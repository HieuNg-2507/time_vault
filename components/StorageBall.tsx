import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

interface StorageBallProps {
  minutes: number;
}

const StorageBall: React.FC<StorageBallProps> = ({ minutes }) => {
  const getBallStyle = () => {
    let size, backgroundColor, borderColor;

    if (minutes <= 5) {
      size = theme.sizing.storageBall.small; // 28px
      backgroundColor = theme.colors.secondary[500];
      borderColor = theme.colors.secondary[600];
    } else if (minutes <= 15) {
      size = theme.sizing.storageBall.medium; // 34px
      backgroundColor = theme.colors.territory1[500];
      borderColor = theme.colors.territory1[600];
    } else {
      size = theme.sizing.storageBall.large; // 40px
      backgroundColor = theme.colors.territory2[500];
      borderColor = theme.colors.territory2[600];
    }

    return {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor,
      borderColor,
      borderWidth: 1, // 1px border as specified
    };
  };

  const ballStyle = getBallStyle();

  return (
    <View style={[styles.ball, ballStyle]}>
      <Text style={styles.text}>{minutes}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  ball: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  text: {
    color: theme.colors.shades.white,
    fontFamily: 'Outfit-Bold',
    fontSize: 12, // Font size is smaller for storage balls
    textAlign: 'center',
  },
});

export default StorageBall;
