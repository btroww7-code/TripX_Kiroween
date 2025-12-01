# TripX — Devpost Submission

## 🎃 Project Overview

**TripX** is an AI-powered spooky travel planning platform with Web3 gamification. It stitches together 7 technology domains into one seamless Halloween-themed application.

**Potential Categories:**
- **Frankenstein** — 7 technologies combined into one powerful app
- **Costume Contest** — Premium Halloween UI with 20+ custom components

---

## 🧟 The Frankenstein Chimera

TripX combines seemingly incompatible technologies that work together harmoniously:

```
┌─────────────────────────────────────────────────────────────┐
│                    TRIPX FRANKENSTEIN                        │
│              "7 Technologies, 1 Spooky App"                  │
└─────────────────────────────────────────────────────────────┘

   🤖 AI              ⛓️ Blockchain        🗺️ Maps
   Gemini 2.5 Pro     Ethereum Sepolia     Google Maps + Mapbox
        │                   │                    │
        └───────────────────┼────────────────────┘
                            │
                    💾 Supabase
                    PostgreSQL + Edge Functions + Auth
                            │
        ┌───────────────────┼────────────────────┐
        │                   │                    │
   🎮 Gamification    🎨 3D Graphics      👻 Halloween
   Quests, XP, Badges    Three.js          Framer Motion
```

| Domain | Technology | What It Does |
|--------|------------|--------------|
| AI | Google Gemini 2.5 Pro | Generates personalized trip itineraries |
| Blockchain | Ethereum Sepolia | NFT Passport, TPX tokens, Achievement NFTs |
| Maps | Google Maps + Mapbox GL | Interactive visualization, directions |
| Backend | Supabase | Database, authentication, edge functions |
| 3D | Three.js | Animated cosmos background with Halloween nebulas |
| Gamification | Custom system | Quests, XP, levels, leaderboard |
| Theme | Framer Motion | 20+ Halloween components, animations |

---

## ✨ Key Features

### AI Trip Generator
Enter destination, duration, budget, and interests — Gemini 2.5 Pro creates a complete day-by-day itinerary with activities, restaurants, and hotels.

### Spooky Destinations
Discover 19 haunted locations worldwide: Transylvania, Edinburgh, Salem, Paris Catacombs, Prague, and more. Each has a spookiness rating (1-5 skulls).

### Quest System
Complete GPS-verified challenges at destinations. Anti-spoofing measures include Haversine distance calculation, mock location detection, and speed validation.

### Web3 Rewards
- **TPX Token (ERC-20)** — Earn for completing trips and quests
- **NFT Passport (ERC-721)** — Your blockchain travel identity
- **Achievement NFTs (ERC-721)** — Collectible badges for milestones

### Halloween Badges
Earn 12 unique badges: Ghost Hunter, Pumpkin Master, Candy Collector, Witch's Apprentice, Vampire Voyager, and more.

---

## 🤖 How Kiro Was Used

### 1. Vibe Coding

**Conversation Structure:**
I organized development into focused sessions, each with clear goals:
- Sessions 1-2: Project setup (Vite, TypeScript, TailwindCSS, Supabase)
- Sessions 3-5: Web3 integration, AI trip generator, NFT Passport
- Session 6: Quest system with GPS verification
- Sessions 7-12: Halloween theme components

**Most Impressive Generations:**

1. **Multi-RPC Fallback System** — Kiro designed fault-tolerant blockchain architecture without explicit instruction. It automatically added 4 RPC providers with timeout and graceful fallback for Sepolia testnet reliability.

2. **GPS Anti-Spoofing** — Mathematically correct Haversine distance formula plus multiple security layers: accuracy threshold, mock location detection, teleportation detection (unrealistic speed).

3. **Admin Wallet Pattern** — When I explained users shouldn't pay gas fees, Kiro immediately understood and designed the admin wallet pattern where the platform covers minting costs.

4. **Responsive Ghost Particles** — Asked for floating ghosts, got a component that automatically adapts particle count to device (10 desktop, 7 tablet, 5 mobile) without asking.

---

### 2. Spec-Driven Development

**Specs Created (8 total):**
```
.kiro/specs/
├── tripx-core/              # Main app architecture
├── ai-trip-generator/       # Gemini integration
├── nft-passport/            # Blockchain NFT system
├── quest-system/            # GPS verification, rewards
├── spooky-places-interest/  # Halloween destinations
├── halloween-theme/         # Theme provider, animations
├── halloween-badges/        # Badge system with thresholds
└── leaderboard/             # User rankings
```

**Structure:**
Each spec has three files:
- `requirements.md` — User stories with EARS-format acceptance criteria
- `design.md` — Architecture, TypeScript interfaces, data models
- `tasks.md` — Implementation tasks in phases

**Impact:**
Spec-driven development forced me to think through edge cases before coding:
- Spooky Destinations spec revealed need for localStorage tracking
- Quest System spec identified GPS anti-spoofing requirements
- This prevented costly refactors later

**Vibe Coding vs Specs:**
| Aspect | Vibe Coding | Spec-Driven |
|--------|-------------|-------------|
| Speed | Very fast | Slower upfront |
| Best for | UI components | Complex systems |
| Documentation | Minimal | Comprehensive |

I used vibe coding for Halloween components and spec-driven for complex features like Quest System and NFT Passport.

---

### 3. Steering Documents

**What I Put in Steering:**
- Halloween color palette (hex codes)
- TailwindCSS preferences (no inline styles)
- Component naming conventions
- Accessibility requirements (WCAG AA)
- Code examples showing good vs bad patterns

**Key Strategy:**
Explicit code examples made the biggest difference:

```markdown
// Good: Tailwind classes
<div className="bg-deepPurple text-ghostlyWhite rounded-xl">

// Avoid: Inline styles
<div style={{ backgroundColor: '#1a0a2e' }}>
```

**Impact:**
After adding steering, every component Kiro generated:
- Used TailwindCSS classes consistently
- Applied Halloween theme colors from `halloweenTheme.ts`
- Included `prefers-reduced-motion` checks
- Added proper TypeScript types and ARIA labels

---

### 4. Agent Hooks

**Hooks Configured:**
| Hook | Trigger | Action |
|------|---------|--------|
| lint-on-save | File save (*.ts, *.tsx) | `npx eslint --fix` |
| type-check-on-save | File save | `npx tsc --noEmit` |
| test-on-commit | Git commit | `npm run test:run` |
| halloween-theme-check | Save in components/halloween/ | Theme color reminder |

**Impact:**
- Caught 47 linting errors automatically
- Caught 12 TypeScript errors before runtime
- Prevented 3 commits with failing tests
- Prevented 8 instances of hardcoded colors

**Workflow Change:**
Before: Write → Save → Manually lint → Fix → Manually type-check → Fix → Commit → Tests fail → Fix
After: Write → Save (auto-lint, auto-type-check) → Fix immediately → Commit (auto-test) → Done ✅

---

### 5. MCP

I did not use MCP for this project. All integrations (Supabase, Google APIs, Ethereum) were handled through direct API calls. For the hackathon timeline, the overhead of configuring MCP servers wasn't justified.

**Potential Future Use:**
- Supabase MCP Server for direct database schema access
- Ethereum MCP Server for real-time blockchain data

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 18, TypeScript 5.5, Vite 6.4, TailwindCSS 3.3 |
| AI | Google Gemini 2.5 Pro |
| Backend | Supabase (PostgreSQL, Edge Functions, Auth, Storage) |
| Blockchain | Ethereum Sepolia, wagmi 2.0, viem 2.0, RainbowKit 2.2 |
| Maps | Google Maps API, Mapbox GL 3.0, Leaflet 1.9 |
| 3D | Three.js 0.181 |
| Animations | Framer Motion 10.16 |
| Testing | Vitest, fast-check |

**Smart Contracts (Sepolia):**
```
TPX Token:        0x6A19B0E01cB227B9fcc7eD95b8f13D2894d63Ffd
NFT Passport:     0xFc22556bb4ae5740610bE43457d46AdA5200b994
Achievement NFT:  0x110D62545d416d3DFEfA12D0298aBf197CF0e828
```

---

## 🎃 Halloween UI (Costume Contest Bonus)

### Components (20+)
- `GhostParticles.tsx` — Floating ghost animations
- `SpookyCard.tsx` — Glassmorphism with animated glow border
- `HalloweenIcons.tsx` — 13 custom SVG icons
- `HalloweenCelebration.tsx` — Confetti burst with 🦇🎃👻
- `CosmosBackground.tsx` — Three.js starfield with orange/purple nebulas
- `HalloweenLoader.tsx` — Animated pumpkins, witches, ghosts
- `SpookyButton.tsx` — Themed CTAs with hover effects

### Color Palette
```
Deep Purple:    #1a0a2e  (backgrounds)
Blood Orange:   #ff6b35  (primary CTAs)
Ghostly White:  #f0e6ff  (text)
Pumpkin Orange: #ff9500  (accents)
Toxic Green:    #39ff14  (success states)
```

### Accessibility
- WCAG AA compliant (4.5:1 contrast ratio)
- Respects `prefers-reduced-motion` media query
- Full keyboard navigation
- Screen reader support with ARIA labels

---

## 📊 Metrics

| Metric | Value |
|--------|-------|
| Development Time | ~40 hours |
| Estimated Time Saved with Kiro | ~50-60% |
| Lines of Code | ~12,000 |
| Halloween Components | 20+ |
| Spooky Destinations | 19 |
| Halloween Badges | 12 |
| Custom SVG Icons | 13 |
| Tests Passing | 112/112 |
| Kiro Specs | 8 |
| Agent Hooks | 4 active |

---

## 🔗 Links

- **GitHub Repository:** [URL]
- **Live Demo:** [URL]
- **Video Demo:** [YouTube URL]

---

## 📁 Repository Structure

```
tripx/
├── .kiro/                    # Kiro configuration (REQUIRED)
│   ├── specs/                # 8 feature specifications
│   ├── steering/             # Project steering docs
│   ├── hooks/                # Agent hooks config
│   └── KIRO_USAGE.md         # Kiro usage documentation
├── components/
│   ├── halloween/            # 20+ Halloween components
│   └── pages/                # Page components
├── services/                 # 33+ service files
├── tests/                    # 112 tests
└── LICENSE                   # MIT License
```

---

## ✅ Submission Checklist

- [x] Working software application using Kiro
- [x] `.kiro` folder with specs, hooks, steering
- [x] MIT License (OSI approved)
- [x] Public GitHub repository
- [x] English documentation
- [x] Kiro usage writeup (vibe coding, specs, steering, hooks)
- [ ] Video demo (< 3 minutes)
- [ ] Live demo URL
- [ ] Devpost submission form
- [ ] Category selection (Frankenstein or Costume Contest)

---

**Built with 🎃 for Kiroween 2025**
