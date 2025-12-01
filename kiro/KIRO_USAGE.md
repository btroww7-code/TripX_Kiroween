# How I Used Kiro to Build TripX

This doc covers how I used Kiro throughout building TripX for Kiroween.

---

## Vibe Coding Sessions

### Setting Up the Project

Started by asking Kiro to scaffold a React + Vite + TypeScript project with a spooky color scheme. Gave it the hex codes I wanted (deep purple, blood orange, ghostly white) and it set up the whole thing including Tailwind config with those colors baked in.

### Halloween Theme System

Asked for a context provider that handles theme state and respects reduced motion preferences. Kiro added a responsive particle count hook without me asking - it automatically adjusts ghost count based on screen size (10 on desktop, 7 tablet, 5 mobile). Nice touch.

```typescript
// This came out of a single prompt about theme management
const particleCount = useParticleCount(); // adapts to viewport
```

### Ghost Particles

Wanted floating ghosts in the background. Described what I wanted (ghosts floating up with sway animation) and Kiro generated the whole component with Framer Motion. The animation timing and easing looked good right away.

### Web3 Stuff

This is where Kiro really helped. Asked for wallet integration with RainbowKit/wagmi and it generated a multi-RPC fallback system I didn't even ask for:

```typescript
// Tries multiple RPCs if one fails - Kiro added this on its own
const RPC_PROVIDERS = [
  'https://ethereum-sepolia.publicnode.com',
  'https://rpc.sepolia.org',
  // ... more fallbacks
];
```

Smart move since Sepolia RPCs can be flaky.

### AI Trip Generator

Set up the Gemini integration through Supabase Edge Functions. The prompt engineering for getting structured JSON back from Gemini was solid - worked on first try which saved a lot of debugging.

### NFT Passport

Explained I wanted users to mint NFTs without paying gas (platform covers it). Kiro understood the admin wallet pattern immediately and generated the right architecture.

### Quest System with GPS

This was complex - needed Haversine distance calculation plus anti-spoofing checks. Kiro got the math right and added checks for:
- GPS accuracy threshold
- Mock location detection  
- Unrealistic speed (teleportation detection)

The Haversine implementation was mathematically correct which I verified.

### Halloween Icons

Asked for 13 custom SVG icons (ghost, cauldron, pumpkin, etc). Got all of them as inline SVGs with consistent styling. The ghost icon turned out great.

### SpookyCard Component

Described glassmorphism with animated glow border. Kiro nailed the backdrop-blur effect and the gradient border animation on hover.

---

## Spec-Driven Development

Used specs for all major features (8 total):

- **tripx-core** - main app requirements and architecture
- **ai-trip-generator** - Gemini integration for trip generation
- **nft-passport** - blockchain NFT system with admin wallet pattern
- **quest-system** - GPS verification logic with anti-spoofing
- **spooky-places-interest** - haunted destinations interest option
- **halloween-theme** - theme provider, animations, accessibility
- **halloween-badges** - badge system with thresholds and persistence
- **leaderboard** - user rankings with time filtering

Each spec has three files:
- `requirements.md` - EARS-format acceptance criteria
- `design.md` - architecture, interfaces, correctness properties
- `tasks.md` - implementation checklist

Writing requirements first helped clarify what I actually needed before diving into code. The design docs forced me to think through the architecture.

---

## Steering Doc

The `project-steering.md` file made a big difference. Once I defined the Halloween color palette and component patterns there, Kiro's outputs became way more consistent. Every new component automatically used the right colors and followed the same patterns.

Key things I put in steering:
- Color hex codes
- Component naming conventions
- TailwindCSS preferences (no inline styles)
- Accessibility requirements

---

## Hooks

Set up a few automation hooks:
- Lint on save
- Type check on save  
- Test on commit
- Halloween theme reminder when editing halloween components

The lint-on-save alone caught a bunch of issues early.

---

## What Worked Well

1. **Steering doc** - consistency across all generated code
2. **Specific prompts** - better results than vague requests
3. **Iterating** - first output usually good, small tweaks to perfect it
4. **Specs for complex features** - forced me to think before coding

## What I'd Do Again

- Set up steering doc earlier
- Use specs for anything with multiple moving parts
- Be specific about error handling upfront

---

## Stats

- ~12,000 lines generated
- 20+ Halloween components
- 19 spooky destinations
- 12 Halloween badges
- 13 custom SVG icons
- 112 tests passing

Kiro saved me probably 40-50 hours compared to writing everything manually.
