import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Ball } from '@/types';

const { width, height } = Dimensions.get('window');

interface BallSpinnerProps {
  ball: Ball;
  onAnimationComplete: () => void;
}

export const BallSpinner: React.FC<BallSpinnerProps> = ({ ball, onAnimationComplete }) => {
  const translateY = useSharedValue(-100);
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    // Start animation sequence
    translateY.value = withSpring(height * 0.4, {
      damping: 15,
      stiffness: 100,
    });
    
    rotation.value = withTiming(360 * 3, {
      duration: 1500,
    });

    // Bounce effect when landing
    setTimeout(() => {
      scale.value = withSpring(1.2, {
        damping: 10,
        stiffness: 200,
      }, () => {
        scale.value = withSpring(1, {
          damping: 15,
          stiffness: 300,
        }, () => {
          runOnJS(onAnimationComplete)();
        });
      });
    }, 1500);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: translateY.value },
        { rotate: `${rotation.value}deg` },
        { scale: scale.value },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.ball, { backgroundColor: ball.color }, animatedStyle]}>
        <Animated.Text style={styles.ballText}>{ball.minutes}</Animated.Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  ball: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  ballText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});