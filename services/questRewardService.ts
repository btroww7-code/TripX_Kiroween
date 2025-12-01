/**
 * Quest Reward Service
 * 
 * Unified service for claiming quest rewards (TPX + NFT) simultaneously.
 * Mirrors the flow from SpookyDestinations for consistency.
 * Requirements: 16.2, 17.1
 */

import { supabase } from '../lib/supabase';
import * as web3Service from './web3Service';
import { getQuestImageUrl } from './questImageService';
import { updateLeaderboard } from './leaderboardService';

export interface QuestRewardResult {
  success: boolean;
  rewards?: {
    xp: number;
    tpx: number;
    nft: boolean;
    nftImageUrl?: string;
  };
  tpxResult?: {
    success: boolean;
    txHash?: string;
    error?: string;
  };
  nftResult?: {
    success: boolean;
    tokenId?: number;
    txHash?: string;
    error?: string;
  };
  error?: string;
}

/**
 * Claim all rewards for a completed quest simultaneously (TPX + NFT)
 * This is the unified flow matching SpookyDestinations behavior
 */
export async function claimQuestRewardsUnified(
  userId: string,
  questId: string,
  walletAddress: string
): Promise<QuestRewardResult> {
  console.log('[QuestRewardService] Claiming rewards for quest:', questId);

  try {
    // 1. Get quest and user_quest data
    const { data: userQuest, error: questError } = await supabase
      .from('user_quests')
      .select(`
        *,
        quests (
          id, title, description, location, 
          reward_tokens, reward_xp, nft_reward, image_url
        )
      `)
      .eq('user_id', userId)
      .eq('quest_id', questId)
      .in('status', ['completed', 'verified'])
      .maybeSingle();

    if (questError || !userQuest) {
      console.error('[QuestRewardService] Quest not found or not completed:', questError);
      return { success: false, error: 'Quest not found or not completed' };
    }

    const quest = userQuest.quests;
    if (!quest) {
      return { success: false, error: 'Quest data not found' };
    }

    const rewards = {
      xp: quest.reward_xp || 0,
      tpx: quest.reward_tokens || 0,
      nft: quest.nft_reward || false,
      nftImageUrl: quest.image_url || getQuestImageUrl(quest.title, quest.location || ''),
    };

    console.log('[QuestRewardService] Rewards to claim:', rewards);

    let tpxResult: QuestRewardResult['tpxResult'] = { success: true };
    let nftResult: QuestRewardResult['nftResult'] = { success: true };

    // 2. Send TPX tokens (if any)
    if (rewards.tpx > 0 && !userQuest.tokens_claimed) {
      console.log('[QuestRewardService] Sending', rewards.tpx, 'TPX to', walletAddress);
      
      try {
        const result = await web3Service.claimTokens(walletAddress, rewards.tpx);
        
        if (result.success) {
          tpxResult = { success: true, txHash: result.txHash };
          
          // Log transaction
          await supabase.from('token_transactions').insert({
            user_id: userId,
            quest_id: questId,
            transaction_type: 'claim',
            amount: rewards.tpx,
            tx_hash: result.txHash,
            contract_address: import.meta.env.VITE_TPX_CONTRACT_ADDRESS,
            from_address: '0x0000000000000000000000000000000000000000',
            to_address: walletAddress,
            status: 'pending',
          });

          // Mark tokens as claimed
          await supabase
            .from('user_quests')
            .update({ tokens_claimed: true, claimed_at: new Date().toISOString() })
            .eq('user_id', userId)
            .eq('quest_id', questId);

        } else {
          tpxResult = { success: false, error: result.error || 'TPX transfer failed' };
        }
      } catch (tpxError: any) {
        console.error('[QuestRewardService] TPX error:', tpxError);
        tpxResult = { success: false, error: tpxError.message };
      }
    }

    // 3. Mint NFT (if quest has NFT reward and not already minted)
    if (rewards.nft && !userQuest.nft_minted) {
      console.log('[QuestRewardService] Minting NFT for quest:', quest.title);
      
      try {
        // Build NFT metadata
        const nftMetadata = {
          name: `Quest Achievement: ${quest.title}`,
          description: quest.description || `Completed quest at ${quest.location}`,
          image: rewards.nftImageUrl,
          attributes: [
            { trait_type: 'Quest', value: quest.title },
            { trait_type: 'Location', value: quest.location || 'Unknown' },
            { trait_type: 'XP Earned', value: rewards.xp.toString() },
            { trait_type: 'Season', value: 'Halloween 2025' },
          ],
        };

        const metadataJson = JSON.stringify(nftMetadata);
        const metadataBase64 = btoa(unescape(encodeURIComponent(metadataJson)));
        const metadataURI = `data:application/json;base64,${metadataBase64}`;

        const result = await web3Service.mintAchievementNFT(walletAddress, metadataURI, questId);

        if (result.success) {
          nftResult = { success: true, tokenId: result.tokenId, txHash: result.txHash };

          // Log NFT transaction
          await supabase.from('nft_transactions').insert({
            user_id: userId,
            quest_id: questId,
            nft_type: 'achievement',
            token_id: result.tokenId,
            tx_hash: result.txHash,
            contract_address: import.meta.env.VITE_ACHIEVEMENT_NFT_CONTRACT_ADDRESS,
            status: 'pending',
            metadata_uri: metadataURI,
          });

          // Mark NFT as minted
          await supabase
            .from('user_quests')
            .update({ 
              nft_minted: true, 
              nft_token_id: result.tokenId,
              nft_tx_hash: result.txHash,
              nft_minted_at: new Date().toISOString(),
            })
            .eq('user_id', userId)
            .eq('quest_id', questId);

        } else {
          nftResult = { success: false, error: result.error || 'NFT mint failed' };
        }
      } catch (nftError: any) {
        console.error('[QuestRewardService] NFT error:', nftError);
        nftResult = { success: false, error: nftError.message };
      }
    }

    // 4. Update user stats in Supabase (XP + TPX + level)
    try {
      const { data: currentUser } = await supabase
        .from('users')
        .select('total_tokens_earned, total_xp, quests_completed, total_tokens_claimed, level')
        .eq('id', userId)
        .single();

      if (currentUser) {
        const updates: any = {};
        
        // CRITICAL: Always update XP when rewards are claimed
        if (rewards.xp > 0) {
          const currentXP = currentUser.total_xp || 0;
          const newXP = currentXP + rewards.xp;
          updates.total_xp = newXP;
          
          // Calculate new level from XP: level = floor(sqrt(totalXP / 100)) + 1
          const newLevel = Math.floor(Math.sqrt(newXP / 100)) + 1;
          updates.level = newLevel;
          
          // Calculate passport tier based on level
          let passportTier = 'bronze';
          if (newLevel >= 15) passportTier = 'platinum';
          else if (newLevel >= 10) passportTier = 'gold';
          else if (newLevel >= 5) passportTier = 'silver';
          updates.passport_tier = passportTier;
          
          console.log('[QuestRewardService] XP update:', { currentXP, newXP, newLevel, passportTier });
        }
        
        if (tpxResult.success && rewards.tpx > 0) {
          const currentTokens = parseFloat(currentUser.total_tokens_earned?.toString() || '0');
          const currentClaimed = parseFloat(currentUser.total_tokens_claimed?.toString() || '0');
          updates.total_tokens_earned = (currentTokens + rewards.tpx).toString();
          updates.total_tokens_claimed = (currentClaimed + rewards.tpx).toString();
        }

        if (Object.keys(updates).length > 0) {
          await supabase.from('users').update(updates).eq('id', userId);
          console.log('[QuestRewardService] User stats updated:', updates);
        }

        // Update leaderboard
        await updateLeaderboard(userId);
      }
    } catch (statsError) {
      console.error('[QuestRewardService] Stats update error:', statsError);
    }

    // 5. Dispatch event for UI refresh
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('userDataUpdated', {
        detail: { userId, walletAddress },
      }));
    }

    const overallSuccess = tpxResult.success || nftResult.success;
    
    return {
      success: overallSuccess,
      rewards,
      tpxResult,
      nftResult,
      error: !overallSuccess ? 'Failed to claim rewards' : undefined,
    };

  } catch (error: any) {
    console.error('[QuestRewardService] Error:', error);
    return { success: false, error: error.message || 'Unknown error' };
  }
}


/**
 * Claim rewards for a quest directly (without database lookup)
 * Used for spooky destinations and other quests that don't use user_quests table
 */
export async function claimQuestRewardsDirect(
  userId: string,
  questId: string,
  walletAddress: string,
  rewards: {
    xp: number;
    tpx: number;
    nft: boolean;
    nftImageUrl?: string;
    questTitle?: string;
    questLocation?: string;
  }
): Promise<QuestRewardResult> {
  console.log('[QuestRewardService] Direct claim for quest:', questId, rewards);

  let tpxResult: QuestRewardResult['tpxResult'] = { success: true };
  let nftResult: QuestRewardResult['nftResult'] = { success: true };

  // 1. Send TPX tokens
  if (rewards.tpx > 0) {
    try {
      const result = await web3Service.claimTokens(walletAddress, rewards.tpx);
      
      if (result.success) {
        tpxResult = { success: true, txHash: result.txHash };
        
        // Log transaction (optional - don't fail if this errors)
        try {
          await supabase.from('token_transactions').insert({
            user_id: userId,
            quest_id: questId,
            transaction_type: 'claim',
            amount: rewards.tpx,
            tx_hash: result.txHash,
            contract_address: import.meta.env.VITE_TPX_CONTRACT_ADDRESS,
            from_address: '0x0000000000000000000000000000000000000000',
            to_address: walletAddress,
            status: 'pending',
          });
        } catch (logError) {
          console.warn('[QuestRewardService] Failed to log TPX tx:', logError);
        }
      } else {
        tpxResult = { success: false, error: result.error || 'TPX transfer failed' };
      }
    } catch (error: any) {
      console.error('[QuestRewardService] TPX error:', error);
      tpxResult = { success: false, error: error.message };
    }
  }

  // 2. Mint NFT
  if (rewards.nft) {
    try {
      const nftMetadata = {
        name: rewards.questTitle || `Quest Achievement: ${questId}`,
        description: `Completed quest at ${rewards.questLocation || 'Unknown Location'}`,
        image: rewards.nftImageUrl || 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/generic-halloween.png',
        attributes: [
          { trait_type: 'Quest', value: rewards.questTitle || questId },
          { trait_type: 'Location', value: rewards.questLocation || 'Unknown' },
          { trait_type: 'XP Earned', value: rewards.xp.toString() },
          { trait_type: 'Season', value: 'Halloween 2025' },
        ],
      };

      const metadataJson = JSON.stringify(nftMetadata);
      const metadataBase64 = btoa(unescape(encodeURIComponent(metadataJson)));
      const metadataURI = `data:application/json;base64,${metadataBase64}`;

      const result = await web3Service.mintAchievementNFT(walletAddress, metadataURI, questId);

      if (result.success) {
        nftResult = { success: true, tokenId: result.tokenId, txHash: result.txHash };

        // Log NFT transaction (optional - don't fail if this errors)
        try {
          await supabase.from('nft_transactions').insert({
            user_id: userId,
            quest_id: questId,
            nft_type: 'achievement',
            token_id: result.tokenId,
            tx_hash: result.txHash,
            contract_address: import.meta.env.VITE_ACHIEVEMENT_NFT_CONTRACT_ADDRESS,
            status: 'pending',
            metadata_uri: metadataURI,
          });
        } catch (logError) {
          console.warn('[QuestRewardService] Failed to log NFT tx:', logError);
        }
      } else {
        nftResult = { success: false, error: result.error || 'NFT mint failed' };
      }
    } catch (error: any) {
      console.error('[QuestRewardService] NFT error:', error);
      nftResult = { success: false, error: error.message };
    }
  }

  // 3. Update user stats (XP + TPX + level)
  try {
    const { data: currentUser } = await supabase
      .from('users')
      .select('total_tokens_earned, total_tokens_claimed, total_xp, level')
      .eq('id', userId)
      .single();

    if (currentUser) {
      const updates: any = {};
      
      // CRITICAL: Always update XP when rewards are claimed
      if (rewards.xp > 0) {
        const currentXP = currentUser.total_xp || 0;
        const newXP = currentXP + rewards.xp;
        updates.total_xp = newXP;
        
        // Calculate new level from XP: level = floor(sqrt(totalXP / 100)) + 1
        const newLevel = Math.floor(Math.sqrt(newXP / 100)) + 1;
        updates.level = newLevel;
        
        // Calculate passport tier based on level
        let passportTier = 'bronze';
        if (newLevel >= 15) passportTier = 'platinum';
        else if (newLevel >= 10) passportTier = 'gold';
        else if (newLevel >= 5) passportTier = 'silver';
        updates.passport_tier = passportTier;
        
        console.log('[QuestRewardService] Direct XP update:', { currentXP, newXP, newLevel, passportTier });
      }
      
      if (tpxResult.success && rewards.tpx > 0) {
        const currentTokens = parseFloat(currentUser.total_tokens_earned?.toString() || '0');
        const currentClaimed = parseFloat(currentUser.total_tokens_claimed?.toString() || '0');
        updates.total_tokens_earned = (currentTokens + rewards.tpx).toString();
        updates.total_tokens_claimed = (currentClaimed + rewards.tpx).toString();
      }

      if (Object.keys(updates).length > 0) {
        await supabase.from('users').update(updates).eq('id', userId);
        console.log('[QuestRewardService] Direct user stats updated:', updates);
      }

      await updateLeaderboard(userId);
    }
  } catch (error) {
    console.error('[QuestRewardService] Stats update error:', error);
  }

  // 4. Dispatch UI refresh event
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('userDataUpdated', {
      detail: { userId, walletAddress },
    }));
  }

  return {
    success: tpxResult.success || nftResult.success,
    rewards: {
      xp: rewards.xp,
      tpx: rewards.tpx,
      nft: rewards.nft,
      nftImageUrl: rewards.nftImageUrl,
    },
    tpxResult,
    nftResult,
  };
}
