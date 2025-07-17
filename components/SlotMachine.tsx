import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Ball } from '@/types';
import TimeBall from './TimeBall';

const { width: screenWidth } = Dimensions.get('window');
const SPIN_BOX_WIDTH = 351; // From Figma 'Spin box/ click' layout_4CRHIM dimensions
const LINE_HEIGHT = 216; // From Figma 'Line 1' layout_7RJ2KO

interface SlotMachineProps {
  balls: Ball[]; // Array of balls to display in the slots
  isSpinning: boolean;
  onSpinComplete: (ball: Ball) => void; // Callback when a ball lands
}

export const SlotMachine: React.FC<SlotMachineProps> = ({ balls, isSpinning, onSpinComplete }) => {
  // For now, let's display placeholder balls based on the Figma structure.
  // The actual spinning logic will need to be integrated.
  // We'll use dummy balls for now to represent the structure.
  const dummyBalls: Ball[] = [
    { id: 'dummy-1', minutes: 15, color: '#FFB800' },
    { id: 'dummy-2', minutes: 20, color: '#F85180' },
    { id: 'dummy-3', minutes: 10, color: '#FFB800' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.spinLine}>
        {dummyBalls.map((ball, index) => (
          <View
            key={index}
            style={[
              styles.line,
              index === 0 && styles.lineLeftRadius,
              index === dummyBalls.length - 1 && styles.lineRightRadius,
              { backgroundColor: 'rgba(255, 255, 255, 0.12)' } // Figma fill_EKI0CL
            ]}
          >
            <TimeBall minutes={ball.minutes} />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SPIN_BOX_WIDTH, // Match the parent spin box width
    alignItems: 'center',
  },
  spinLine: {
    flexDirection: 'row',
    alignItems: 'stretch', // Correct for vertical stretching
    gap: 1, // Figma gap: 1px
    height: LINE_HEIGHT,
    width: '100%', // Fill the container width
  },
  line: {
    flex: 1, // Distribute space equally
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', // Ensure balls don't overflow the line
  },
  lineLeftRadius: {
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  lineRightRadius: {
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
});
