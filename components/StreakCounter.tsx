import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Flame } from 'lucide-react-native';
import { theme } from '@/styles/theme';

interface StreakCounterProps {
  count: number;
  goal: number;
  onPress?: () => void;
}

const StreakCounter: React.FC<StreakCounterProps> = ({ count, goal, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Flame size={28} color={theme.colors.primary[400]} />
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
  textContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginLeft: 8,
  },
  countText: {
    fontFamily: 'Outfit-SemiBold',
    fontSize: 28,
    color: theme.colors.primary[400],
  },
  goalText: {
    fontFamily: 'Outfit-SemiBold',
    fontSize: 28,
    color: theme.colors.primary[400],
  },
});

export default StreakCounter;
