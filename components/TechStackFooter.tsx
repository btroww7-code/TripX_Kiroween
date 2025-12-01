/**
 * Tech Stack Footer Component
 * 
 * Displays all technologies used in the Frankenstein chimera.
 * Shows the integration of AI, Blockchain, Maps, and Web technologies.
 * 
 * Requirements: 9.4
 */

import React from 'react';
import { motion } from 'framer-motion';
import { TechAttribution, TechType } from './halloween/TechAttribution';
import { HalloweenIcon } from './halloween/HalloweenIcons';
import { HALLOWEEN_THEME } from '../styles/halloweenTheme';

interface TechStackFooterProps {
  className?: string;
  compact?: boolean;
}

const techStack: { category: string; icon: string; techs: TechType[] }[] = [
  { category: 'AI', icon: '🧠', techs: ['gemini'] },
  { category: 'Blockchain', icon: '⛓️', techs: ['ethereum', 'rainbowkit'] },
  { category: 'Backend', icon: '⚡', techs: ['supabase'] },
  { category: 'Maps', icon: '🗺️', techs: ['mapbox', 'google-maps'] },
  { category: 'Frontend', icon: '⚛️', techs: ['react', 'vite'] },
];

export const TechStackFooter: React.FC<TechStackFooterProps> = ({ className = '', compact = false }) => {
  if (compact) {
    return (
      <div className={`flex flex-wrap items-center justify-center gap-3 py-4 ${className}`}>
        <span className="text-xs text-slate-500 mr-2">Powered by:</span>
        {techStack.flatMap(cat => cat.techs).slice(0, 5).map((tech) => (
          <TechAttribution key={tech} technology={tech} variant="footer" />
        ))}
      </div>
    );
  }

  return (
    <motion.footer
      className={`relative py-8 px-6 border-t border-slate-800/50 ${className}`}
      style={{
        background: `linear-gradient(180deg, transparent 0%, ${HALLOWEEN_THEME.colors.primary.deepPurple}20 100%)`,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <HalloweenIcon name="cauldron" size={24} color={HALLOWEEN_THEME.colors.accent.pumpkinOrange} />
        <h3 className="text-lg font-semibold text-slate-300">
          Frankenstein Tech Stack
        </h3>
        <HalloweenIcon name="potion" size={24} color={HALLOWEEN_THEME.colors.accent.toxicGreen} />
      </div>

      {/* Tech categories */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
        {techStack.map((category, idx) => (
          <motion.div
            key={category.category}
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <span className="text-2xl mb-1">{category.icon}</span>
            <span className="text-xs text-slate-500 uppercase tracking-wider">{category.category}</span>
            <div className="flex flex-col gap-1">
              {category.techs.map((tech) => (
                <TechAttribution key={tech} technology={tech} variant="footer" />
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Hackathon badge */}
      <div className="flex items-center justify-center mt-6 gap-2">
        <HalloweenIcon name="pumpkin" size={16} color={HALLOWEEN_THEME.colors.accent.pumpkinOrange} />
        <span className="text-xs text-slate-500">
          Built for Kiroween 2025 Hackathon • Frankenstein Category
        </span>
        <HalloweenIcon name="ghost" size={16} color={HALLOWEEN_THEME.colors.accent.ghostlyWhite} />
      </div>
    </motion.footer>
  );
};

export default TechStackFooter;
