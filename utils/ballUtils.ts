import { BallConfig } from '@/types';

export const BALL_CONFIGS: BallConfig[] = [
  { minutes: 2, color: '#20B2AA', probability: 0.3 },
  { minutes: 5, color: '#20B2AA', probability: 0.25 },
  { minutes: 10, color: '#FFD700', probability: 0.25 },
  { minutes: 15, color: '#FFD700', probability: 0.15 },
  { minutes: 20, color: '#FF6B6B', probability: 0.05 },
];

export const generateRandomBall = () => {
  const random = Math.random();
  let cumulativeProbability = 0;
  
  for (const config of BALL_CONFIGS) {
    cumulativeProbability += config.probability;
    if (random <= cumulativeProbability) {
      return {
        id: Date.now().toString(),
        minutes: config.minutes,
        color: config.color,
      };
    }
  }
  
  return {
    id: Date.now().toString(),
    minutes: 2,
    color: '#20B2AA',
  };
};

export const getBallCountsByValue = (balls: any[]) => {
  const counts = { 2: 0, 5: 0, 10: 0, 15: 0, 20: 0 };
  balls.forEach(ball => {
    if (counts[ball.minutes as keyof typeof counts] !== undefined) {
      counts[ball.minutes as keyof typeof counts]++;
    }
  });
  return counts;
};