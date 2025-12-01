/**
 * Halloween Passport Overlay Component
 * 
 * Adds spooky decorations to the NFT Passport including:
 * - Animated cobweb corners
 * - Mystical border glow
 * - Floating candle flames
 * 
 * Requirements: 13.2
 */

import React from 'react';
import { motion } from 'framer-motion';
import { HalloweenIcon } from './HalloweenIcons';
import { HALLOWEEN_THEME } from '../../styles/halloweenTheme';

interface HalloweenPassportOverlayProps {
  className?: string;
}

export const HalloweenPassportOverlay: React.FC<HalloweenPassportOverlayProps> = ({ className = '' }) => {
  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden rounded-3xl ${className}`}>
      {/* Mystical border glow */}
      <motion.div
        className="absolute inset-0 rounded-3xl"
        animate={prefersReducedMotion ? {} : {
          boxShadow: [
            `0 0 20px ${HALLOWEEN_THEME.colors.primary.bloodOrange}40, inset 0 0 30px ${HALLOWEEN_THEME.colors.primary.deepPurple}30`,
            `0 0 40px ${HALLOWEEN_THEME.colors.accent.pumpkinOrange}50, inset 0 0 50px ${HALLOWEEN_THEME.colors.primary.deepPurple}40`,
            `0 0 20px ${HALLOWEEN_THEME.colors.primary.bloodOrange}40, inset 0 0 30px ${HALLOWEEN_THEME.colors.primary.deepPurple}30`,
          ],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Top-left cobweb */}
      <motion.div
        className="absolute -top-2 -left-2 opacity-40"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <HalloweenIcon name="cobweb" size={80} color={HALLOWEEN_THEME.colors.accent.ghostlyWhite} />
      </motion.div>

      {/* Top-right cobweb (mirrored) */}
      <motion.div
        className="absolute -top-2 -right-2 opacity-40"
        style={{ transform: 'scaleX(-1)' }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <HalloweenIcon name="cobweb" size={80} color={HALLOWEEN_THEME.colors.accent.ghostlyWhite} />
      </motion.div>

      {/* Floating candles */}
      {!prefersReducedMotion && (
        <>
          <FloatingCandle x="10%" y="20%" delay={0} />
          <FloatingCandle x="85%" y="25%" delay={0.5} />
          <FloatingCandle x="15%" y="70%" delay={1} />
          <FloatingCandle x="80%" y="75%" delay={1.5} />
        </>
      )}

      {/* Corner accent - bottom left skull */}
      <motion.div
        className="absolute bottom-3 left-3 opacity-30"
        animate={prefersReducedMotion ? {} : { 
          rotate: [-5, 5, -5],
          scale: [1, 1.05, 1]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <HalloweenIcon name="skull" size={24} color={HALLOWEEN_THEME.colors.accent.ghostlyWhite} />
      </motion.div>

      {/* Corner accent - bottom right bat */}
      <motion.div
        className="absolute bottom-3 right-3 opacity-30"
        animate={prefersReducedMotion ? {} : { 
          y: [-2, 2, -2],
          rotate: [0, 10, 0, -10, 0]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <HalloweenIcon name="vampireBat" size={24} color={HALLOWEEN_THEME.colors.accent.ghostlyWhite} />
      </motion.div>

      {/* Subtle orange gradient overlay */}
      <div 
        className="absolute inset-0 rounded-3xl opacity-10"
        style={{
          background: `linear-gradient(135deg, ${HALLOWEEN_THEME.colors.primary.bloodOrange}20 0%, transparent 50%, ${HALLOWEEN_THEME.colors.accent.pumpkinOrange}20 100%)`
        }}
      />
    </div>
  );
};

// Floating candle component
const FloatingCandle: React.FC<{ x: string; y: string; delay: number }> = ({ x, y, delay }) => {
  return (
    <motion.div
      className="absolute text-2xl"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ 
        opacity: [0.6, 0.9, 0.6],
        y: [0, -8, 0],
      }}
      transition={{ 
        duration: 2.5, 
        repeat: Infinity, 
        ease: 'easeInOut',
        delay 
      }}
    >
      🕯️
    </motion.div>
  );
};

export default HalloweenPassportOverlay;
