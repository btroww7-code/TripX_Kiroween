# Design Document: AI Trip Generator

## Overview

The AI Trip Generator uses Google Gemini 2.5 Pro via Supabase Edge Functions to create personalized travel itineraries. The system supports Halloween-themed trips when users select the "spooky" interest.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  aiTripService.generateTripPlan()                         │  │
│  │  - Validates input                                        │  │
│  │  - Calls Supabase Edge Function                          │  │
│  │  - Handles errors                                         │  │
│  └────────────────────────┬─────────────────────────────────┘  │
└────────────────────────────┼────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              SUPABASE EDGE FUNCTION (Deno)                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  generate-trip-ai                                         │  │
│  │  1. Geocode destination                                  │  │
│  │  2. Generate trip with Gemini AI                         │  │
│  │  3. Include spooky locations if interest selected        │  │
│  │  4. Format response                                       │  │
│  └────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────┐  ┌──────────────────────┐
│  Google Gemini AI    │  │  Google Places API   │
│  - Trip generation   │  │  - Geocoding         │
│  - Quest creation    │  │  - Place details     │
└──────────────────────┘  └──────────────────────┘
```

## Components and Interfaces

### Trip Request

```typescript
interface TripRequest {
  destination: string;
  days: number;
  budget: 'low' | 'medium' | 'high';
  interests: string[]; // includes 'spooky' for Halloween trips
}
```

### Generated Trip Plan

```typescript
interface GeneratedTripPlan {
  trip_overview: {
    city: string;
    country: string;
    best_time_to_visit: string;
    overview_description: string;
  };
  destination_info: {
    coordinates: { lat: number; lng: number };
    timezone: string;
    currency: string;
  };
  hotels: Hotel[];
  daily_plan: DailyPlan[];
  generated_quests: Quest[];
  metadata: {
    generated_at: string;
    model: string;
    total_estimated_cost: number;
  };
}
```

### Spooky Trip Enhancement

When "spooky" is in interests array, the AI prompt includes:
- Ghost tours and paranormal experiences
- Haunted hotels and accommodations
- Cemetery visits and dark history tours
- Halloween-themed activities
- Spooky restaurants and bars

## Error Handling

```typescript
enum TripGenerationError {
  API_CONFIG = 'API configuration error',
  DESTINATION_NOT_FOUND = 'Could not find destination',
  SERVICE_UNAVAILABLE = 'Trip generation service unavailable',
  NETWORK_ERROR = 'Check your internet connection',
  TIMEOUT = 'Request timed out'
}
```

## Testing Strategy

- Unit tests for input validation
- Integration tests with mock Gemini responses
- End-to-end tests for trip generation flow
