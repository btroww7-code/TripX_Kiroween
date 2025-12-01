import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Wallet,
  Coins,
  Award,
  Sparkles,
  TrendingUp,
  Calendar,
  MapPin,
  Trophy,
  Zap,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { useWalletAuth } from '../../../hooks/useWalletAuth';
import { useEmailAuth } from '../../../hooks/useEmailAuth';
import { getUser } from '../../../services/userService';
// Balance is now loaded from useWalletAuth hook
import { TokenTransactionHistory } from '../../TokenTransactionHistory';
import { NFTTransactionHistory } from '../../NFTTransactionHistory';
import { AchievementHistory } from '../../AchievementHistory';
import { AddTPXToMetaMask } from '../../AddTPXToMetaMask';
import { HalloweenBadgesPanel } from '../../halloween/HalloweenBadgesPanel';
import { HalloweenCelebration } from '../../halloween/HalloweenCelebration';
// ClaimTokensButton removed
import { formatTokenAmount } from '../../../services/tokenService';
import { supabase } from '../../../lib/supabase';
import * as halloweenBadgeService from '../../../services/halloweenBadgeService';
import * as halloweenStorageService from '../../../services/halloweenStorageService';

interface ProfileProps {
  onNavigate?: (page: string) => void;
}

export const Profile: React.FC<ProfileProps> = ({ onNavigate }) => {
  const { user: walletUser, address, isConnected: isWalletConnected, tpxBalance: walletTPX } = useWalletAuth();
  const { user: emailUser, isAuthenticated: isEmailAuthenticated } = useEmailAuth();
  const user = walletUser || emailUser;
  const isLoggedIn = isWalletConnected || isEmailAuthenticated;
  const tokenBalance = walletTPX || null; // Use balance from hook instead of local state

  const [activeTab, setActiveTab] = useState<'overview' | 'tokens' | 'nfts' | 'achievements'>('overview');
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [nftPassport, setNftPassport] = useState<any>(null);
  const [loadingPassport, setLoadingPassport] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [showBadgeCelebration, setShowBadgeCelebration] = useState(false);
  // Removed pendingRewards state - now handled by ClaimTokensButton
  // Removed claimingRewards state - now handled by ClaimTokensButton

  // Listen for claim complete events to refresh user data
  useEffect(() => {
    const handleClaimComplete = () => {
      console.log('[Profile] Claim complete event received, refreshing data...');
      loadUserData();
    };
    
    window.addEventListener('claimComplete', handleClaimComplete);
    return () => window.removeEventListener('claimComplete', handleClaimComplete);
  }, []);

  // Set current user for per-user Halloween storage
  React.useEffect(() => {
    const userId = user?.id || null;
    halloweenStorageService.setCurrentUser(userId);
  }, [user?.id]);

  React.useEffect(() => {
    console.log('[Profile] User changed:', user?.id, 'address:', address);
    
    // CRITICAL: Clear all data when user changes to prevent showing wrong user's data
    setUserData(null);
    setNftPassport(null);
    setLoadingBalance(false);
    setLoadingPassport(false);
    
    if (user?.id) {
      console.log('[Profile] Loading data for user:', user.id);
      loadUserData();
      // Balance is loaded from useWalletAuth hook
      loadPassportData();
      // Pending rewards now handled by ClaimTokensButton component
    } else {
      console.log('[Profile] No user - showing empty state');
    }
  }, [user?.id, address]);

  const loadUserData = async () => {
    if (!user?.id) return;
    try {
      const data = await getUser(user.id);
      if (data) {
        setUserData(data);
        // Check for eligible badges
        checkAndUnlockBadges();
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const checkAndUnlockBadges = () => {
    try {
      const progress = halloweenStorageService.getProgress();
      const { badges: eligibleBadgeIds } = halloweenBadgeService.checkBadgeEligibility(progress);
      
      // Unlock eligible badges
      eligibleBadgeIds.forEach(badgeId => {
        const badge = halloweenBadgeService.unlockBadge(badgeId);
        if (badge) {
          console.log('[Profile] Badge unlocked:', badge.name);
          setShowBadgeCelebration(true);
        }
      });
    } catch (error) {
      console.error('Error checking badges:', error);
    }
  };

  const loadPassportData = async () => {
    if (!user?.id) return;
    setLoadingPassport(true);
    try {
      console.log('[Profile] Loading passport data for user:', user.id);
      
      // Get ALL passports for user (can have multiple tiers)
      const { data, error } = await supabase
        .from('nft_passports')
        .select('*')
        .eq('user_id', user.id)
        .order('total_xp', { ascending: false });
      
      console.log('[Profile] Passports from DB:', data, 'Error:', error);
      
      if (error && error.code !== 'PGRST116') {
        console.error('[Profile] Error loading passports:', error);
      }
      
      // Set the highest tier passport as the main one for display
      if (data && data.length > 0) {
        const tierOrder = ['platinum', 'gold', 'silver', 'bronze'];
        const sortedPassports = data.sort((a: any, b: any) => {
          return tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier);
        });
        console.log('[Profile] ✅ Found', data.length, 'passports, highest tier:', sortedPassports[0].tier);
        setNftPassport(sortedPassports[0]);
        setLoadingPassport(false);
        return;
      }
      
      // If no passports in DB, user hasn't minted any yet
      console.log('[Profile] No passports found for user');
      setNftPassport(null);
    } catch (error) {
      console.error('[Profile] Error loading passport data:', error);
      setNftPassport(null);
    } finally {
      setLoadingPassport(false);
    }
  };

  // loadPendingRewards and handleClaimRewards removed - now handled by ClaimTokensButton

  if (!isLoggedIn) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <User className="w-20 h-20 text-white/30 mb-6" />
          <h2 className="text-2xl font-bold text-white mb-2">Please Sign In</h2>
          <p className="text-white/60">Connect your wallet or sign in to view your profile</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'tokens', label: 'Token History', icon: Coins },
    { id: 'nfts', label: 'NFT History', icon: Sparkles },
    { id: 'achievements', label: 'Achievements', icon: Award },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
        <p className="text-white/60">View your stats, transactions, and achievements</p>
      </motion.div>

      {/* Profile Overview Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-6 mb-6"
      >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* User Info */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">
                {userData?.username || user?.username || 'Traveler'}
              </h3>
              <p className="text-white/60 text-sm">
                {/* CRITICAL: Calculate level from XP for consistency */}
                Level {Math.floor(Math.sqrt((userData?.total_xp || user?.total_xp || 0) / 100)) + 1}
              </p>
            </div>
          </div>

          {/* Wallet Address */}
          {address && (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-cyan-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white/60 text-xs mb-1">Wallet Address</p>
                <a
                  href={`https://sepolia.etherscan.io/address/${address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-mono"
                >
                  {address.slice(0, 6)}...{address.slice(-4)}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          {/* Token Balance */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
              <Coins className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white/60 text-xs mb-1">TPX Balance</p>
              {loadingBalance ? (
                <p className="text-white font-bold">Loading...</p>
              ) : (
                <p className="text-white font-bold text-lg">
                  {tokenBalance !== null ? formatTokenAmount(tokenBalance) : '0'} TPX
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Token Management */}
        {isWalletConnected && address && user?.id && (
          <div className="mt-6 space-y-3">
            {/* Add TPX to MetaMask button */}
            <div className="flex justify-center p-3 rounded-xl bg-white/5 border border-white/10">
              <AddTPXToMetaMask address={address} />
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-white/10">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="text-2xl font-bold text-white">{userData?.total_xp || user?.total_xp || 0}</span>
            </div>
            <p className="text-white/60 text-xs">Total XP</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-purple-400" />
              <span className="text-2xl font-bold text-white">{userData?.quests_completed || user?.quests_completed || 0}</span>
            </div>
            <p className="text-white/60 text-xs">Quests Completed</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Coins className="w-5 h-5 text-cyan-400" />
              <span className="text-2xl font-bold text-white">
                {formatTokenAmount(
                  typeof (userData?.total_tokens_earned || user?.total_tokens_earned) === 'string'
                    ? parseFloat(userData?.total_tokens_earned || user?.total_tokens_earned || '0') || 0
                    : (userData?.total_tokens_earned || user?.total_tokens_earned || 0)
                )}
              </span>
            </div>
            <p className="text-white/60 text-xs">Tokens Earned</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-green-400" />
              <span className="text-2xl font-bold text-white">
                {Array.isArray(userData?.countries_visited) ? userData.countries_visited.length : (nftPassport?.countries_visited?.length || 0)}
              </span>
            </div>
            <p className="text-white/60 text-xs">Countries Visited</p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 sm:mb-6 overflow-x-auto pb-2 -mb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap text-sm sm:text-base ${
                isActive
                  ? 'bg-cyan-500 text-white'
                  : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* NFT Passport Card */}
            {isWalletConnected && address && (
              <div className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  NFT Passport
                </h3>
                {loadingPassport ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 text-white/40 animate-spin" />
                  </div>
                ) : nftPassport ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                      <div>
                        <p className="text-white/60 text-sm mb-1">Status</p>
                        <p className="text-green-400 font-semibold">Minted</p>
                      </div>
                      <div>
                        <p className="text-white/60 text-sm mb-1">Token ID</p>
                        <p className="text-white font-semibold">#{nftPassport.token_id}</p>
                      </div>
                      <div>
                        <p className="text-white/60 text-sm mb-1">Tier</p>
                        <p className="text-white font-semibold capitalize">{nftPassport.tier || 'bronze'}</p>
                      </div>
                      {nftPassport.tx_hash && (
                        <div>
                          <p className="text-white/60 text-sm mb-1">Transaction</p>
                          <a
                            href={`https://sepolia.etherscan.io/tx/${nftPassport.tx_hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors text-sm"
                          >
                            View
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 rounded-lg bg-white/5">
                        <p className="text-2xl font-bold text-white">{nftPassport.quests_completed || 0}</p>
                        <p className="text-white/60 text-xs mt-1">Quests</p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-white/5">
                        <p className="text-2xl font-bold text-white">{nftPassport.total_xp || 0}</p>
                        <p className="text-white/60 text-xs mt-1">Total XP</p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-white/5">
                        <p className="text-2xl font-bold text-white">{nftPassport.countries_visited?.length || 0}</p>
                        <p className="text-white/60 text-xs mt-1">Countries</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Sparkles className="w-12 h-12 text-white/30 mx-auto mb-4" />
                    <p className="text-white/60 text-sm">No NFT Passport minted yet</p>
                    <p className="text-white/40 text-xs mt-2">Mint your NFT Passport from the Dashboard</p>
                  </div>
                )}
              </div>
            )}

            {/* Halloween Badges Panel */}
            <HalloweenBadgesPanel
              userId={user?.id}
              onBadgeUnlock={(badge) => {
                console.log('[Profile] Badge unlocked:', badge.name);
                setShowBadgeCelebration(true);
              }}
            />

            <RecentActivitySection userId={user?.id} />
          </div>
        )}

        {activeTab === 'tokens' && (
          <div className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-6">
            <TokenTransactionHistory />
          </div>
        )}

        {activeTab === 'nfts' && (
          <div className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-6">
            <NFTTransactionHistory />
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-6">
            <AchievementHistory />
          </div>
        )}
      </motion.div>

      {/* Badge Unlock Celebration */}
      {showBadgeCelebration && (
        <HalloweenCelebration
          type="badge"
          onComplete={() => setShowBadgeCelebration(false)}
        />
      )}
    </div>
  );
};

// Recent Activity Section Component
const RecentActivitySection: React.FC<{ userId?: string }> = ({ userId }) => {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadRecentActivity();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const loadRecentActivity = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      // Get recent quests
      const { data: recentQuests } = await supabase
        .from('user_quests')
        .select('*, quests(title, location)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);

      // Get recent token transactions
      const { data: recentTokens } = await supabase
        .from('token_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);

      // Get recent NFT transactions
      const { data: recentNFTs } = await supabase
        .from('nft_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);

      // Combine and sort by date
      const allActivities: any[] = [];

      recentQuests?.forEach((q: any) => {
        allActivities.push({
          type: 'quest',
          title: q.quests?.title || 'Quest',
          description: q.status === 'completed' ? 'Completed quest' : `Quest ${q.status}`,
          date: q.completed_at || q.created_at,
          icon: '🎯',
        });
      });

      recentTokens?.forEach((t: any) => {
        allActivities.push({
          type: 'token',
          title: `${t.amount} TPX`,
          description: t.transaction_type === 'claim' ? 'Claimed tokens' : 'Token transaction',
          date: t.created_at,
          icon: '💰',
        });
      });

      recentNFTs?.forEach((n: any) => {
        allActivities.push({
          type: 'nft',
          title: `${n.nft_type} NFT`,
          description: `Minted ${n.nft_type} NFT #${n.token_id || '?'}`,
          date: n.created_at,
          icon: '🎨',
        });
      });

      // Sort by date descending
      allActivities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setActivities(allActivities.slice(0, 10));
    } catch (error) {
      console.error('Error loading recent activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-cyan-400" />
        Recent Activity
      </h3>
      
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-white/40 animate-spin" />
        </div>
      ) : activities.length === 0 ? (
        <p className="text-white/60 text-sm text-center py-4">
          No recent activity yet. Complete quests to see your activity here!
        </p>
      ) : (
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              <span className="text-2xl">{activity.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{activity.title}</p>
                <p className="text-white/60 text-xs">{activity.description}</p>
              </div>
              <span className="text-white/40 text-xs whitespace-nowrap">{formatDate(activity.date)}</span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

