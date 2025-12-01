/**
 * Halloween Error Fallback Component
 * 
 * Displays a spooky-themed error message when something goes wrong.
 * Used as fallback UI for Error Boundaries.
 * 
 * Requirements: 21.1, 21.5
 */

import React from 'react';
import { motion } from 'framer-motion';
import { HalloweenIcon } from './HalloweenIcons';
import { SpookyButton } from './SpookyButton';
import { HALLOWEEN_THEME } from '../../styles/halloweenTheme';
import { getUserFriendlyMessage } from '../../lib/errorMessages';

interface HalloweenErrorFallbackProps {
  error: Error;
  resetError?: () => void;
  title?: string;
}

export const HalloweenErrorFallback: React.FC<HalloweenErrorFallbackProps> = ({
  error,
  resetError,
  title = 'Oops! Something spooky happened...',
}) => {
  const userMessage = getUserFriendlyMessage(error);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center justify-center min-h-[400px] p-8"
    >
      <div
        className="relative max-w-md w-full p-8 rounded-2xl backdrop-blur-xl border border-white/10 text-center overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${HALLOWEEN_THEME.colors.primary.deepPurple}90, ${HALLOWEEN_THEME.colors.primary.midnightBlue}95)`,
          boxShadow: `0 0 40px ${HALLOWEEN_THEME.colors.primary.bloodOrange}20`,
        }}
      >
        {/* Animated glow */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          animate={{
            boxShadow: [
              `inset 0 0 30px ${HALLOWEEN_THEME.colors.primary.bloodOrange}10`,
              `inset 0 0 50px ${HALLOWEEN_THEME.colors.primary.bloodOrange}20`,
              `inset 0 0 30px ${HALLOWEEN_THEME.colors.primary.bloodOrange}10`,
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Ghost icon */}
        <motion.div
          className="relative mb-6 inline-block"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <HalloweenIcon
            name="ghost"
            size={80}
            color={HALLOWEEN_THEME.colors.accent.ghostlyWhite}
          />
        </motion.div>

        {/* Title */}
        <h2
          className="text-2xl font-bold mb-3"
          style={{ color: HALLOWEEN_THEME.colors.accent.ghostlyWhite }}
        >
          {title}
        </h2>

        {/* Error message */}
        <p
          className="text-base mb-6 opacity-80"
          style={{ color: HALLOWEEN_THEME.colors.accent.ghostlyWhite }}
        >
          {userMessage}
        </p>

        {/* Decorative elements */}
        <div className="absolute top-4 left-4 opacity-30">
          <HalloweenIcon name="cobweb" size={40} color={HALLOWEEN_THEME.colors.accent.ghostlyWhite} />
        </div>
        <div className="absolute top-4 right-4 opacity-30" style={{ transform: 'scaleX(-1)' }}>
          <HalloweenIcon name="cobweb" size={40} color={HALLOWEEN_THEME.colors.accent.ghostlyWhite} />
        </div>

        {/* Action buttons */}
        <div className="relative flex flex-col sm:flex-row gap-3 justify-center">
          {resetError && (
            <SpookyButton
              variant="primary"
              onClick={resetError}
              className="px-6 py-3"
            >
              <span className="flex items-center gap-2">
                <HalloweenIcon name="potion" size={18} />
                Try Again
              </span>
            </SpookyButton>
          )}
          
          <SpookyButton
            variant="ghost"
            onClick={() => window.location.reload()}
            className="px-6 py-3"
          >
            <span className="flex items-center gap-2">
              <HalloweenIcon name="cauldron" size={18} />
              Refresh Page
            </span>
          </SpookyButton>
        </div>

        {/* Bottom decoration */}
        <motion.div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-20"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <HalloweenIcon name="pumpkin" size={30} color={HALLOWEEN_THEME.colors.accent.pumpkinOrange} />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HalloweenErrorFallback;
