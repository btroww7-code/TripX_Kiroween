/**
 * Halloween Quest Service
 * 
 * Service for managing Halloween-themed quests with unified reward claiming.
 * Integrates with existing quest system and supports simultaneous TPX + NFT rewards.
 * 
 * Requirements: 16.2, 17.1
 */

import { HALLOWEEN_QUESTS, HalloweenQuestData } from '../data/halloweenQuests';
import { claimQuestRewardsUnified } from './questRewardService';
import { supabase } from '../lib/supabase';
import * as halloweenStorage from './halloweenStorageService';

/**
 * Get all Halloween quests
 */
export function getHalloweenQuests(): HalloweenQuestData[] {
  return HALLOWEEN_QUESTS;
}

/**
 * Get Halloween quest by ID
 */
export function getHalloweenQuestById(questId: string): HalloweenQuestData | undefined {
  return HALLOWEEN_QUESTS.find(quest => quest.id === questId);
}

/**
 * Check if a quest is a Halloween quest
 */
export function isHalloweenQuest(questId: string): boolean {
  return HALLOWEEN_QUESTS.some(quest => quest.id === questId);
}

/**
 * Get Halloween quests by difficulty
 */
export function getHalloweenQuestsByDifficulty(
  difficulty: 'easy' | 'medium' | 'hard' | 'legendary'
): HalloweenQuestData[] {
  return HALLOWEEN_QUESTS.filter(quest => quest.difficulty === difficulty);
}

/**
 * Get count of Halloween quests
 */
export function getHalloweenQuestCount(): number {
  return HALLOWEEN_QUESTS.length;
}

/**
 * Claim all rewards for a Halloween quest (TPX + NFT simultaneously)
 * Uses the unified reward service for consistent behavior with SpookyDestinations
 */
export async function claimHalloweenQuestRewards(
  userId: string,
  questId: string,
  walletAddress: string
): Promise<{
  success: boolean;
  rewards?: { xp: number; tpx: number; nft: boolean };
  tpxTxHash?: string;
  nftTokenId?: number;
  nftTxHash?: string;
  error?: string;
}> {
  console.log('[HalloweenQuestService] Claiming rewards for quest:', questId);

  try {
    // Use unified reward service
    const result = await claimQuestRewardsUnified(userId, questId, walletAddress);

    if (result.success) {
      // Update Halloween progress
      halloweenStorage.incrementQuestsCompleted();
      
      if (result.rewards?.tpx) {
        halloweenStorage.addTokensEarned(result.rewards.tpx);
      }

      return {
        success: true,
        rewards: result.rewards,
        tpxTxHash: result.tpxResult?.txHash,
        nftTokenId: result.nftResult?.tokenId,
        nftTxHash: result.nftResult?.txHash,
      };
    }

    return { success: false, error: result.error };
  } catch (error: any) {
    console.error('[HalloweenQuestService] Error claiming rewards:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get Halloween quest statistics for a user
 */
export async function getHalloweenQuestStats(userId: string): Promise<{
  total: number;
  completed: number;
  inProgress: number;
  totalXPEarned: number;
  totalTPXEarned: number;
  nftsMinted: number;
}> {
  try {
    // Get user's Halloween quests from database
    const { data: userQuests } = await supabase
      .from('user_quests')
      .select(`
        status,
        tokens_claimed,
        nft_minted,
        quests (
          id,
          reward_xp,
          reward_tokens,
          quest_type
        )
      `)
      .eq('user_id', userId);

    // Filter Halloween quests
    const halloweenUserQuests = (userQuests || []).filter((uq: any) => 
      uq.quests?.quest_type === 'halloween' || isHalloweenQuest(uq.quests?.id)
    );

    const completed = halloweenUserQuests.filter((uq: any) => 
      uq.status === 'completed' || uq.status === 'verified'
    );

    const totalXPEarned = completed.reduce((sum: number, uq: any) => 
      sum + (uq.quests?.reward_xp || 0), 0
    );

    const totalTPXEarned = halloweenUserQuests
      .filter((uq: any) => uq.tokens_claimed)
      .reduce((sum: number, uq: any) => sum + (uq.quests?.reward_tokens || 0), 0);

    const nftsMinted = halloweenUserQuests.filter((uq: any) => uq.nft_minted).length;

    return {
      total: HALLOWEEN_QUESTS.length,
      completed: completed.length,
      inProgress: halloweenUserQuests.filter((uq: any) => uq.status === 'in_progress').length,
      totalXPEarned,
      totalTPXEarned,
      nftsMinted,
    };
  } catch (error) {
    console.error('[HalloweenQuestService] Error getting stats:', error);
    return {
      total: HALLOWEEN_QUESTS.length,
      completed: 0,
      inProgress: 0,
      totalXPEarned: 0,
      totalTPXEarned: 0,
      nftsMinted: 0,
    };
  }
}
