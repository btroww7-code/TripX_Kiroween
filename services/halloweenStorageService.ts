/**
 * Halloween Storage Service
 * 
 * Manages localStorage for Halloween features (visited destinations, badges, progress).
 * Per-user storage - each user has their own data.
 * Requirements: 16.5, 17.1
 */

import { HalloweenBadge, HalloweenProgress } from '../types/halloween';

const STORAGE_KEY_PREFIX = {
  VISITED_SPOOKY: 'tripx_visited_spooky_destinations',
  HALLOWEEN_BADGES: 'tripx_halloween_badges',
  HALLOWEEN_PROGRESS: 'tripx_halloween_progress',
  USER_PREFERENCES: 'tripx_user_preferences',
} as const;

// Current user ID for per-user storage
let currentUserId: string | null = null;

/**
 * Set current user ID for per-user storage
 */
export const setCurrentUser = (userId: string | null): void => {
  currentUserId = userId;
  console.log('[HalloweenStorage] Current user set to:', userId);
};

/**
 * Get current user ID
 */
export const getCurrentUser = (): string | null => currentUserId;

/**
 * Get storage key for current user
 */
const getStorageKey = (baseKey: string): string => {
  if (currentUserId) {
    return `${baseKey}_${currentUserId}`;
  }
  return `${baseKey}_anonymous`;
};

// Legacy export for backwards compatibility
export const STORAGE_KEYS = STORAGE_KEY_PREFIX;

/**
 * Get list of visited spooky destination IDs
 */
export const getVisitedDestinations = (): string[] => {
  try {
    const key = getStorageKey(STORAGE_KEY_PREFIX.VISITED_SPOOKY);
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error('Error reading visited destinations:', error);
    return [];
  }
};

/**
 * Add a destination to visited list
 */
export const addVisitedDestination = (destinationId: string): void => {
  try {
    const key = getStorageKey(STORAGE_KEY_PREFIX.VISITED_SPOOKY);
    const visited = getVisitedDestinations();
    if (!visited.includes(destinationId)) {
      visited.push(destinationId);
      localStorage.setItem(key, JSON.stringify(visited));
    }
  } catch (error) {
    console.error('Error adding visited destination:', error);
  }
};

/**
 * Check if a destination has been visited
 */
export const isDestinationVisited = (destinationId: string): boolean => {
  const visited = getVisitedDestinations();
  return visited.includes(destinationId);
};

/**
 * Get all unlocked Halloween badges
 */
export const getBadges = (): HalloweenBadge[] => {
  try {
    const key = getStorageKey(STORAGE_KEY_PREFIX.HALLOWEEN_BADGES);
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    
    const badges = JSON.parse(raw);
    // Convert unlockedAt strings back to Date objects
    return badges.map((badge: any) => ({
      ...badge,
      unlockedAt: badge.unlockedAt ? new Date(badge.unlockedAt) : undefined,
    }));
  } catch (error) {
    console.error('Error reading badges:', error);
    return [];
  }
};

/**
 * Unlock a badge and save with timestamp
 */
export const unlockBadge = (badge: HalloweenBadge): void => {
  try {
    const key = getStorageKey(STORAGE_KEY_PREFIX.HALLOWEEN_BADGES);
    const badges = getBadges();
    const existingIndex = badges.findIndex(b => b.id === badge.id);
    
    const unlockedBadge = {
      ...badge,
      unlockedAt: new Date(),
    };
    
    if (existingIndex >= 0) {
      badges[existingIndex] = unlockedBadge;
    } else {
      badges.push(unlockedBadge);
    }
    
    localStorage.setItem(key, JSON.stringify(badges));
  } catch (error) {
    console.error('Error unlocking badge:', error);
  }
};

/**
 * Check if a badge is unlocked
 */
export const isBadgeUnlocked = (badgeId: string): boolean => {
  const badges = getBadges();
  return badges.some(b => b.id === badgeId);
};

/**
 * Get Halloween progress data
 */
export const getProgress = (): HalloweenProgress => {
  try {
    const key = getStorageKey(STORAGE_KEY_PREFIX.HALLOWEEN_PROGRESS);
    const raw = localStorage.getItem(key);
    if (!raw) {
      return {
        spookyDestinationsVisited: 0,
        halloweenQuestsCompleted: 0,
        tokensEarnedInSeason: 0,
        unlockedBadges: [],
      };
    }
    return JSON.parse(raw);
  } catch (error) {
    console.error('Error reading progress:', error);
    return {
      spookyDestinationsVisited: 0,
      halloweenQuestsCompleted: 0,
      tokensEarnedInSeason: 0,
      unlockedBadges: [],
    };
  }
};

/**
 * Update Halloween progress
 */
export const updateProgress = (progress: Partial<HalloweenProgress>): void => {
  try {
    const key = getStorageKey(STORAGE_KEY_PREFIX.HALLOWEEN_PROGRESS);
    const currentProgress = getProgress();
    const updatedProgress = {
      ...currentProgress,
      ...progress,
    };
    localStorage.setItem(key, JSON.stringify(updatedProgress));
  } catch (error) {
    console.error('Error updating progress:', error);
  }
};

/**
 * Increment spooky destinations visited count
 */
export const incrementDestinationsVisited = (): void => {
  const progress = getProgress();
  updateProgress({
    spookyDestinationsVisited: progress.spookyDestinationsVisited + 1,
  });
};

/**
 * Increment Halloween quests completed count
 */
export const incrementQuestsCompleted = (): void => {
  const progress = getProgress();
  updateProgress({
    halloweenQuestsCompleted: progress.halloweenQuestsCompleted + 1,
  });
};

/**
 * Add tokens earned in season
 */
export const addTokensEarned = (amount: number): void => {
  const progress = getProgress();
  updateProgress({
    tokensEarnedInSeason: progress.tokensEarnedInSeason + amount,
  });
};

/**
 * Clear all Halloween data for current user
 */
export const clearAllHalloweenData = (): void => {
  try {
    localStorage.removeItem(getStorageKey(STORAGE_KEY_PREFIX.VISITED_SPOOKY));
    localStorage.removeItem(getStorageKey(STORAGE_KEY_PREFIX.HALLOWEEN_BADGES));
    localStorage.removeItem(getStorageKey(STORAGE_KEY_PREFIX.HALLOWEEN_PROGRESS));
  } catch (error) {
    console.error('Error clearing Halloween data:', error);
  }
};

/**
 * Clear Halloween data for specific user
 */
export const clearHalloweenDataForUser = (userId: string): void => {
  try {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX.VISITED_SPOOKY}_${userId}`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX.HALLOWEEN_BADGES}_${userId}`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX.HALLOWEEN_PROGRESS}_${userId}`);
  } catch (error) {
    console.error('Error clearing Halloween data for user:', error);
  }
};
