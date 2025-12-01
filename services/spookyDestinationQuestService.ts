/**
 * Spooky Destination Quest Service
 * 
 * Manages quests for spooky destinations with NFT rewards, XP, and TPX tokens.
 * Requirements: 16.1, 16.2, 16.3, 17.1
 */

import { SpookyDestination, SpookyDestinationQuest } from '../types/halloween';
import { SPOOKY_DESTINATIONS } from '../data/spookyDestinations';
import * as halloweenStorage from './halloweenStorageService';
import { supabase } from '../lib/supabase';
import { updateLeaderboard } from './leaderboardService';

const QUEST_STORAGE_KEY_PREFIX = 'tripx_spooky_destination_quests';

// Current user ID for per-user storage
let currentUserId: string | null = null;

/**
 * Set current user ID for per-user quest storage
 * Also clears cache and syncs with Supabase
 */
export const setCurrentUser = (userId: string | null): void => {
  const previousUserId = currentUserId;
  currentUserId = userId;
  
  // Clear cache when user changes
  if (previousUserId !== userId) {
    clearSupabaseCache();
  }
  
  console.log('[SpookyQuestService] Current user set to:', userId);
};

/**
 * Get current user ID
 */
export const getCurrentUser = (): string | null => currentUserId;

/**
 * Get storage key for current user
 */
const getStorageKey = (): string => {
  if (currentUserId) {
    return `${QUEST_STORAGE_KEY_PREFIX}_${currentUserId}`;
  }
  // Fallback for anonymous users (quests won't persist across sessions)
  return `${QUEST_STORAGE_KEY_PREFIX}_anonymous`;
};

/**
 * Generate quest for a spooky destination
 */
export const generateQuestForDestination = (destination: SpookyDestination): SpookyDestinationQuest => {
  const difficulty = getDifficultyFromSpookiness(destination.spookinessRating);
  
  return {
    id: `spooky-quest-${destination.id}`,
    destinationId: destination.id,
    title: `Explore ${destination.name}`,
    description: `Visit ${destination.name} in ${destination.country} and document your paranormal experience. Complete activities and earn exclusive Halloween rewards!`,
    requirements: [
      `Visit ${destination.name}`,
      'Take a photo at the location',
      'Complete at least one activity',
      'Share your experience',
    ],
    xpReward: destination.xpReward || getDefaultXPReward(difficulty),
    tpxReward: destination.tpxReward || getDefaultTPXReward(difficulty),
    nftReward: true,
    nftImageUrl: destination.nftImageUrl,
    difficulty,
    status: 'available',
  };
};

/**
 * Get all spooky destination quests (sync version - uses localStorage)
 */
export const getAllSpookyQuests = (): SpookyDestinationQuest[] => {
  const savedQuests = getSavedQuests();
  
  return SPOOKY_DESTINATIONS.map(destination => {
    const savedQuest = savedQuests.find(q => q.destinationId === destination.id);
    if (savedQuest) {
      return savedQuest;
    }
    return generateQuestForDestination(destination);
  });
};

/**
 * Sync quests from Supabase to localStorage
 * Call this when user logs in to restore their quest progress
 */
export const syncQuestsFromSupabase = async (): Promise<void> => {
  if (!currentUserId) {
    console.log('[SpookyQuestService] No user ID, skipping sync');
    return;
  }

  try {
    const supabaseQuests = await loadQuestsFromSupabase();
    
    if (supabaseQuests.length === 0) {
      console.log('[SpookyQuestService] No quests in Supabase to sync');
      return;
    }

    // Merge Supabase quests into localStorage
    const storageKey = getStorageKey();
    const localQuests = getSavedQuests();
    
    // Create a map of local quests for quick lookup
    const localQuestsMap = new Map(localQuests.map(q => [q.id, q]));
    
    // Merge: Supabase takes priority (it's the source of truth)
    for (const supabaseQuest of supabaseQuests) {
      localQuestsMap.set(supabaseQuest.id, supabaseQuest);
    }
    
    // Save merged quests to localStorage
    const mergedQuests = Array.from(localQuestsMap.values());
    localStorage.setItem(storageKey, JSON.stringify(mergedQuests));
    
    console.log('[SpookyQuestService] Synced', supabaseQuests.length, 'quests from Supabase to localStorage');
  } catch (error) {
    console.error('[SpookyQuestService] Error syncing from Supabase:', error);
  }
};

/**
 * Get quest by destination ID
 */
export const getQuestByDestinationId = (destinationId: string): SpookyDestinationQuest | null => {
  const quests = getAllSpookyQuests();
  return quests.find(q => q.destinationId === destinationId) || null;
};

/**
 * Start a quest (mark as in progress)
 */
export const startQuest = (questId: string): SpookyDestinationQuest | null => {
  const quests = getAllSpookyQuests();
  const quest = quests.find(q => q.id === questId);
  
  if (!quest || quest.status !== 'available') {
    return null;
  }
  
  quest.status = 'in_progress';
  saveQuest(quest);
  
  return quest;
};

/**
 * Complete a quest (verify and mark as completed)
 */
export const completeQuest = (
  questId: string,
  verificationData: {
    photoUrl?: string;
    latitude?: number;
    longitude?: number;
  }
): { success: boolean; quest?: SpookyDestinationQuest; error?: string } => {
  const quests = getAllSpookyQuests();
  const quest = quests.find(q => q.id === questId);
  
  if (!quest) {
    return { success: false, error: 'Quest not found' };
  }
  
  if (quest.status === 'completed' || quest.status === 'claimed') {
    return { success: false, error: 'Quest already completed' };
  }
  
  // For demo/hackathon - auto-verify
  // In production, would verify GPS coordinates and photo
  
  quest.status = 'completed';
  quest.completedAt = new Date();
  saveQuest(quest);
  
  // Update Halloween progress
  halloweenStorage.incrementDestinationsVisited();
  halloweenStorage.incrementQuestsCompleted();
  
  return { success: true, quest };
};

/**
 * Claim rewards for a completed quest
 */
export const claimQuestRewards = async (
  questId: string,
  userId?: string
): Promise<{
  success: boolean;
  rewards?: {
    xp: number;
    tpx: number;
    nft: boolean;
    nftImageUrl?: string;
  };
  error?: string;
}> => {
  const quests = getAllSpookyQuests();
  const quest = quests.find(q => q.id === questId);
  
  if (!quest) {
    return { success: false, error: 'Quest not found' };
  }
  
  if (quest.status !== 'completed') {
    return { success: false, error: 'Quest must be completed first' };
  }
  
  quest.status = 'claimed';
  quest.claimedAt = new Date();
  saveQuest(quest);
  
  // Update tokens earned in localStorage
  halloweenStorage.addTokensEarned(quest.tpxReward);
  
  // Update Supabase user stats and leaderboard if userId provided
  if (userId) {
    try {
      // Get current user tokens
      const { data: currentUser } = await supabase
        .from('users')
        .select('total_tokens_earned, total_xp, quests_completed, level')
        .eq('id', userId)
        .single();

      if (currentUser) {
        const currentTokens = parseFloat(currentUser.total_tokens_earned?.toString() || '0');
        const currentXp = currentUser.total_xp || 0;
        const currentQuests = currentUser.quests_completed || 0;
        
        // Calculate new XP and level
        const newXP = currentXp + quest.xpReward;
        const newLevel = Math.floor(Math.sqrt(newXP / 100)) + 1;
        
        // Calculate passport tier based on level
        let passportTier = 'bronze';
        if (newLevel >= 15) passportTier = 'platinum';
        else if (newLevel >= 10) passportTier = 'gold';
        else if (newLevel >= 5) passportTier = 'silver';

        // Update user stats in Supabase (including level and tier)
        await supabase
          .from('users')
          .update({
            total_tokens_earned: (currentTokens + quest.tpxReward).toString(),
            total_xp: newXP,
            level: newLevel,
            passport_tier: passportTier,
            quests_completed: currentQuests + 1,
          })
          .eq('id', userId);

        // Update leaderboard
        await updateLeaderboard(userId);
        
        // Dispatch event for UI refresh
        window.dispatchEvent(new CustomEvent('userDataUpdated'));
        
        console.log(`[claimQuestRewards] Updated Supabase for user ${userId}: +${quest.tpxReward} TPX, +${quest.xpReward} XP, Level ${newLevel}, Tier ${passportTier}`);
      }
    } catch (error) {
      console.error('[claimQuestRewards] Error updating Supabase:', error);
      // Continue - localStorage was already updated
    }
  }
  
  return {
    success: true,
    rewards: {
      xp: quest.xpReward,
      tpx: quest.tpxReward,
      nft: quest.nftReward,
      nftImageUrl: quest.nftImageUrl,
    },
  };
};

/**
 * Get quest statistics
 */
export const getQuestStats = () => {
  const quests = getAllSpookyQuests();
  
  return {
    total: quests.length,
    available: quests.filter(q => q.status === 'available').length,
    inProgress: quests.filter(q => q.status === 'in_progress').length,
    completed: quests.filter(q => q.status === 'completed').length,
    claimed: quests.filter(q => q.status === 'claimed').length,
    totalXPAvailable: quests.reduce((sum, q) => sum + q.xpReward, 0),
    totalTPXAvailable: quests.reduce((sum, q) => sum + q.tpxReward, 0),
    earnedXP: quests.filter(q => q.status === 'claimed').reduce((sum, q) => sum + q.xpReward, 0),
    earnedTPX: quests.filter(q => q.status === 'claimed').reduce((sum, q) => sum + q.tpxReward, 0),
  };
};

/**
 * Get quests by difficulty
 */
export const getQuestsByDifficulty = (difficulty: SpookyDestinationQuest['difficulty']): SpookyDestinationQuest[] => {
  return getAllSpookyQuests().filter(q => q.difficulty === difficulty);
};

/**
 * Get available quests (not started or completed)
 */
export const getAvailableQuests = (): SpookyDestinationQuest[] => {
  return getAllSpookyQuests().filter(q => q.status === 'available');
};

/**
 * Get completed quests awaiting claim
 */
export const getCompletedQuests = (): SpookyDestinationQuest[] => {
  return getAllSpookyQuests().filter(q => q.status === 'completed');
};

// Helper functions

function getDifficultyFromSpookiness(rating: number): SpookyDestinationQuest['difficulty'] {
  if (rating >= 5) return 'legendary';
  if (rating >= 4) return 'hard';
  if (rating >= 3) return 'medium';
  return 'easy';
}

function getDefaultXPReward(difficulty: SpookyDestinationQuest['difficulty']): number {
  switch (difficulty) {
    case 'legendary': return 600;
    case 'hard': return 400;
    case 'medium': return 250;
    case 'easy': return 100;
  }
}

function getDefaultTPXReward(difficulty: SpookyDestinationQuest['difficulty']): number {
  switch (difficulty) {
    case 'legendary': return 150;
    case 'hard': return 100;
    case 'medium': return 50;
    case 'easy': return 25;
  }
}

// Cache for Supabase quests (loaded once per user)
let supabaseQuestsCache: SpookyDestinationQuest[] | null = null;
let supabaseCacheUserId: string | null = null;

/**
 * Load spooky quests from Supabase for current user
 */
export const loadQuestsFromSupabase = async (): Promise<SpookyDestinationQuest[]> => {
  if (!currentUserId) {
    console.log('[SpookyQuestService] No user ID, skipping Supabase load');
    return [];
  }

  // Return cache if valid
  if (supabaseQuestsCache && supabaseCacheUserId === currentUserId) {
    return supabaseQuestsCache;
  }

  try {
    console.log('[SpookyQuestService] Loading quests from Supabase for user:', currentUserId);
    
    const { data, error } = await supabase
      .from('user_spooky_quests')
      .select('*')
      .eq('user_id', currentUserId);

    if (error) {
      // Table might not exist yet - that's OK, we'll create records as needed
      console.warn('[SpookyQuestService] Error loading from Supabase (table may not exist):', error.message);
      return [];
    }

    const quests: SpookyDestinationQuest[] = (data || []).map((row: any) => ({
      id: row.quest_id,
      destinationId: row.destination_id,
      title: row.title,
      description: row.description || '',
      requirements: row.requirements || [],
      xpReward: row.xp_reward || 0,
      tpxReward: row.tpx_reward || 0,
      nftReward: row.nft_reward || false,
      nftImageUrl: row.nft_image_url,
      difficulty: row.difficulty || 'medium',
      status: row.status || 'available',
      completedAt: row.completed_at ? new Date(row.completed_at) : undefined,
      claimedAt: row.claimed_at ? new Date(row.claimed_at) : undefined,
    }));

    // Update cache
    supabaseQuestsCache = quests;
    supabaseCacheUserId = currentUserId;

    console.log('[SpookyQuestService] Loaded', quests.length, 'quests from Supabase');
    return quests;
  } catch (error) {
    console.error('[SpookyQuestService] Error loading quests from Supabase:', error);
    return [];
  }
};

/**
 * Save spooky quest to Supabase
 */
const saveQuestToSupabase = async (quest: SpookyDestinationQuest): Promise<void> => {
  if (!currentUserId) {
    console.log('[SpookyQuestService] No user ID, skipping Supabase save');
    return;
  }

  try {
    const record = {
      user_id: currentUserId,
      quest_id: quest.id,
      destination_id: quest.destinationId,
      title: quest.title,
      description: quest.description,
      requirements: quest.requirements,
      xp_reward: quest.xpReward,
      tpx_reward: quest.tpxReward,
      nft_reward: quest.nftReward,
      nft_image_url: quest.nftImageUrl,
      difficulty: quest.difficulty,
      status: quest.status,
      completed_at: quest.completedAt?.toISOString() || null,
      claimed_at: quest.claimedAt?.toISOString() || null,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('user_spooky_quests')
      .upsert(record, { 
        onConflict: 'user_id,quest_id',
      });

    if (error) {
      console.warn('[SpookyQuestService] Error saving to Supabase:', error.message);
      // Continue - localStorage is still updated
    } else {
      console.log('[SpookyQuestService] Quest saved to Supabase:', quest.id, 'status:', quest.status);
      
      // Invalidate cache
      if (supabaseCacheUserId === currentUserId) {
        supabaseQuestsCache = null;
      }
    }
  } catch (error) {
    console.error('[SpookyQuestService] Error saving quest to Supabase:', error);
  }
};

/**
 * Clear Supabase cache (call when user changes)
 */
export const clearSupabaseCache = (): void => {
  supabaseQuestsCache = null;
  supabaseCacheUserId = null;
};

function getSavedQuests(): SpookyDestinationQuest[] {
  // First try localStorage (fast, synchronous)
  try {
    const storageKey = getStorageKey();
    const raw = localStorage.getItem(storageKey);
    if (!raw) return [];
    
    const quests = JSON.parse(raw);
    return quests.map((q: any) => ({
      ...q,
      completedAt: q.completedAt ? new Date(q.completedAt) : undefined,
      claimedAt: q.claimedAt ? new Date(q.claimedAt) : undefined,
    }));
  } catch (error) {
    console.error('Error reading saved quests:', error);
    return [];
  }
}

function saveQuest(quest: SpookyDestinationQuest): void {
  // Save to localStorage (synchronous, fast)
  try {
    const storageKey = getStorageKey();
    const quests = getSavedQuests();
    const existingIndex = quests.findIndex(q => q.id === quest.id);
    
    if (existingIndex >= 0) {
      quests[existingIndex] = quest;
    } else {
      quests.push(quest);
    }
    
    localStorage.setItem(storageKey, JSON.stringify(quests));
  } catch (error) {
    console.error('Error saving quest to localStorage:', error);
  }

  // Also save to Supabase (async, for persistence across devices/sessions)
  saveQuestToSupabase(quest);
}

/**
 * Reset all quest progress for current user
 */
export const resetAllQuests = (): void => {
  const storageKey = getStorageKey();
  localStorage.removeItem(storageKey);
};

/**
 * Reset quest progress for specific user
 */
export const resetQuestsForUser = (userId: string): void => {
  localStorage.removeItem(`${QUEST_STORAGE_KEY_PREFIX}_${userId}`);
};
