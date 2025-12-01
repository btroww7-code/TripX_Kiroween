# Design Document

## Overview

The Leaderboard system provides real-time competitive rankings for TripX users. It supports multiple ranking metrics (XP, destinations, quests, badges), time-based filtering, and efficient caching for fast load times. The system integrates with Supabase for data storage and uses React Query for client-side caching.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Leaderboard Page                           │
│              (Leaderboard.tsx Component)                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  leaderboardService                          │
│           (Rankings, Filters, User Position)                 │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│   Supabase    │    │  React Query  │    │  User Stats   │
│   Database    │    │    Cache      │    │   Service     │
└───────────────┘    └───────────────┘    └───────────────┘
```

## Components and Interfaces

### Leaderboard Page

```typescript
interface LeaderboardProps {
  className?: string;
}

interface LeaderboardState {
  period: RankingPeriod;
  metric: RankingMetric;
  isLoading: boolean;
}
```

### Leaderboard Entry

```typescript
interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatarUrl?: string;
  xp: number;
  level: number;
  spookyDestinations: number;
  halloweenQuests: number;
  badges: number;
  lastActivity: string;
}
```

### Leaderboard Service

```typescript
interface LeaderboardService {
  getLeaderboard(options: LeaderboardOptions): Promise<LeaderboardEntry[]>;
  getUserRank(userId: string, options: LeaderboardOptions): Promise<UserRankInfo>;
  getTopUsers(limit: number, metric: RankingMetric): Promise<LeaderboardEntry[]>;
}

interface LeaderboardOptions {
  period: RankingPeriod;
  metric: RankingMetric;
  limit?: number;
  offset?: number;
}

type RankingPeriod = 'all-time' | 'monthly' | 'weekly';
type RankingMetric = 'xp' | 'destinations' | 'quests' | 'badges';
```

### User Rank Info

```typescript
interface UserRankInfo {
  rank: number;
  totalUsers: number;
  percentile: number;
  nearbyUsers: LeaderboardEntry[];
}
```

## Data Models

### Supabase Schema

```sql
-- User stats view for leaderboard
CREATE VIEW leaderboard_stats AS
SELECT 
  u.id as user_id,
  u.username,
  u.avatar_url,
  COALESCE(SUM(a.xp_earned), 0) as total_xp,
  COUNT(DISTINCT sd.destination_id) as spooky_destinations,
  COUNT(DISTINCT q.quest_id) as halloween_quests,
  COUNT(DISTINCT b.badge_id) as badges,
  MAX(a.created_at) as last_activity
FROM users u
LEFT JOIN activities a ON u.id = a.user_id
LEFT JOIN spooky_destination_visits sd ON u.id = sd.user_id
LEFT JOIN quest_completions q ON u.id = q.user_id
LEFT JOIN user_badges b ON u.id = b.user_id
GROUP BY u.id, u.username, u.avatar_url;
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Ranking Order Consistency
*For any* leaderboard result, entries should be sorted in descending order by the selected metric, with no entry having a higher metric value than the entry above it.
**Validates: Requirements 1.1, 6.1**

### Property 2: Rank Position Accuracy
*For any* leaderboard with N entries, rank positions should be consecutive integers from 1 to N with no gaps or duplicates.
**Validates: Requirements 1.2, 2.1**

### Property 3: Percentile Calculation
*For any* user rank R in a leaderboard of N users, the percentile should equal ((N - R + 1) / N) * 100.
**Validates: Requirements 2.3**

### Property 4: Time Period Filtering
*For any* time-filtered leaderboard, all entries should only include XP earned within the specified time period.
**Validates: Requirements 3.1, 3.2, 3.3**

### Property 5: Tiebreaker Consistency
*For any* two users with equal scores, the user with the earlier achievement date should have the higher rank.
**Validates: Requirements 6.2**

## Error Handling

- Network failures show cached data with stale indicator
- Empty leaderboard displays encouraging message to be first
- Invalid user ID returns null rank info
- Database errors fall back to empty leaderboard with error message

## Testing Strategy

### Unit Tests
- Test ranking calculation for various user sets
- Test time period filtering logic
- Test percentile calculation
- Test tiebreaker logic

### Property-Based Tests (fast-check)
- Test ranking order consistency across random user data
- Test rank position accuracy
- Test percentile calculation accuracy
- Test tiebreaker consistency
- Minimum 100 iterations per property test
