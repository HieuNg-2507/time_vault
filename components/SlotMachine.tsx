import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { Ball } from '@/types';
import { generateRandomBall } from '@/utils/ballUtils';

const { width } = Dimensions.get('window');
const SLOT_WIDTH = (width * 0.8 - 40) / 3;
const BALL_SIZE = 60;

interface SlotMachineProps {
  onSpinComplete: (ball: Ball) => void;
  isSpinning: boolean;
}

const BALL_TYPES = [
  { minutes: 2, color: '#20B2AA' },
  { minutes: 5, color: '#20B2AA' },
  { minutes: 10, color: '#FFD700' },
  { minutes: 15, color: '#FFD700' },
  { minutes: 20, color: '#FF6B6B' },
];

export const SlotMachine: React.FC<SlotMachineProps> = ({ onSpinComplete, isSpinning }) => {
  const [finalBall, setFinalBall] = useState<Ball | null>(null);
  
  const slot1Y = useSharedValue(0);
  const slot2Y = useSharedValue(0);
  const slot3Y = useSharedValue(0);

  useEffect(() => {
    if (isSpinning) {
      const newBall = generateRandomBall();
      setFinalBall(newBall);
      
      // Start spinning animation
      slot1Y.value = withSequence(
        withTiming(-300, { duration: 1000, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: 500, easing: Easing.bounce })
      );
      
      slot2Y.value = withSequence(
        withTiming(-300, { duration: 1200, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: 500, easing: Easing.bounce })
      );
      
      slot3Y.value = withSequence(
        withTiming(-300, { duration: 1400, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: 500, easing: Easing.bounce }, () => {
          runOnJS(onSpinComplete)(newBall);
        })
      );
    }
  }, [isSpinning]);

  const slot1Style = useAnimatedStyle(() => ({
    transform: [{ translateY: slot1Y.value }],
  }));

  const slot2Style = useAnimatedStyle(() => ({
    transform: [{ translateY: slot2Y.value }],
  }));

  const slot3Style = useAnimatedStyle(() => ({
    transform: [{ translateY: slot3Y.value }],
  }));

  const renderSlot = (animatedStyle: any, ballType: typeof BALL_TYPES[0]) => (
    <View style={styles.slotColumn}>
      <Animated.View style={[styles.ballContainer, animatedStyle]}>
        <View style={[styles.ball, { backgroundColor: ballType.color }]}>
          <Animated.Text style={styles.ballText}>{ballType.minutes}</Animated.Text>
        </View>
      </Animated.View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.slotMachine}>
        {renderSlot(slot1Style, finalBall ? { minutes: finalBall.minutes, color: finalBall.color } : BALL_TYPES[0])}
        {renderSlot(slot2Style, finalBall ? { minutes: finalBall.minutes, color: finalBall.color } : BALL_TYPES[1])}
        {renderSlot(slot3Style, finalBall ? { minutes: finalBall.minutes, color: finalBall.color } : BALL_TYPES[2])}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotMachine: {
    flexDirection: 'row',
    backgroundColor: '#2F307A',
    borderRadius: 10,
    padding: 10,
    height: 120,
    overflow: 'hidden',
  },
  slotColumn: {
    width: SLOT_WIDTH,
    height: 100,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
  ballContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  ball: {
    width: BALL_SIZE,
    height: BALL_SIZE,
    borderRadius: BALL_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  ballText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});