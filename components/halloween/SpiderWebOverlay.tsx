/**
 * SpiderWebOverlay Component
 * 
 * Subtle spider web overlay using real image asset.
 * Creates atmospheric Halloween effect.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useAnimationsEnabled } from './HalloweenProvider';

export const SpiderWebOverlay: React.FC = () => {
  const animationsEnabled = useAnimationsEnabled();

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-40"
      initial={{ opacity: 0 }}
      animate={{ opacity: animationsEnabled ? 1 : 0 }}
      transition={{ duration: 2 }}
    >
      <img
        src="/happyhalloween/spiderWeb.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          mixBlendMode: 'screen',
          opacity: 0.15,
        }}
      />
    </motion.div>
  );
};
