import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, RotateCcw } from 'lucide-react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useGameState } from '@/hooks/useGameState';
import { BallJar } from '@/components/BallJar';

export default function JarScreen() {
  const { gameState } = useGameState();

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Long-Term Jar</Text>
          <TouchableOpacity style={styles.resetButton}>
            <RotateCcw size={20} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.counterContainer}>
          <Text style={styles.counterIcon}>🔥</Text>
          <Text style={styles.counterText}>
            {gameState.longTermCounter} / {gameState.longTermGoal}
          </Text>
        </View>

        <View style={styles.content}>
          <View style={styles.jarContainer}>
            <BallJar balls={gameState.longTermBalls} />
          </View>
          
          <View style={styles.instructions}>
            <Text style={styles.instructionText}>
              Tilt your device to move the balls around!
            </Text>
            <Text style={styles.instructionSubtext}>
              {gameState.longTermBalls.length} balls collected
            </Text>
          </View>
        </View>
      </LinearGradient>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3D3F9E',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resetButton: {
    padding: 8,
  },
  counterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  counterIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  counterText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  jarContainer: {
    flex: 1,
    marginBottom: 20,
  },
  instructions: {
    alignItems: 'center',
    paddingBottom: 30,
  },
  instructionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 5,
  },
  instructionSubtext: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    textAlign: 'center',
  },
});