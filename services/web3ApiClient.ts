/**
 * Web3 API Client - Frontend Only
 * Direct Supabase + Web3 integration (no backend required)
 */

import { supabase } from '../lib/supabase';
import * as web3Service from './web3Service';
import { getQuestImageUrl } from './questImageService';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ClaimRewardsResponse {
  amount: number;
  txHash: string;
  message: string;
}

export interface MintPassportResponse {
  tokenId: number;
  txHash: string;
  message: string;
}

export interface UpdatePassportResponse {
  txHash: string;
  message: string;
}

export interface MintAchievementResponse {
  tokenId: number;
  txHash: string;
  message: string;
}

export interface TransactionStatusResponse {
  status: 'pending' | 'confirmed' | 'failed';
  transaction?: any;
}

/**
 * Claim TPX rewards for a SINGLE completed quest
 * This is called immediately after quest verification
 */
export async function claimQuestRewardAPI(
  userId: string,
  questId: string,
  walletAddress: string,
  rewardAmount: number
): Promise<ApiResponse<ClaimRewardsResponse>> {
  try {
    console.log('[claimQuestRewardAPI] Claiming reward for quest:', questId, 'amount:', rewardAmount, 'TPX');

    if (rewardAmount <= 0) {
      return {
        success: false,
        error: 'No reward amount specified',
      };
    }

    // 1. Verify quest exists and is completed but not yet claimed
    const { data: userQuest, error: questError } = await supabase
      .from('user_quests')
      .select('*, quests(reward_tokens)')
      .eq('user_id', userId)
      .eq('quest_id', questId)
      .in('status', ['completed', 'verified'])
      .maybeSingle();

    if (questError || !userQuest) {
      console.error('[claimQuestRewardAPI] Quest not found or not completed:', questError);
      return {
        success: false,
        error: 'Quest not found or not completed',
      };
    }

    // Check if already claimed
    if (userQuest.tokens_claimed) {
      console.log('[claimQuestRewardAPI] Tokens already claimed for this quest');
      return {
        success: false,
        error: 'Tokens already claimed for this quest',
      };
    }

    // Use the actual reward from quest definition
    const actualReward = userQuest.quests?.reward_tokens || rewardAmount;
    console.log('[claimQuestRewardAPI] Actual reward from quest:', actualReward, 'TPX');

    // 2. Execute blockchain transfer for THIS quest only
    console.log('[claimQuestRewardAPI] Executing blockchain transfer:', actualReward, 'TPX to', walletAddress);
    const result = await web3Service.claimTokens(walletAddress, actualReward);

    if (!result.success) {
      console.error('[claimQuestRewardAPI] Blockchain transfer failed:', result.error);
      return {
        success: false,
        error: result.error || 'Failed to transfer tokens on blockchain',
      };
    }

    console.log('[claimQuestRewardAPI] ✅ Blockchain transfer successful:', result.txHash);

    // 3. Log transaction to database
    const TPX_CONTRACT_ADDRESS = import.meta.env.VITE_TPX_CONTRACT_ADDRESS;
    
    const { error: logError } = await supabase
      .from('token_transactions')
      .insert({
        user_id: userId,
        quest_id: questId,
        transaction_type: 'claim' as const,
        amount: actualReward,
        tx_hash: result.txHash,
        contract_address: TPX_CONTRACT_ADDRESS,
        from_address: '0x0000000000000000000000000000000000000000',
        to_address: walletAddress,
        status: 'confirmed' as const,
        blockchain_confirmed_at: new Date().toISOString(),
      });

    if (logError) {
      console.error('[claimQuestRewardAPI] Failed to log transaction:', logError);
    }

    // 4. Mark THIS quest as claimed
    const { error: updateError } = await supabase
      .from('user_quests')
      .update({ 
        tokens_claimed: true,
        claimed_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('quest_id', questId);

    if (updateError) {
      console.error('[claimQuestRewardAPI] Failed to mark quest as claimed:', updateError);
    }

    // 5. Update user's total_tokens_claimed
    const { data: userData } = await supabase
      .from('users')
      .select('total_tokens_claimed')
      .eq('id', userId)
      .single();

    const newTotal = (parseFloat(userData?.total_tokens_claimed?.toString() || '0') || 0) + actualReward;
    await supabase
      .from('users')
      .update({ total_tokens_claimed: newTotal })
      .eq('id', userId);

    return {
      success: true,
      data: {
        amount: actualReward,
        txHash: result.txHash,
        message: `Successfully claimed ${actualReward} TPX tokens for quest`,
      },
    };
  } catch (error: any) {
    console.error('[claimQuestRewardAPI] Error:', error);
    return {
      success: false,
      error: error.message || 'Failed to claim quest reward',
    };
  }
}

/**
 * Claim TPX rewards for ALL verified quests (batch claim)
 * Use this only for manual "Claim All" functionality
 * Uses direct Web3 calls + Supabase (no backend)
 */
export async function claimRewardsAPI(
  userId: string,
  walletAddress: string
): Promise<ApiResponse<ClaimRewardsResponse>> {
  try {
    console.log('[claimRewardsAPI] Starting claim for user:', userId, 'wallet:', walletAddress);

    // 1. Get user_quests with tokens_claimed = false (PRIMARY SOURCE OF TRUTH)
    const { data: unclaimedQuests, error: questsError } = await supabase
      .from('user_quests')
      .select(`
        quest_id,
        status,
        tokens_claimed,
        quests(reward_tokens)
      `)
      .eq('user_id', userId)
      .in('status', ['completed', 'verified'])
      .eq('tokens_claimed', false);

    if (questsError) {
      console.error('[claimRewardsAPI] Error fetching unclaimed quests:', questsError);
      return {
        success: false,
        error: 'Failed to fetch unclaimed quests',
      };
    }

    if (!unclaimedQuests || unclaimedQuests.length === 0) {
      console.log('[claimRewardsAPI] No unclaimed quests found');
      // Clean up any stale pending_claims
      await supabase.from('pending_claims').delete().eq('user_id', userId);
      return {
        success: false,
        error: 'No unclaimed rewards found. All quest rewards have already been claimed.',
      };
    }

    // Calculate claimable amount from user_quests (not pending_claims)
    const claimableAmount = unclaimedQuests.reduce((sum: number, uq: any) => {
      const tokens = uq.quests?.reward_tokens || 0;
      return sum + parseFloat(tokens.toString());
    }, 0);

    const questIds = unclaimedQuests.map((uq: any) => uq.quest_id);

    console.log('[claimRewardsAPI] Found', unclaimedQuests.length, 'unclaimed quests, total:', claimableAmount, 'TPX');

    if (claimableAmount <= 0) {
      return {
        success: false,
        error: 'No rewards to claim',
      };
    }

    // 2. Check for duplicate transaction (prevent double claiming within 2 minutes)
    const { data: recentTx } = await supabase
      .from('token_transactions')
      .select('tx_hash, created_at')
      .eq('user_id', userId)
      .eq('transaction_type', 'claim')
      .eq('status', 'confirmed')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (recentTx?.created_at) {
      const txAge = Date.now() - new Date(recentTx.created_at).getTime();
      if (txAge < 2 * 60 * 1000) { // 2 minutes
        return {
          success: false,
          error: 'Please wait a moment before claiming again.',
        };
      }
    }

    // 3. Execute blockchain transfer
    console.log('[claimRewardsAPI] Executing blockchain transfer:', claimableAmount, 'TPX to', walletAddress);
    const result = await web3Service.claimTokens(walletAddress, claimableAmount);

    if (!result.success) {
      console.error('[claimRewardsAPI] Blockchain transfer failed:', result.error);
      return {
        success: false,
        error: result.error || 'Failed to claim tokens on blockchain',
      };
    }

    console.log('[claimRewardsAPI] ✅ Blockchain transfer successful:', result.txHash);

    // 4. Log transaction to database FIRST (before marking as claimed)
    const TPX_CONTRACT_ADDRESS = import.meta.env.VITE_TPX_CONTRACT_ADDRESS;
    
    console.log('[claimRewardsAPI] Logging transaction to database...');
    const transactionInserts = unclaimedQuests.map((uq: any) => ({
      user_id: userId,
      quest_id: uq.quest_id,
      transaction_type: 'claim' as const,
      amount: parseFloat(uq.quests?.reward_tokens?.toString() || '0'),
      tx_hash: result.txHash,
      contract_address: TPX_CONTRACT_ADDRESS,
      from_address: '0x0000000000000000000000000000000000000000',
      to_address: walletAddress,
      status: 'confirmed' as const,
      blockchain_confirmed_at: new Date().toISOString(),
    }));

    console.log('[claimRewardsAPI] Inserting', transactionInserts.length, 'transaction records:', transactionInserts[0]);

    const { data: insertedTxs, error: logError } = await supabase
      .from('token_transactions')
      .insert(transactionInserts)
      .select();

    if (logError) {
      console.error('[claimRewardsAPI] ❌ Failed to log transactions:', logError);
      console.error('[claimRewardsAPI] Error details:', {
        code: logError.code,
        message: logError.message,
        details: logError.details,
        hint: logError.hint
      });
    } else {
      console.log('[claimRewardsAPI] ✅ Logged', insertedTxs?.length || 0, 'transactions to database');
    }

    // 5. CRITICAL: Mark quests as claimed AFTER logging transactions
    console.log('[claimRewardsAPI] Marking', questIds.length, 'quests as tokens_claimed...');
    
    const { error: updateQuestsError } = await supabase
      .from('user_quests')
      .update({ 
        tokens_claimed: true,
        claimed_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .in('quest_id', questIds);

    if (updateQuestsError) {
      console.error('[claimRewardsAPI] ❌ CRITICAL: Failed to mark quests as claimed:', updateQuestsError);
      console.error('[claimRewardsAPI] Update error details:', {
        code: updateQuestsError.code,
        message: updateQuestsError.message,
        details: updateQuestsError.details
      });
      // Continue anyway - blockchain tx succeeded, we'll log this
    } else {
      console.log('[claimRewardsAPI] ✅ All quests marked as tokens_claimed');
    }

    // 6. Update user's total_tokens_claimed
    const { data: userData } = await supabase
      .from('users')
      .select('total_tokens_claimed')
      .eq('id', userId)
      .single();

    const newTotalClaimed = (parseFloat(userData?.total_tokens_claimed?.toString() || '0') || 0) + claimableAmount;

    await supabase
      .from('users')
      .update({ total_tokens_claimed: newTotalClaimed })
      .eq('id', userId);

    // 7. Clean up pending_claims completely
    const { error: deleteError } = await supabase
      .from('pending_claims')
      .delete()
      .eq('user_id', userId);

    if (deleteError) {
      console.warn('[claimRewardsAPI] Failed to delete pending_claims:', deleteError);
      // Try update as fallback
      await supabase
        .from('pending_claims')
        .update({
          total_amount: 0,
          quest_rewards: [],
          last_updated: new Date().toISOString()
        })
        .eq('user_id', userId);
    } else {
      console.log('[claimRewardsAPI] ✅ pending_claims deleted');
    }

    return {
      success: true,
      data: {
        amount: claimableAmount,
        txHash: result.txHash,
        message: `Successfully claimed ${claimableAmount} TPX tokens`,
      },
    };
  } catch (error: any) {
    console.error('[claimRewardsAPI] Error:', error);
    return {
      success: false,
      error: error.message || 'Failed to claim rewards',
    };
  }
}

/**
 * Mint NFT Passport for a user
 * Uses direct Web3 calls + Supabase (no backend)
 */
export async function mintPassportAPI(
  userId: string,
  walletAddress: string,
  tier: string = 'bronze'
): Promise<ApiResponse<MintPassportResponse>> {
  try {
    console.log('[mintPassportAPI] Starting mint for user:', userId, 'wallet:', walletAddress, 'tier:', tier);

    // 1. Check if user already has passport of THIS TIER in database
    // Users can mint multiple passports (one per tier: bronze, silver, gold, platinum)
    const { data: existingPassport, error: checkError } = await supabase
      .from('nft_passports')
      .select('token_id, user_id, tier')
      .eq('user_id', userId)
      .eq('tier', tier)
      .maybeSingle();

    if (existingPassport && existingPassport.token_id) {
      console.log('[mintPassportAPI] User already has', tier, 'passport in DB:', existingPassport.token_id);
      return {
        success: false,
        error: `You already have a ${tier} NFT Passport`,
      };
    }

    // Note: We no longer block based on blockchain balance since users can have multiple tier passports

    // 3. Get user data for metadata
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError || !userData) {
      console.error('[mintPassportAPI] User not found:', userError);
      return {
        success: false,
        error: 'User not found',
      };
    }

    // 4. Build metadata URI
    const metadata = {
      name: `TripX Passport - ${userData.username || 'Explorer'}`,
      description: `Travel NFT Passport for ${walletAddress}`,
      image: `https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/passport-${tier}.png`,
      attributes: [
        { trait_type: 'Tier', value: tier },
        { trait_type: 'Level', value: userData.level || 1 },
        { trait_type: 'XP', value: userData.total_xp || 0 },
        { trait_type: 'Quests Completed', value: userData.quests_completed || 0 },
      ],
    };

    const metadataURI = `data:application/json;base64,${btoa(JSON.stringify(metadata))}`;

    // 5. Mint NFT on blockchain
    console.log('[mintPassportAPI] Calling web3Service.mintNFTPassport...');
    const result = await web3Service.mintNFTPassport(walletAddress, metadataURI, tier);
    console.log('[mintPassportAPI] web3Service.mintNFTPassport result:', result);

    if (!result.success) {
      console.error('[mintPassportAPI] Mint failed:', result.error);
      return {
        success: false,
        error: result.error || 'Failed to mint passport',
      };
    }

    console.log('[mintPassportAPI] Mint successful, tokenId:', result.tokenId, 'txHash:', result.txHash);

    // If tokenId is not available yet (transaction pending), try to fetch it
    let tokenId = result.tokenId;
    if (!tokenId && result.txHash) {
      console.log('[mintPassportAPI] Token ID not available yet, trying to fetch from blockchain...');
      try {
        // Wait a bit and try to get token ID
        await new Promise(resolve => setTimeout(resolve, 3000));
        const fetchedTokenId = await web3Service.getNFTPassportTokenId(walletAddress);
        if (fetchedTokenId && fetchedTokenId > 0) {
          tokenId = fetchedTokenId;
          console.log('[mintPassportAPI] Token ID fetched from blockchain:', tokenId);
        }
      } catch (fetchError) {
        console.warn('[mintPassportAPI] Could not fetch token ID yet:', fetchError);
        // Continue anyway - token ID can be fetched later
      }
    }

    // 6. Update user record in database - use existing columns only
    const { error: updateError } = await supabase
      .from('users')
      .update({
        nft_passport_token_id: result.tokenId,
        passport_token_id: result.tokenId,
        passport_tier: tier,
      })
      .eq('id', userId);

    if (updateError) {
      console.warn('[mintPassportAPI] Failed to update user record:', updateError);
    }

    // 7. Insert/update nft_passports table (CRITICAL - must be done after successful mint)
    // Each user can have multiple passports (one per tier), so we use composite key (user_id, tier)
    const { error: passportInsertError } = await supabase
      .from('nft_passports')
      .upsert({
        user_id: userId,
        token_id: tokenId || null, // Use fetched tokenId or null if not available yet
        tier: tier,
        tx_hash: result.txHash, // Store tx_hash in nft_passports for easy access
        metadata_uri: metadataURI,
        countries_visited: userData.countries_visited || [],
        quests_completed: userData.quests_completed || 0,
        total_xp: userData.total_xp || 0,
        minted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,tier'  // Composite key - one passport per tier per user
      });

    if (passportInsertError) {
      console.warn('[mintPassportAPI] Failed to insert nft_passports record:', passportInsertError);
    } else {
      console.log('[mintPassportAPI] ✅ nft_passports record created/updated');
    }

    // 8. Log NFT transaction
    const NFT_CONTRACT_ADDRESS = import.meta.env.VITE_NFT_PASSPORT_CONTRACT_ADDRESS;
    const { error: logError } = await supabase
      .from('nft_transactions')
      .insert({
        user_id: userId,
        nft_type: 'passport',
        token_id: tokenId || null, // Use fetched tokenId or null if not available yet
        tx_hash: result.txHash,
        contract_address: NFT_CONTRACT_ADDRESS,
        to_address: walletAddress,
        status: tokenId ? 'confirmed' : 'pending', // Set to pending if tokenId not available yet
        blockchain_confirmed_at: tokenId ? new Date().toISOString() : null,
      });

    if (logError) {
      console.warn('[mintPassportAPI] Failed to log NFT transaction:', logError);
    }

    // Create notification for NFT minted
    if (tokenId) {
      try {
        const { notifyNFTMinted } = await import('./notificationService');
        await notifyNFTMinted(userId, 'passport', tokenId, result.txHash);
      } catch (err) {
        console.error('Failed to create NFT minted notification:', err);
      }
    }

    return {
      success: true,
      data: {
        tokenId: tokenId || undefined, // Return tokenId if available, undefined otherwise
        txHash: result.txHash,
        message: tokenId
          ? `Successfully minted ${tier} passport NFT`
          : `NFT Passport mint transaction sent! Token ID will be available once confirmed.`,
      },
    };
  } catch (error: any) {
    console.error('[mintPassportAPI] Error:', error);
    return {
      success: false,
      error: error.message || 'Failed to mint passport',
    };
  }
}

/**
 * Update NFT Passport metadata
 * Uses direct Web3 calls + Supabase (no backend)
 */
export async function updatePassportAPI(
  userId: string,
  tier?: string
): Promise<ApiResponse<UpdatePassportResponse>> {
  try {
    console.log('[updatePassportAPI] Updating passport for user:', userId, 'tier:', tier);

    // 1. Get user data
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError || !userData) {
      console.error('[updatePassportAPI] User not found:', userError);
      return {
        success: false,
        error: 'User not found',
      };
    }

    if (!userData.nft_passport_token_id) {
      return {
        success: false,
        error: 'User does not have a passport',
      };
    }

    // 2. Build updated metadata
    const newTier = tier || userData.passport_tier || 'bronze';
    const metadata = {
      name: `TripX Passport - ${userData.username || 'Explorer'}`,
      description: `Travel NFT Passport for ${userData.wallet_address}`,
      image: `https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/passport-${newTier}.png`,
      attributes: [
        { trait_type: 'Tier', value: newTier },
        { trait_type: 'Level', value: userData.level || 1 },
        { trait_type: 'XP', value: userData.total_xp || 0 },
        { trait_type: 'Quests Completed', value: userData.quests_completed || 0 },
      ],
    };

    const metadataURI = `data:application/json;base64,${btoa(JSON.stringify(metadata))}`;

    // 3. Update NFT on blockchain
    const result = await web3Service.updateNFTPassport(
      userData.nft_passport_token_id,
      metadataURI,
      newTier
    );

    if (!result.success) {
      console.error('[updatePassportAPI] Update failed:', result.error);
      return {
        success: false,
        error: result.error || 'Failed to update passport',
      };
    }

    console.log('[updatePassportAPI] Update successful, txHash:', result.txHash);

    // 4. Update user record
    if (tier) {
      const { error: updateError } = await supabase
        .from('users')
        .update({ passport_tier: tier })
        .eq('id', userId);

      if (updateError) {
        console.warn('[updatePassportAPI] Failed to update user tier:', updateError);
      }
    }

    return {
      success: true,
      data: {
        txHash: result.txHash,
        message: 'Successfully updated passport',
      },
    };
  } catch (error: any) {
    console.error('[updatePassportAPI] Error:', error);
    return {
      success: false,
      error: error.message || 'Failed to update passport',
    };
  }
}

/**
 * Burn TPX tokens for secret quest unlock
 * Uses direct Web3 calls + Supabase (no backend)
 */
export async function burnTokensAPI(
  userId: string,
  amount: number,
  questId?: string
): Promise<ApiResponse<{ message: string }>> {
  try {
    console.log('[burnTokensAPI] Burning', amount, 'tokens for user:', userId, 'quest:', questId);

    // 1. Get user wallet address
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('wallet_address')
      .eq('id', userId)
      .single();

    if (userError || !userData || !userData.wallet_address) {
      return {
        success: false,
        error: 'User wallet not found',
      };
    }

    // 2. Burn tokens on blockchain
    const result = await web3Service.burnTokens(userData.wallet_address, amount);

    if (!result.success) {
      console.error('[burnTokensAPI] Burn failed:', result.error);
      return {
        success: false,
        error: result.error || 'Failed to burn tokens',
      };
    }

    console.log('[burnTokensAPI] Burn successful, txHash:', result.txHash);

    // 3. Log transaction
    const TPX_CONTRACT_ADDRESS = import.meta.env.VITE_TPX_CONTRACT_ADDRESS;
    const { error: logError } = await supabase
      .from('token_transactions')
      .insert({
        user_id: userId,
        transaction_type: 'burn',
        amount: amount,
        tx_hash: result.txHash,
        contract_address: TPX_CONTRACT_ADDRESS,
        from_address: userData.wallet_address,
        to_address: '0x0000000000000000000000000000000000000000',
        status: 'confirmed',
        blockchain_confirmed_at: new Date().toISOString(),
      });

    if (logError) {
      console.warn('[burnTokensAPI] Failed to log burn transaction:', logError);
    }

    return {
      success: true,
      data: {
        message: `Successfully burned ${amount} TPX tokens`,
      },
    };
  } catch (error: any) {
    console.error('[burnTokensAPI] Error:', error);
    return {
      success: false,
      error: error.message || 'Failed to burn tokens',
    };
  }
}

/**
 * Mint Achievement NFT for unlocked achievement badge
 * Uses direct Web3 calls + Supabase (no backend)
 * Supports both quest-based achievements and standalone achievements
 */
export async function mintAchievementAPI(
  userId: string,
  achievementId: string,
  walletAddress: string
): Promise<ApiResponse<MintAchievementResponse>> {
  try {
    console.log('[mintAchievementAPI] Minting achievement for user:', userId, 'achievement:', achievementId);

    // 1. Try to get achievement from achievements table first
    let achievementData: any = null;
    let isQuestBased = false;
    
    const { data: achievement, error: achievementError } = await supabase
      .from('achievements')
      .select('*')
      .eq('id', achievementId)
      .maybeSingle();

    if (achievement) {
      achievementData = achievement;
      console.log('[mintAchievementAPI] Found achievement:', achievement.name);
    } else {
      // Fallback: try quests table for quest-based achievements
      const { data: questData, error: questError } = await supabase
        .from('quests')
        .select('*')
        .eq('id', achievementId)
        .maybeSingle();

      if (questData) {
        achievementData = questData;
        isQuestBased = true;
        console.log('[mintAchievementAPI] Found quest:', questData.title);
      }
    }

    if (!achievementData) {
      console.error('[mintAchievementAPI] Achievement/Quest not found for ID:', achievementId);
      return {
        success: false,
        error: 'Achievement not found',
      };
    }

    // 2. Check if already minted in nft_transactions
    const { data: existingNFTTx } = await supabase
      .from('nft_transactions')
      .select('token_id, tx_hash')
      .eq('user_id', userId)
      .eq('quest_id', achievementId)
      .eq('nft_type', 'achievement')
      .maybeSingle();

    if (existingNFTTx && existingNFTTx.token_id) {
      console.log('[mintAchievementAPI] NFT already minted:', existingNFTTx.token_id);
      return {
        success: false,
        error: 'Achievement NFT already minted',
      };
    }

    // 3. For quest-based achievements, verify completion
    if (isQuestBased) {
      const { data: userQuest } = await supabase
        .from('user_quests')
        .select('*')
        .eq('user_id', userId)
        .eq('quest_id', achievementId)
        .in('status', ['completed', 'verified'])
        .maybeSingle();

      if (!userQuest) {
        return {
          success: false,
          error: 'Quest not completed',
        };
      }

      if (userQuest.nft_minted || userQuest.nft_token_id) {
        return {
          success: false,
          error: 'Achievement NFT already minted for this quest',
        };
      }
    } else {
      // For standalone achievements, check user_achievements
      const { data: userAchievement } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', userId)
        .eq('achievement_id', achievementId)
        .eq('unlocked', true)
        .maybeSingle();

      if (!userAchievement) {
        return {
          success: false,
          error: 'Achievement not unlocked',
        };
      }

      if (userAchievement.nft_minted || userAchievement.nft_token_id) {
        return {
          success: false,
          error: 'Achievement NFT already minted',
        };
      }
    }

    // 4. Build metadata
    const title = achievementData.name || achievementData.title || 'Achievement';
    const description = achievementData.description || `Achievement: ${title}`;
    const imageUrl = achievementData.image_url || achievementData.icon_url || 
      `https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/achievement-default.png`;
    
    const metadata = {
      name: `TripX Achievement - ${title}`,
      description: description,
      image: imageUrl,
      attributes: [
        { trait_type: 'Achievement', value: title },
        { trait_type: 'Type', value: isQuestBased ? 'Quest' : 'Badge' },
        { trait_type: 'Category', value: achievementData.category || 'General' },
      ],
    };

    const metadataURI = `data:application/json;base64,${btoa(JSON.stringify(metadata))}`;

    // 5. Mint NFT on blockchain
    const result = await web3Service.mintAchievementNFT(walletAddress, metadataURI, achievementId);

    if (!result.success) {
      console.error('[mintAchievementAPI] Mint failed:', result.error);
      return {
        success: false,
        error: result.error || 'Failed to mint achievement',
      };
    }

    console.log('[mintAchievementAPI] Mint successful, tokenId:', result.tokenId, 'txHash:', result.txHash);

    // 6. Update the appropriate table based on achievement type
    if (isQuestBased) {
      const { error: updateError } = await supabase
        .from('user_quests')
        .update({
          nft_minted: true,
          nft_token_id: result.tokenId,
          nft_tx_hash: result.txHash,
          nft_minted_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('quest_id', achievementId);

      if (updateError) {
        console.warn('[mintAchievementAPI] Failed to update user_quests:', updateError);
      }
    } else {
      // Update user_achievements table
      const { error: updateError } = await supabase
        .from('user_achievements')
        .update({
          nft_minted: true,
          nft_token_id: result.tokenId,
          nft_tx_hash: result.txHash,
        })
        .eq('user_id', userId)
        .eq('achievement_id', achievementId);

      if (updateError) {
        console.warn('[mintAchievementAPI] Failed to update user_achievements:', updateError);
      }
    }

    // 7. Log NFT transaction
    const ACHIEVEMENT_CONTRACT_ADDRESS = import.meta.env.VITE_ACHIEVEMENT_NFT_CONTRACT_ADDRESS;
    const { error: logError } = await supabase
      .from('nft_transactions')
      .insert({
        user_id: userId,
        quest_id: achievementId,
        nft_type: 'achievement',
        token_id: result.tokenId,
        tx_hash: result.txHash,
        contract_address: ACHIEVEMENT_CONTRACT_ADDRESS,
        to_address: walletAddress,
        status: 'confirmed',
        blockchain_confirmed_at: new Date().toISOString(),
      });

    if (logError) {
      console.warn('[mintAchievementAPI] Failed to log NFT transaction:', logError);
    }

    return {
      success: true,
      data: {
        tokenId: result.tokenId,
        txHash: result.txHash,
        message: `Successfully minted achievement NFT for ${questData.title}`,
      },
    };
  } catch (error: any) {
    console.error('[mintAchievementAPI] Error:', error);
    return {
      success: false,
      error: error.message || 'Failed to mint achievement',
    };
  }
}

/**
 * Get transaction status by hash
 * Checks Supabase database (no backend needed)
 */
export async function getTransactionStatusAPI(
  txHash: string
): Promise<ApiResponse<TransactionStatusResponse>> {
  try {
    console.log('[getTransactionStatusAPI] Checking status for tx:', txHash);

    // Check token transactions
    const { data: tokenTx, error: tokenError } = await supabase
      .from('token_transactions')
      .select('*')
      .eq('tx_hash', txHash)
      .maybeSingle();

    if (!tokenError && tokenTx) {
      return {
        success: true,
        data: {
          status: tokenTx.status as 'pending' | 'confirmed' | 'failed',
          transaction: tokenTx,
        },
      };
    }

    // Check NFT transactions
    const { data: nftTx, error: nftError } = await supabase
      .from('nft_transactions')
      .select('*')
      .eq('tx_hash', txHash)
      .maybeSingle();

    if (!nftError && nftTx) {
      return {
        success: true,
        data: {
          status: nftTx.status as 'pending' | 'confirmed' | 'failed',
          transaction: nftTx,
        },
      };
    }

    return {
      success: false,
      error: 'Transaction not found',
    };
  } catch (error: any) {
    console.error('[getTransactionStatusAPI] Error:', error);
    return {
      success: false,
      error: error.message || 'Failed to get transaction status',
    };
  }
}

/**
 * Helper function to handle API errors with user-friendly messages
 */
export function handleApiError(error: string | undefined): string {
  if (!error) return 'An unknown error occurred';

  // Map common errors to user-friendly messages
  const errorMessages: Record<string, string> = {
    'Network error': 'Unable to connect to server. Please check your internet connection.',
    'Failed to claim rewards': 'Unable to claim rewards at this time. Please try again later.',
    'Failed to mint passport': 'Unable to mint NFT Passport. Please try again later.',
    'Failed to update passport': 'Unable to update passport. Please try again later.',
    'Failed to burn tokens': 'Unable to burn tokens. Please try again later.',
    'User not found': 'User account not found. Please login again.',
    'User already has a passport': 'You already have an NFT Passport.',
    'No unclaimed rewards found': 'You have no rewards to claim at this time.',
    'TPX contract not deployed': 'Token contract is not available. Please contact support.',
    'Admin wallet not configured': 'System configuration error. Please contact support.',
  };

  return errorMessages[error] || error;
}

