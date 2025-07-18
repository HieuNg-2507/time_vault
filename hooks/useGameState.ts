import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameState, Ball } from '@/types';

const STORAGE_KEY = 'gameState';

const initialState: GameState = {
  longTermCounter: 55, // Updated to match the sum of longTermBalls minutes
  longTermGoal: 100,  // Initial goal
  spinsRemaining: 100,
  todayBalls: [
    { id: '1', minutes: 2, color: '#20B2AA' },
    { id: '2', minutes: 2, color: '#20B2AA' },
    { id: '3', minutes: 5, color: '#20B2AA' },
    { id: '4', minutes: 10, color: '#FFD700' },
    { id: '5', minutes: 15, color: '#FFD700' },
    { id: '6', minutes: 20, color: '#FF6B6B' },
  ],
  longTermBalls: [
    { id: 'lt1', minutes: 5, color: '#20B2AA' },
    { id: 'lt2', minutes: 10, color: '#FFD700' },
    { id: 'lt3', minutes: 20, color: '#FF6B6B' },
    { id: 'lt4', minutes: 15, color: '#FFD700' },
    { id: 'lt5', minutes: 5, color: '#20B2AA' },
  ], // Add test balls
  blockedApps: ['Instagram', 'Facebook', 'TikTok', 'Twitter'],
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(initialState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGameState();
  }, []);

  const loadGameState = async () => {
    try {
      // For debugging purposes, clear the saved state to use our test data
      // await AsyncStorage.removeItem(STORAGE_KEY);
      
      const savedState = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        // Ensure longTermCounter is correctly calculated from longTermBalls on load
        const calculatedCounter = parsedState.longTermBalls.reduce((sum: number, ball: Ball) => sum + ball.minutes, 0);
        setGameState({
          ...parsedState,
          longTermCounter: calculatedCounter,
          longTermGoal: calculateNextGoal(calculatedCounter), // Recalculate goal on load
        });
      } else {
        // If no saved state, use our initial state with test data
        console.log('No saved state found, using initial state with test data');
        setGameState(initialState);
      }
    } catch (error) {
      console.error('Error loading game state:', error);
      // If there's an error, use our initial state with test data
      setGameState(initialState);
    } finally {
      setLoading(false);
    }
  };

  const saveGameState = async (newState: GameState) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      setGameState(newState);
    } catch (error) {
      console.error('Error saving game state:', error);
    }
  };

  const calculateNextGoal = (currentCounter: number): number => {
    if (currentCounter < 100) return 100;
    if (currentCounter < 500) return 500;
    if (currentCounter < 1000) return 1000;
    return currentCounter + 500; // Or some other logic for beyond 1000
  };

  const addBallToToday = (ball: Ball) => {
    const newState = {
      ...gameState,
      todayBalls: [...gameState.todayBalls, ball],
    };
    saveGameState(newState);
  };

  const removeBallFromToday = (ballId: string) => {
    const newState = {
      ...gameState,
      todayBalls: gameState.todayBalls.filter(ball => ball.id !== ballId),
    };
    saveGameState(newState);
  };

  const moveBallToLongTerm = (ballId: string) => {
    const ball = gameState.todayBalls.find(b => b.id === ballId);
    if (!ball) return;

    // Create a new ball with a unique ID using 'lt' prefix and timestamp
    const uniqueBall = {
      ...ball,
      id: `lt_${Date.now()}_${Math.floor(Math.random() * 1000)}`
    };

    const newLongTermBalls = [...gameState.longTermBalls, uniqueBall];
    const newLongTermCounter = newLongTermBalls.reduce((sum, b) => sum + b.minutes, 0);
    const newLongTermGoal = calculateNextGoal(newLongTermCounter);

    const newState = {
      ...gameState,
      todayBalls: gameState.todayBalls.filter(b => b.id !== ballId),
      longTermBalls: newLongTermBalls,
      longTermCounter: newLongTermCounter,
      longTermGoal: newLongTermGoal,
    };
    saveGameState(newState);
  };

  const decrementSpins = () => {
    if (gameState.spinsRemaining > 0) {
      const newState = {
        ...gameState,
        spinsRemaining: gameState.spinsRemaining - 1,
      };
      saveGameState(newState);
    }
  };

  const resetDailySpins = () => {
    const newState = {
      ...gameState,
      spinsRemaining: 100,
    };
    saveGameState(newState);
  };

  return {
    gameState,
    loading,
    addBallToToday,
    removeBallFromToday,
    moveBallToLongTerm,
    decrementSpins,
    resetDailySpins,
  };
};
