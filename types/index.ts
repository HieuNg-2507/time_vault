export interface Ball {
  id: string;
  minutes: number;
  color: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

export interface GameState {
  longTermCounter: number;
  longTermGoal: number;
  spinsRemaining: number;
  todayBalls: Ball[];
  longTermBalls: Ball[];
  blockedApps: string[];
}

export interface BallConfig {
  minutes: number;
  color: string;
  probability: number;
}