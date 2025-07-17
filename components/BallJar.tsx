import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  useDerivedValue,
} from 'react-native-reanimated';
import { Accelerometer, AccelerometerMeasurement } from 'expo-sensors';
import { Ball } from '@/types';
import StorageBall from './StorageBall'; // Use StorageBall
import { theme } from '@/styles/theme';

// Define a type for the subscription object
interface SensorSubscription {
  remove: () => void;
}

const { width, height } = Dimensions.get('window');
const JAR_WIDTH = width * 0.8;
const JAR_HEIGHT = height * 0.6;
const BALL_RADIUS = theme.sizing.storageBall.small / 2; // Default radius, will be adjusted per ball

interface BallJarProps {
  balls: Ball[];
  onBallAdded?: (ball: Ball) => void;
}

interface PhysicsBall extends Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number; // Store radius for collision detection
  animatedX: Animated.SharedValue<number>;
  animatedY: Animated.SharedValue<number>;
}

const GRAVITY_ACCELERATION = 0.5; // Adjusted gravity
const FRICTION_FACTOR = 0.98;
const TILT_SENSITIVITY = 0.05; // Sensitivity for accelerometer data

export const BallJar: React.FC<BallJarProps> = ({ balls, onBallAdded }) => {
  // Create shared values for all possible balls upfront
  const sharedValues = useRef<{[key: string]: {x: Animated.SharedValue<number>, y: Animated.SharedValue<number>}}>({});
  
  // Initialize shared values for all balls if they don't exist yet
  balls.forEach(ball => {
    if (!sharedValues.current[ball.id]) {
      const initialX = JAR_WIDTH / 2 + (Math.random() - 0.5) * (JAR_WIDTH * 0.5);
      const initialY = JAR_HEIGHT - 50 - (Math.random() * 100);
      sharedValues.current[ball.id] = {
        x: useSharedValue(initialX),
        y: useSharedValue(initialY)
      };
    }
  });
  
  const [physicsBalls, setPhysicsBalls] = useState<PhysicsBall[]>([]);
  const [accelerometerData, setAccelerometerData] = useState({ x: 0, y: 0, z: 0 });
  const [accelerometerAvailable, setAccelerometerAvailable] = useState<boolean | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Subscribe to Accelerometer
  useEffect(() => {
    let subscription: SensorSubscription | undefined;
    let isMounted = true;
    
    const startAccelerometer = async () => {
      try {
        // Set default values immediately to prevent errors
        if (isMounted) {
          setAccelerometerData({ x: 0, y: 0, z: 0 });
        }
        
        // Check if Accelerometer is available
        let isAvailableResult = false;
        try {
          isAvailableResult = await Accelerometer.isAvailableAsync();
          if (isMounted) {
            setAccelerometerAvailable(isAvailableResult);
          }
        } catch (availabilityError) {
          console.error('Error checking accelerometer availability:', availabilityError);
          if (isMounted) {
            setAccelerometerAvailable(false);
          }
        }
        
        if (isAvailableResult && isMounted) {
          try {
            // Set update interval first
            await Accelerometer.setUpdateInterval(16); // ~60 FPS
            
            try {
              // Then subscribe to updates with a safe wrapper
              const safeSetData = (data: AccelerometerMeasurement) => {
                if (isMounted) {
                  setAccelerometerData(data);
                }
              };
              
              subscription = Accelerometer.addListener(safeSetData);
            } catch (subscriptionError) {
              console.error('Error subscribing to accelerometer:', subscriptionError);
            }
          } catch (intervalError) {
            console.error('Error setting accelerometer interval:', intervalError);
          }
        } else {
          console.log('Accelerometer is not available on this device or component unmounted');
        }
      } catch (error) {
        console.error('Error in accelerometer setup:', error);
      }
    };
    
    // Delay accelerometer initialization slightly to ensure component is fully mounted
    const initTimer = setTimeout(() => {
      startAccelerometer();
    }, 100);

    return () => {
      isMounted = false;
      clearTimeout(initTimer);
      
      try {
        if (subscription) {
          subscription.remove();
        }
      } catch (cleanupError) {
        console.error('Error cleaning up accelerometer subscription:', cleanupError);
      }
    };
  }, []);

  useEffect(() => {
    // Initialize physics balls with correct radii
    const initBalls = balls.map((ball, index) => {
      const radius = theme.sizing.storageBall[
        ball.minutes <= 5 ? 'small' : ball.minutes <= 15 ? 'medium' : 'large'
      ] / 2;
      
      // Use the pre-created shared values
      const sharedValue = sharedValues.current[ball.id];
      
      return {
        ...ball,
        x: sharedValue.x.value,
        y: sharedValue.y.value,
        vx: (Math.random() - 0.5) * 2,
        vy: 0,
        radius: radius,
        animatedX: sharedValue.x,
        animatedY: sharedValue.y,
      };
    });
    setPhysicsBalls(initBalls);
  }, [balls]);

  // Physics simulation loop
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setPhysicsBalls(prevBalls => {
        let updatedBalls = prevBalls.map(ball => {
          // Apply gravity
          let newVy = ball.vy + GRAVITY_ACCELERATION;

          // Apply tilt from accelerometer (map accelerometer values to tilt)
          // Accelerometer x maps to tiltY, Accelerometer y maps to tiltX
          // We invert y to make it intuitive (tilting phone forward = balls move up)
          const tiltX = accelerometerData.y * TILT_SENSITIVITY;
          const tiltY = -accelerometerData.x * TILT_SENSITIVITY;

          let newVx = ball.vx + tiltX;
          newVy += tiltY; // Add tilt to vertical velocity

          let newX = ball.x + newVx;
          let newY = ball.y + newVy;

          // Boundary collision
          if (newX - ball.radius < 0) { // Left boundary
            newVx = -newVx * FRICTION_FACTOR;
            newX = ball.radius;
          } else if (newX + ball.radius > JAR_WIDTH) { // Right boundary
            newVx = -newVx * FRICTION_FACTOR;
            newX = JAR_WIDTH - ball.radius;
          }

          if (newY - ball.radius < 0) { // Top boundary (shouldn't happen with gravity)
            newVy = -newVy * FRICTION_FACTOR;
            newY = ball.radius;
          } else if (newY + ball.radius > JAR_HEIGHT) { // Bottom boundary
            newVy = -newVy * FRICTION_FACTOR * 0.6; // Less bounce on bottom
            newY = JAR_HEIGHT - ball.radius;
          }

          // Apply friction
          newVx *= FRICTION_FACTOR;
          newVy *= FRICTION_FACTOR;

          // Update animated values
          ball.animatedX.value = withSpring(newX, { damping: 20, stiffness: 300 });
          ball.animatedY.value = withSpring(newY, { damping: 20, stiffness: 300 });

          return {
            ...ball,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
          };
        });

        // Ball-to-ball collision detection and response
        for (let i = 0; i < updatedBalls.length; i++) {
          for (let j = i + 1; j < updatedBalls.length; j++) {
            const ballA = updatedBalls[i];
            const ballB = updatedBalls[j];

            const dx = ballB.x - ballA.x;
            const dy = ballB.y - ballA.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const minDistance = ballA.radius + ballB.radius;

            if (distance < minDistance) {
              // Collision detected
              const overlap = minDistance - distance;
              const angle = Math.atan2(dy, dx);

              // Resolve overlap (push balls apart)
              const pushX = (overlap / 2) * Math.cos(angle);
              const pushY = (overlap / 2) * Math.sin(angle);

              ballA.x -= pushX;
              ballA.y -= pushY;
              ballB.x += pushX;
              ballB.y += pushY;

              // Calculate new velocities (simplified elastic collision)
              const normalX = dx / distance;
              const normalY = dy / distance;

              const relVelX = ballA.vx - ballB.vx;
              const relVelY = ballA.vy - ballB.vy;

              const velocityAlongNormal = relVelX * normalX + relVelY * normalY;

              // Do not resolve if velocities are separating
              if (velocityAlongNormal > 0) continue;

              const impulse = (2 * velocityAlongNormal) / (1 + 1); // Assuming equal mass

              ballA.vx -= impulse * normalX;
              ballA.vy -= impulse * normalY;
              ballB.vx += impulse * normalX;
              ballB.vy += impulse * normalY;
            }
          }
        }

        // Update animated values after collision resolution
        updatedBalls.forEach(ball => {
          ball.animatedX.value = withSpring(ball.x, { damping: 20, stiffness: 300 });
          ball.animatedY.value = withSpring(ball.y, { damping: 20, stiffness: 300 });
        });

        return updatedBalls;
      });
    }, 16);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [accelerometerData, balls]); // Re-run if accelerometer data or balls change

  const animatedStyle = (ball: PhysicsBall) => useAnimatedStyle(() => {
    return {
      position: 'absolute',
      width: ball.radius * 2,
      height: ball.radius * 2,
      transform: [
        { translateX: ball.animatedX.value - ball.radius },
        { translateY: ball.animatedY.value - ball.radius },
      ],
    };
  });

  return (
    <Animated.View style={styles.container}>
      <View style={styles.jar}>
        {physicsBalls.length === 0 ? (
          <Text style={styles.emptyText}>No balls in storage yet</Text>
        ) : (
          physicsBalls.map((ball) => (
            <Animated.View key={ball.id} style={animatedStyle(ball)}>
              <StorageBall minutes={ball.minutes} />
            </Animated.View>
          ))
        )}
        
        {accelerometerAvailable === false && (
          <View style={styles.accelerometerWarning}>
            <Text style={styles.accelerometerWarningText}>
              Accelerometer not available. Balls will not respond to device tilt.
            </Text>
          </View>
        )}
      </View>
      <Text style={styles.debugText}>
        Balls: {physicsBalls.length} | Tilt: {accelerometerData.x.toFixed(2)}, {accelerometerData.y.toFixed(2)}
        {accelerometerAvailable === false ? ' (Accelerometer not available)' : ''}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  accelerometerWarning: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 8,
  },
  accelerometerWarningText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
  jar: {
    width: JAR_WIDTH,
    height: JAR_HEIGHT,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
    borderTopWidth: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
    overflow: 'hidden', // Ensure balls don't render outside the jar
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    textAlign: 'center',
    marginTop: JAR_HEIGHT / 2 - 10,
  },
  debugText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginTop: 10,
  },
});
