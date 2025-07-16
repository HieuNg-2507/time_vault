import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, X } from 'lucide-react-native';
import { useGameState } from '@/hooks/useGameState';
import { Ball } from '@/types';
import * as Haptics from 'expo-haptics';

export default function TodayScreen() {
  const { gameState, removeBallFromToday, moveBallToLongTerm } = useGameState();
  const [selectedBall, setSelectedBall] = useState<Ball | null>(null);
  const [showTimeCard, setShowTimeCard] = useState(false);

  const handleBallPress = async (ball: Ball) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedBall(ball);
    setShowTimeCard(true);
  };

  const handleBallChoice = (choice: 'use' | 'store') => {
    if (!selectedBall) return;

    if (choice === 'use') {
      removeBallFromToday(selectedBall.id);
      Alert.alert('App Unlocked', `You can now use blocked apps for ${selectedBall.minutes} minutes.`);
    } else {
      moveBallToLongTerm(selectedBall.id);
      Alert.alert('Ball Stored', `${selectedBall.minutes} minute ball moved to Long-Term Jar.`);
    }

    setShowTimeCard(false);
    setSelectedBall(null);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Today's Collection</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{gameState.todayBalls.length}</Text>
            <Text style={styles.statLabel}>Total Balls</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {gameState.todayBalls.reduce((sum, ball) => sum + ball.minutes, 0)}
            </Text>
            <Text style={styles.statLabel}>Total Minutes</Text>
          </View>
        </View>

        <ScrollView style={styles.ballsContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.ballsGrid}>
            {gameState.todayBalls.map((ball, index) => (
              <TouchableOpacity
                key={ball.id}
                style={[styles.ballItem, { backgroundColor: ball.color }]}
                onPress={() => handleBallPress(ball)}
              >
                <Text style={styles.ballText}>{ball.minutes}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {gameState.todayBalls.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No balls collected today</Text>
            <Text style={styles.emptySubtext}>Spin to earn your first ball!</Text>
          </View>
        )}
      </View>

      <Modal visible={showTimeCard} transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.timeCard}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowTimeCard(false)}
            >
              <X size={24} color="#999" />
            </TouchableOpacity>
            
            {selectedBall && (
              <>
                <View style={[styles.modalBall, { backgroundColor: selectedBall.color }]}>
                  <Text style={styles.modalBallText}>{selectedBall.minutes}</Text>
                </View>
                <Text style={styles.modalTitle}>
                  {selectedBall.minutes} minutes ball
                </Text>
                
                <TouchableOpacity
                  style={styles.storageButton}
                  onPress={() => handleBallChoice('store')}
                >
                  <Text style={styles.storageButtonText}>Storage</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.useNowButton}
                  onPress={() => handleBallChoice('use')}
                >
                  <Text style={styles.useNowButtonText}>Use now</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
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
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginTop: 5,
  },
  ballsContainer: {
    flex: 1,
  },
  ballsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingBottom: 20,
  },
  ballItem: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  ballText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptySubtext: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    width: '80%',
    maxWidth: 300,
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    padding: 5,
  },
  modalBall: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalBallText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 30,
    color: '#333',
  },
  storageButton: {
    backgroundColor: '#5A67D8',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
  },
  storageButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  useNowButton: {
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
  },
  useNowButtonText: {
    color: '#5A67D8',
    fontSize: 16,
    fontWeight: '600',
  },
});