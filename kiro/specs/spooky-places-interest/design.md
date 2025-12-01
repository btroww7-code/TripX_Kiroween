# Design Document: Haunted & Spooky Interest Option

## Overview

This feature adds "Haunted & Spooky" as a fifth interest option in the Create Trip page. The implementation follows the existing pattern for interest options while adding Halloween-themed styling and animations.

## Architecture

The feature integrates into the existing CreateTrip component:

```
CreateTrip.tsx
├── interestOptions array (add 5th option)
├── toggleInterest function (unchanged)
├── interests state array (unchanged)
└── handleGenerate → aiTripService.generateTripPlan (unchanged)
```

No new components or services required.

## Components and Interfaces

### Modified: interestOptions Array

```typescript
// Current options
const interestOptions = [
  { id: 'food', label: 'Food & Coffee', icon: Coffee, color: 'from-orange-400 to-red-500' },
  { id: 'culture', label: 'Culture & History', icon: Landmark, color: 'from-purple-400 to-pink-500' },
  { id: 'nature', label: 'Nature & Parks', icon: Trees, color: 'from-green-400 to-emerald-500' },
  { id: 'nightlife', label: 'Nightlife & Fun', icon: Music, color: 'from-blue-400 to-cyan-500' },
];

// New option to add
{ 
  id: 'spooky', 
  label: 'Haunted & Spooky', 
  icon: GhostIcon,  // from HalloweenIcons
  color: 'from-purple-600 to-orange-500',
  isSpooky: true    // flag for Halloween animations
}
```

### Interface Extension

```typescript
interface InterestOption {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
  isSpooky?: boolean;  // Optional flag for Halloween styling
}
```

## Correctness Properties

### Property 1: Toggle Interest Idempotence

For any interests array, toggling "spooky" twice should return to original state.

**Validates: Requirements 1.2, 1.3, 1.4**

### Property 2: Interest Array Membership After Toggle

For any array without "spooky", after toggling, array should contain "spooky". For any array with "spooky", after toggling, array should not contain "spooky".

**Validates: Requirements 1.2, 1.3, 1.4**

### Property 3: Spooky Interest Propagation to AI Service

For any trip request with "spooky" in interests, the AI service should receive "spooky" in its interests parameter.

**Validates: Requirements 3.1, 3.2**

## Testing Strategy

### Unit Tests
- Verify interestOptions contains 5 options including spooky
- Verify spooky option has correct properties

### Property-Based Tests
- Property 1: Toggle idempotence
- Property 2: Membership after toggle
- Property 3: AI service propagation
