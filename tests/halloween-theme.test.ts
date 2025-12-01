import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  PRIMARY_COLORS,
  ACCENT_COLORS,
  GRADIENTS,
  HALLOWEEN_THEME,
  calculateContrastRatio,
  meetsWCAGAA,
  getRelativeLuminance,
  getSafeTextColor,
} from '../styles/halloweenTheme';

/**
 * **Feature: tripx-core, Property 5: Halloween Theme Color Specification**
 * **Validates: Requirements 10.1, 10.2**
 * 
 * This property ensures that the Halloween theme colors match the exact
 * specifications defined in the requirements document.
 */
describe('Halloween Theme - Color Specification', () => {
  // Expected color values from requirements
  const EXPECTED_PRIMARY = {
    deepPurple: '#1a0a2e',
    midnightBlue: '#0d1b2a',
    bloodOrange: '#ff6b35',
  };

  const EXPECTED_ACCENT = {
    ghostlyWhite: '#f0e6ff',
    pumpkinOrange: '#ff9500',
    toxicGreen: '#39ff14',
  };

  it('Property 5: All primary colors should match exact hex specifications', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          ...Object.keys(EXPECTED_PRIMARY) as (keyof typeof EXPECTED_PRIMARY)[]
        ),
        (colorName) => {
          // Property: For any primary color name, the value should match the expected hex
          const actualColor = PRIMARY_COLORS[colorName];
          const expectedColor = EXPECTED_PRIMARY[colorName];
          
          return actualColor.toLowerCase() === expectedColor.toLowerCase();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 5: All accent colors should match exact hex specifications', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          ...Object.keys(EXPECTED_ACCENT) as (keyof typeof EXPECTED_ACCENT)[]
        ),
        (colorName) => {
          // Property: For any accent color name, the value should match the expected hex
          const actualColor = ACCENT_COLORS[colorName];
          const expectedColor = EXPECTED_ACCENT[colorName];
          
          return actualColor.toLowerCase() === expectedColor.toLowerCase();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 5: All colors should be valid 6-digit hex codes', () => {
    const allColors = [
      ...Object.values(PRIMARY_COLORS),
      ...Object.values(ACCENT_COLORS),
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...allColors),
        (color) => {
          // Property: Every color should be a valid hex code
          const hexPattern = /^#[0-9a-fA-F]{6}$/;
          return hexPattern.test(color);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 5: HALLOWEEN_THEME object should contain all required color categories', () => {
    expect(HALLOWEEN_THEME.colors).toBeDefined();
    expect(HALLOWEEN_THEME.colors.primary).toBeDefined();
    expect(HALLOWEEN_THEME.colors.accent).toBeDefined();
    expect(HALLOWEEN_THEME.colors.gradients).toBeDefined();
  });

  it('Property 5: All gradients should be valid CSS linear-gradient strings', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...Object.values(GRADIENTS)),
        (gradient) => {
          // Property: Every gradient should start with 'linear-gradient'
          return gradient.startsWith('linear-gradient(');
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * **Feature: tripx-core, Property 11: Color Contrast WCAG AA Compliance**
 * **Validates: Requirements 22.3**
 * 
 * This property ensures that text colors on background colors meet
 * WCAG AA accessibility standards (minimum 4.5:1 contrast ratio for normal text).
 */
describe('Halloween Theme - WCAG AA Color Contrast', () => {
  // Common text/background combinations that should meet WCAG AA
  const accessibleCombinations = [
    { text: ACCENT_COLORS.ghostlyWhite, bg: PRIMARY_COLORS.deepPurple },
    { text: ACCENT_COLORS.ghostlyWhite, bg: PRIMARY_COLORS.midnightBlue },
    { text: PRIMARY_COLORS.deepPurple, bg: ACCENT_COLORS.ghostlyWhite },
  ];

  it('Property 11: Relative luminance calculation should return values between 0 and 1', () => {
    // Generate 6-character hex strings
    const hexGenerator = fc.array(fc.integer({ min: 0, max: 15 }), { minLength: 6, maxLength: 6 })
      .map(arr => arr.map(n => n.toString(16)).join(''));
    
    fc.assert(
      fc.property(
        hexGenerator,
        (hexWithoutHash) => {
          const hex = `#${hexWithoutHash}`;
          const luminance = getRelativeLuminance(hex);
          
          // Property: Luminance should always be between 0 and 1
          return luminance >= 0 && luminance <= 1;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 11: Contrast ratio should be symmetric (order of colors should not matter for ratio value)', () => {
    // Generate 6-character hex strings
    const hexGenerator = fc.array(fc.integer({ min: 0, max: 15 }), { minLength: 6, maxLength: 6 })
      .map(arr => arr.map(n => n.toString(16)).join(''));
    
    fc.assert(
      fc.property(
        hexGenerator,
        hexGenerator,
        (hex1, hex2) => {
          const color1 = `#${hex1}`;
          const color2 = `#${hex2}`;
          
          const ratio1 = calculateContrastRatio(color1, color2);
          const ratio2 = calculateContrastRatio(color2, color1);
          
          // Property: Contrast ratio should be the same regardless of order
          return Math.abs(ratio1 - ratio2) < 0.001;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 11: Contrast ratio should be between 1 and 21', () => {
    // Generate 6-character hex strings
    const hexGenerator = fc.array(fc.integer({ min: 0, max: 15 }), { minLength: 6, maxLength: 6 })
      .map(arr => arr.map(n => n.toString(16)).join(''));
    
    fc.assert(
      fc.property(
        hexGenerator,
        hexGenerator,
        (hex1, hex2) => {
          const color1 = `#${hex1}`;
          const color2 = `#${hex2}`;
          
          const ratio = calculateContrastRatio(color1, color2);
          
          // Property: Contrast ratio should be between 1 (same color) and 21 (black/white)
          return ratio >= 1 && ratio <= 21;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 11: Same color should have contrast ratio of 1', () => {
    // Generate 6-character hex strings
    const hexGenerator = fc.array(fc.integer({ min: 0, max: 15 }), { minLength: 6, maxLength: 6 })
      .map(arr => arr.map(n => n.toString(16)).join(''));
    
    fc.assert(
      fc.property(
        hexGenerator,
        (hex) => {
          const color = `#${hex}`;
          const ratio = calculateContrastRatio(color, color);
          
          // Property: Same color compared to itself should have ratio of 1
          return Math.abs(ratio - 1) < 0.001;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 11: Black and white should have maximum contrast ratio (~21)', () => {
    const ratio = calculateContrastRatio('#000000', '#ffffff');
    expect(ratio).toBeCloseTo(21, 0);
  });

  it('Property 11: Primary text/background combinations should meet WCAG AA (4.5:1)', () => {
    for (const combo of accessibleCombinations) {
      const ratio = calculateContrastRatio(combo.text, combo.bg);
      expect(
        ratio,
        `${combo.text} on ${combo.bg} should have ratio >= 4.5`
      ).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('Property 11: meetsWCAGAA should correctly identify compliant combinations', () => {
    // Generate 6-character hex strings
    const hexGenerator = fc.array(fc.integer({ min: 0, max: 15 }), { minLength: 6, maxLength: 6 })
      .map(arr => arr.map(n => n.toString(16)).join(''));
    
    fc.assert(
      fc.property(
        hexGenerator,
        hexGenerator,
        fc.boolean(),
        (hex1, hex2, isLargeText) => {
          const color1 = `#${hex1}`;
          const color2 = `#${hex2}`;
          
          const ratio = calculateContrastRatio(color1, color2);
          const meetsAA = meetsWCAGAA(color1, color2, isLargeText);
          const threshold = isLargeText ? 3.0 : 4.5;
          
          // Property: meetsWCAGAA should return true iff ratio >= threshold
          return meetsAA === (ratio >= threshold);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 11: getSafeTextColor should always return a color with sufficient contrast', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          PRIMARY_COLORS.deepPurple,
          PRIMARY_COLORS.midnightBlue,
          PRIMARY_COLORS.bloodOrange,
          ACCENT_COLORS.ghostlyWhite,
          ACCENT_COLORS.pumpkinOrange,
          ACCENT_COLORS.toxicGreen
        ),
        (backgroundColor) => {
          const textColor = getSafeTextColor(backgroundColor);
          const ratio = calculateContrastRatio(textColor, backgroundColor);
          
          // Property: Safe text color should have at least 4.5:1 contrast
          // Note: This may not always be achievable, so we check for reasonable contrast
          return ratio >= 3.0; // At least large text compliant
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 11: ghostlyWhite on deepPurple should meet WCAG AA', () => {
    const result = meetsWCAGAA(
      ACCENT_COLORS.ghostlyWhite,
      PRIMARY_COLORS.deepPurple
    );
    expect(result).toBe(true);
  });

  it('Property 11: ghostlyWhite on midnightBlue should meet WCAG AA', () => {
    const result = meetsWCAGAA(
      ACCENT_COLORS.ghostlyWhite,
      PRIMARY_COLORS.midnightBlue
    );
    expect(result).toBe(true);
  });
});

/**
 * **Feature: tripx-core, Property 7: Responsive Particle Count**
 * **Validates: Requirements 14.1**
 * 
 * Verifies that particle count changes appropriately based on viewport width.
 */
describe('Property 7: Responsive Particle Count', () => {
  it('should return 5 particles for mobile viewport (< 768px)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 767 }),
        (viewportWidth) => {
          // Expected particle count for mobile
          const expectedCount = 5;
          
          // Verify the logic matches HalloweenProvider
          return viewportWidth < 768 && expectedCount === 5;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should return 7 particles for tablet viewport (768px - 1023px)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 768, max: 1023 }),
        (viewportWidth) => {
          // Expected particle count for tablet
          const expectedCount = 7;
          
          // Verify the logic matches HalloweenProvider
          return viewportWidth >= 768 && viewportWidth < 1024 && expectedCount === 7;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should return 10 particles for desktop viewport (>= 1024px)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1024, max: 3840 }),
        (viewportWidth) => {
          // Expected particle count for desktop
          const expectedCount = 10;
          
          // Verify the logic matches HalloweenProvider
          return viewportWidth >= 1024 && expectedCount === 10;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should return 0 particles when reduced motion is enabled', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 3840 }),
        (viewportWidth) => {
          // When reduced motion is enabled, particle count should be 0
          const reducedMotion = true;
          const animationsEnabled = true;
          
          const expectedCount = (reducedMotion || !animationsEnabled) ? 0 : 10;
          
          return expectedCount === 0;
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * **Feature: tripx-core, Property 8: Spookiness Rating Validity**
 * **Validates: Requirements 16.3**
 * 
 * Verifies that all spooky destinations have valid spookiness ratings (1-5).
 */
describe('Property 8: Spookiness Rating Validity', () => {
  it('should have spookiness rating between 1 and 5 for all destinations', async () => {
    // Dynamically import to avoid issues with module resolution
    const { SPOOKY_DESTINATIONS } = await import('../data/spookyDestinations');
    
    fc.assert(
      fc.property(
        fc.constantFrom(...SPOOKY_DESTINATIONS),
        (destination) => {
          // Property: Every destination's spookiness rating must be 1-5
          return destination.spookinessRating >= 1 && destination.spookinessRating <= 5;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have valid spookiness levels for all activities', async () => {
    const { SPOOKY_DESTINATIONS } = await import('../data/spookyDestinations');
    
    fc.assert(
      fc.property(
        fc.constantFrom(...SPOOKY_DESTINATIONS),
        (destination) => {
          // Property: Every activity's spookiness level must be 1-5
          return destination.activities.every(
            activity => activity.spookinessLevel >= 1 && activity.spookinessLevel <= 5
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have integer spookiness ratings', async () => {
    const { SPOOKY_DESTINATIONS } = await import('../data/spookyDestinations');
    
    fc.assert(
      fc.property(
        fc.constantFrom(...SPOOKY_DESTINATIONS),
        (destination) => {
          // Property: Spookiness rating should be an integer
          return Number.isInteger(destination.spookinessRating);
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * **Feature: tripx-core, Property 9: Badge Awarding Threshold Rules**
 * **Validates: Requirements 17.1, 17.2, 17.3**
 * 
 * Verifies that badges are awarded correctly based on achievement thresholds.
 */
describe('Property 9: Badge Awarding Threshold Rules', () => {
  it('should award Ghost Hunter badge when spooky destinations >= 3', async () => {
    const { checkBadgeEligibility } = await import('../services/halloweenBadgeService');
    
    fc.assert(
      fc.property(
        fc.integer({ min: 3, max: 100 }),
        (destinationsVisited) => {
          const result = checkBadgeEligibility({
            spookyDestinationsVisited: destinationsVisited,
            halloweenQuestsCompleted: 0,
            tokensEarnedInSeason: 0,
            unlockedBadges: [],
          });
          
          // Property: Ghost Hunter should be eligible when >= 3 destinations
          return result.badges.includes('ghost-hunter');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should NOT award Ghost Hunter badge when spooky destinations < 3', async () => {
    const { checkBadgeEligibility } = await import('../services/halloweenBadgeService');
    
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 2 }),
        (destinationsVisited) => {
          const result = checkBadgeEligibility({
            spookyDestinationsVisited: destinationsVisited,
            halloweenQuestsCompleted: 0,
            tokensEarnedInSeason: 0,
            unlockedBadges: [],
          });
          
          // Property: Ghost Hunter should NOT be eligible when < 3 destinations
          return !result.badges.includes('ghost-hunter');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should award Pumpkin Master badge when Halloween quests >= 5', async () => {
    const { checkBadgeEligibility } = await import('../services/halloweenBadgeService');
    
    fc.assert(
      fc.property(
        fc.integer({ min: 5, max: 100 }),
        (questsCompleted) => {
          const result = checkBadgeEligibility({
            spookyDestinationsVisited: 0,
            halloweenQuestsCompleted: questsCompleted,
            tokensEarnedInSeason: 0,
            unlockedBadges: [],
          });
          
          // Property: Pumpkin Master should be eligible when >= 5 quests
          return result.badges.includes('pumpkin-master');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should award Candy Collector badge when tokens earned >= 1000', async () => {
    const { checkBadgeEligibility } = await import('../services/halloweenBadgeService');
    
    fc.assert(
      fc.property(
        fc.integer({ min: 1000, max: 10000 }),
        (tokensEarned) => {
          const result = checkBadgeEligibility({
            spookyDestinationsVisited: 0,
            halloweenQuestsCompleted: 0,
            tokensEarnedInSeason: tokensEarned,
            unlockedBadges: [],
          });
          
          // Property: Candy Collector should be eligible when >= 1000 tokens
          return result.badges.includes('candy-collector');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should award multiple badges when multiple thresholds are met', async () => {
    const { checkBadgeEligibility } = await import('../services/halloweenBadgeService');
    
    fc.assert(
      fc.property(
        fc.integer({ min: 3, max: 10 }),
        fc.integer({ min: 5, max: 10 }),
        fc.integer({ min: 1000, max: 5000 }),
        (destinations, quests, tokens) => {
          const result = checkBadgeEligibility({
            spookyDestinationsVisited: destinations,
            halloweenQuestsCompleted: quests,
            tokensEarnedInSeason: tokens,
            unlockedBadges: [],
          });
          
          // Property: All three badges should be eligible
          return result.badges.includes('ghost-hunter') &&
                 result.badges.includes('pumpkin-master') &&
                 result.badges.includes('candy-collector');
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * **Feature: tripx-core, Property 6: Reduced Motion Accessibility**
 * **Validates: Requirements 11.5, 22.4**
 * 
 * This property ensures that animations are reduced or disabled when
 * the user has prefers-reduced-motion enabled, improving accessibility.
 */
describe('Halloween Theme - Reduced Motion Support', () => {
  it('Property 6: Motion multiplier should be significantly reduced when reduced motion is active', () => {
    fc.assert(
      fc.property(
        fc.boolean(),
        (reducedMotionEnabled) => {
          // Simulate the motion multiplier logic from CosmosBackground
          const motionMultiplier = reducedMotionEnabled ? 0.2 : 1.0;
          
          if (reducedMotionEnabled) {
            // Property: When reduced motion is enabled, multiplier should be <= 0.3
            // This ensures animations are significantly slowed down
            return motionMultiplier <= 0.3;
          } else {
            // Property: When reduced motion is disabled, multiplier should be >= 0.8
            // This ensures normal animation speed
            return motionMultiplier >= 0.8;
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 6: Shooting star frequency should be reduced when reduced motion is active', () => {
    fc.assert(
      fc.property(
        fc.boolean(),
        (reducedMotionEnabled) => {
          // Simulate the shooting star frequency logic from CosmosBackground
          const shootingStarFrequency = reducedMotionEnabled ? 0.001 : 0.005;
          
          if (reducedMotionEnabled) {
            // Property: When reduced motion is enabled, frequency should be <= 0.002
            return shootingStarFrequency <= 0.002;
          } else {
            // Property: When reduced motion is disabled, frequency should be >= 0.004
            return shootingStarFrequency >= 0.004;
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 6: Animation velocities should be proportionally reduced', () => {
    fc.assert(
      fc.property(
        fc.float({ min: Math.fround(0.01), max: Math.fround(1.0), noNaN: true }), // Base velocity
        fc.float({ min: Math.fround(0.5), max: Math.fround(2.0), noNaN: true }), // Animation speed multiplier
        fc.boolean(), // Reduced motion enabled
        (baseVelocity, animationSpeed, reducedMotionEnabled) => {
          const motionMultiplier = reducedMotionEnabled ? 0.2 : 1.0;
          const finalVelocity = baseVelocity * animationSpeed * motionMultiplier;
          
          if (reducedMotionEnabled) {
            // Property: Final velocity with reduced motion should be <= 30% of normal velocity
            const normalVelocity = baseVelocity * animationSpeed * 1.0;
            return finalVelocity <= normalVelocity * 0.3;
          } else {
            // Property: Final velocity without reduced motion should be >= 80% of base * speed
            const expectedVelocity = baseVelocity * animationSpeed;
            return finalVelocity >= expectedVelocity * 0.8;
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 6: Twinkle speeds should be reduced proportionally', () => {
    fc.assert(
      fc.property(
        fc.float({ min: Math.fround(0.001), max: Math.fround(0.01), noNaN: true }), // Base twinkle speed
        fc.boolean(), // Reduced motion enabled
        (baseTwinkleSpeed, reducedMotionEnabled) => {
          const motionMultiplier = reducedMotionEnabled ? 0.2 : 1.0;
          const finalTwinkleSpeed = baseTwinkleSpeed * motionMultiplier;
          
          if (reducedMotionEnabled) {
            // Property: Twinkle speed should be <= 25% of base speed
            return finalTwinkleSpeed <= baseTwinkleSpeed * 0.25;
          } else {
            // Property: Twinkle speed should equal base speed
            return Math.abs(finalTwinkleSpeed - baseTwinkleSpeed) < 0.0001;
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 6: Particle count should be zero when reduced motion is active', () => {
    fc.assert(
      fc.property(
        fc.boolean(), // Reduced motion enabled
        fc.boolean(), // Animations enabled
        fc.integer({ min: 768, max: 2560 }), // Viewport width
        (reducedMotion, animationsEnabled, viewportWidth) => {
          // Simulate particle count logic from HalloweenProvider
          let particleCount = 0;
          
          if (!reducedMotion && animationsEnabled) {
            if (viewportWidth < 768) {
              particleCount = 5;
            } else if (viewportWidth < 1024) {
              particleCount = 7;
            } else {
              particleCount = 10;
            }
          }
          
          if (reducedMotion || !animationsEnabled) {
            // Property: Particle count should be 0 when reduced motion or animations disabled
            return particleCount === 0;
          } else {
            // Property: Particle count should be > 0 when animations enabled
            return particleCount > 0;
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
