# Requirements Document: NFT Passport System

## Introduction

The NFT Passport is a blockchain-based user profile on Ethereum Sepolia. Each user receives a unique ERC-721 NFT that tracks their level, XP, trips completed, and achievements. The NFT features Halloween-themed visual design with cobwebs, candles, and mystical effects.

## Glossary

- **NFT Passport**: ERC-721 token representing user's travel profile
- **Token ID**: Unique identifier for each NFT on blockchain
- **Tier**: User's rank (Bronze, Silver, Gold, Platinum, Diamond)
- **Admin Wallet**: Backend wallet that pays gas fees for users
- **Sepolia**: Ethereum test network
- **Halloween Overlay**: Spooky visual effects on passport display

## Requirements

### Requirement 1: NFT Passport Minting

**User Story:** As a user, I want to mint NFT Passport for free.

#### Acceptance Criteria

1. WHEN user connects wallet THEN system SHALL check for existing passport
2. WHEN user has no passport THEN system SHALL display "Mint NFT Passport" button
3. WHEN user clicks mint THEN system SHALL use admin wallet to pay gas fees
4. WHEN minting completes THEN system SHALL transfer NFT to user wallet

### Requirement 2: NFT Metadata

**User Story:** As a user, I want my NFT to display travel stats.

#### Acceptance Criteria

1. WHEN metadata generated THEN system SHALL include level, XP, tier, trips, quests
2. WHEN metadata formatted THEN system SHALL follow OpenSea standards
3. WHEN image generated THEN system SHALL use Halloween-themed design

### Requirement 3: Tier System

**User Story:** As a user, I want to progress through tiers.

#### Acceptance Criteria

1. WHEN user is level 1-10 THEN system SHALL assign Bronze tier
2. WHEN user is level 11-25 THEN system SHALL assign Silver tier
3. WHEN user is level 26-50 THEN system SHALL assign Gold tier
4. WHEN user is level 51-75 THEN system SHALL assign Platinum tier
5. WHEN user is level 76+ THEN system SHALL assign Diamond tier

### Requirement 4: Halloween Visual Enhancement

**User Story:** As a user, I want my passport to have Halloween styling.

#### Acceptance Criteria

1. WHEN passport displayed THEN system SHALL show cobweb corner decorations
2. WHEN passport displayed THEN system SHALL show mystical border glow
3. WHEN passport displayed THEN system SHALL show floating candle flames

### Requirement 5: Multi-RPC Fallback

**User Story:** As a user, I want reliable blockchain access.

#### Acceptance Criteria

1. WHEN reading NFT data THEN system SHALL try primary RPC first
2. WHEN primary fails THEN system SHALL automatically try secondary RPC
3. WHEN all RPCs fail THEN system SHALL display "Blockchain unavailable" message
