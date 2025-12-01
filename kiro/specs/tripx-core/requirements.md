# Requirements Document: TripX Core

## Introduction

TripX is an AI-powered spooky travel planning platform with Web3 gamification, created for the Kiroween 2025 hackathon in the Frankenstein category. The application combines AI trip generation, blockchain rewards, interactive maps, and Halloween-themed features into a seamless user experience.

## Glossary

- **TripX**: AI-powered spooky travel planning application
- **Kiroween**: AWS/Devpost hackathon (October 31 - December 5, 2025)
- **Frankenstein Category**: Hackathon category for apps combining multiple technologies
- **TPX Token**: ERC-20 reward token on Ethereum Sepolia
- **NFT Passport**: ERC-721 token representing user's travel profile
- **Spooky Destinations**: Haunted locations worldwide for Halloween-themed travel
- **Halloween Badges**: Achievement badges with Halloween designs
- **Gemini AI**: Google's Gemini 2.5 Pro for trip generation
- **Supabase**: Backend-as-a-Service for database, auth, and edge functions

## Requirements

### Requirement 1: Kiro Folder Structure

**User Story:** As a hackathon participant, I want proper .kiro folder structure so judges can verify Kiro usage.

#### Acceptance Criteria

1. WHEN repository is cloned THEN system SHALL contain `.kiro` directory at root level
2. WHEN .kiro directory is accessed THEN system SHALL contain `specs` subdirectory with feature specifications
3. WHEN .kiro directory is accessed THEN system SHALL contain `steering` subdirectory with project configuration
4. WHEN .kiro directory is accessed THEN system SHALL contain `hooks` subdirectory with automation configs
5. WHEN .gitignore is reviewed THEN system SHALL NOT ignore `.kiro` folder

### Requirement 2: Open Source License

**User Story:** As a hackathon participant, I want OSI-approved open source license for submission compliance.

#### Acceptance Criteria

1. WHEN repository root is accessed THEN system SHALL contain LICENSE file with MIT License
2. WHEN GitHub displays repository THEN system SHALL show "MIT License" in About section

### Requirement 3: Halloween Theme Colors

**User Story:** As a user, I want cohesive Halloween color palette for memorable experience.

#### Acceptance Criteria

1. WHEN application loads THEN system SHALL use primary colors: deep purple (#1a0a2e), midnight blue (#0d1b2a), blood orange (#ff6b35)
2. WHEN application loads THEN system SHALL use accent colors: ghostly white (#f0e6ff), pumpkin orange (#ff9500), toxic green (#39ff14)
3. WHEN text is displayed THEN system SHALL maintain WCAG AA contrast ratios

### Requirement 4: Halloween Animations

**User Story:** As a user, I want subtle Halloween animations for delightful experience.

#### Acceptance Criteria

1. WHEN Dashboard loads THEN system SHALL display floating ghost particles (max 10, subtle opacity)
2. WHEN user hovers over cards THEN system SHALL display spooky glow effects
3. WHEN user earns rewards THEN system SHALL display Halloween celebration animation
4. WHEN animations render THEN system SHALL respect prefers-reduced-motion media query

### Requirement 5: Halloween Icons

**User Story:** As a user, I want Halloween-themed icons for consistent visual identity.

#### Acceptance Criteria

1. WHEN navigation is displayed THEN system SHALL use Halloween icons: ghost, cauldron, hauntedCastle, skull
2. WHEN transport modes are displayed THEN system SHALL use spooky variants: witchBroom, ghostTrain, vampireBat
3. WHEN loading states occur THEN system SHALL display animated Halloween loaders

### Requirement 6: Technology Integration (Frankenstein)

**User Story:** As a hackathon judge, I want to see multiple technologies integrated seamlessly.

#### Acceptance Criteria

1. WHEN application runs THEN system SHALL demonstrate integration of at least 5 technology domains
2. WHEN AI features are used THEN system SHALL integrate Google Gemini 2.5 Pro
3. WHEN Web3 features are used THEN system SHALL integrate Ethereum blockchain (ERC-20, ERC-721)
4. WHEN map features are used THEN system SHALL integrate Google Maps and Mapbox GL
5. WHEN data features are used THEN system SHALL integrate Supabase

### Requirement 7: Technology Attribution

**User Story:** As a user, I want to see which technology powers each feature.

#### Acceptance Criteria

1. WHEN AI generates trip THEN system SHALL display "Powered by Google Gemini" indicator
2. WHEN blockchain transactions occur THEN system SHALL display Ethereum network indicator
3. WHEN maps are displayed THEN system SHALL show map provider attribution

### Requirement 8: Spooky Destinations

**User Story:** As a user, I want to discover Halloween-themed travel destinations.

#### Acceptance Criteria

1. WHEN user browses destinations THEN system SHALL display haunted places worldwide
2. WHEN spooky destinations are displayed THEN system SHALL show spookiness rating (1-5 skulls)
3. WHEN user selects destination THEN system SHALL display Halloween-specific activities
4. WHEN user marks destination as visited THEN system SHALL store progress

### Requirement 9: Halloween Badges

**User Story:** As a user, I want to earn Halloween achievement badges.

#### Acceptance Criteria

1. WHEN user visits 3 spooky destinations THEN system SHALL award "Ghost Hunter" badge
2. WHEN user completes 5 Halloween quests THEN system SHALL award "Pumpkin Master" badge
3. WHEN user earns 1000 TPX THEN system SHALL award "Candy Collector" badge
4. WHEN badges are displayed THEN system SHALL show Halloween-themed designs with unlock animations

### Requirement 10: AI Trip Generation

**User Story:** As a user, I want AI to generate personalized trip itineraries.

#### Acceptance Criteria

1. WHEN user submits trip request THEN system SHALL accept destination, duration, budget, interests
2. WHEN AI generates trip THEN system SHALL include day-by-day itinerary with activities
3. WHEN "spooky" interest is selected THEN system SHALL include haunted locations in itinerary

### Requirement 11: NFT Passport

**User Story:** As a user, I want blockchain-based travel profile.

#### Acceptance Criteria

1. WHEN user connects wallet THEN system SHALL check for existing NFT Passport
2. WHEN user mints passport THEN system SHALL use admin wallet to pay gas fees
3. WHEN passport is displayed THEN system SHALL show level, XP, tier, trips completed

### Requirement 12: Quest System

**User Story:** As a user, I want location-based quests with rewards.

#### Acceptance Criteria

1. WHEN user views quests THEN system SHALL display available quests with rewards
2. WHEN user is at quest location THEN system SHALL verify GPS position
3. WHEN quest is completed THEN system SHALL award XP and TPX tokens

### Requirement 13: Performance

**User Story:** As a user, I want fast and responsive application.

#### Acceptance Criteria

1. WHEN application loads THEN system SHALL achieve First Contentful Paint under 2 seconds
2. WHEN AI generates trip THEN system SHALL complete within 30 seconds
3. WHEN animations run THEN system SHALL maintain 60fps

### Requirement 14: Error Handling

**User Story:** As a user, I want clear error messages.

#### Acceptance Criteria

1. WHEN API calls fail THEN system SHALL display user-friendly error message
2. WHEN wallet connection fails THEN system SHALL explain issue and provide guidance
3. WHEN errors occur THEN system SHALL NOT display technical stack traces

### Requirement 15: Accessibility

**User Story:** As a user with disabilities, I want accessible application.

#### Acceptance Criteria

1. WHEN keyboard navigation is used THEN system SHALL allow full navigation without mouse
2. WHEN screen reader is used THEN system SHALL provide proper ARIA labels
3. WHEN colors are displayed THEN system SHALL maintain minimum 4.5:1 contrast ratio
4. WHEN animations play THEN system SHALL respect prefers-reduced-motion setting
