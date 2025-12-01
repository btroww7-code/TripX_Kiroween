/**
 * GhostParticles Component
 * 
 * Floating ghost particles animation for Halloween atmosphere.
 * Uses Framer Motion for smooth animations and respects reduced motion preferences.
 * 
 * Requirements: 11.1, 14.1
 */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useParticleCount } from './HalloweenProvider';
import { HalloweenIcon } from './HalloweenIcons';

interface GhostParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  rotation: number;
  floatDuration: number;
  swayAmplitude: number;
  delay: number;
}

interface GhostParticlesProps {
  opacity?: number;
}

/**
 * Generate random ghost particle data
 */
const generateGhostParticles = (count: number): GhostParticle[] => {
  const particles: GhostParticle[] = [];
  
  for (let i = 0; i < count; i++) {
    particles.push({
      id: i,
      x: Math.random() * 100, // Random x position (0-100%)
      y: Math.random() * 100, // Start at random y position
      size: Math.random() * 30 + 40, // Size between 40-70px
      opacity: Math.random() * 0.4 + 0.3, // Opacity between 0.3-0.7
      rotation: Math.random() * 20 - 10, // Rotation between -10 and 10 degrees
      floatDuration: Math.random() * 10 + 15, // Duration between 15-25 seconds
      swayAmplitude: Math.random() * 30 + 20, // Sway between 20-50px
      delay: Math.random() * 5, // Stagger start times
    });
  }
  
  return particles;
};

export const GhostParticles: React.FC<GhostParticlesProps> = ({
  opacity = 0.8,
}) => {
  // Get responsive particle count from HalloweenProvider
  const particleCount = useParticleCount();
  
  // Generate particles (memoized to prevent regeneration on re-renders)
  const particles = useMemo(
    () => generateGhostParticles(particleCount),
    [particleCount]
  );

  // If no particles (reduced motion or disabled), render nothing
  if (particleCount === 0) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.x}%`,
          }}
          initial={{ 
            y: '100vh',
            opacity: 0,
            rotate: particle.rotation,
          }}
          animate={{
            y: '-10vh',
            opacity: [0, particle.opacity * opacity, particle.opacity * opacity, 0],
            x: [
              0,
              particle.swayAmplitude,
              -particle.swayAmplitude,
              0,
            ],
            rotate: [
              particle.rotation,
              particle.rotation + 10,
              particle.rotation - 10,
              particle.rotation,
            ],
          }}
          transition={{
            duration: particle.floatDuration,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.3, 0.7, 1],
            delay: particle.delay,
          }}
        >
          <HalloweenIcon 
            name="ghost" 
            size={particle.size}
            className="text-ghostlyWhite"
          />
        </motion.div>
      ))}
    </div>
  );
};
