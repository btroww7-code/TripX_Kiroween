/**
 * FrankensteinButton Component
 * 
 * Premium dark elegant button with subtle horror aesthetic.
 * Clean, minimal design with sophisticated glow effects.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface FrankensteinButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const FrankensteinButton: React.FC<FrankensteinButtonProps> = ({
  children,
  onClick,
  className = '',
}) => {
  return (
    <motion.button
      onClick={onClick}
      className={`relative group ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      {/* Outer glow on hover */}
      <motion.div
        className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(255,107,53,0.6) 0%, rgba(255,149,0,0.4) 50%, rgba(255,107,53,0.6) 100%)',
          filter: 'blur(8px)',
        }}
      />

      {/* Main button */}
      <div
        className="relative px-8 py-4 rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(255,107,53,0.9) 0%, rgba(255,80,20,0.95) 100%)',
          boxShadow: '0 4px 20px rgba(255,107,53,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
        }}
      >
        {/* Subtle inner highlight */}
        <div 
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 50%)',
          }}
        />

        {/* Animated shimmer on hover */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex items-center justify-center gap-3">
          <span className="text-base font-semibold text-white tracking-wide">
            {children}
          </span>
          <motion.div
            className="group-hover:translate-x-1 transition-transform duration-300"
          >
            <ArrowRight className="w-5 h-5 text-white/90" />
          </motion.div>
        </div>
      </div>
    </motion.button>
  );
};

export default FrankensteinButton;
