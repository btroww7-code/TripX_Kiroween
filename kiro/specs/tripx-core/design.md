# Design Document: TripX Core

## Overview

TripX is a Halloween-themed travel planning application that combines AI, blockchain, maps, and gamification into a seamless user experience. The architecture follows a frontend-only pattern with Supabase providing backend services.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Vite)                       │
├─────────────────────────────────────────────────────────────────┤
│  Components/        │  Services/         │  Hooks/              │
│  - halloween/       │  - aiTripService   │  - useWallet         │
│  - pages/           │  - web3Service     │  - useNFTPassport    │
│  - layout/          │  - questService    │  - useHalloween      │
└────────┬────────────────────┬────────────────────┬──────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SUPABASE (Backend-as-a-Service)               │
├─────────────────────────────────────────────────────────────────┤
│  PostgreSQL DB      │  Edge Functions    │  Auth     │  Storage │
│  - users            │  - generate-trip   │  - Email  │  - NFT   │
│  - trips            │  - ai-quest        │  - Wallet │  metadata│
│  - quests           │                    │           │          │
└────────┬────────────────────┬────────────────────────────────────┘
         │                    │
         ▼                    ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  Google Gemini  │ │  Ethereum       │ │  Google Maps    │
│  2.5 Pro AI     │ │  Sepolia        │ │  + Mapbox GL    │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

## Halloween Theme Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    HALLOWEEN THEME LAYER                         │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Color System │  │ Icon System  │  │ Animation    │          │
│  │              │  │              │  │ System       │          │
│  │ - Primary    │  │ - 13 icons   │  │ - Particles  │          │
│  │ - Accent     │  │ - Navigation │  │ - Hover      │          │
│  │ - Gradients  │  │ - Badges     │  │ - Celebrate  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    HalloweenProvider                      │  │
│  │  - Theme context                                          │  │
│  │  - Animation settings                                     │  │
│  │  - Reduced motion support                                 │  │
│  │  - Responsive particle count                              │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### Halloween Theme

```typescript
// styles/halloweenTheme.ts
export const HALLOWEEN_THEME = {
  colors: {
    primary: {
      deepPurple: '#1a0a2e',
      midnightBlue: '#0d1b2a',
      bloodOrange: '#ff6b35',
    },
    accent: {
      ghostlyWhite: '#f0e6ff',
      pumpkinOrange: '#ff9500',
      toxicGreen: '#39ff14',
    },
    gradients: {
      spookyNight: 'linear-gradient(135deg, #1a0a2e 0%, #0d1b2a 50%, #1a0a2e 100%)',
      hauntedGlow: 'linear-gradient(180deg, #ff6b35 0%, #ff9500 100%)',
    }
  }
};
```

### HalloweenProvider

```typescript
// components/halloween/HalloweenProvider.tsx
interface HalloweenContextValue {
  animationsEnabled: boolean;
  setAnimationsEnabled: (enabled: boolean) => void;
  particleCount: number;
  prefersReducedMotion: boolean;
}

export const HalloweenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const prefersReducedMotion = useReducedMotion();
  const particleCount = useParticleCount(); // 10 desktop, 7 tablet, 5 mobile
  
  return (
    <HalloweenContext.Provider value={{ ... }}>
      {children}
    </HalloweenContext.Provider>
  );
};
```

### Halloween Icons

```typescript
// components/halloween/HalloweenIcons.tsx
type HalloweenIconName = 
  | 'ghost' | 'cauldron' | 'hauntedCastle' | 'skull'
  | 'witchBroom' | 'ghostTrain' | 'vampireBat'
  | 'pumpkin' | 'potion' | 'spellBook' | 'crystalBall'
  | 'cobweb' | 'candyCorn';

interface HalloweenIconProps {
  name: HalloweenIconName;
  size?: number;
  color?: string;
  className?: string;
}
```

### Spooky Destinations

```typescript
// types/halloween.ts
interface SpookyDestination {
  id: string;
  name: string;
  location: string;
  country: string;
  coordinates: { lat: number; lng: number };
  spookinessRating: 1 | 2 | 3 | 4 | 5;
  description: string;
  activities: SpookyActivity[];
  bestTimeToVisit: string;
  imageUrl: string;
  tags: string[];
}

interface SpookyActivity {
  name: string;
  type: 'ghostTour' | 'hauntedHouse' | 'cemeteryVisit' | 'darkHistoryTour';
  duration: string;
  price: number;
  description: string;
}
```

### Halloween Badges

```typescript
// types/halloween.ts
interface HalloweenBadge {
  id: string;
  name: string;
  description: string;
  icon: HalloweenIconName;
  requirement: {
    type: 'spookyDestinations' | 'halloweenQuests' | 'tpxEarned' | 'special';
    threshold: number;
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: string;
}
```

## Data Models

### Storage Strategy

- **Spooky Destinations**: Static data in `data/spookyDestinations.ts`
- **Halloween Badges**: localStorage + Supabase achievements table
- **User Progress**: localStorage with Supabase sync

```typescript
// services/halloweenStorageService.ts
const STORAGE_KEYS = {
  VISITED_SPOOKY: 'tripx_visited_spooky_destinations',
  HALLOWEEN_BADGES: 'tripx_halloween_badges',
  HALLOWEEN_PROGRESS: 'tripx_halloween_progress'
};

export const halloweenStorage = {
  getVisitedDestinations: (): string[] => {
    const data = localStorage.getItem(STORAGE_KEYS.VISITED_SPOOKY);
    return data ? JSON.parse(data) : [];
  },
  
  addVisitedDestination: (destinationId: string) => {
    const visited = halloweenStorage.getVisitedDestinations();
    if (!visited.includes(destinationId)) {
      visited.push(destinationId);
      localStorage.setItem(STORAGE_KEYS.VISITED_SPOOKY, JSON.stringify(visited));
    }
  }
};
```

## Correctness Properties

### Property 1: Gitignore Does Not Ignore Kiro Directory

For any .gitignore file in the repository, the .kiro directory should not be ignored.

**Validates: Requirement 1.5**

### Property 2: Spec Folder Structure Completeness

For any spec folder, it should contain requirements.md, design.md, and tasks.md files.

**Validates: Requirement 1.2, 1.3, 1.4**

### Property 5: Halloween Theme Color Specification

For any Halloween theme color, it should match the specified hex values.

**Validates: Requirement 3.1, 3.2**

### Property 6: Reduced Motion Accessibility

When prefers-reduced-motion is enabled, animations should be disabled or reduced.

**Validates: Requirement 4.4, 15.4**

### Property 7: Responsive Particle Count

Particle count should adapt to viewport: 10 desktop, 7 tablet, 5 mobile.

**Validates: Requirement 4.1**

### Property 8: Spookiness Rating Validity

All spooky destinations should have spookinessRating between 1 and 5.

**Validates: Requirement 8.2**

### Property 9: Badge Awarding Threshold Rules

Badges should be awarded when user meets threshold requirements.

**Validates: Requirement 9.1, 9.2, 9.3**

### Property 10: Error Message User-Friendliness

Error messages should not contain stack traces, file paths, or technical details.

**Validates: Requirement 14.3**

### Property 11: Color Contrast WCAG AA Compliance

Text colors should maintain minimum 4.5:1 contrast ratio against backgrounds.

**Validates: Requirement 15.3**

## Error Handling

```typescript
// lib/errorMessages.ts
export function getUserFriendlyMessage(error: Error): string {
  const message = error.message.toLowerCase();
  
  if (message.includes('network') || message.includes('fetch')) {
    return 'Connection issue. Please check your internet and try again.';
  }
  if (message.includes('wallet') || message.includes('metamask')) {
    return 'Wallet connection failed. Please try reconnecting.';
  }
  if (message.includes('api') || message.includes('500')) {
    return 'Service temporarily unavailable. Please try again later.';
  }
  
  return 'Something went wrong. Please try again.';
}
```

## Testing Strategy

### Unit Tests
- Halloween theme color values
- Icon rendering
- Badge eligibility logic

### Property-Based Tests (fast-check)
- Properties 1, 2, 5, 6, 7, 8, 9, 10, 11
- Minimum 100 iterations per property

### Integration Tests
- HalloweenProvider context
- Spooky destinations service
- Badge unlock flow
