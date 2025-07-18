import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Menu, X, ChevronDown, ChevronUp } from 'lucide-react-native';
import { useGameContext } from '@/contexts/GameContext';
import { SlotMachine } from '@/components/SlotMachine';
import { getBallCountsByValue } from '@/utils/ballUtils';
import { Ball } from '@/types';
import * as Haptics from 'expo-haptics';
import StreakCounter from '@/components/StreakCounter';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const { 
    todayBalls, 
    longTermBalls,
    addBallToToday, 
    removeBallFromToday, 
    moveBallToLongTerm,
    getLongTermTotal,
    getLongTermGoal,
    spinsRemaining,
    decrementSpins
  } = useGameContext();
  
  const [currentBall, setCurrentBall] = useState<Ball | null>(null);
  const [showBallModal, setShowBallModal] = useState(false);
  const [showTodayBalls, setShowTodayBalls] = useState(false);
  const [selectedTodayBall, setSelectedTodayBall] = useState<Ball | null>(null);
  const [showTodayBallModal, setShowTodayBallModal] = useState(false);
  const router = useRouter();

  const ballCounts = getBallCountsByValue(todayBalls);

  const handleSpinComplete = (ball: Ball) => {
    // Add a small delay before showing the modal to ensure animations are complete
    setTimeout(() => {
      setCurrentBall(ball);
      setShowBallModal(true);
    }, 300);
  };

  const handleBallChoice = (choice: 'store' | 'use') => {
    if (!currentBall) return;

    if (choice === 'store') {
      addBallToToday(currentBall);
      Alert.alert('Ball Stored', `${currentBall.minutes} minute ball added to your Today collection.`);
    } else {
      Alert.alert('App Unlocked', `You can now use blocked apps for ${currentBall.minutes} minutes.`);
    }

    setShowBallModal(false);
    setCurrentBall(null);
  };

  const handleTodayBallPress = async (ball: Ball) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedTodayBall(ball);
    setShowTodayBallModal(true);
  };

  const handleTodayBallChoice = (choice: 'use' | 'store') => {
    if (!selectedTodayBall) return;

    if (choice === 'use') {
      removeBallFromToday(selectedTodayBall.id);
      Alert.alert('App Unlocked', `You can now use blocked apps for ${selectedTodayBall.minutes} minutes.`);
    } else {
      // Store the ball ID and minutes before moving it
      const ballId = selectedTodayBall.id;
      const ballMinutes = selectedTodayBall.minutes;
      
      console.log(`Moving ball to long-term jar: ID=${ballId}, Minutes=${ballMinutes}`);
      
      // Move the ball to long-term jar
      moveBallToLongTerm(ballId);
      
      // Show alert with navigation option
      Alert.alert(
        'Ball Stored', 
        `${ballMinutes} minute ball moved to Long-Term Jar.`,
        [
          { 
            text: 'View Jar', 
            onPress: () => {
              // Close the modal first
              setShowTodayBallModal(false);
              setSelectedTodayBall(null);
              // Navigate to jar screen
              setTimeout(() => router.push('/(tabs)/jar'), 300);
            }
          },
          { 
            text: 'OK', 
            onPress: () => {
              setShowTodayBallModal(false);
              setSelectedTodayBall(null);
            }
          }
        ]
      );
      return; // Return early since we're handling modal closing in the alert buttons
    }

    setShowTodayBallModal(false);
    setSelectedTodayBall(null);
  };

  const toggleTodayBalls = () => {
    setShowTodayBalls(!showTodayBalls);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <ErrorBoundary
          fallback={
            <TouchableOpacity 
              style={styles.counterContainer}
              onPress={() => router.push('/(tabs)/jar')}
            >
              <View style={styles.fallbackCounter}>
                <Text style={styles.fallbackCounterText}>
                  {getLongTermTotal()} / {getLongTermGoal()}
                </Text>
              </View>
            </TouchableOpacity>
          }
        >
          <TouchableOpacity 
            style={styles.counterContainer}
            onPress={() => router.push('/(tabs)/jar')}
          >
            <StreakCounter 
              count={getLongTermTotal()} 
              goal={getLongTermGoal()} 
              onPress={() => router.push('/(tabs)/jar')}
            />
          </TouchableOpacity>
        </ErrorBoundary>
        <TouchableOpacity style={styles.menuButton}>
          <Menu size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.spinContainer}>
          <View style={styles.spinBox}>
            <View style={styles.spinTopContainer}>
              <Text style={styles.spinsRemaining}>{spinsRemaining}</Text>
            </View>
            
            <View style={styles.spinMiddleContainer}>
              <SlotMachine 
                onSpinComplete={handleSpinComplete}
                decrementSpins={decrementSpins}
                spinsRemaining={spinsRemaining}
                balls={[
                  { id: 'slot-1', minutes: 5, color: '#41DBD8' },
                  { id: 'slot-2', minutes: 10, color: '#FFB800' },
                  { id: 'slot-3', minutes: 20, color: '#F85180' }
                ]}
              />
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.todayButton} onPress={toggleTodayBalls}>
          <Text style={styles.todayButtonText}>Today</Text>
          {showTodayBalls ? (
            <ChevronUp size={16} color="white" style={styles.chevron} />
          ) : (
            <ChevronDown size={16} color="white" style={styles.chevron} />
          )}
        </TouchableOpacity>

        {showTodayBalls && (
          <View style={styles.todayBallsContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.todayBallsRow}>
                {todayBalls.map((ball) => (
                  <TouchableOpacity
                    key={ball.id}
                    style={[styles.todayBall, { backgroundColor: ball.color }]}
                    onPress={() => handleTodayBallPress(ball)}
                  >
                    <Text style={styles.todayBallText}>{ball.minutes}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        <View style={styles.ballsContainer}>
          <View style={styles.ballRow}>
            <View style={[styles.ballDisplay, { backgroundColor: '#20B2AA' }]}>
              <Text style={styles.ballDisplayText}>2</Text>
            </View>
            <Text style={styles.ballCount}>x{ballCounts[2]}</Text>
            
            <View style={[styles.ballDisplay, { backgroundColor: '#20B2AA' }]}>
              <Text style={styles.ballDisplayText}>5</Text>
            </View>
            <Text style={styles.ballCount}>x{ballCounts[5]}</Text>
            
            <View style={[styles.ballDisplay, { backgroundColor: '#FFD700' }]}>
              <Text style={styles.ballDisplayText}>10</Text>
            </View>
            <Text style={styles.ballCount}>x{ballCounts[10]}</Text>
            
            <View style={[styles.ballDisplay, { backgroundColor: '#FF6B6B' }]}>
              <Text style={styles.ballDisplayText}>20</Text>
            </View>
            <Text style={styles.ballCount}>x{ballCounts[20]}</Text>
          </View>
        </View>
      </View>

      {/* Spin Result Modal */}
      <Modal visible={showBallModal} transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.timeCard}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setShowBallModal(false);
              }}
            >
              <X size={24} color="#999" />
            </TouchableOpacity>
            
            {currentBall && (
              <>
                <View style={[styles.modalBall, { backgroundColor: currentBall.color }]}>
                  <Text style={styles.modalBallText}>{currentBall.minutes}</Text>
                </View>
                <Text style={styles.modalTitle}>
                  {currentBall.minutes} minutes ball
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

      {/* Today Ball Modal */}
      <Modal visible={showTodayBallModal} transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.timeCard}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowTodayBallModal(false)}
            >
              <X size={24} color="#999" />
            </TouchableOpacity>
            
            {selectedTodayBall && (
              <>
                <View style={[styles.modalBall, { backgroundColor: selectedTodayBall.color }]}>
                  <Text style={styles.modalBallText}>{selectedTodayBall.minutes}</Text>
                </View>
                <Text style={styles.modalTitle}>
                  {selectedTodayBall.minutes} minutes ball
                </Text>
                
                <TouchableOpacity
                  style={styles.storageButton}
                  onPress={() => handleTodayBallChoice('store')}
                >
                  <Text style={styles.storageButtonText}>Storage</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.useNowButton}
                  onPress={() => handleTodayBallChoice('use')}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  counterText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  spinContainer: {
    marginTop: 60,
    marginBottom: 30,
  },
  spinTopContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  spinMiddleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  spinBox: {
    backgroundColor: '#2F307A',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    width: 320,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  spinsRemaining: {
    color: '#333',
    fontSize: 32,
    fontWeight: 'bold',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  spinButton: {
    backgroundColor: '#FFCD4D',
    paddingHorizontal: 60,
    paddingVertical: 15,
    borderRadius: 7,
    borderTopWidth: 3,
    borderTopColor: 'rgba(248, 179, 0, 1)',
    borderBottomWidth: 3,
    borderBottomColor: 'rgba(255, 226, 153, 1)',
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  spinButtonDisabled: {
    backgroundColor: '#999',
  },
  spinButtonSpinning: {
    backgroundColor: '#E0B846', // Slightly darker when spinning
  },
  spinButtonText: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
  },
  todayButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    paddingHorizontal: 24,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(108, 110, 198, 0.5)',
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  todayButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  chevron: {
    marginLeft: 8,
  },
  todayBallsContainer: {
    marginBottom: 20,
    maxHeight: 100,
  },
  todayBallsRow: {
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  todayBall: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  todayBallText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  ballsContainer: {
    width: '100%',
  },
  ballRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  ballDisplay: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  ballDisplayText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  ballCount: {
    color: 'white',
    fontSize: 12,
    marginRight: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  fallbackCounterText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
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
