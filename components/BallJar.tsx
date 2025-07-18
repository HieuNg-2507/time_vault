import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { Ball } from '@/types';
import StorageBall from './StorageBall';
import { theme } from '@/styles/theme';
import { usePhysics } from '@/hooks/usePhysics';
import { generateBallId } from '@/utils/idGenerator';

const { width, height } = Dimensions.get('window');

// Update interval for accelerometer
const UPDATE_INTERVAL = 16; // ~60fps

interface BallJarProps {
  balls: Ball[];
  counter?: number;
  goal?: number;
}

/**
 * BallJar component that displays balls with physics simulation
 */
const BallJar: React.FC<BallJarProps> = ({ balls, counter = 0, goal = 1000 }) => {
  // Physics configuration
  const physicsConfig = {
    gravity: { x: 0, y: 0.2 },
    friction: 0.95, // Slightly reduced friction for smoother movement
    bounce: 0.7,    // Reduced bounce for less bouncy balls
    collisionDamping: 0.3 // Reduced damping for less separation between balls
  };

  // Use the physics hook
  const {
    physicsState,
    addBall,
    removeBall,
    updateConfig
  } = usePhysics([], physicsConfig);

  // State for accelerometer data
  const [accelerometerData, setAccelerometerData] = useState({ x: 0, y: 0, z: 0 });
  const [subscription, setSubscription] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Get the radius for a ball based on its minutes
  const getBallRadius = (minutes: number) => {
    if (minutes <= 5) {
      return theme.sizing.storageBall.small / 2;
    } else if (minutes <= 15) {
      return theme.sizing.storageBall.medium / 2;
    } else {
      return theme.sizing.storageBall.large / 2;
    }
  };

  // Subscribe to accelerometer
  useEffect(() => {
    const startAccelerometer = async () => {
      try {
        // Use a faster update interval for more responsive physics
        Accelerometer.setUpdateInterval(UPDATE_INTERVAL);
        const subscription = Accelerometer.addListener(data => {
          setAccelerometerData(data);
          
          // Calculate gravity vector based on device orientation
          // The accelerometer values represent the acceleration applied to the device
          // When the device is flat, z = 1 (gravity pulling down on z-axis)
          // When tilted, x and y values change based on tilt angle
          
          // Normalize the accelerometer data to create a more consistent gravity effect
          const magnitude = Math.sqrt(data.x * data.x + data.y * data.y + data.z * data.z);
          const normalizedX = data.x / magnitude;
          const normalizedY = data.y / magnitude;
          
          // Scale factor controls the strength of gravity
          const scaleFactor = 0.3;
          
          // Apply gravity based on device orientation
          // For X: When phone tilts right (positive X in accelerometer), balls should move right (positive X in gravity)
          // For Y: When phone tilts down (negative Y in accelerometer), balls should move down (positive Y in gravity)
          // This matches the natural expectation of gravity
          updateConfig({
            gravity: {
              x: normalizedX * scaleFactor, // Changed sign to match natural gravity direction
              y: -normalizedY * scaleFactor  // Keep this as is, it's correct
            }
          });
          
          // Log gravity values for debugging
          if (Math.random() < 0.01) { // Only log occasionally to avoid flooding
            console.log(`Gravity: x=${normalizedX * scaleFactor}, y=${-normalizedY * scaleFactor}`);
            console.log(`Raw accelerometer: x=${data.x}, y=${data.y}, z=${data.z}`);
          }
        });
        setSubscription(subscription);
      } catch (error) {
        setError('Could not access the accelerometer. Please make sure your device supports this feature.');
      }
    };

    startAccelerometer();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  // Sync balls with physics engine
  useEffect(() => {
    // Only log when there's a change in ball count
    if (balls.length !== physicsState.objects.length) {
      console.log(`BallJar: Syncing ${balls.length} balls with physics engine`);
    }
    
    // Ensure each ball has a unique ID
    const ballsWithIds = balls.map(ball => ({
      ...ball,
      id: ball.id || generateBallId('jar', ball.minutes)
    }));

    // Remove balls that are no longer in the list
    const currentBallIds = new Set(ballsWithIds.map(b => b.id));
    physicsState.objects.forEach(obj => {
      if (!currentBallIds.has(obj.id)) {
        removeBall(obj.id);
      }
    });

    // Add new balls with random positions
    const existingBallIds = new Set(physicsState.objects.map(obj => obj.id));
    ballsWithIds.forEach(ball => {
      if (!existingBallIds.has(ball.id)) {
        // Generate random position within the visible area, but avoid the top-left corner
        // where balls tend to get stuck
        const { width, height } = Dimensions.get('window');
        const padding = 60; // Increased padding to keep away from edges
        
        // Avoid the top-left corner by ensuring x and y are not both small
        let randomX, randomY;
        do {
          randomX = padding + Math.random() * (width - padding * 2);
          randomY = padding + Math.random() * (height - padding * 2);
        } while (randomX < width * 0.3 && randomY < height * 0.3);
        
        // Add ball with random position
        addBall(ball, randomX, randomY);
      }
    });
  }, [balls, physicsState.objects.length, addBall, removeBall]);

  // Update counter when balls change and ensure physics config is appropriate
  useEffect(() => {
    // This ensures the counter is always in sync with the actual balls
    // Especially important when balls are added to the long-term jar
    const ballsTotal = balls.reduce((sum, ball) => sum + ball.minutes, 0);
    
    // Adjust physics parameters based on number of balls
    // More balls = less damping to prevent clustering
    if (balls.length > 10) {
      updateConfig({
        collisionDamping: 0.1, // Reduced damping for more balls
        friction: 0.97,      // Slightly increased friction for stability
        bounce: 0.5         // Reduced bounce for more stability with many balls
      });
    } else {
      updateConfig({
        collisionDamping: 0.3, // Default damping for fewer balls
        friction: 0.95,      // Default friction
        bounce: 0.7         // Default bounce
      });
    }
  }, [balls, counter, updateConfig]);

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Counter display */}
      <View style={styles.counterContainer}>
        <Text style={styles.counterValue}>{counter}</Text>
        <Text style={styles.counterSeparator}>/</Text>
        <Text style={styles.counterGoal}>{goal}</Text>
      </View>
      
      {/* Balls */}
      {physicsState.objects.map((obj) => {
        const ball = obj.data as Ball;
        return (
          <View
            key={obj.id}
            style={[
              styles.ballContainer,
              {
                width: obj.radius * 2,
                height: obj.radius * 2,
                left: obj.position.x - obj.radius,
                top: obj.position.y - obj.radius,
              },
            ]}
          >
            <StorageBall minutes={ball.minutes} />
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  ballContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  counterContainer: {
    position: 'absolute',
    top: height / 3 - 40, // Positioned at about 1/3 from the top
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterValue: {
    fontFamily: 'Outfit-SemiBold',
    fontSize: 72,
    color: 'rgba(213, 214, 239, 0.5)', // D5D6EF with 50% opacity
  },
  counterSeparator: {
    fontFamily: 'Outfit-SemiBold',
    fontSize: 72,
    color: 'rgba(213, 214, 239, 0.3)', // D5D6EF with 30% opacity
    marginHorizontal: 4,
  },
  counterGoal: {
    fontFamily: 'Outfit-SemiBold',
    fontSize: 72,
    color: 'rgba(213, 214, 239, 0.3)', // D5D6EF with 30% opacity
  },
});

export default BallJar;
