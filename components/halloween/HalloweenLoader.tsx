/**
 * HalloweenLoader Component
 * 
 * Animated loading indicators with Halloween themes.
 * Variants: pumpkin, witch, ghost, cauldron
 * 
 * Requirements: 12.4
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useAnimationsEnabled } from './HalloweenProvider';
import { HalloweenIcon } from './HalloweenIcons';

export type LoaderVariant = 'pumpkin' | 'witch' | 'ghost' | 'cauldron';

interface HalloweenLoaderProps {
  variant?: LoaderVariant;
  text?: string;
  size?: number;
}

export const HalloweenLoader: React.FC<HalloweenLoaderProps> = ({
  variant = 'pumpkin',
  text,
  size = 48,
}) => {
  const animationsEnabled = useAnimationsEnabled();

  const renderLoader = () => {
    switch (variant) {
      case 'pumpkin':
        return (
          <motion.div
            animate={animationsEnabled ? {
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            } : {}}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <HalloweenIcon name="pumpkin" size={size} className="text-pumpkinOrange" />
          </motion.div>
        );

      case 'witch':
        return (
          <motion.div
            animate={animationsEnabled ? {
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0],
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <HalloweenIcon name="witchBroom" size={size} className="text-ghostlyWhite" />
          </motion.div>
        );

      case 'ghost':
        return (
          <motion.div
            animate={animationsEnabled ? {
              y: [0, -15, 0],
              opacity: [0.5, 1, 0.5],
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <HalloweenIcon name="ghost" size={size} className="text-ghostlyWhite" />
          </motion.div>
        );

      case 'cauldron':
        return (
          <div className="relative">
            <HalloweenIcon name="cauldron" size={size} className="text-toxicGreen" />
            {/* Bubbling effect */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-toxicGreen"
                  animate={animationsEnabled ? {
                    y: [0, -20, -40],
                    opacity: [1, 0.5, 0],
                    scale: [0.5, 1, 0.5],
                  } : {}}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: 'easeOut',
                  }}
                />
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      {renderLoader()}
      {text && (
        <motion.p
          className="text-ghostlyWhite text-lg font-medium"
          animate={animationsEnabled ? {
            opacity: [0.5, 1, 0.5],
          } : {}}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};
