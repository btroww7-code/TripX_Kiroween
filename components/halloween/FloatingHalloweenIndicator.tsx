/**
 * FloatingHalloweenIndicator Component
 * 
 * Premium floating pumpkin using real image assets.
 * Ultra-minimal glass container - almost invisible.
 */

import React from 'react';
import { motion } from 'framer-motion';

export const FloatingHalloweenIndicator: React.FC = () => {
  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50 pointer-events-none"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 1.5,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <motion.div
        className="relative"
        animate={{
          y: [0, -15, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Subtle ambient glow */}
        <motion.div
          className="absolute -inset-6 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(255, 172, 9, 0.15) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        
        {/* Almost invisible container */}
        <div 
          className="relative p-2"
          style={{
            background: 'rgba(255,255,255,0.005)',
            borderRadius: '50%',
          }}
        >
          {/* Real pumpkin image */}
          <motion.img
            src="/happyhalloween/pumpkin02.png"
            alt="Pumpkin"
            className="w-16 h-16 object-contain"
            style={{
              filter: 'drop-shadow(0 0 20px rgba(255, 172, 9, 0.6)) drop-shadow(0 0 40px rgba(255, 172, 9, 0.3))',
            }}
            animate={{
              rotate: [0, -3, 3, -3, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};
