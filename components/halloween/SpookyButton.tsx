/**
 * SpookyButton Component
 * 
 * Animated button with Halloween effects: shimmer on hover, bat fly-by on click, glow shadows.
 * Variants: primary, secondary, ghost
 * 
 * Requirements: 11.2
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimationsEnabled } from './HalloweenProvider';
import { HALLOWEEN_THEME } from '../../styles/halloweenTheme';

export type SpookyButtonVariant = 'primary' | 'secondary' | 'ghost';
export type SpookyButtonSize = 'sm' | 'md' | 'lg';

interface SpookyButtonProps {
  children: React.ReactNode;
  variant?: SpookyButtonVariant;
  size?: SpookyButtonSize;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  'aria-label'?: string;
}

const sizeStyles: Record<SpookyButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-6 py-3 rounded-lg',
  lg: 'px-8 py-4 text-lg rounded-xl',
};

const variantStyles: Record<SpookyButtonVariant, {
  bg: string;
  hoverBg: string;
  text: string;
  border: string;
  glow: string;
}> = {
  primary: {
    bg: HALLOWEEN_THEME.colors.primary.bloodOrange,
    hoverBg: HALLOWEEN_THEME.colors.accent.pumpkinOrange,
    text: HALLOWEEN_THEME.colors.accent.ghostlyWhite,
    border: 'transparent',
    glow: HALLOWEEN_THEME.colors.primary.bloodOrange,
  },
  secondary: {
    bg: HALLOWEEN_THEME.colors.primary.deepPurple,
    hoverBg: HALLOWEEN_THEME.colors.primary.midnightBlue,
    text: HALLOWEEN_THEME.colors.accent.ghostlyWhite,
    border: HALLOWEEN_THEME.colors.accent.pumpkinOrange,
    glow: HALLOWEEN_THEME.colors.accent.pumpkinOrange,
  },
  ghost: {
    bg: 'transparent',
    hoverBg: `${HALLOWEEN_THEME.colors.primary.deepPurple}33`,
    text: HALLOWEEN_THEME.colors.accent.ghostlyWhite,
    border: HALLOWEEN_THEME.colors.accent.ghostlyWhite,
    glow: HALLOWEEN_THEME.colors.accent.ghostlyWhite,
  },
};

export const SpookyButton: React.FC<SpookyButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
  type = 'button',
  'aria-label': ariaLabel,
}) => {
  const animationsEnabled = useAnimationsEnabled();
  const [showBat, setShowBat] = useState(false);
  const styles = variantStyles[variant];

  const handleClick = () => {
    if (disabled) return;
    
    if (animationsEnabled) {
      setShowBat(true);
      setTimeout(() => setShowBat(false), 1000);
    }
    
    onClick?.();
  };

  const buttonVariants = {
    initial: {
      scale: 1,
      boxShadow: `0 0 10px ${styles.glow}33`,
    },
    hover: {
      scale: 1.05,
      boxShadow: `0 0 20px ${styles.glow}66, 0 0 40px ${styles.glow}33`,
    },
    tap: {
      scale: 0.95,
    },
  };

  return (
    <div className="relative inline-block">
      <motion.button
        type={type}
        className={`
          relative font-semibold
          transition-all duration-300
          disabled:opacity-50 disabled:cursor-not-allowed
          overflow-hidden flex items-center justify-center
          focus:outline-none focus-visible:ring-2 focus-visible:ring-pumpkinOrange focus-visible:ring-offset-2 focus-visible:ring-offset-deepPurple
          ${sizeStyles[size]}
          ${className}
        `}
        style={{
          backgroundColor: styles.bg,
          color: styles.text,
          border: `2px solid ${styles.border}`,
        }}
        variants={animationsEnabled && !disabled ? buttonVariants : {}}
        initial="initial"
        whileHover={!disabled ? 'hover' : undefined}
        whileTap={!disabled ? 'tap' : undefined}
        onClick={handleClick}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-disabled={disabled}
      >
        {/* Shimmer effect on hover */}
        {animationsEnabled && !disabled && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
            style={{
              backgroundSize: '200% 100%',
            }}
            whileHover={{
              opacity: [0, 0.3, 0],
              backgroundPosition: ['0% 0%', '200% 0%'],
            }}
            transition={{
              duration: 1,
              ease: 'linear',
            }}
          />
        )}

        {/* Button content */}
        <span className="relative z-10">{children}</span>
      </motion.button>

      {/* Bat fly-by animation on click */}
      <AnimatePresence>
        {showBat && animationsEnabled && (
          <motion.div
            className="absolute text-2xl pointer-events-none"
            style={{
              left: '50%',
              top: '50%',
            }}
            initial={{
              x: -50,
              y: 0,
              opacity: 0,
              rotate: -45,
            }}
            animate={{
              x: 100,
              y: -50,
              opacity: [0, 1, 1, 0],
              rotate: 0,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 1,
              ease: 'easeOut',
            }}
          >
            🦇
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
