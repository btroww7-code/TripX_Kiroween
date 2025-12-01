/**
 * SpookyCard Component
 * 
 * Glassmorphic card with Halloween glow effects, animated borders, and cobweb decorations.
 * Used throughout the app for trips, quests, and achievements.
 * 
 * Requirements: 11.2, 13.3
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useAnimationsEnabled } from './HalloweenProvider';
import { HalloweenIcon } from './HalloweenIcons';
import { HALLOWEEN_THEME } from '../../styles/halloweenTheme';

export type SpookyCardVariant = 'default' | 'quest' | 'trip' | 'achievement';

interface SpookyCardProps {
  children: React.ReactNode;
  variant?: SpookyCardVariant;
  glowColor?: string;
  hoverEffect?: boolean;
  className?: string;
  onClick?: () => void;
}

const variantStyles: Record<SpookyCardVariant, {
  borderGradient: string;
  glowColor: string;
  bgOpacity: string;
}> = {
  default: {
    borderGradient: HALLOWEEN_THEME.colors.gradients.hauntedGlow,
    glowColor: HALLOWEEN_THEME.colors.primary.bloodOrange,
    bgOpacity: 'bg-opacity-10',
  },
  quest: {
    borderGradient: `linear-gradient(135deg, ${HALLOWEEN_THEME.colors.accent.pumpkinOrange} 0%, ${HALLOWEEN_THEME.colors.primary.bloodOrange} 100%)`,
    glowColor: HALLOWEEN_THEME.colors.accent.pumpkinOrange,
    bgOpacity: 'bg-opacity-15',
  },
  trip: {
    borderGradient: `linear-gradient(135deg, ${HALLOWEEN_THEME.colors.primary.deepPurple} 0%, ${HALLOWEEN_THEME.colors.primary.midnightBlue} 100%)`,
    glowColor: HALLOWEEN_THEME.colors.primary.deepPurple,
    bgOpacity: 'bg-opacity-20',
  },
  achievement: {
    borderGradient: `linear-gradient(135deg, ${HALLOWEEN_THEME.colors.accent.toxicGreen} 0%, ${HALLOWEEN_THEME.colors.accent.pumpkinOrange} 100%)`,
    glowColor: HALLOWEEN_THEME.colors.accent.toxicGreen,
    bgOpacity: 'bg-opacity-15',
  },
};

export const SpookyCard: React.FC<SpookyCardProps> = ({
  children,
  variant = 'default',
  glowColor,
  hoverEffect = true,
  className = '',
  onClick,
}) => {
  const animationsEnabled = useAnimationsEnabled();
  const styles = variantStyles[variant];
  const finalGlowColor = glowColor || styles.glowColor;

  const cardVariants = {
    initial: { scale: 1, boxShadow: `0 0 20px ${finalGlowColor}33` },
    hover: {
      scale: hoverEffect ? 1.02 : 1,
      boxShadow: `0 0 40px ${finalGlowColor}66, 0 0 80px ${finalGlowColor}33`,
    },
  };

  const borderVariants = {
    animate: {
      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
    },
  };

  return (
    <motion.div
      className={`relative rounded-xl overflow-hidden backdrop-blur-md ${onClick ? 'focus:outline-none focus-visible:ring-2 focus-visible:ring-pumpkinOrange focus-visible:ring-offset-2 focus-visible:ring-offset-deepPurple' : ''} ${className}`}
      variants={animationsEnabled ? cardVariants : {}}
      initial="initial"
      whileHover={hoverEffect && animationsEnabled ? 'hover' : undefined}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
      style={{
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      {/* Animated border gradient */}
      <motion.div
        className="absolute inset-0 rounded-xl p-[2px]"
        style={{
          background: styles.borderGradient,
          backgroundSize: '200% 200%',
        }}
        variants={animationsEnabled ? borderVariants : {}}
        animate={animationsEnabled ? 'animate' : undefined}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {/* Inner card with glassmorphism */}
        <div
          className={`h-full w-full rounded-xl bg-deepPurple ${styles.bgOpacity} backdrop-blur-xl`}
          style={{
            background: `linear-gradient(135deg, ${HALLOWEEN_THEME.colors.primary.deepPurple}${styles.bgOpacity === 'bg-opacity-10' ? '1a' : styles.bgOpacity === 'bg-opacity-15' ? '26' : '33'}, ${HALLOWEEN_THEME.colors.primary.midnightBlue}${styles.bgOpacity === 'bg-opacity-10' ? '1a' : styles.bgOpacity === 'bg-opacity-15' ? '26' : '33'})`,
          }}
        />
      </motion.div>

      {/* Cobweb decorations in corners */}
      <div className="absolute top-2 left-2 opacity-30 pointer-events-none z-10">
        <HalloweenIcon name="cobweb" size={24} className="text-ghostlyWhite" />
      </div>
      <div className="absolute top-2 right-2 opacity-30 pointer-events-none z-10 transform scale-x-[-1]">
        <HalloweenIcon name="cobweb" size={24} className="text-ghostlyWhite" />
      </div>

      {/* Content */}
      <div className="relative z-20 p-6">
        {children}
      </div>
    </motion.div>
  );
};
