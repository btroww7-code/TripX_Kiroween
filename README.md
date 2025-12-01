# 🎃 TripX

**AI-Powered Spooky Travel Planning with Web3 Gamification**

[![Kiroween 2025](https://img.shields.io/badge/Kiroween-2025-ff6b35?style=for-the-badge&logo=ghost)](https://kiroween.devpost.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Ethereum](https://img.shields.io/badge/Ethereum-Sepolia-627EEA?logo=ethereum&logoColor=white)](https://sepolia.etherscan.io/)

---

## What is TripX?

TripX transforms trip planning from a chore into a spooky adventure. It's a **Frankenstein chimera** that stitches together 7 technology domains:

- 🤖 **AI** — Google Gemini 2.5 Pro generates personalized itineraries
- ⛓️ **Blockchain** — Ethereum NFTs and tokens reward your travels
- 🗺️ **Maps** — Google Maps + Mapbox for interactive visualization
- 💾 **Backend** — Supabase for database, auth, and edge functions
- 🎮 **Gamification** — Quests, badges, XP, and leaderboards
- 🎨 **3D Graphics** — Three.js animated cosmos background
- 👻 **Halloween Theme** — Premium spooky UI with Framer Motion

```
Your Input          →    AI Magic           →    Your Spooky Trip
─────────────            ──────────              ──────────────────
• Destination            Gemini 2.5 Pro          • Day-by-day itinerary
• Duration               + Google Places         • Haunted locations
• Budget                 + Blockchain            • Quest challenges
• Interests              + Halloween Theme       • NFT rewards
```

---

## Features

### 🗺️ AI Trip Generator
Create personalized travel itineraries in seconds using Google Gemini 2.5 Pro.
- Smart interest matching (Food, Culture, Nature, Nightlife)
- Budget-aware planning with realistic costs
- 4-5 activities per day, properly scheduled
- Hotel recommendations within your budget

### 👻 Spooky Destinations
Discover 19 haunted locations worldwide — Transylvania, Edinburgh, Salem, Paris Catacombs, Prague, and more. Each destination has a spookiness rating (1-5 skulls) and unique Halloween quests.

### 🎮 Quest System
Complete location-based challenges to earn rewards.
- GPS-verified quest completion with anti-spoofing
- Photo verification using AI
- XP and leveling system
- Halloween-themed seasonal quests

### 🏆 Web3 Rewards
Earn blockchain rewards for your travels:

| Token | Type | Purpose |
|-------|------|---------|
| 🪙 TPX | ERC-20 | Utility token for completing trips and quests |
| 🎫 NFT Passport | ERC-721 | Your unique travel identity on blockchain |
| 🏅 Achievement NFTs | ERC-721 | Collectible badges for milestones |

### 🎃 Halloween Badges
Earn 12 unique badges: Ghost Hunter, Pumpkin Master, Candy Collector, Witch's Apprentice, and more.

### 📊 Leaderboard
Compete with travelers worldwide. Global rankings by XP, achievement collections, and seasonal Halloween rankings.

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 18, TypeScript, Vite, TailwindCSS, Framer Motion |
| AI | Google Gemini 2.5 Pro |
| Backend | Supabase (PostgreSQL, Edge Functions, Auth, Storage) |
| Blockchain | Ethereum Sepolia, wagmi, viem, RainbowKit |
| Maps | Google Maps API, Mapbox GL, Leaflet |
| 3D | Three.js |
| Testing | Vitest, fast-check |

### Smart Contracts (Sepolia Testnet)
```
TPX Token:        0x6A19B0E01cB227B9fcc7eD95b8f13D2894d63Ffd
NFT Passport:     0xFc22556bb4ae5740610bE43457d46AdA5200b994
Achievement NFT:  0x110D62545d416d3DFEfA12D0298aBf197CF0e828
```

---

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- MetaMask (for Web3 features)

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/tripx.git
cd tripx

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
# Edit .env with your API keys

# Start development server
npm run dev
```

App runs at `http://localhost:5173`

### Environment Variables

Create `.env` file with:

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Google APIs
VITE_GOOGLE_MAPS_API_KEY=your-maps-key
VITE_GEMINI_API_KEY=your-gemini-key

# Mapbox
VITE_MAPBOX_TOKEN=your-mapbox-token

# Web3
VITE_WALLETCONNECT_PROJECT_ID=your-project-id

# Contracts (Sepolia)
VITE_TPX_TOKEN_ADDRESS=0x6A19B0E01cB227B9fcc7eD95b8f13D2894d63Ffd
VITE_NFT_PASSPORT_ADDRESS=0xFc22556bb4ae5740610bE43457d46AdA5200b994
VITE_ACHIEVEMENT_NFT_ADDRESS=0x110D62545d416d3DFEfA12D0298aBf197CF0e828
```

### Scripts

```bash
npm run dev       # Development server
npm run build     # Production build
npm run preview   # Preview production build
npm run test      # Run tests
npm run lint      # Lint code
```

---

## Project Structure

```
tripx/
├── .kiro/                    # Kiro AI configuration
│   ├── specs/                # Feature specifications (8 specs)
│   ├── steering/             # Project steering docs
│   ├── hooks/                # Agent hooks
│   └── KIRO_USAGE.md         # Kiro usage documentation
├── components/
│   ├── halloween/            # 20+ Halloween components
│   ├── pages/                # Page components
│   └── ...                   # Shared UI components
├── services/                 # Business logic (33+ services)
├── hooks/                    # Custom React hooks
├── data/                     # Static data
├── styles/                   # Theme and styles
├── types/                    # TypeScript interfaces
├── lib/                      # Utilities
└── tests/                    # Test files
```

---

## Built with Kiro AI

This project was developed using **Kiro AI** for the Kiroween 2025 hackathon.

### Kiro Features Used

| Feature | Usage |
|---------|-------|
| Vibe Coding | 12 sessions building components and services |
| Specs | 8 formal specifications (tripx-core, ai-trip-generator, nft-passport, quest-system, spooky-places-interest, halloween-theme, halloween-badges, leaderboard) |
| Steering | Project-wide coding standards, Halloween theme, accessibility |
| Hooks | Lint on save, type check, test on commit, theme reminders |

### Key Generations
- Multi-RPC fallback system for blockchain reliability
- GPS anti-spoofing with Haversine distance calculation
- Admin wallet pattern for gasless NFT minting
- 13 custom Halloween SVG icons
- Responsive ghost particles (adapts to device)

See [.kiro/KIRO_USAGE.md](.kiro/KIRO_USAGE.md) for detailed documentation.

---

## Halloween Theme

### Color Palette
```
Deep Purple:    #1a0a2e  (backgrounds)
Midnight Blue:  #0d1b2a  (secondary)
Blood Orange:   #ff6b35  (primary CTAs)
Ghostly White:  #f0e6ff  (text)
Pumpkin Orange: #ff9500  (accents)
Toxic Green:    #39ff14  (success)
```

### Components
- GhostParticles — Floating ghost animations
- SpookyCard — Glassmorphism with glow effects
- HalloweenIcons — 13 custom SVG icons
- HalloweenCelebration — Confetti with 🦇🎃👻
- CosmosBackground — Three.js starfield

### Accessibility
- WCAG AA compliant (4.5:1 contrast)
- Respects `prefers-reduced-motion`
- Full keyboard navigation
- Screen reader support

---

## Authentication

| Feature | Email Login | Wallet Connected |
|---------|-------------|------------------|
| Create & Save Trips | ✅ | ✅ |
| View Quests | ✅ | ✅ |
| Spooky Destinations | ✅ | ✅ |
| Halloween Badges | ✅ | ✅ |
| Leaderboard | ✅ | ✅ |
| Mint NFT Passport | ❌ | ✅ |
| Claim TPX Tokens | ❌ | ✅ |
| Quest Blockchain Rewards | ❌ | ✅ |

---

## Testing

```bash
# Unit tests
npm run test

# Property-based tests
npm run test:pbt

# All tests with coverage
npm run test:coverage
```

112 tests covering:
- Badge awarding logic
- Spookiness rating validation
- Color contrast compliance
- Reduced motion support
- Spec folder structure

---

## Deployment

### Vercel (Recommended)

1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy

Build settings:
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions.

---

## Kiroween 2025 Submission

**Potential Categories:**
- **Frankenstein** — 7 technology domains seamlessly integrated into one app
- **Costume Contest** — Premium Halloween UI with 20+ custom spooky components

**Project Highlights:**
- AI + Blockchain + Maps + Gamification + Halloween theme
- Unexpected combination that works harmoniously
- WCAG AA accessible with reduced motion support

**Hackathon Checklist:**
- ✅ `.kiro` folder with specs, steering, hooks
- ✅ MIT License (OSI approved)
- ✅ Public GitHub repository
- ✅ English documentation
- ✅ Kiro usage documentation

---

## Links

- 🎬 [Video Demo](#) — Coming soon
- 🌐 [Live Demo](#) — Coming soon
- 📝 [Devpost Submission](#) — Coming soon

---

## License

MIT License — see [LICENSE](LICENSE) file.

---

<div align="center">

**Built with 🎃 for Kiroween 2025**

*Transform your travels into spooky adventures*

</div>
