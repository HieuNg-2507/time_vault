import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { theme } from '@/styles/theme';

interface StreakCounterProps {
  count: number;
  goal: number;
  onPress?: () => void;
}

const StreakCounter: React.FC<StreakCounterProps> = ({ count, goal, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Image 
        source={require('@/figma_images/streak_icon.svg')} 
        style={styles.streakIcon}
      />
      <View style={styles.textContainer}>
        <Text style={styles.countText}>{count}</Text>
        <Text style={styles.goalText}> / {goal}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  streakIcon: {
    width: 32,
    height: 32,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginLeft: 4,
  },
  countText: {
    fontFamily: 'Outfit-SemiBold',
    fontSize: 28,
    color: theme.colors.primary[400],
    letterSpacing: -0.56, // -2% of 28px
  },
  goalText: {
    fontFamily: 'Outfit-SemiBold',
    fontSize: 28,
    color: theme.colors.primary[400],
    letterSpacing: -0.56, // -2% of 28px
  },
});

export default StreakCounter;
