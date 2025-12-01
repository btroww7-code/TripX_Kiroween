/**
 * Halloween-specific type definitions
 * 
 * Requirements: 16.1, 16.3, 16.4, 17.1
 */

export interface SpookyActivity {
  name: string;
  description: string;
  duration: string;
  spookinessLevel: number; // 1-5
}

export interface SpookyDestination {
  id: string;
  name: string;
  location: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  description: string;
  spookinessRating: number; // 1-5
  activities: SpookyActivity[];
  imageUrl: string;
  tags: string[];
  bestTimeToVisit: string;
  historicalBackground: string;
  // NFT & Rewards
  nftImageUrl?: string;
  xpReward?: number;
  tpxReward?: number;
}

export interface SpookyDestinationQuest {
  id: string;
  destinationId: string;
  title: string;
  description: string;
  requirements: string[];
  xpReward: number;
  tpxReward: number;
  nftReward: boolean;
  nftImageUrl?: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'legendary';
  status: 'available' | 'in_progress' | 'completed' | 'claimed';
  completedAt?: Date;
  claimedAt?: Date;
}

export interface BadgeRequirement {
  type: 'spooky_destinations' | 'halloween_quests' | 'tokens_earned';
  count: number;
  description: string;
}

export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface HalloweenBadge {
  id: string;
  name: string;
  description: string;
  icon: string; // HalloweenIcon name
  rarity: BadgeRarity;
  imageUrl?: string; // NFT image URL for minting
  requirement: BadgeRequirement;
  unlockedAt?: Date;
}

export interface HalloweenProgress {
  spookyDestinationsVisited: number;
  halloweenQuestsCompleted: number;
  tokensEarnedInSeason: number;
  unlockedBadges: string[]; // Badge IDs
}
