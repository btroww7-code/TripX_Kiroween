/**
 * HalloweenCelebration Component
 * 
 * Celebration animations for badge unlocks, quest completions, and level ups.
 * Includes confetti burst, flying bats, pumpkin bounce, and glowing ring effects.
 * 
 * Requirements: 11.3, 11.4, 11.5
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimationsEnabled } from './HalloweenProvider';

export type CelebrationType = 'badge' | 'quest' | 'achievement' | 'levelUp';

interface HalloweenCelebrationProps {
  type: CelebrationType;
  onComplete?: () => void;
  duration?: number;
}

const CELEBRATION_EMOJIS: Record<CelebrationType, string[]> = {
  badge: ['🦇', '👻', '🕷️', '🕸️'],
  quest: ['🎃', '🦇', '👻', '🍬'],
  achievement: ['🏆', '⭐', '🎃', '🦇'],
  levelUp: ['🎉', '⭐', '🔥', '🎃'],
};

interface Particle {
  id: number;
  emoji: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  velocityX: number;
  velocityY: number;
}

const generateParticles = (type: CelebrationType, count: number = 20): Particle[] => {
  const emojis = CELEBRATION_EMOJIS[type];
  const particles: Particle[] = [];

  for (let i = 0; i < count; i++) {
    particles.push({
      id: i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      x: 50, // Start from center
      y: 50,
      rotation: Math.random() * 360,
      scale: Math.random() * 0.5 + 0.5,
      velocityX: (Math.random() - 0.5) * 100,
      velocityY: (Math.random() - 0.5) * 100 - 50, // Bias upward
    });
  }

  return particles;
};

export const HalloweenCelebration: React.FC<HalloweenCelebrationProps> = ({
  type,
  onComplete,
  duration = 3000,
}) => {
  const animationsEnabled = useAnimationsEnabled();
  const [particles] = useState(() => generateParticles(type));
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!animationsEnabled) {
      onComplete?.();
      return;
    }

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onComplete?.();
      }, 500);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete, animationsEnabled]);

  if (!animationsEnabled) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          {/* Glowing ring effect */}
          <motion.div
            className="absolute"
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 3, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          >
            <div
              className="w-32 h-32 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(255, 107, 53, 0.8) 0%, rgba(255, 149, 0, 0) 70%)',
              }}
            />
          </motion.div>

          {/* Pumpkin bounce (for quest and achievement) */}
          {(type === 'quest' || type === 'achievement') && (
            <motion.div
              className="absolute text-8xl"
              initial={{ y: 100, opacity: 0, scale: 0 }}
              animate={{
                y: [100, -20, 0, -10, 0],
                opacity: [0, 1, 1, 1, 0],
                scale: [0, 1.2, 1, 1.1, 0.8],
              }}
              transition={{
                duration: 2,
                times: [0, 0.3, 0.5, 0.7, 1],
                ease: 'easeOut',
              }}
            >
              🎃
            </motion.div>
          )}

          {/* Flying bats */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`bat-${i}`}
              className="absolute text-4xl"
              initial={{ x: -100, y: Math.random() * 200 - 100, opacity: 0 }}
              animate={{
                x: window.innerWidth + 100,
                y: Math.random() * 200 - 100,
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 2,
                delay: i * 0.3,
                ease: 'linear',
              }}
            >
              🦇
            </motion.div>
          ))}

          {/* Confetti burst */}
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute text-2xl"
              style={{
                left: '50%',
                top: '50%',
              }}
              initial={{
                x: 0,
                y: 0,
                opacity: 1,
                rotate: particle.rotation,
                scale: particle.scale,
              }}
              animate={{
                x: particle.velocityX,
                y: particle.velocityY,
                opacity: 0,
                rotate: particle.rotation + 360,
              }}
              transition={{
                duration: 1.5,
                ease: 'easeOut',
              }}
            >
              {particle.emoji}
            </motion.div>
          ))}

          {/* Level up text */}
          {type === 'levelUp' && (
            <motion.div
              className="absolute text-6xl font-bold text-pumpkinOrange"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1.2, 1],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 2,
                times: [0, 0.3, 0.7, 1],
              }}
              style={{
                textShadow: '0 0 20px rgba(255, 149, 0, 0.8)',
              }}
            >
              LEVEL UP!
            </motion.div>
          )}
        </div>
      )}
    </AnimatePresence>
  );
};
