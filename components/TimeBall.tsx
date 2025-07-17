import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';

interface TimeBallProps {
  minutes: number;
}

const getBallColors = (minutes: number) => {
  if (minutes === 20) {
    return theme.colors.ball.pink;
  }
  if (minutes === 10 || minutes === 15) {
    return theme.colors.ball.yellow;
  }
  // Default to teal for 2 and 5 minutes
  return theme.colors.ball.teal;
};

const TimeBall: React.FC<TimeBallProps> = ({ minutes }) => {
  const colors = getBallColors(minutes);

  const ballStyle = {
    backgroundColor: colors.background,
    borderColor: colors.border,
  };

  return (
    <View style={[styles.ball, ballStyle]}>
      <Text style={styles.ballText}>{minutes}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  ball: {
    width: theme.sizing.ball,
    height: theme.sizing.ball,
    borderRadius: theme.sizing.ballBorderRadius,
    borderWidth: theme.sizing.ballBorderWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ballText: {
    fontFamily: theme.typography.ball.fontFamily,
    fontWeight: theme.typography.ball.fontWeight,
    fontSize: theme.typography.ball.fontSize,
    color: theme.typography.ball.color,
  },
});

export default TimeBall;
