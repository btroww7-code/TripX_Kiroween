# Design Document

## Overview

The Halloween Badges system implements a gamification layer that rewards users for their activities within TripX. The system tracks user progress, calculates badge eligibility based on defined thresholds, and persists badge data in localStorage with Supabase sync for authenticated users.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Badge Components                          │
│         (HalloweenBadge, HalloweenBadgesPanel)              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  halloweenBadgeService                       │
│              (Eligibility, Award, Progress)                  │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│  localStorage │    │   Supabase    │    │  Badge Data   │
│   (offline)   │    │   (sync)      │    │  (static)     │
└───────────────┘    └───────────────┘    └───────────────┘
```

## Components and Interfaces

### HalloweenBadge

```typescript
interface HalloweenBadgeProps {
  badge: Badge;
  isEarned: boolean;
  progress?: number;
  onClick?: () => void;
}
```

### HalloweenBadgesPanel

```typescript
interface HalloweenBadgesPanelProps {
  userId?: string;
  className?: string;
}
```

### Badge Service

```typescript
interface BadgeService {
  checkEligibility(userStats: UserStats): Badge[];
  awardBadge(userId: string, badgeId: string): Promise<void>;
  getUserBadges(userId: string): Promise<EarnedBadge[]>;
  getBadgeProgress(userId: string, badgeId: string): number;
}
```

## Data Models

### Badge

```typescript
interface Badge {
  id: string;
  name: string;
  description: string;
  icon: HalloweenIconName;
  category: 'destination' | 'quest' | 'seasonal' | 'special';
  threshold: number;
  thresholdType: 'destinations_visited' | 'quests_completed' | 'trips_created';
}
```

### EarnedBadge

```typescript
interface EarnedBadge {
  badgeId: string;
  earnedAt: string;
  userId: string;
}
```

### UserStats

```typescript
interface UserStats {
  spookyDestinationsVisited: number;
  halloweenQuestsCompleted: number;
  tripsCreated: number;
}
```

### Badge Definitions

```typescript
const HALLOWEEN_BADGES: Badge[] = [
  // Destination badges
  { id: 'ghost-hunter', name: 'Ghost Hunter', threshold: 3, thresholdType: 'destinations_visited' },
  { id: 'paranormal-investigator', name: 'Paranormal Investigator', threshold: 5, thresholdType: 'destinations_visited' },
  { id: 'master-darkness', name: 'Master of Darkness', threshold: 10, thresholdType: 'destinations_visited' },
  
  // Quest badges
  { id: 'first-scare', name: 'First Scare', threshold: 1, thresholdType: 'quests_completed' },
  { id: 'witchs-apprentice', name: "Witch's Apprentice", threshold: 5, thresholdType: 'quests_completed' },
  { id: 'vampire-voyager', name: 'Vampire Voyager', threshold: 10, thresholdType: 'quests_completed' },
  
  // Seasonal badges
  { id: 'pumpkin-master', name: 'Pumpkin Master', threshold: 1, thresholdType: 'seasonal' },
  { id: 'candy-collector', name: 'Candy Collector', threshold: 1, thresholdType: 'seasonal' },
];
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Badge Threshold Consistency
*For any* user stats and badge definition, if the user's stat value is greater than or equal to the badge threshold, the badge should be marked as eligible.
**Validates: Requirements 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 6.1**

### Property 2: No Duplicate Badges
*For any* user and badge, the system should never award the same badge twice to the same user.
**Validates: Requirements 6.3**

### Property 3: Multiple Badge Award
*For any* user stats that meet multiple badge thresholds, all eligible badges should be awarded in a single eligibility check.
**Validates: Requirements 6.2**

### Property 4: Badge Persistence Round Trip
*For any* earned badge, storing to localStorage and then retrieving should return the same badge data.
**Validates: Requirements 4.1, 4.2**

### Property 5: Progress Calculation Accuracy
*For any* user stats and badge threshold, the progress percentage should equal (current_value / threshold) * 100, capped at 100%.
**Validates: Requirements 3.2**

## Error Handling

- Corrupted localStorage data triggers graceful recovery with empty badge state
- Missing badge definitions return empty eligibility list
- Invalid user stats default to zero values
- Supabase sync failures fall back to localStorage only

## Testing Strategy

### Unit Tests
- Test badge eligibility calculation for each badge type
- Test localStorage persistence and retrieval
- Test badge component rendering

### Property-Based Tests (fast-check)
- Test threshold consistency across random user stats
- Test no duplicate badge awards
- Test multiple badge eligibility
- Test localStorage round trip
- Minimum 100 iterations per property test
