# Design Document: Quest System

## Overview

The Quest System gamifies travel with location-based challenges. It combines GPS verification, photo proof, and blockchain rewards. Halloween-themed quests are available at spooky destinations.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Quest Components                                         │  │
│  │  - QuestCard (with SpookyCard styling)                   │  │
│  │  - QuestMap (quest locations)                            │  │
│  │  - QuestDetailsModal (completion UI)                     │  │
│  └────────────────────────┬─────────────────────────────────┘  │
└────────────────────────────┼────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              SERVICES (questService.ts)                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  GPS Verification                                         │  │
│  │  - calculateHaversineDistance()                          │  │
│  │  - isWithinQuestRadius()                                 │  │
│  │  - validateGPSPosition() (anti-spoofing)                 │  │
│  │                                                            │  │
│  │  Quest Operations                                         │  │
│  │  - startQuest()                                          │  │
│  │  - uploadQuestPhoto()                                    │  │
│  │  - completeQuest()                                       │  │
│  └────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### Quest Data Model

```typescript
interface Quest {
  id: string;
  title: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  difficulty: number;        // 1-10
  reward_tokens: number;     // TPX tokens
  reward_xp: number;         // Experience points
  category: string;          // 'halloween' for spooky quests
  image_url?: string;
  is_active: boolean;
}
```

### GPS Verification

```typescript
// Haversine distance calculation
function calculateHaversineDistance(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

// Anti-spoofing validation
function validateGPSPosition(
  position: GeolocationPosition,
  previousPosition?: GeolocationPosition
): { valid: boolean; reason?: string } {
  // Check accuracy
  if (position.coords.accuracy > 50) {
    return { valid: false, reason: 'GPS accuracy too low' };
  }

  // Check for mock location
  if (position.coords.accuracy === 0 && !position.coords.altitude) {
    return { valid: false, reason: 'Possible mock location detected' };
  }

  // Check for unrealistic speed
  if (previousPosition) {
    const timeDiff = (position.timestamp - previousPosition.timestamp) / 1000;
    const distance = calculateHaversineDistance(
      previousPosition.coords.latitude,
      previousPosition.coords.longitude,
      position.coords.latitude,
      position.coords.longitude
    );
    const speed = distance / timeDiff;

    if (speed > 50) { // 180 km/h
      return { valid: false, reason: 'Unrealistic speed detected' };
    }
  }

  return { valid: true };
}
```

### Halloween Quest Integration

Halloween quests are identified by `category: 'halloween'` and displayed with SpookyCard styling. They appear at spooky destinations and award bonus XP during Halloween season.

## Error Handling

```typescript
enum GPSError {
  PERMISSION_DENIED = 'Location permission denied',
  POSITION_UNAVAILABLE = 'Location unavailable',
  ACCURACY_TOO_LOW = 'GPS accuracy too low',
  MOCK_LOCATION = 'Mock location detected',
  UNREALISTIC_SPEED = 'Unrealistic movement speed'
}
```

## Testing Strategy

- Unit tests for Haversine distance calculation
- Unit tests for GPS validation logic
- Integration tests for quest completion flow
