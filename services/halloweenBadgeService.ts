/**
 * Halloween Badge Service
 * 
 * Business logic for badge eligibility, unlocking, and progress tracking.
 * Requirements: 17.1, 17.2, 17.3, 17.5
 */

import { HalloweenBadge, HalloweenProgress } from '../types/halloween';
import { HALLOWEEN_BADGES } from '../data/halloweenBadges';
import * as halloweenStorage from './halloweenStorageService';

/**
 * Check which badges the user is eligible for based on their progress
 */
export const checkBadgeEligibility = (progress: HalloweenProgress): { badges: string[] } => {
  const eligibleBadges: string[] = [];

  for (const badge of HALLOWEEN_BADGES) {
    // Skip if already unlocked
    if (halloweenStorage.isBadgeUnlocked(badge.id)) {
      continue;
    }

    // Check requirement
    let isEligible = false;
    switch (badge.requirement.type) {
      case 'spooky_destinations':
        isEligible = progress.spookyDestinationsVisited >= badge.requirement.count;
        break;
      case 'halloween_quests':
        isEligible = progress.halloweenQuestsCompleted >= badge.requirement.count;
        break;
      case 'tokens_earned':
        isEligible = progress.tokensEarnedInSeason >= badge.requirement.count;
        break;
    }

    if (isEligible) {
      eligibleBadges.push(badge.id);
    }
  }

  return { badges: eligibleBadges };
};

/**
 * Unlock a badge by ID
 */
export const unlockBadge = (badgeId: string): HalloweenBadge | null => {
  const badge = HALLOWEEN_BADGES.find(b => b.id === badgeId);
  if (!badge) {
    console.error(`Badge not found: ${badgeId}`);
    return null;
  }

  halloweenStorage.unlockBadge(badge);
  
  // Update progress to track unlocked badges
  const progress = halloweenStorage.getProgress();
  if (!progress.unlockedBadges.includes(badgeId)) {
    halloweenStorage.updateProgress({
      unlockedBadges: [...progress.unlockedBadges, badgeId],
    });
  }

  return badge;
};

/**
 * Get progress towards a specific badge
 */
export const getBadgeProgress = (
  badgeId: string,
  currentProgress: HalloweenProgress
): {
  current: number;
  required: number;
  percentage: number;
  isUnlocked: boolean;
} => {
  const badge = HALLOWEEN_BADGES.find(b => b.id === badgeId);
  if (!badge) {
    return { current: 0, required: 0, percentage: 0, isUnlocked: false };
  }

  let current = 0;
  switch (badge.requirement.type) {
    case 'spooky_destinations':
      current = currentProgress.spookyDestinationsVisited;
      break;
    case 'halloween_quests':
      current = currentProgress.halloweenQuestsCompleted;
      break;
    case 'tokens_earned':
      current = currentProgress.tokensEarnedInSeason;
      break;
  }

  const required = badge.requirement.count;
  const percentage = Math.min((current / required) * 100, 100);
  const isUnlocked = halloweenStorage.isBadgeUnlocked(badgeId);

  return {
    current,
    required,
    percentage,
    isUnlocked,
  };
};

/**
 * Get all badges with their unlock status
 */
export const getAllBadgesWithStatus = (): Array<HalloweenBadge & { isUnlocked: boolean }> => {
  return HALLOWEEN_BADGES.map(badge => ({
    ...badge,
    isUnlocked: halloweenStorage.isBadgeUnlocked(badge.id),
  }));
};

/**
 * Get unlocked badges
 */
export const getUnlockedBadges = (): HalloweenBadge[] => {
  return halloweenStorage.getBadges();
};

/**
 * Get locked badges
 */
export const getLockedBadges = (): HalloweenBadge[] => {
  const unlockedIds = halloweenStorage.getBadges().map(b => b.id);
  return HALLOWEEN_BADGES.filter(badge => !unlockedIds.includes(badge.id));
};

/**
 * Check and auto-unlock eligible badges
 * Returns array of newly unlocked badge IDs
 */
export const checkAndUnlockEligibleBadges = (): string[] => {
  const progress = halloweenStorage.getProgress();
  const { badges: eligibleBadgeIds } = checkBadgeEligibility(progress);
  
  const newlyUnlocked: string[] = [];
  for (const badgeId of eligibleBadgeIds) {
    const badge = unlockBadge(badgeId);
    if (badge) {
      newlyUnlocked.push(badgeId);
    }
  }

  return newlyUnlocked;
};

/**
 * Get badge statistics
 */
export const getBadgeStats = () => {
  const unlocked = getUnlockedBadges();
  const total = HALLOWEEN_BADGES.length;
  
  return {
    total,
    unlocked: unlocked.length,
    locked: total - unlocked.length,
    unlockedPercentage: (unlocked.length / total) * 100,
  };
};

/**
 * Optional: Save badge to Supabase achievements table
 * This integrates with existing achievement system
 */
export const saveToSupabase = async (userId: string, badgeId: string): Promise<void> => {
  // This would integrate with existing achievementService
  // For now, just a placeholder
  console.log(`TODO: Save badge ${badgeId} for user ${userId} to Supabase`);
};


/**
 * Get all available Halloween badges
 */
export const getAllBadges = (): HalloweenBadge[] => {
  return HALLOWEEN_BADGES;
};

/**
 * Get badge by ID
 */
export const getBadgeById = (badgeId: string): HalloweenBadge | undefined => {
  return HALLOWEEN_BADGES.find(b => b.id === badgeId);
};
