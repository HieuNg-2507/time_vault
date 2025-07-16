import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  useAnimatedGestureHandler,
  runOnJS,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { Ball } from '@/types';

const { width, height } = Dimensions.get('window');
const JAR_WIDTH = width * 0.8;
const JAR_HEIGHT = height * 0.6;
const BALL_SIZE = 40;

interface BallJarProps {
  balls: Ball[];
  onBallAdded?: (ball: Ball) => void;
}

interface PhysicsBall extends Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  animatedX: Animated.SharedValue<number>;
  animatedY: Animated.SharedValue<number>;
}

export const BallJar: React.FC<BallJarProps> = ({ balls, onBallAdded }) => {
  const [physicsBalls, setPhysicsBalls] = useState<PhysicsBall[]>([]);
  const tiltX = useSharedValue(0);
  const tiltY = useSharedValue(0);

  useEffect(() => {
    // Initialize physics balls
    const initBalls = balls.map((ball, index) => ({
      ...ball,
      x: JAR_WIDTH / 2 + (Math.random() - 0.5) * 100,
      y: JAR_HEIGHT - 50 - (index * 5),
      vx: (Math.random() - 0.5) * 2,
      vy: 0,
      animatedX: useSharedValue(JAR_WIDTH / 2 + (Math.random() - 0.5) * 100),
      animatedY: useSharedValue(JAR_HEIGHT - 50 - (index * 5)),
    }));
    
    setPhysicsBalls(initBalls);
  }, [balls]);

  useEffect(() => {
    // Physics simulation
    const interval = setInterval(() => {
      setPhysicsBalls(prevBalls => {
        return prevBalls.map(ball => {
          let newX = ball.x + ball.vx;
          let newY = ball.y + ball.vy;
          let newVx = ball.vx;
          let newVy = ball.vy + 0.5; // gravity

          // Apply tilt effect
          newVx += tiltX.value * 0.1;
          newVy += tiltY.value * 0.1;

          // Boundary collision
          if (newX <= BALL_SIZE / 2 || newX >= JAR_WIDTH - BALL_SIZE / 2) {
            newVx = -newVx * 0.8;
            newX = Math.max(BALL_SIZE / 2, Math.min(JAR_WIDTH - BALL_SIZE / 2, newX));
          }

          if (newY >= JAR_HEIGHT - BALL_SIZE / 2) {
            newVy = -newVy * 0.6;
            newY = JAR_HEIGHT - BALL_SIZE / 2;
          }

          // Apply friction
          newVx *= 0.98;
          newVy *= 0.98;

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
      });
    }, 16);

    return () => clearInterval(interval);
  }, [tiltX, tiltY]);

  const gestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      tiltX.value = event.translationX / 100;
      tiltY.value = event.translationY / 100;
    },
    onEnd: () => {
      tiltX.value = withSpring(0);
      tiltY.value = withSpring(0);
    },
  });

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={styles.container}>
        <View style={styles.jar}>
          {physicsBalls.map((ball) => (
            <BallItem key={ball.id} ball={ball} />
          ))}
        </View>
      </Animated.View>
    </PanGestureHandler>
  );
};

const BallItem: React.FC<{ ball: PhysicsBall }> = ({ ball }) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: ball.animatedX.value - BALL_SIZE / 2 },
        { translateY: ball.animatedY.value - BALL_SIZE / 2 },
      ],
    };
  });

  return (
    <Animated.View style={[styles.ball, { backgroundColor: ball.color }, animatedStyle]}>
      <Animated.Text style={styles.ballText}>{ball.minutes}</Animated.Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  ball: {
    width: BALL_SIZE,
    height: BALL_SIZE,
    borderRadius: BALL_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  ballText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});