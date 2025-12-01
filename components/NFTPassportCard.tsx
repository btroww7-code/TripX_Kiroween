import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Award,
  MapPin,
  Star,
  Loader2,
  CheckCircle,
  Sparkles,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { toast } from 'sonner';
import { mintPassportAPI } from '../services/web3ApiClient';
import { monitorNFTTransaction, getEtherscanNFTTxUrl } from '../services/etherscanMonitor';
import { useWalletAuth } from '../hooks/useWalletAuth';
import { useEmailAuth } from '../hooks/useEmailAuth';
import { supabase } from '../lib/supabase';
import { glassEffects } from '../styles/glassEffects';
import { AddNFTToWalletModal } from './AddNFTToWalletModal';
import { markNFTAsAdded } from './AddNFTToWallet';
import { TechAttribution } from './halloween/TechAttribution';
import { notifyNFTMinted } from '../services/notificationService';

interface NFTPassportCardProps {
  className?: string;
}

type PassportTier = 'bronze' | 'silver' | 'gold' | 'platinum';

interface TierData {
  tier: PassportTier;
  minted: boolean;
  tokenId?: number;
  txHash?: string;
  unlocked: boolean;
  requiredXP: number;
  requiredLevel: number;
}

interface UserStats {
  totalXP: number;
  level: number;
  questsCompleted: number;
  countriesVisited: string[];
}

const TIER_COLORS: Record<PassportTier, string> = {
  bronze: 'from-orange-700 to-orange-900',
  silver: 'from-gray-400 to-gray-600',
  gold: 'from-yellow-400 to-yellow-600',
  platinum: 'from-purple-400 to-purple-600',
};

const TIER_ICONS: Record<PassportTier, string> = {
  bronze: '🥉',
  silver: '🥈',
  gold: '🥇',
  platinum: '💎',
};

// IMPORTANT: These thresholds MUST match userService.ts getPassportTier()
// Level formula: level = floor(sqrt(totalXP / 100)) + 1
const TIER_REQUIREMENTS: Record<PassportTier, { level: number; xp: number }> = {
  bronze: { level: 1, xp: 0 },
  silver: { level: 5, xp: 1600 },
  gold: { level: 10, xp: 8100 },
  platinum: { level: 15, xp: 19600 },
};

const ALL_TIERS: PassportTier[] = ['bronze', 'silver', 'gold', 'platinum'];

export const NFTPassportCard: React.FC<NFTPassportCardProps> = ({ className = '' }) => {
  const { user: walletUser, address, isConnected: isWalletConnected } = useWalletAuth();
  const { user: emailUser } = useEmailAuth();
  const hookUser = walletUser || emailUser;
  const [localUser, setLocalUser] = useState(hookUser);
  const user = localUser || hookUser;

  useEffect(() => {
    if (hookUser) {
      setLocalUser(hookUser);
    }
  }, [hookUser]);

  const [userStats, setUserStats] = useState<UserStats>({
    totalXP: 0,
    level: 1,
    questsCompleted: 0,
    countriesVisited: [],
  });
  const [tierData, setTierData] = useState<TierData[]>([]);
  const [loading, setLoading] = useState(false);
  const [mintingTier, setMintingTier] = useState<PassportTier | null>(null);
  const [showAddToWalletModal, setShowAddToWalletModal] = useState(false);
  const [mintResult, setMintResult] = useState<{
    tokenId: number;
    txHash: string;
    contractAddress: string;
    imageUrl: string;
    tier: PassportTier;
  } | null>(null);

  const mintedInSession = useRef<Set<PassportTier>>(new Set());

  useEffect(() => {
    if (isWalletConnected && address && user?.id) {
      setLoading(true);
      fetchData();
    } else if (!user?.id && !isWalletConnected) {
      setUserStats({ totalXP: 0, level: 1, questsCompleted: 0, countriesVisited: [] });
      setTierData([]);
      setLoading(false);
    }
  }, [user?.id, address, isWalletConnected]);

  const fetchData = async () => {
    if (!user?.id) return;

    try {
      // Get user data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (userError || !userData) {
        console.error('[NFTPassportCard] Error fetching user:', userError);
        return;
      }

      const totalXP = userData.total_xp || 0;
      const level = Math.floor(Math.sqrt(totalXP / 100)) + 1;

      setUserStats({
        totalXP,
        level,
        questsCompleted: userData.quests_completed || 0,
        countriesVisited: userData.countries_visited || [],
      });

      // Get all minted passports for this user
      const { data: passports, error: passportError } = await supabase
        .from('nft_passports')
        .select('*')
        .eq('user_id', user.id);

      const mintedPassports = new Map<PassportTier, { tokenId: number; txHash?: string }>();
      if (!passportError && passports) {
        passports.forEach((p: any) => {
          if (p.tier && p.token_id) {
            mintedPassports.set(p.tier as PassportTier, {
              tokenId: p.token_id,
              txHash: p.tx_hash,
            });
          }
        });
      }

      // Build tier data
      const tiers: TierData[] = ALL_TIERS.map((tier) => {
        const req = TIER_REQUIREMENTS[tier];
        const minted = mintedPassports.has(tier);
        const mintInfo = mintedPassports.get(tier);

        return {
          tier,
          minted,
          tokenId: mintInfo?.tokenId,
          txHash: mintInfo?.txHash,
          unlocked: totalXP >= req.xp,
          requiredXP: req.xp,
          requiredLevel: req.level,
        };
      });

      setTierData(tiers);
    } catch (error) {
      console.error('[NFTPassportCard] Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMintTier = async (tier: PassportTier) => {
    if (mintedInSession.current.has(tier)) {
      toast.info(`${tier} passport already minted in this session`);
      return;
    }

    if (!address || !user?.id) {
      toast.error('Please connect your wallet');
      return;
    }

    const tierInfo = tierData.find((t) => t.tier === tier);
    if (!tierInfo?.unlocked) {
      toast.error(`You need ${TIER_REQUIREMENTS[tier].xp} XP to mint ${tier} passport`);
      return;
    }

    if (tierInfo.minted) {
      toast.info(`${tier} passport already minted!`);
      return;
    }

    setMintingTier(tier);
    const loadingToast = toast.loading(`Minting ${tier} NFT Passport...`);

    try {
      const result = await mintPassportAPI(user.id, address, tier);

      if (result.success && result.data) {
        mintedInSession.current.add(tier);

        const nftContractAddress =
          import.meta.env.VITE_NFT_PASSPORT_CONTRACT_ADDRESS ||
          '0xFc22556bb4ae5740610bE43457d46AdA5200b994';
        const txHash = result.data.txHash;

        toast.dismiss(loadingToast);
        const monitorToastId = toast.loading('🔍 Monitoring blockchain...', {
          duration: 120000,
        });

        monitorNFTTransaction(
          address,
          async (txResult) => {
            toast.dismiss(monitorToastId);

            const etherscanUrl = getEtherscanNFTTxUrl(txResult.transactionHash || txHash);
            toast.success(`🎉 ${tier} Passport minted!`, {
              description: (
                <a
                  href={etherscanUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  View on Etherscan →
                </a>
              ),
              duration: 10000,
            });

            const passportImageUrl = `https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/passport-${tier}.png`;
            setMintResult({
              tokenId: result.data.tokenId,
              txHash: txResult.transactionHash || txHash,
              contractAddress: nftContractAddress,
              imageUrl: passportImageUrl,
              tier,
            });

            // Save to nft_passports table
            await supabase.from('nft_passports').upsert(
              {
                user_id: user.id,
                token_id: result.data.tokenId,
                tier,
                tx_hash: txResult.transactionHash || txHash,
                total_xp: userStats.totalXP,
                quests_completed: userStats.questsCompleted,
                countries_visited: userStats.countriesVisited,
              },
              { onConflict: 'user_id,tier' }
            );

            notifyNFTMinted(
              user.id,
              'passport',
              result.data.tokenId,
              txResult.transactionHash || txHash
            ).catch(console.warn);

            setShowAddToWalletModal(true);
            setMintingTier(null);
            fetchData();
          },
          () => {},
          nftContractAddress,
          100,
          0
        ).then((monitorResult) => {
          if (!monitorResult.found) {
            toast.dismiss(monitorToastId);
            toast.warning('Transaction verification timeout');
            setMintingTier(null);
            fetchData();
          }
        });
      } else {
        toast.dismiss(loadingToast);
        toast.error(result.error || 'Mint failed');
        setMintingTier(null);
      }
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(error.message || 'Mint failed');
      setMintingTier(null);
    }
  };

  const handleAddToWallet = async () => {
    if (!mintResult || !window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC721',
          options: {
            address: mintResult.contractAddress,
            tokenId: mintResult.tokenId.toString(),
          },
        },
      });
      markNFTAsAdded(mintResult.tokenId, mintResult.contractAddress);
    } catch (error: any) {
      console.log('[NFTPassportCard] MetaMask error:', error.message);
      markNFTAsAdded(mintResult.tokenId, mintResult.contractAddress);
    }
    setShowAddToWalletModal(false);
  };

  if (!isWalletConnected || !address) {
    return null;
  }

  // Calculate current tier based on XP
  const currentTier: PassportTier =
    userStats.level >= 15
      ? 'platinum'
      : userStats.level >= 10
        ? 'gold'
        : userStats.level >= 5
          ? 'silver'
          : 'bronze';

  return (
    <div className={`relative ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-6 backdrop-blur-xl border border-white/10 relative overflow-hidden"
        style={glassEffects.inlineStyles.glassStrong}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${TIER_COLORS[currentTier]} opacity-10`} />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${TIER_COLORS[currentTier]} flex items-center justify-center`}
              >
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">NFT Passport Collection</h3>
                <p className="text-sm text-slate-400">
                  Current Tier: <span className="capitalize text-white">{currentTier}</span>{' '}
                  {TIER_ICONS[currentTier]}
                </p>
              </div>
            </div>
          </div>

          {/* User Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star className="w-4 h-4 text-teal-400" />
                <p className="text-2xl font-bold text-white">{userStats.totalXP.toLocaleString()}</p>
              </div>
              <p className="text-xs text-slate-400">Total XP</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <CheckCircle className="w-4 h-4 text-teal-400" />
                <p className="text-2xl font-bold text-white">{userStats.questsCompleted}</p>
              </div>
              <p className="text-xs text-slate-400">Quests</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <MapPin className="w-4 h-4 text-teal-400" />
                <p className="text-2xl font-bold text-white">{userStats.countriesVisited.length}</p>
              </div>
              <p className="text-xs text-slate-400">Countries</p>
            </div>
          </div>

          {/* Tier Cards */}
          <div className="space-y-3">
            <p className="text-sm text-slate-400 mb-2">Mint NFT for each tier you've unlocked:</p>
            {tierData.map((tier) => (
              <div
                key={tier.tier}
                className={`rounded-xl p-4 border ${
                  tier.unlocked
                    ? 'bg-white/5 border-white/20'
                    : 'bg-white/[0.02] border-white/5 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg bg-gradient-to-br ${TIER_COLORS[tier.tier]} flex items-center justify-center`}
                    >
                      <span className="text-xl">{TIER_ICONS[tier.tier]}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-white capitalize">{tier.tier} Passport</p>
                      <p className="text-xs text-slate-400">
                        {tier.unlocked
                          ? tier.minted
                            ? `Minted • Token #${tier.tokenId}`
                            : 'Ready to mint!'
                          : `Requires ${tier.requiredXP.toLocaleString()} XP (Level ${tier.requiredLevel})`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {tier.minted && tier.tokenId && (
                      <a
                        href={`https://sepolia.etherscan.io/token/${import.meta.env.VITE_NFT_PASSPORT_ADDRESS}?a=${tier.tokenId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                        title="View on Etherscan"
                      >
                        <ExternalLink className="w-4 h-4 text-cyan-400" />
                      </a>
                    )}

                    {tier.unlocked ? (
                      tier.minted ? (
                        <div className="px-3 py-1.5 rounded-lg bg-green-500/20 text-green-400 text-sm font-medium flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          Minted
                        </div>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleMintTier(tier.tier)}
                          disabled={mintingTier !== null}
                          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all bg-gradient-to-r ${TIER_COLORS[tier.tier]} text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
                        >
                          {mintingTier === tier.tier ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Minting...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4" />
                              Mint
                            </>
                          )}
                        </motion.button>
                      )
                    ) : (
                      <div className="px-3 py-1.5 rounded-lg bg-white/5 text-slate-500 text-sm font-medium flex items-center gap-1">
                        <Lock className="w-4 h-4" />
                        Locked
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Ethereum Attribution */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <TechAttribution technology="ethereum" variant="inline" />
          </div>
        </div>
      </motion.div>

      {/* Add to Wallet Modal */}
      {mintResult && (
        <AddNFTToWalletModal
          isOpen={showAddToWalletModal}
          onClose={() => setShowAddToWalletModal(false)}
          onAddToWallet={handleAddToWallet}
          nftType="passport"
          tokenId={mintResult.tokenId}
          contractAddress={mintResult.contractAddress}
          txHash={mintResult.txHash}
          imageUrl={mintResult.imageUrl}
          refreshOnClose={true}
        />
      )}
    </div>
  );
};
