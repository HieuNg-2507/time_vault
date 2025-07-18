import React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { Ball } from '@/types';
import StorageBall from './StorageBall';
import { theme } from '@/styles/theme';

const { width, height } = Dimensions.get('window');
const JAR_WIDTH = width * 0.8;
const JAR_HEIGHT = height * 0.6;

interface StaticBallJarProps {
  balls: Ball[];
}

// Simple static layout for balls - no physics, no hooks
const StaticBallJar: React.FC<StaticBallJarProps> = ({ balls }) => {
  // Calculate positions for balls in a grid layout
  const getBallPosition = (index: number) => {
    const columns = 4; // Number of columns in the grid
    const spacing = 10; // Spacing between balls
    
    // Calculate the maximum radius for any ball
    const maxRadius = theme.sizing.storageBall.large / 2;
    
    // Calculate the column and row for this ball
    const column = index % columns;
    const row = Math.floor(index / columns);
    
    // Calculate the x and y position
    const x = spacing + column * (maxRadius * 2 + spacing) + maxRadius;
    const y = JAR_HEIGHT - spacing - maxRadius - row * (maxRadius * 2 + spacing);
    
    return { x, y };
  };
  
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

  return (
    <View style={styles.container}>
      <View style={styles.jar}>
        {balls.length === 0 ? (
          <Text style={styles.emptyText}>No balls in storage yet</Text>
        ) : (
          balls.map((ball, index) => {
            const position = getBallPosition(index);
            const radius = getBallRadius(ball.minutes);
            
            return (
              <View 
                key={ball.id} 
                style={[
                  styles.ballContainer,
                  {
                    width: radius * 2,
                    height: radius * 2,
                    left: position.x - radius,
                    bottom: position.y - radius,
                  }
                ]}
              >
                <StorageBall minutes={ball.minutes} />
              </View>
            );
          })
        )}
        
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Static layout mode - physics simulation disabled.
          </Text>
        </View>
      </View>
    </View>
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
    overflow: 'hidden', // Ensure balls don't render outside the jar
  },
  ballContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    textAlign: 'center',
    marginTop: JAR_HEIGHT / 2 - 10,
  },
  infoContainer: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 8,
  },
  infoText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default StaticBallJar;
