import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useBallsState } from '@/hooks/useBallsState';
import { useSpinsState } from '@/hooks/useSpinsState';
import { Ball } from '@/types';

// Define the context type
interface GameContextType {
  // Balls state
  todayBalls: Ball[];
  longTermBalls: Ball[];
  addBallToToday: (ball: Ball) => void;
  removeBallFromToday: (ballId: string) => void;
  moveBallToLongTerm: (ballId: string) => void;
  getLongTermTotal: () => number;
  getLongTermGoal: () => number;
  
  // Spins state
  spinsRemaining: number;
  decrementSpins: () => void;
  resetDailySpins: () => void;
  addBonusSpins: (amount: number) => void;
  
  // Loading state
  loading: boolean;
}

// Create the context with a default value
const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider props type
interface GameProviderProps {
  children: ReactNode;
}

/**
 * Game context provider component
 */
export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  // Use the balls state hook
  const {
    todayBalls,
    longTermBalls,
    loading: ballsLoading,
    addBallToToday,
    removeBallFromToday,
    moveBallToLongTerm,
    getLongTermTotal,
    getLongTermGoal
  } = useBallsState();

  // Use the spins state hook
  const {
    spinsRemaining,
    loading: spinsLoading,
    decrementSpins,
    resetDailySpins,
    addBonusSpins
  } = useSpinsState();

  // Combined loading state
  const loading = ballsLoading || spinsLoading;
  
  // Monitor changes to longTermBalls to ensure counter is updated
  useEffect(() => {
    const total = getLongTermTotal();
    const goal = getLongTermGoal();
    console.log(`GameContext: longTermBalls changed - Total: ${total}, Goal: ${goal}`);
  }, [longTermBalls, getLongTermTotal, getLongTermGoal]);

  // Create the context value
  const contextValue: GameContextType = {
    todayBalls,
    longTermBalls,
    addBallToToday,
    removeBallFromToday,
    moveBallToLongTerm,
    getLongTermTotal,
    getLongTermGoal,
    spinsRemaining,
    decrementSpins,
    resetDailySpins,
    addBonusSpins,
    loading
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
};

/**
 * Custom hook to use the game context
 */
export const useGameContext = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};
