import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage key for spins state
const STORAGE_KEY = 'spinsState';

// Default values
const DEFAULT_DAILY_SPINS = 100;
const DEFAULT_RESET_HOUR = 0; // Midnight

/**
 * Custom hook for managing spins state
 * This hook separates the spins state management from the game state
 */
export const useSpinsState = () => {
  // State for remaining spins
  const [spinsRemaining, setSpinsRemaining] = useState(DEFAULT_DAILY_SPINS);
  
  // State for last reset date
  const [lastResetDate, setLastResetDate] = useState<string | null>(null);
  
  // State for loading status
  const [loading, setLoading] = useState(true);

  // Load spins state from storage
  useEffect(() => {
    const loadSpinsState = async () => {
      try {
        const savedState = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedState) {
          const { spinsRemaining, lastResetDate } = JSON.parse(savedState);
          setSpinsRemaining(spinsRemaining);
          setLastResetDate(lastResetDate);
        } else {
          // Default values if none saved
          setSpinsRemaining(DEFAULT_DAILY_SPINS);
          setLastResetDate(new Date().toISOString());
        }
      } catch (error) {
        console.error('Error loading spins state:', error);
        // Use defaults if error
        setSpinsRemaining(DEFAULT_DAILY_SPINS);
        setLastResetDate(new Date().toISOString());
      } finally {
        setLoading(false);
      }
    };

    loadSpinsState();
  }, []);

  // Check if spins should be reset (new day)
  useEffect(() => {
    const checkResetSpins = () => {
      if (!lastResetDate) return;

      const now = new Date();
      const lastReset = new Date(lastResetDate);
      
      // Check if it's a new day (past midnight)
      if (
        now.getDate() !== lastReset.getDate() ||
        now.getMonth() !== lastReset.getMonth() ||
        now.getFullYear() !== lastReset.getFullYear()
      ) {
        resetDailySpins();
      }
    };

    checkResetSpins();
    
    // Set up interval to check for reset (every minute)
    const intervalId = setInterval(checkResetSpins, 60000);
    
    return () => clearInterval(intervalId);
  }, [lastResetDate]);

  // Save spins state to storage
  const saveSpinsState = useCallback(async (spins: number, resetDate: string) => {
    try {
      const state = {
        spinsRemaining: spins,
        lastResetDate: resetDate
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving spins state:', error);
    }
  }, []);

  // Decrement spins
  const decrementSpins = useCallback(() => {
    if (spinsRemaining > 0) {
      const newSpinsRemaining = spinsRemaining - 1;
      setSpinsRemaining(newSpinsRemaining);
      saveSpinsState(newSpinsRemaining, lastResetDate || new Date().toISOString());
    }
  }, [spinsRemaining, lastResetDate, saveSpinsState]);

  // Reset daily spins
  const resetDailySpins = useCallback(() => {
    const now = new Date().toISOString();
    setSpinsRemaining(DEFAULT_DAILY_SPINS);
    setLastResetDate(now);
    saveSpinsState(DEFAULT_DAILY_SPINS, now);
  }, [saveSpinsState]);

  // Add bonus spins
  const addBonusSpins = useCallback((amount: number) => {
    const newSpinsRemaining = spinsRemaining + amount;
    setSpinsRemaining(newSpinsRemaining);
    saveSpinsState(newSpinsRemaining, lastResetDate || new Date().toISOString());
  }, [spinsRemaining, lastResetDate, saveSpinsState]);

  return {
    spinsRemaining,
    loading,
    decrementSpins,
    resetDailySpins,
    addBonusSpins
  };
};
