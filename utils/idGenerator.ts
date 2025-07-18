/**
 * Utility functions for generating unique IDs
 */

/**
 * Generates a unique ID with an optional prefix
 * @param prefix Optional prefix for the ID
 * @returns A unique ID string
 */
export const generateUniqueId = (prefix: string = ''): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `${prefix}${timestamp}_${random}`;
};

/**
 * Generates a unique ID for a ball
 * @param type The type of ball (e.g., 'today', 'longterm')
 * @param minutes The minutes value of the ball
 * @returns A unique ball ID
 */
export const generateBallId = (type: string, minutes: number): string => {
  return generateUniqueId(`ball_${type}_${minutes}_`);
};

/**
 * Generates a unique ID for a reel item
 * @param reelIndex The index of the reel
 * @param position The position in the reel
 * @param minutes The minutes value of the item
 * @returns A unique reel item ID
 */
export const generateReelItemId = (reelIndex: number, position: number, minutes: number): string => {
  return `reel_${reelIndex}_pos_${position}_min_${minutes}_${Math.random().toString(36).substring(2, 9)}`;
};
