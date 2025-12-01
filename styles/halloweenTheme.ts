/**
 * Halloween Theme Configuration for TripX Kiroween Adaptation
 * 
 * This file defines the complete Halloween color palette, gradients,
 * and utility functions for the themed UI.
 * 
 * Requirements: 10.1, 10.2, 10.3, 22.3
 */

// Primary Colors (backgrounds, main UI)
export const PRIMARY_COLORS = {
  deepPurple: '#1a0a2e',
  midnightBlue: '#0d1b2a',
  bloodOrange: '#ff6b35',
} as const;

// Accent Colors (text, icons, effects)
export const ACCENT_COLORS = {
  ghostlyWhite: '#f0e6ff',
  pumpkinOrange: '#ff9500',
  toxicGreen: '#39ff14',
} as const;

// Gradients
export const GRADIENTS = {
  spookyNight: 'linear-gradient(135deg, #1a0a2e 0%, #0d1b2a 50%, #1a0a2e 100%)',
  hauntedGlow: 'linear-gradient(180deg, #ff6b35 0%, #ff9500 100%)',
  mysticalPurple: 'linear-gradient(45deg, #1a0a2e 0%, #f0e6ff 100%)',
  toxicShimmer: 'linear-gradient(90deg, #39ff14 0%, #ff9500 50%, #39ff14 100%)',
} as const;

// Complete Halloween Theme Object
export const HALLOWEEN_THEME = {
  colors: {
    primary: PRIMARY_COLORS,
    accent: ACCENT_COLORS,
    gradients: GRADIENTS,
  },
} as const;

/**
 * Calculate relative luminance of a color (WCAG formula)
 * Used for contrast ratio calculations
 */
export function getRelativeLuminance(hexColor: string): number {
  // Remove # if present
  const hex = hexColor.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  
  // Apply gamma correction
  const rsRGB = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const gsRGB = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const bsRGB = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
  
  // Calculate luminance
  return 0.2126 * rsRGB + 0.7152 * gsRGB + 0.0722 * bsRGB;
}

/**
 * Calculate contrast ratio between two colors (WCAG formula)
 * Returns a ratio between 1 and 21
 * 
 * WCAG AA Requirements:
 * - Normal text: minimum 4.5:1
 * - Large text (18pt+): minimum 3:1
 */
export function calculateContrastRatio(color1: string, color2: string): number {
  const lum1 = getRelativeLuminance(color1);
  const lum2 = getRelativeLuminance(color2);
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if a color combination meets WCAG AA standards
 */
export function meetsWCAGAA(
  textColor: string,
  backgroundColor: string,
  isLargeText: boolean = false
): boolean {
  const ratio = calculateContrastRatio(textColor, backgroundColor);
  const minimumRatio = isLargeText ? 3.0 : 4.5;
  return ratio >= minimumRatio;
}

/**
 * Get a safe text color for a given background
 * Returns either ghostlyWhite or a darker color based on contrast
 */
export function getSafeTextColor(backgroundColor: string): string {
  const contrastWithWhite = calculateContrastRatio(ACCENT_COLORS.ghostlyWhite, backgroundColor);
  
  if (contrastWithWhite >= 4.5) {
    return ACCENT_COLORS.ghostlyWhite;
  }
  
  // If white doesn't work, try a darker color
  return PRIMARY_COLORS.deepPurple;
}

// Export type for theme
export type HalloweenTheme = typeof HALLOWEEN_THEME;
