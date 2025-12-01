/**
 * TechStackOrbs Component
 * 
 * Floating orbs representing the Frankenstein tech stack
 * Shows AI, Blockchain, Maps integration visually
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useAnimationsEnabled } from './HalloweenProvider';

export const TechStackOrbs: React.FC = () => {
  const animationsEnabled = useAnimationsEnabled();

  if (!animationsEnabled) return null;

  const orbs = [
    { icon: '🎃', label: 'Theme', color: 'rgba(255, 149, 0, 0.15)', x: '8%', y: '15%' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
      {orbs.map((orb, index) => (
        <motion.div
          key={orb.label}
          className="absolute"
          style={{
            left: orb.x,
            top: orb.y,
          }}
          animate={{
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 4 + index,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: index * 0.5,
          }}
        >
          <div
            className="relative w-20 h-20 rounded-full flex items-center justify-center"
            style={{
              background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
              backdropFilter: 'blur(20px)',
              border: `1px solid ${orb.color.replace('0.3', '0.5')}`,
              boxShadow: `0 0 40px ${orb.color}`,
            }}
          >
            <span className="text-3xl">{orb.icon}</span>
          </div>
        </motion.div>
      ))}
      

    </div>
  );
};
