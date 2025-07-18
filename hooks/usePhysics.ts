import { useRef, useState, useEffect } from 'react';
import { Dimensions } from 'react-native';
import { PhysicsEngine } from '@/physics/PhysicsEngine';
import { PhysicsObject, PhysicsConfig, PhysicsState } from '@/physics/types';
import { Ball } from '@/types';
import { generateBallId } from '@/utils/idGenerator';

const { width, height } = Dimensions.get('window');

/**
 * Custom hook for using the physics engine in React components
 * @param initialBalls Initial balls to add to the physics simulation
 * @param config Optional physics configuration
 * @returns Physics state and methods to interact with the physics engine
 */
export const usePhysics = (
  initialBalls: Ball[] = [],
  config: Partial<PhysicsConfig> = {}
) => {
  // Create a ref to store the physics engine instance
  const engineRef = useRef<PhysicsEngine | null>(null);
  
  // State to store the current physics state
  const [physicsState, setPhysicsState] = useState<PhysicsState>({
    objects: [],
    bounds: { width, height },
    config: {
      gravity: { x: 0, y: 0.2 },
      friction: 0.95, // Slightly reduced friction for smoother movement
      bounce: 0.7,    // Reduced bounce for less bouncy balls
      collisionDamping: 0, // Reduced damping for less separation between balls
      ...config
    }
  });

  // State to track if the physics engine is running
  const [isRunning, setIsRunning] = useState(false);

  // Initialize the physics engine
  useEffect(() => {
    // Create a new physics engine
    engineRef.current = new PhysicsEngine(
      { width, height },
      physicsState.config
    );

    // Subscribe to physics updates
    const unsubscribe = engineRef.current.subscribe(newState => {
      setPhysicsState(newState);
    });

    // Add initial balls to the physics engine
    initialBalls.forEach(ball => {
      addBall(ball);
    });

    // Start the physics engine
    startSimulation();

    // Clean up on unmount
    return () => {
      unsubscribe();
      stopSimulation();
      engineRef.current = null;
    };
  }, []); // Empty dependency array means this runs once on mount

  // Function to convert a Ball to a PhysicsObject
  const ballToPhysicsObject = (ball: Ball, x?: number, y?: number): PhysicsObject => {
    // Get the radius for this ball based on minutes
    const radius = getBallRadius(ball.minutes);
    
    // Calculate mass based on radius (proportional to volume: 4/3 * π * r³)
    // We use a simplified formula: mass = radius^2 for better physics behavior
    const mass = Math.pow(radius, 2);
    
    // Use provided position or generate a random one
    const posX = x ?? width * (0.2 + 0.6 * Math.random());
    const posY = y ?? height * (0.2 + 0.6 * Math.random());
    
    return {
      id: ball.id || generateBallId('physics', ball.minutes),
      position: { x: posX, y: posY },
      velocity: { x: 0, y: 0 },
      radius,
      mass,
      data: ball // Store the original ball data
    };
  };

  // Get the radius for a ball based on its minutes
  const getBallRadius = (minutes: number): number => {
    // Match exactly with theme.ts sizing
    if (minutes <= 5) {
      return 28; // small ball - radius is 14px
    } else if (minutes <= 15) {
      return 34; // medium ball - radius is 17px
    } else {
      return 40; // large ball - radius is 20px
    }
  };

  // Function to add a ball to the physics simulation
  const addBall = (ball: Ball, x?: number, y?: number): void => {
    if (!engineRef.current) return;
    
    const physicsObject = ballToPhysicsObject(ball, x, y);
    engineRef.current.addObject(physicsObject);
  };

  // Function to remove a ball from the physics simulation
  const removeBall = (id: string): void => {
    if (!engineRef.current) return;
    
    engineRef.current.removeObject(id);
  };

  // Function to update a ball in the physics simulation
  const updateBall = (ball: Ball, x?: number, y?: number): void => {
    if (!engineRef.current) return;
    
    const physicsObject = ballToPhysicsObject(ball, x, y);
    engineRef.current.updateObject(physicsObject);
  };

  // Function to clear all balls from the physics simulation
  const clearBalls = (): void => {
    if (!engineRef.current) return;
    
    engineRef.current.clearObjects();
  };

  // Function to start the physics simulation
  const startSimulation = (): void => {
    if (!engineRef.current) return;
    
    engineRef.current.start();
    setIsRunning(true);
  };

  // Function to stop the physics simulation
  const stopSimulation = (): void => {
    if (!engineRef.current) return;
    
    engineRef.current.stop();
    setIsRunning(false);
  };

  // Function to update the physics configuration
  const updateConfig = (newConfig: Partial<PhysicsConfig>): void => {
    if (!engineRef.current) return;
    
    engineRef.current.updateConfig(newConfig);
  };

  // Function to update the world bounds
  const updateBounds = (newWidth: number, newHeight: number): void => {
    if (!engineRef.current) return;
    
    engineRef.current.updateBounds({ width: newWidth, height: newHeight });
  };

  // Convert physics objects back to balls
  const getBalls = (): Ball[] => {
    return physicsState.objects.map(obj => ({
      ...(obj.data as Ball),
      x: obj.position.x,
      y: obj.position.y,
      vx: obj.velocity.x,
      vy: obj.velocity.y,
      radius: obj.radius
    }));
  };

  return {
    physicsState,
    isRunning,
    addBall,
    removeBall,
    updateBall,
    clearBalls,
    startSimulation,
    stopSimulation,
    updateConfig,
    updateBounds,
    getBalls
  };
};
