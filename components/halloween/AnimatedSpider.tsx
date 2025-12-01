/**
 * AnimatedSpider Component
 * 
 * Animated spider that descends from top of screen.
 * Uses inline SVG for reliability.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useAnimationsEnabled } from './HalloweenProvider';

const SpiderSVG: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    viewBox="0 0 64 64" 
    className={className}
    fill="currentColor"
  >
    {/* Spider body */}
    <ellipse cx="32" cy="38" rx="12" ry="14" fill="#1a1a1a" />
    <ellipse cx="32" cy="24" rx="8" ry="8" fill="#1a1a1a" />
    
    {/* Eyes */}
    <circle cx="28" cy="22" r="3" fill="#ff6b35" />
    <circle cx="36" cy="22" r="3" fill="#ff6b35" />
    <circle cx="28" cy="22" r="1.5" fill="#fff" />
    <circle cx="36" cy="22" r="1.5" fill="#fff" />
    
    {/* Legs - left side */}
    <path d="M20 30 Q10 25 4 18" stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <path d="M20 36 Q8 34 2 30" stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <path d="M20 42 Q8 44 2 50" stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <path d="M22 48 Q12 54 6 62" stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    
    {/* Legs - right side */}
    <path d="M44 30 Q54 25 60 18" stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <path d="M44 36 Q56 34 62 30" stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <path d="M44 42 Q56 44 62 50" stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <path d="M42 48 Q52 54 58 62" stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    
    {/* Fangs */}
    <path d="M29 28 L27 33" stroke="#ff6b35" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M35 28 L37 33" stroke="#ff6b35" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const AnimatedSpider: React.FC = () => {
  const animationsEnabled = useAnimationsEnabled();

  if (!animationsEnabled) return null;

  return (
    <motion.div
      className="fixed top-0 left-[15%] z-30 pointer-events-none"
      initial={{ y: -200 }}
      animate={{
        y: [-200, 150, -200],
      }}
      transition={{
        duration: 15,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {/* Spider thread */}
      <div 
        className="absolute left-1/2 -translate-x-1/2 w-[2px] h-[200px] -top-[200px]"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.3), rgba(255,255,255,0.2))',
        }}
      />
      
      {/* Spider SVG */}
      <motion.div
        className="w-14 h-14"
        style={{
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))',
        }}
        animate={{
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <SpiderSVG className="w-full h-full" />
      </motion.div>
    </motion.div>
  );
};
