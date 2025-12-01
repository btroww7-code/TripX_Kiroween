/**
 * Halloween Theme Provider
 * 
 * Provides Halloween theme context, animation settings, and reduced motion support
 * throughout the application.
 * 
 * Requirements: 11.5, 22.4
 */

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { HALLOWEEN_THEME, HalloweenTheme } from '../../styles/halloweenTheme';

interface AnimationSettings {
  enabled: boolean;
  particleCount: number;
  reducedMotion: boolean;
}

interface HalloweenContextValue {
  theme: HalloweenTheme;
  animations: AnimationSettings;
  setAnimationsEnabled: (enabled: boolean) => void;
}

const HalloweenContext = createContext<HalloweenContextValue | undefined>(undefined);

interface HalloweenProviderProps {
  children: React.ReactNode;
}

export const HalloweenProvider: React.FC<HalloweenProviderProps> = ({ children }) => {
  // Check for user's reduced motion preference
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [animationsEnabled, setAnimationsEnabled] = useState<boolean>(true);

  // Detect viewport size for responsive particle count
  const [viewportWidth, setViewportWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1920
  );

  // Listen for reduced motion preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setReducedMotion(e.matches);
    };

    // Set initial value
    handleChange(mediaQuery);

    // Listen for changes
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  // Listen for viewport size changes
  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Calculate particle count based on viewport size
  const particleCount = useMemo(() => {
    if (reducedMotion || !animationsEnabled) {
      return 0;
    }

    // Mobile: < 768px -> 5 particles
    if (viewportWidth < 768) {
      return 5;
    }
    
    // Tablet: 768px - 1024px -> 7 particles
    if (viewportWidth < 1024) {
      return 7;
    }
    
    // Desktop: > 1024px -> 10 particles
    return 10;
  }, [viewportWidth, reducedMotion, animationsEnabled]);

  const contextValue: HalloweenContextValue = useMemo(
    () => ({
      theme: HALLOWEEN_THEME,
      animations: {
        enabled: animationsEnabled && !reducedMotion,
        particleCount,
        reducedMotion,
      },
      setAnimationsEnabled,
    }),
    [animationsEnabled, particleCount, reducedMotion]
  );

  return (
    <HalloweenContext.Provider value={contextValue}>
      {children}
    </HalloweenContext.Provider>
  );
};

/**
 * Hook to access Halloween theme context
 * 
 * @throws Error if used outside HalloweenProvider
 */
export const useHalloweenTheme = (): HalloweenContextValue => {
  const context = useContext(HalloweenContext);
  
  if (context === undefined) {
    throw new Error('useHalloweenTheme must be used within a HalloweenProvider');
  }
  
  return context;
};

/**
 * Hook to check if animations should be enabled
 * Respects both user preference and reduced motion settings
 */
export const useAnimationsEnabled = (): boolean => {
  const { animations } = useHalloweenTheme();
  return animations.enabled;
};

/**
 * Hook to get the appropriate particle count for current viewport
 */
export const useParticleCount = (): number => {
  const { animations } = useHalloweenTheme();
  return animations.particleCount;
};
