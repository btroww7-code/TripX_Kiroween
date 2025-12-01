# Requirements Document: Haunted & Spooky Interest Option

## Introduction

This feature adds "Haunted & Spooky" as a fifth interest option in the Create Trip page. When selected, the AI trip generator includes haunted locations, ghost tours, and spooky destinations in the generated itinerary. The option features premium Halloween animations.

## Glossary

- **Create Trip Page**: Page where users configure AI-powered trip generation
- **Interests Section**: UI grid showing selectable travel preferences
- **Haunted & Spooky**: Interest option for haunted locations and ghost tours
- **Halloween Animation**: Visual effects using Framer Motion with Halloween colors

## Requirements

### Requirement 1: Interest Option Display

**User Story:** As a user, I want to select "Haunted & Spooky" as a travel interest.

#### Acceptance Criteria

1. WHEN Create Trip page loads THEN system SHALL display "Haunted & Spooky" as fifth interest option
2. WHEN user clicks option THEN system SHALL toggle selection state
3. WHEN option selected THEN system SHALL add "spooky" to interests array
4. WHEN option unselected THEN system SHALL remove "spooky" from interests array

### Requirement 2: Halloween Styling

**User Story:** As a user, I want the Haunted & Spooky option to have premium Halloween styling.

#### Acceptance Criteria

1. WHEN option rendered THEN system SHALL display GhostIcon from HalloweenIcons
2. WHEN option rendered THEN system SHALL use purple-to-orange gradient
3. WHEN user hovers THEN system SHALL trigger subtle glow animation
4. WHEN option selected THEN system SHALL display pulsing glow effect

### Requirement 3: AI Integration

**User Story:** As a user, I want AI to include spooky destinations when I select this interest.

#### Acceptance Criteria

1. WHEN trip generated with Haunted & Spooky selected THEN system SHALL pass "spooky" to AI service
2. WHEN AI receives "spooky" interest THEN system SHALL include haunted locations in itinerary
