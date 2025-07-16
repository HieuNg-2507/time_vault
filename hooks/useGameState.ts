import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameState, Ball } from '@/types';

const STORAGE_KEY = 'gameState';

const initialState: GameState = {
  longTermCounter: 125,
  longTermGoal: 1000,
  spinsRemaining: 100,
  todayBalls: [
    { id: '1', minutes: 2, color: '#20B2AA' },
    { id: '2', minutes: 2, color: '#20B2AA' },
    { id: '3', minutes: 5, color: '#20B2AA' },
    { id: '4', minutes: 10, color: '#FFD700' },
    { id: '5', minutes: 10, color: '#FFD700' },
    { id: '6', minutes: 20, color: '#FF6B6B' },
  ],
  longTermBalls: [],
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
      const savedState = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedState) {
        setGameState(JSON.parse(savedState));
      }
    } catch (error) {
      console.error('Error loading game state:', error);
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

    const newState = {
      ...gameState,
      todayBalls: gameState.todayBalls.filter(b => b.id !== ballId),
      longTermBalls: [...gameState.longTermBalls, ball],
      longTermCounter: gameState.longTermCounter + ball.minutes,
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