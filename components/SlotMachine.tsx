import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, Animated, Easing, TouchableOpacity, Text } from 'react-native';
import { Ball } from '@/types';
import TimeBall from './TimeBall';
import * as Haptics from 'expo-haptics';

const { width: screenWidth } = Dimensions.get('window');
const SPIN_BOX_WIDTH = 299; // From Figma 'Spin box/ click' layout dimensions
const LINE_HEIGHT = 216; // From Figma 'Line 1' layout dimensions
const BALL_SIZE = 56; // From Figma ball dimensions

// Duration of the spin in milliseconds for each reel
const REEL1_DURATION = 4000; // First reel stops after 4s
const REEL2_DURATION = 4500; // Second reel stops after 4.5s
const REEL3_DURATION = 5000; // Third reel stops after 5s

// Initial fast spinning speed (in ms) before slowing down
const INITIAL_FAST_DURATION = 2000;

// Number of positions in each reel (must be multiple of reelBalls[x].length)
const POSITIONS_PER_REEL = 20;

// Space between balls (as a percentage of BALL_SIZE)
const BALL_SPACING = 3; // Reduced spacing for smoother animation

// Speed multiplier for initial fast spinning
const INITIAL_SPEED_MULTIPLIER = 15;

interface SlotMachineProps {
  balls: Ball[]; // Array of balls to display in the slots
  onSpinComplete: (ball: Ball) => void; // Callback when a ball lands
  decrementSpins?: () => void; // Optional callback to decrement spins
  spinsRemaining?: number; // Optional number of spins remaining
}

export const SlotMachine: React.FC<SlotMachineProps> = ({ 
  balls, 
  onSpinComplete, 
  decrementSpins,
  spinsRemaining = 1 // Default to 1 if not provided
}) => {
  // Possible ball values for each reel - without IDs, we'll generate them dynamically
  const reelBallsData = [
    [
      { minutes: 15, color: '#FFB800' },
      { minutes: 10, color: '#FFB800' },
      { minutes: 5, color: '#41DBD8' },
      { minutes: 2, color: '#41DBD8' },
    ],
    [
      { minutes: 20, color: '#F85180' },
      { minutes: 15, color: '#FFB800' },
      { minutes: 10, color: '#FFB800' },
      { minutes: 5, color: '#41DBD8' },
    ],
    [
      { minutes: 10, color: '#FFB800' },
      { minutes: 20, color: '#F85180' },
      { minutes: 15, color: '#FFB800' },
      { minutes: 2, color: '#41DBD8' },
    ]
  ];
  
  // Generate reelBalls with unique IDs using the generateReelItemId function
  const reelBalls = reelBallsData.map((reelData, reelIndex) => 
    reelData.map((ball, ballIndex) => ({
      ...ball,
      id: `slot_reel${reelIndex+1}_ball${ballIndex}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    }))
  );

  // Track the currently visible ball for each reel
  const [visibleBalls, setVisibleBalls] = useState([
    reelBalls[0][0],
    reelBalls[1][0],
    reelBalls[2][0]
  ]);

  // Animation values for each reel
  const reel1Position = useRef(new Animated.Value(0)).current;
  const reel2Position = useRef(new Animated.Value(0)).current;
  const reel3Position = useRef(new Animated.Value(0)).current;
  
  // Track if animation is running
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Reference to track if we've already called onSpinComplete
  const spinCompleteCalledRef = useRef(false);
  
  // References to track active animations
  const reel1Animation = useRef<Animated.CompositeAnimation | null>(null);
  const reel2Animation = useRef<Animated.CompositeAnimation | null>(null);
  const reel3Animation = useRef<Animated.CompositeAnimation | null>(null);
  
  // Generate positions for each reel with unique IDs
  const generateReelPositions = (reelBalls: Ball[], reelIndex: number) => {
    const positions = [];
    for (let i = 0; i < POSITIONS_PER_REEL; i++) {
      const ballIndex = i % reelBalls.length;
      positions.push({
        ...reelBalls[ballIndex],
        // Ensure truly unique IDs by including reelIndex and position
        id: `reel${reelIndex+1}-pos${i}-ball${ballIndex}`
      });
    }
    return positions;
  };

  // Helper function to start continuous scrolling for a reel
  const startContinuousScrolling = (
    animatedValue: Animated.Value,
    duration: number,
    reelIndex: number
  ): Animated.CompositeAnimation => {
    // Calculate scroll speed based on ball count and duration
    // Use a faster speed for more realistic slot machine effect
    const scrollSpeed = BALL_SIZE * BALL_SPACING / (duration / (reelBalls[reelIndex].length * 3));
    
    // Reset the animation value to create a continuous loop effect
    const resetAnimation = () => {
      animatedValue.setValue(0);
    };
    
    // Create continuous scrolling animation with faster speed
    const animation = Animated.timing(animatedValue, {
      toValue: -BALL_SIZE * BALL_SPACING * reelBalls[reelIndex].length * 3,
      duration: duration / 3, // Faster duration for more spins
      easing: Easing.linear,
      useNativeDriver: true
    });
    
    // Create a loop that resets the position when it completes
    const loopAnimation = {
      start: (callback?: Animated.EndCallback) => {
        const loop = () => {
          animation.start(({ finished }) => {
            if (finished) {
              resetAnimation();
              loop();
            } else if (callback) {
              callback({ finished: false });
            }
          });
        };
        loop();
      },
      stop: () => {
        animation.stop();
      },
      reset: () => {
        animation.reset();
      }
    };
    
    return loopAnimation;
  };

  // Helper function to calculate final position ensuring downward motion
  const calculateFinalPosition = (
    currentValue: number,
    targetBallIndex: number,
    reelIndex: number
  ) => {
    const reelHeight = BALL_SIZE * BALL_SPACING * reelBalls[reelIndex].length;
    const targetPos = targetBallIndex * BALL_SIZE * BALL_SPACING;
    const centerOffset = (LINE_HEIGHT - BALL_SIZE) / 2;
    
    // Get current position normalized to reel height
    let currentPos = -currentValue % reelHeight;
    if (currentPos > 0) currentPos -= reelHeight;
    
    // Calculate distance to next occurrence of target ball
    let distance = (targetPos - currentPos) % reelHeight;
    if (distance < 0) distance += reelHeight;
    
    return -(currentPos + distance) + centerOffset;
  };

  // Helper function to add bounce effect
  const bounceToCenter = (
    animatedValue: Animated.Value,
    finalPos: number,
    onComplete: () => void
  ) => {
    Animated.sequence([
      // Overshoot by 8px
      Animated.timing(animatedValue, {
        toValue: finalPos + 8,
        duration: 100,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true
      }),
      // Bounce back with elastic effect
      Animated.timing(animatedValue, {
        toValue: finalPos,
        duration: 150,
        easing: Easing.out(Easing.elastic(1.2)),
        useNativeDriver: true
      })
    ]).start(({ finished }) => {
      if (finished) {
        onComplete();
      }
    });
  };

  // Helper function to stop scrolling with result
  const stopScrollingWithResult = (
    animatedValue: Animated.Value,
    finalBallIndex: number,
    animation: Animated.CompositeAnimation | null,
    reelIndex: number,
    onComplete: () => void
  ) => {
    if (animation) {
      animation.stop();
    }

    // Get current position value
    let currentValue = 0;
    // Use the __getValue() method which is available in React Native's Animated.Value
    animatedValue.extractOffset();
    const value = (animatedValue as any)._value;
    currentValue = value || 0;
    
    // Calculate final position ensuring downward motion
    const finalPosition = calculateFinalPosition(currentValue, finalBallIndex, reelIndex);
    
    // Animate to final position with bounce effect
    bounceToCenter(animatedValue, finalPosition, onComplete);
  };
  
  const reel1Positions = generateReelPositions(reelBalls[0], 0);
  const reel2Positions = generateReelPositions(reelBalls[1], 1);
  const reel3Positions = generateReelPositions(reelBalls[2], 2);
  
  // Initialize the reels with proper positioning
  useEffect(() => {
    // Calculate the offset needed to center the ball in the viewport
    const ballHeight = BALL_SIZE * BALL_SPACING;
    const centerOffset = (LINE_HEIGHT - BALL_SIZE) / 2;
    
    // Set initial positions to show centered balls
    reel1Position.setValue(centerOffset);
    reel2Position.setValue(centerOffset);
    reel3Position.setValue(centerOffset);
    
    // Set initial visible balls
    setVisibleBalls([
      reelBalls[0][0],
      reelBalls[1][0],
      reelBalls[2][0]
    ]);
  }, []);
  
  // Helper function to create a reel animation with fast initial speed and slower ending
  const createReelAnimation = (
    animatedValue: Animated.Value,
    finalPosition: number,
    duration: number,
    reelIndex: number,
    onComplete: () => void
  ) => {
    // Calculate the total height of all balls in the reel
    const totalHeight = BALL_SIZE * BALL_SPACING * POSITIONS_PER_REEL;
    
    // Calculate how many full rotations to make based on duration
    const rotations = Math.max(3, Math.floor(duration / 1000));
    
    // Calculate the final position to ensure a ball is centered
    const ballHeight = BALL_SIZE * BALL_SPACING;
    const reelLength = reelBalls[reelIndex].length;
    
    // Calculate the offset needed to center the ball in the viewport
    const centerOffset = (LINE_HEIGHT - BALL_SIZE) / 2;
    const finalOffset = (finalPosition % reelLength) * ballHeight;
    
    // Calculate the total distance to travel
    // We add an offset to ensure the ball is centered in the viewport
    const distance = (rotations * totalHeight) + finalOffset + centerOffset;
    
    // Create a sequence of animations: fast spinning followed by slowing down to final position
    Animated.sequence([
      // Fast initial spinning
      Animated.timing(animatedValue, {
        toValue: distance * 0.8, // 80% of the distance at high speed
        duration: INITIAL_FAST_DURATION / INITIAL_SPEED_MULTIPLIER, // Much faster initial speed
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      // Slow down to final position
      Animated.timing(animatedValue, {
        toValue: distance,
        duration: duration - INITIAL_FAST_DURATION,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      })
    ]).start(({ finished }) => {
      if (finished) {
        // Update the visible ball for this reel
        const finalBall = reelBalls[reelIndex][finalPosition % reelLength];
        setVisibleBalls(prev => {
          const newBalls = [...prev];
          newBalls[reelIndex] = finalBall;
          return newBalls;
        });
        
        // Call the completion callback
        onComplete();
      }
    });
    
    // Return a dummy CompositeAnimation for type compatibility
    return {
      start: () => {},
      stop: () => {},
      reset: () => {},
    };
  };
  
  // Function to spin the reels
  const spinReels = async () => {
    // Don't start a new spin if animation is already running or no spins remaining
    if (isAnimating || spinsRemaining <= 0) return;
    
    // Add haptic feedback
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Call decrementSpins if provided
    if (decrementSpins) {
      decrementSpins();
    }
    
    setIsAnimating(true);
    spinCompleteCalledRef.current = false;
    
    // Reset animation values to start position
    const centerOffset = (LINE_HEIGHT - BALL_SIZE) / 2;
    reel1Position.setValue(centerOffset);
    reel2Position.setValue(centerOffset);
    reel3Position.setValue(centerOffset);
    
    // Random final positions for each reel
    const finalPos1 = Math.floor(Math.random() * reelBalls[0].length);
    const finalPos2 = Math.floor(Math.random() * reelBalls[1].length);
    const finalPos3 = Math.floor(Math.random() * reelBalls[2].length);
    
    // Set the final balls that will be shown when spinning stops
    const finalBall1 = reelBalls[0][finalPos1];
    const finalBall2 = reelBalls[1][finalPos2];
    const finalBall3 = reelBalls[2][finalPos3];

    // Start continuous scrolling for each reel
    reel1Animation.current = startContinuousScrolling(reel1Position, REEL1_DURATION, 0);
    reel2Animation.current = startContinuousScrolling(reel2Position, REEL2_DURATION, 1);
    reel3Animation.current = startContinuousScrolling(reel3Position, REEL3_DURATION, 2);
    
    reel1Animation.current.start();
    reel2Animation.current.start();
    reel3Animation.current.start();
    
    // Schedule stopping of each reel at different times
    setTimeout(() => {
      stopScrollingWithResult(reel1Position, finalPos1, reel1Animation.current, 0, async () => {
        // Update the visible ball for this reel
        setVisibleBalls(prev => {
          const newBalls = [...prev];
          newBalls[0] = finalBall1;
          return newBalls;
        });
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      });
    }, REEL1_DURATION - 500);
    
    setTimeout(() => {
      stopScrollingWithResult(reel2Position, finalPos2, reel2Animation.current, 1, async () => {
        // Update the visible ball for this reel
        setVisibleBalls(prev => {
          const newBalls = [...prev];
          newBalls[1] = finalBall2;
          return newBalls;
        });
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      });
    }, REEL2_DURATION - 500);
    
    setTimeout(() => {
      stopScrollingWithResult(reel3Position, finalPos3, reel3Animation.current, 2, async () => {
        // Update the visible ball for this reel
        setVisibleBalls(prev => {
          const newBalls = [...prev];
          newBalls[2] = finalBall3;
          return newBalls;
        });
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setIsAnimating(false);
        if (!spinCompleteCalledRef.current) {
          spinCompleteCalledRef.current = true;
          onSpinComplete(finalBall2);
        }
      });
    }, REEL3_DURATION - 500);
  };
  
  // Render a single reel with multiple balls
  const renderReel = (
    reelPositions: Ball[],
    animatedPosition: Animated.Value,
    index: number
  ) => {
    // Calculate the height of each ball container
    const ballContainerHeight = BALL_SIZE * BALL_SPACING;

    // Create gradient masks for fade effect
    const gradientColors = ['rgba(255,255,255,0.12)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0.12)'];
    const gradientHeights = ['30%', '40%', '30%'];
    
    return (
      <View
        style={[
          styles.line,
          index === 0 && styles.lineLeftRadius,
          index === 2 && styles.lineRightRadius
        ]}
      >
        {/* Top fade gradient */}
        <View style={[styles.fadeGradient, styles.fadeTop]}>
          <View style={styles.gradientOverlay} />
        </View>

        {/* Bottom fade gradient */}
        <View style={[styles.fadeGradient, styles.fadeBottom]}>
          <View style={styles.gradientOverlay} />
        </View>

        {/* Static ball that's always visible when not spinning */}
        {!isAnimating && (
          <View style={styles.staticBallContainer}>
            <TimeBall minutes={visibleBalls[index].minutes} />
          </View>
        )}
        
        {/* Animated reel that's visible when spinning */}
        {isAnimating && (
          <Animated.View
            style={[
              styles.reelContainer,
              {
                transform: [
                  {
                    translateY: animatedPosition.interpolate({
                      inputRange: [0, ballContainerHeight * reelBalls[index].length],
                      outputRange: [0, -ballContainerHeight * reelBalls[index].length],
                      extrapolate: 'extend',
                    }),
                  },
                ],
              },
            ]}
          >
            {/* Double the positions to create seamless loop */}
            {[...reelPositions, ...reelPositions].map((ball, ballIndex) => (
              <View 
                key={`${ball.id}-${ballIndex}`} 
                style={[
                  styles.ballContainer,
                  { height: ballContainerHeight }
                ]}
              >
                <TimeBall minutes={ball.minutes} />
              </View>
            ))}
          </Animated.View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.spinLine}>
        {renderReel(reel1Positions, reel1Position, 0)}
        {renderReel(reel2Positions, reel2Position, 1)}
        {renderReel(reel3Positions, reel3Position, 2)}
      </View>
      
      {/* Spin button directly in the component */}
      <TouchableOpacity
        style={[
          styles.spinButton,
          spinsRemaining <= 0 && styles.spinButtonDisabled,
          isAnimating && styles.spinButtonSpinning
        ]}
        onPress={spinReels}
        disabled={isAnimating || spinsRemaining <= 0}
      >
        <Text style={styles.spinButtonText}>Spin</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  fadeGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: '30%',
    zIndex: 1,
    pointerEvents: 'none',
  },
  fadeTop: {
    top: 0,
    opacity: 0.6,
  },
  fadeBottom: {
    bottom: 0,
    opacity: 0.6,
  },
  gradientOverlay: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  container: {
    width: SPIN_BOX_WIDTH,
    alignItems: 'center',
  },
  spinLine: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 1,
    height: LINE_HEIGHT,
    width: '100%',
    marginBottom: 20,
  },
  line: {
    flex: 1,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  lineLeftRadius: {
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  lineRightRadius: {
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  reelContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    position: 'absolute',
  },
  ballContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  staticBallContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    position: 'absolute',
    display: 'flex',
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
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
});
