/**
 * HalloweenBadgesPanel Component
 * 
 * Displays all Halloween badges in a grid with filtering by rarity.
 * Shows locked and unlocked badges with progress tracking.
 * Syncs progress from Supabase user data for accurate tracking.
 * 
 * Requirements: 17.4
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';
import { HalloweenBadge } from './HalloweenBadge';
import { SpookyCard } from './SpookyCard';
import { HalloweenLoader } from './HalloweenLoader';
import * as halloweenBadgeService from '../../services/halloweenBadgeService';
import * as halloweenStorageService from '../../services/halloweenStorageService';
import { supabase } from '../../lib/supabase';
import type { HalloweenBadge as BadgeType, HalloweenProgress } from '../../types/halloween';

interface HalloweenBadgesPanelProps {
  userId?: string;
  onBadgeUnlock?: (badge: BadgeType) => void;
}

export const HalloweenBadgesPanel: React.FC<HalloweenBadgesPanelProps> = ({
  userId,
  onBadgeUnlock,
}) => {
  const [allBadges, setAllBadges] = useState<BadgeType[]>([]);
  const [unlockedBadges, setUnlockedBadges] = useState<BadgeType[]>([]);
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [showUnlockAnimation, setShowUnlockAnimation] = useState<string | null>(null);
  const [realProgress, setRealProgress] = useState<HalloweenProgress>({
    spookyDestinationsVisited: 0,
    halloweenQuestsCompleted: 0,
    tokensEarnedInSeason: 0,
    unlockedBadges: [],
  });

  useEffect(() => {
    loadBadges();
  }, [userId]);

  const loadBadges = async () => {
    setLoading(true);
    try {
      // Get all available badges
      const badges = halloweenBadgeService.getAllBadges();
      setAllBadges(badges);

      // Get unlocked badges from localStorage
      const unlocked = halloweenStorageService.getBadges();
      setUnlockedBadges(unlocked);

      // CRITICAL: Sync progress from Supabase for accurate tracking
      if (userId) {
        await syncProgressFromSupabase(userId);
      } else {
        // Use localStorage progress if no user
        setRealProgress(halloweenStorageService.getProgress());
      }
    } catch (error) {
      console.error('Error loading badges:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sync Halloween progress from Supabase user data
   * This ensures badges show real progress based on actual user activity
   */
  const syncProgressFromSupabase = async (uid: string) => {
    try {
      // Get user data from Supabase
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('total_tokens_earned, quests_completed')
        .eq('id', uid)
        .single();

      // Count spooky quests completed
      const { count: spookyQuestsCount, error: spookyError } = await supabase
        .from('user_spooky_quests')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', uid)
        .eq('status', 'completed');

      // Count visited spooky destinations from localStorage (these are client-side tracked)
      const visitedDestinations = halloweenStorageService.getVisitedDestinations();

      const progress: HalloweenProgress = {
        spookyDestinationsVisited: visitedDestinations.length,
        halloweenQuestsCompleted: spookyQuestsCount || 0,
        tokensEarnedInSeason: userData?.total_tokens_earned 
          ? (typeof userData.total_tokens_earned === 'string' 
              ? parseFloat(userData.total_tokens_earned) 
              : userData.total_tokens_earned)
          : 0,
        unlockedBadges: halloweenStorageService.getProgress().unlockedBadges,
      };

      console.log('[HalloweenBadgesPanel] Synced progress from Supabase:', progress);
      setRealProgress(progress);

      // Update localStorage with synced data
      halloweenStorageService.updateProgress(progress);

      // Check and unlock eligible badges
      const { badges: eligibleBadgeIds } = halloweenBadgeService.checkBadgeEligibility(progress);
      eligibleBadgeIds.forEach(badgeId => {
        const badge = halloweenBadgeService.unlockBadge(badgeId);
        if (badge) {
          console.log('[HalloweenBadgesPanel] Auto-unlocked badge:', badge.name);
          setUnlockedBadges(prev => [...prev.filter(b => b.id !== badge.id), badge]);
          if (onBadgeUnlock) {
            onBadgeUnlock(badge);
          }
        }
      });
    } catch (error) {
      console.error('[HalloweenBadgesPanel] Error syncing from Supabase:', error);
      // Fallback to localStorage
      setRealProgress(halloweenStorageService.getProgress());
    }
  };

  const getBadgeProgress = (badge: BadgeType) => {
    // Use real synced progress instead of just localStorage
    return halloweenBadgeService.getBadgeProgress(badge.id, realProgress);
  };

  const isBadgeUnlocked = (badgeId: string): boolean => {
    // Check both localStorage unlocked badges AND if progress meets requirement
    const inUnlockedList = unlockedBadges.some(b => b.id === badgeId);
    if (inUnlockedList) return true;
    
    // Also check if badge should be unlocked based on current progress
    const badge = allBadges.find(b => b.id === badgeId);
    if (!badge) return false;
    
    let current = 0;
    switch (badge.requirement.type) {
      case 'spooky_destinations':
        current = realProgress.spookyDestinationsVisited;
        break;
      case 'halloween_quests':
        current = realProgress.halloweenQuestsCompleted;
        break;
      case 'tokens_earned':
        current = realProgress.tokensEarnedInSeason;
        break;
    }
    
    // If progress meets requirement, auto-unlock the badge
    if (current >= badge.requirement.count) {
      // Unlock badge in background
      const unlockedBadge = halloweenBadgeService.unlockBadge(badgeId);
      if (unlockedBadge && !unlockedBadges.some(b => b.id === badgeId)) {
        setUnlockedBadges(prev => [...prev, unlockedBadge]);
      }
      return true;
    }
    
    return false;
  };

  const filteredBadges = allBadges.filter(badge => {
    if (selectedRarity === 'all') return true;
    return badge.rarity === selectedRarity;
  });

  const rarityOptions = [
    { value: 'all', label: 'All Badges' },
    { value: 'common', label: 'Common' },
    { value: 'rare', label: 'Rare' },
    { value: 'epic', label: 'Epic' },
    { value: 'legendary', label: 'Legendary' },
  ];

  const unlockedCount = unlockedBadges.length;
  const totalCount = allBadges.length;
  const completionPercentage = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  if (loading) {
    return (
      <SpookyCard variant="default" className="p-8">
        <div className="flex justify-center">
          <HalloweenLoader variant="ghost" text="Loading badges..." />
        </div>
      </SpookyCard>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <SpookyCard variant="default" className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Halloween Badges</h2>
            <p className="text-white/70">
              Collect badges by completing spooky challenges and quests
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="text-3xl font-bold text-pumpkinOrange">
              {unlockedCount} / {totalCount}
            </div>
            <div className="text-sm text-white/60">{completionPercentage}% Complete</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 w-full h-3 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 1, delay: 0.2 }}
            className="h-full bg-gradient-to-r from-pumpkinOrange to-bloodOrange"
          />
        </div>
      </SpookyCard>

      {/* Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-5 h-5 text-white/60" />
        {rarityOptions.map(option => (
          <motion.button
            key={option.value}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedRarity(option.value)}
            className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
              selectedRarity === option.value
                ? 'bg-pumpkinOrange text-white shadow-lg shadow-pumpkinOrange/30'
                : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
            }`}
          >
            {option.label}
          </motion.button>
        ))}
      </div>

      {/* Badges grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBadges.map((badge, index) => {
          const isUnlocked = isBadgeUnlocked(badge.id);
          const progress = !isUnlocked ? getBadgeProgress(badge) : undefined;

          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <HalloweenBadge
                badge={badge}
                isUnlocked={isUnlocked}
                progress={progress}
                showAnimation={showUnlockAnimation === badge.id}
                onAnimationComplete={() => {
                  setShowUnlockAnimation(null);
                  if (onBadgeUnlock) {
                    onBadgeUnlock(badge);
                  }
                }}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Empty state */}
      {filteredBadges.length === 0 && (
        <SpookyCard variant="default" className="p-12 text-center">
          <p className="text-white/60 text-lg">No badges found for this rarity</p>
        </SpookyCard>
      )}
    </div>
  );
};
