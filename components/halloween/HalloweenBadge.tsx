/**
 * HalloweenBadge Component
 * 
 * Displays a Halloween badge with locked/unlocked states, progress bar,
 * and unlock animation.
 * 
 * Requirements: 17.4
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { HalloweenIcon, type HalloweenIconName } from './HalloweenIcons';
import type { HalloweenBadge as BadgeType } from '../../types/halloween';

interface HalloweenBadgeProps {
  badge: BadgeType;
  isUnlocked: boolean;
  progress?: {
    current: number;
    required: number;
    percentage: number;
  };
  showAnimation?: boolean;
  onAnimationComplete?: () => void;
}

export const HalloweenBadge: React.FC<HalloweenBadgeProps> = ({
  badge,
  isUnlocked,
  progress,
  showAnimation = false,
  onAnimationComplete,
}) => {
  const rarityColors = {
    common: 'from-gray-400 to-gray-600',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-orange-400 to-yellow-500',
  };

  const rarityGlow = {
    common: 'shadow-gray-500/50',
    rare: 'shadow-blue-500/50',
    epic: 'shadow-purple-500/50',
    legendary: 'shadow-orange-500/50',
  };

  return (
    <motion.div
      initial={showAnimation ? { scale: 0, rotate: -180 } : false}
      animate={showAnimation ? { scale: 1, rotate: 0 } : {}}
      transition={{ type: 'spring', duration: 0.8 }}
      onAnimationComplete={onAnimationComplete}
      className="relative"
    >
      <div
        className={`relative backdrop-blur-xl bg-white/[0.03] rounded-2xl p-6 border-2 transition-all duration-300 ${
          isUnlocked
            ? `border-${badge.rarity === 'legendary' ? 'pumpkinOrange' : 'white'}/30 ${rarityGlow[badge.rarity]} shadow-xl`
            : 'border-white/10 opacity-60'
        }`}
      >
        {/* Rarity gradient background */}
        {isUnlocked && (
          <motion.div
            animate={{
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className={`absolute inset-0 bg-gradient-to-br ${rarityColors[badge.rarity]} opacity-10 rounded-2xl`}
          />
        )}

        {/* Badge content */}
        <div className="relative z-10 flex flex-col items-center gap-4">
          {/* Icon */}
          <div className="relative">
            {isUnlocked ? (
              <motion.div
                animate={
                  showAnimation
                    ? {
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0],
                      }
                    : {}
                }
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <HalloweenIcon
                  name={badge.icon as HalloweenIconName}
                  size={64}
                  className="text-pumpkinOrange"
                />
              </motion.div>
            ) : (
              <div className="relative">
                <HalloweenIcon
                  name={badge.icon as HalloweenIconName}
                  size={64}
                  className="text-white/20"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-white/40" />
                </div>
              </div>
            )}
          </div>

          {/* Badge name */}
          <h3
            className={`text-lg font-bold text-center ${
              isUnlocked ? 'text-white' : 'text-white/40'
            }`}
          >
            {badge.name}
          </h3>

          {/* Description */}
          <p
            className={`text-sm text-center ${
              isUnlocked ? 'text-white/70' : 'text-white/30'
            }`}
          >
            {badge.description}
          </p>

          {/* Rarity badge */}
          <div
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              isUnlocked
                ? `bg-gradient-to-r ${rarityColors[badge.rarity]} text-white`
                : 'bg-white/10 text-white/40'
            }`}
          >
            {badge.rarity.toUpperCase()}
          </div>

          {/* Progress bar for locked badges */}
          {!isUnlocked && progress && (
            <div className="w-full">
              <div className="flex justify-between text-xs text-white/50 mb-2">
                <span>Progress</span>
                <span>
                  {progress.current} / {progress.required}
                </span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress.percentage}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-pumpkinOrange to-bloodOrange"
                />
              </div>
            </div>
          )}

          {/* Unlock date for unlocked badges */}
          {isUnlocked && badge.unlockedAt && (
            <p className="text-xs text-white/40">
              Unlocked: {new Date(badge.unlockedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};
