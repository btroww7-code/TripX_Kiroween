/**
 * Technology Attribution Component
 * 
 * Displays "Powered by X" badges for technology attribution.
 * Used to showcase the Frankenstein chimera of technologies.
 * 
 * Requirements: 9.1, 9.2, 9.3
 */

import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { HALLOWEEN_THEME } from '../../styles/halloweenTheme';

export type TechType = 'gemini' | 'ethereum' | 'supabase' | 'mapbox' | 'google-maps' | 'rainbowkit' | 'react' | 'vite';

interface TechAttributionProps {
  technology: TechType;
  variant?: 'badge' | 'inline' | 'footer';
  showLink?: boolean;
  className?: string;
}

const techConfig: Record<TechType, { name: string; icon: string; link: string; color: string }> = {
  gemini: {
    name: 'Google Gemini 2.5 Pro',
    icon: '✨',
    link: 'https://ai.google.dev/',
    color: '#4285F4',
  },
  ethereum: {
    name: 'Ethereum Sepolia',
    icon: '⟠',
    link: 'https://ethereum.org/',
    color: '#627EEA',
  },
  supabase: {
    name: 'Supabase',
    icon: '⚡',
    link: 'https://supabase.com/',
    color: '#3ECF8E',
  },
  mapbox: {
    name: 'Mapbox GL',
    icon: '🗺️',
    link: 'https://www.mapbox.com/',
    color: '#4264FB',
  },
  'google-maps': {
    name: 'Google Maps',
    icon: '📍',
    link: 'https://developers.google.com/maps',
    color: '#4285F4',
  },
  rainbowkit: {
    name: 'RainbowKit',
    icon: '🌈',
    link: 'https://www.rainbowkit.com/',
    color: '#7B3FE4',
  },
  react: {
    name: 'React 18',
    icon: '⚛️',
    link: 'https://react.dev/',
    color: '#61DAFB',
  },
  vite: {
    name: 'Vite',
    icon: '⚡',
    link: 'https://vitejs.dev/',
    color: '#646CFF',
  },
};

export const TechAttribution: React.FC<TechAttributionProps> = ({
  technology,
  variant = 'badge',
  showLink = true,
  className = '',
}) => {
  const config = techConfig[technology];

  if (variant === 'inline') {
    return (
      <span className={`inline-flex items-center gap-1 text-xs text-slate-400 ${className}`}>
        <span>{config.icon}</span>
        <span>Powered by {config.name}</span>
        {showLink && (
          <a
            href={config.link}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-300 transition-colors"
            aria-label={`Learn more about ${config.name}`}
          >
            <ExternalLink size={10} />
          </a>
        )}
      </span>
    );
  }

  if (variant === 'footer') {
    return (
      <motion.a
        href={config.link}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors ${className}`}
        whileHover={{ scale: 1.02 }}
        aria-label={`Powered by ${config.name}`}
      >
        <span className="text-lg">{config.icon}</span>
        <span className="text-xs text-slate-400">{config.name}</span>
      </motion.a>
    );
  }

  // Default badge variant
  return (
    <motion.div
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-md border transition-all ${className}`}
      style={{
        background: `linear-gradient(135deg, ${HALLOWEEN_THEME.colors.primary.deepPurple}80, ${HALLOWEEN_THEME.colors.primary.midnightBlue}90)`,
        borderColor: `${config.color}40`,
        boxShadow: `0 0 20px ${config.color}20`,
      }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: `0 0 30px ${config.color}40`,
      }}
    >
      <span className="text-xl">{config.icon}</span>
      <div className="flex flex-col">
        <span className="text-[10px] text-slate-500 uppercase tracking-wider">Powered by</span>
        <span className="text-sm font-medium text-slate-200">{config.name}</span>
      </div>
      {showLink && (
        <a
          href={config.link}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 p-1 rounded-full hover:bg-white/10 transition-colors"
          aria-label={`Learn more about ${config.name}`}
        >
          <ExternalLink size={14} className="text-slate-400" />
        </a>
      )}
    </motion.div>
  );
};

export default TechAttribution;
