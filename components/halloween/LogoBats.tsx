/**
 * LogoBats Component
 * 
 * Bats flying across the logo area like silhouettes against a moon.
 * Premium, subtle animation effect.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useAnimationsEnabled } from './HalloweenProvider';

export const LogoBats: React.FC = () => {
  const animationsEnabled = useAnimationsEnabled();

  if (!animationsEnabled) return null;

  const bats = [
    { id: 1, delay: 0, duration: 18, startX: 280, startY: 100, size: 12 },
    { id: 2, delay: 8, duration: 22, startX: 260, startY: 85, size: 10 },
    { id: 3, delay: 15, duration: 20, startX: 300, startY: 110, size: 14 },
  ];

  return (
    <div 
      className="fixed top-0 left-0 z-50 pointer-events-none overflow-hidden"
      style={{
        width: '350px',
        height: '180px',
      }}
    >
      {bats.map((bat) => (
        <motion.div
          key={bat.id}
          className="absolute"
          style={{
            fontSize: `${bat.size}px`,
          }}
          initial={{ x: bat.startX, y: bat.startY, opacity: 0 }}
          animate={{
            x: [bat.startX, bat.startX - 80, bat.startX - 150, bat.startX - 200, -60],
            y: [bat.startY, bat.startY - 15, bat.startY - 35, bat.startY - 60, -40],
            opacity: [0, 0.8, 1, 0.8, 0],
          }}
          transition={{
            duration: bat.duration,
            delay: bat.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <motion.span
            animate={{
              y: [0, -4, 0, 4, 0],
              rotate: [-10, -15, -8, -12, -10],
              scale: [1, 1.05, 1, 0.95, 1],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              display: 'block',
              filter: 'drop-shadow(0 0 3px rgba(0,0,0,0.6))',
              transform: 'scaleX(-1)',
            }}
          >
            🦇
          </motion.span>
        </motion.div>
      ))}
    </div>
  );
};
