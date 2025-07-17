import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ball } from '@/types';
import { theme } from '@/styles/theme';

interface FallbackJarProps {
  balls: Ball[];
  onRetry?: () => void;
}

export const FallbackJar: React.FC<FallbackJarProps> = ({ balls, onRetry }) => {
  return (
    <View style={styles.container}>
      <View style={styles.jar}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Ball Jar</Text>
          <Text style={styles.description}>
            {balls.length} balls collected
          </Text>
          <Text style={styles.message}>
            The interactive ball jar could not be initialized.
          </Text>
          {onRetry && (
            <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          )}
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
    width: '80%',
    height: '60%',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
    borderTopWidth: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    marginBottom: 20,
  },
  message: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: theme.colors.primary[400],
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FallbackJar;
