# Requirements Document: Quest System

## Introduction

The Quest System gamifies travel by rewarding users for visiting locations and completing challenges. Users complete quests by verifying GPS location and uploading photos, earning XP and TPX tokens. The system includes Halloween-themed quests for spooky destinations.

## Glossary

- **Quest**: Location-based challenge with rewards
- **GPS Verification**: Checking user is at quest location using geolocation
- **Haversine Distance**: Formula for calculating distance between GPS coordinates
- **XP**: Experience points for leveling up
- **TPX Token**: ERC-20 reward token on Ethereum
- **Halloween Quest**: Spooky-themed quest at haunted locations

## Requirements

### Requirement 1: Quest Discovery

**User Story:** As a user, I want to browse available quests.

#### Acceptance Criteria

1. WHEN user views quests THEN system SHALL display title, description, location, rewards
2. WHEN user filters quests THEN system SHALL support category, difficulty, distance
3. WHEN Halloween quests exist THEN system SHALL display with spooky styling

### Requirement 2: GPS Verification

**User Story:** As a user, I want system to verify I'm at quest location.

#### Acceptance Criteria

1. WHEN GPS verification starts THEN system SHALL request high-accuracy location
2. WHEN location obtained THEN system SHALL calculate distance using Haversine formula
3. WHEN user within 100 meters THEN system SHALL mark as "in range"
4. WHEN GPS accuracy poor (>50m) THEN system SHALL reject position

### Requirement 3: Anti-Spoofing

**User Story:** As a platform, I want to prevent GPS spoofing.

#### Acceptance Criteria

1. WHEN GPS position received THEN system SHALL check accuracy < 50 meters
2. WHEN GPS has accuracy = 0 THEN system SHALL reject as possible mock location
3. WHEN user moves unrealistically fast (>180 km/h) THEN system SHALL reject position

### Requirement 4: Quest Completion

**User Story:** As a user, I want to complete quests and earn rewards.

#### Acceptance Criteria

1. WHEN quest verified THEN system SHALL award XP to user
2. WHEN quest verified THEN system SHALL add TPX tokens to claimable balance
3. WHEN quest completed THEN system SHALL display HalloweenCelebration animation

### Requirement 5: Photo Upload

**User Story:** As a user, I want to upload photo as proof.

#### Acceptance Criteria

1. WHEN user uploads photo THEN system SHALL accept JPEG, PNG, WebP
2. WHEN photo uploaded THEN system SHALL store in Supabase Storage
3. WHEN photo stored THEN system SHALL update quest with proof URL
