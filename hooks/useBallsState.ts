import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ball } from '@/types';
import { generateBallId } from '@/utils/idGenerator';

// Storage key for balls state
const STORAGE_KEY_TODAY = 'ballsState_today';
const STORAGE_KEY_LONGTERM = 'ballsState_longterm';

/**
 * Custom hook for managing balls state
 * This hook separates the ball state management from the game state
 */
export const useBallsState = () => {
  // State for today's balls
  const [todayBalls, setTodayBalls] = useState<Ball[]>([]);
  
  // State for long-term balls
  const [longTermBalls, setLongTermBalls] = useState<Ball[]>([]);
  
  // State for loading status
  const [loading, setLoading] = useState(true);

  // Load balls state from storage
  useEffect(() => {
    const loadBallsState = async () => {
      try {
        // Load today's balls
        const savedTodayBalls = await AsyncStorage.getItem(STORAGE_KEY_TODAY);
        if (savedTodayBalls) {
          setTodayBalls(JSON.parse(savedTodayBalls));
        } else {
          // Default today balls if none saved
          setTodayBalls([
            { id: generateBallId('today', 2), minutes: 2, color: '#20B2AA' },
            { id: generateBallId('today', 2), minutes: 2, color: '#20B2AA' },
            { id: generateBallId('today', 5), minutes: 5, color: '#20B2AA' },
            { id: generateBallId('today', 10), minutes: 10, color: '#FFD700' },
            { id: generateBallId('today', 15), minutes: 15, color: '#FFD700' },
            { id: generateBallId('today', 20), minutes: 20, color: '#FF6B6B' },
          ]);
        }

        // Load long-term balls
        const savedLongTermBalls = await AsyncStorage.getItem(STORAGE_KEY_LONGTERM);
        if (savedLongTermBalls) {
          setLongTermBalls(JSON.parse(savedLongTermBalls));
        } else {
          // Default long-term balls if none saved
          setLongTermBalls([
            { id: generateBallId('longterm', 5), minutes: 5, color: '#20B2AA' },
            { id: generateBallId('longterm', 10), minutes: 10, color: '#FFD700' },
            { id: generateBallId('longterm', 20), minutes: 20, color: '#FF6B6B' },
            { id: generateBallId('longterm', 15), minutes: 15, color: '#FFD700' },
            { id: generateBallId('longterm', 5), minutes: 5, color: '#20B2AA' },
          ]);
        }
      } catch (error) {
        console.error('Error loading balls state:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBallsState();
  }, []);

  // Save today's balls to storage
  const saveTodayBalls = useCallback(async (balls: Ball[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_TODAY, JSON.stringify(balls));
      setTodayBalls(balls);
    } catch (error) {
      console.error('Error saving today balls:', error);
    }
  }, []);

  // Save long-term balls to storage
  const saveLongTermBalls = useCallback(async (balls: Ball[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_LONGTERM, JSON.stringify(balls));
      setLongTermBalls(balls);
    } catch (error) {
      console.error('Error saving long-term balls:', error);
    }
  }, []);

  // Add a ball to today's balls
  const addBallToToday = useCallback((ball: Ball) => {
    // Ensure the ball has a unique ID
    const ballWithId = {
      ...ball,
      id: ball.id || generateBallId('today', ball.minutes)
    };
    
    setTodayBalls(prev => {
      const newBalls = [...prev, ballWithId];
      saveTodayBalls(newBalls);
      return newBalls;
    });
  }, [saveTodayBalls]);

  // Remove a ball from today's balls
  const removeBallFromToday = useCallback((ballId: string) => {
    setTodayBalls(prev => {
      const newBalls = prev.filter(ball => ball.id !== ballId);
      saveTodayBalls(newBalls);
      return newBalls;
    });
  }, [saveTodayBalls]);

  // Move a ball from today to long-term
  const moveBallToLongTerm = useCallback((ballId: string) => {
    setTodayBalls(prev => {
      const ball = prev.find(b => b.id === ballId);
      if (!ball) {
        console.error(`Ball with ID ${ballId} not found in today's balls`);
        return prev;
      }

      console.log(`Moving ball to long-term: ${ball.minutes} minutes, ID: ${ballId}`);

      // Create a new ball with a unique long-term ID that includes timestamp to ensure uniqueness
      const timestamp = Date.now();
      const longTermBall = {
        ...ball,
        id: generateBallId('longterm', ball.minutes)
      };

      console.log(`Created new long-term ball with ID: ${longTermBall.id}`);

      // First, update the long-term balls synchronously
      const newLongTermBalls = [...longTermBalls, longTermBall];
      
      // Immediately calculate the new total to ensure it's up to date
      const newTotal = newLongTermBalls.reduce((sum, b) => sum + b.minutes, 0);
      console.log(`Long-term total updated: ${newTotal}`);
      
      // Save the updated long-term balls
      saveLongTermBalls(newLongTermBalls);
      
      // Remove from today's balls
      const newTodayBalls = prev.filter(b => b.id !== ballId);
      saveTodayBalls(newTodayBalls);
      
      return newTodayBalls;
    });
  }, [longTermBalls, saveTodayBalls, saveLongTermBalls]);

  // Calculate the total minutes in long-term balls
  const getLongTermTotal = useCallback(() => {
    const total = longTermBalls.reduce((sum, ball) => sum + ball.minutes, 0);
    console.log(`Current long-term total: ${total}`);
    return total;
  }, [longTermBalls]);

  // Calculate the next goal based on current total
  const calculateNextGoal = useCallback((currentTotal: number) => {
    if (currentTotal < 100) return 100;
    if (currentTotal < 500) return 500;
    if (currentTotal < 1000) return 1000;
    return Math.ceil(currentTotal / 500) * 500 + 500; // Next 500 increment
  }, []);

  // Get the current long-term goal
  const getLongTermGoal = useCallback(() => {
    const total = getLongTermTotal();
    return calculateNextGoal(total);
  }, [getLongTermTotal, calculateNextGoal]);

  return {
    todayBalls,
    longTermBalls,
    loading,
    addBallToToday,
    removeBallFromToday,
    moveBallToLongTerm,
    getLongTermTotal,
    getLongTermGoal
  };
};
