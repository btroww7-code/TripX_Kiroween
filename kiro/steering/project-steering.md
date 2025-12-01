# TripX Project Steering Document

## Project Overview

TripX is an AI-powered spooky travel planning platform with Web3 gamification, created for the Kiroween 2025 hackathon. The application combines multiple cutting-edge technologies to create a unique "Frankenstein" chimera that seamlessly integrates AI trip generation, blockchain rewards, interactive maps, and Halloween-themed features.

**Hackathon Category:** Frankenstein - "Stitch together a chimera of technologies into one app"

**Key Innovation:** Combining AI travel planning with blockchain-based gamification and Halloween-themed user experience.

## Technology Stack

### Frontend Core
- **Framework:** React 18.2.0 with TypeScript 5.3.0
- **Build Tool:** Vite 6.4.1 (fast HMR, optimized builds)
- **Styling:** TailwindCSS 3.3.6 with custom Halloween theme
- **State Management:** React hooks + TanStack Query 5.0.0
- **Animations:** Framer Motion 10.16.0 for premium Halloween effects

### AI & Backend Services
- **AI Engine:** Google Gemini 2.5 Pro (@google/genai 1.29.0)
  - Trip generation with personalized itineraries
  - Quest creation with location-based challenges
  - Natural language processing for user preferences
- **Backend-as-a-Service:** Supabase 2.38.0
  - PostgreSQL database (users, trips, quests, achievements)
  - Edge Functions (Deno runtime for AI calls, transit APIs)
  - Authentication (email/password + wallet connection)
  - Storage (NFT metadata, user uploads)

### Blockchain & Web3
- **Network:** Ethereum Sepolia Testnet
- **Wallet Integration:** RainbowKit 2.2.9 + wagmi 2.0.0 + viem 2.0.0
- **Smart Contracts:**
  - TPX Token (ERC-20) - Reward token for completing quests
  - NFT Passport (ERC-721) - User profile with levels and stats
  - Achievement NFTs (ERC-721) - Collectible badges for milestones

### Maps & Visualization
- **Google Maps API:** Places, Geocoding, Directions, Distance Matrix
- **Mapbox GL 3.0.0:** Interactive 3D maps with custom styling
- **Leaflet 1.9.4 + React Leaflet 4.2.1:** Fallback map rendering
- **Three.js 0.181.2:** Animated cosmos background with Halloween nebulas

### UI Components & Icons
- **Icons:** Lucide React 0.294.0 + Custom Halloween SVG icons
- **Notifications:** Sonner 2.0.7 for toast messages
- **Custom Components:** SpookyCard, GhostParticles, HalloweenLoader

## Architecture Principles

### Frontend-Only Architecture
- **No custom backend server** - All backend logic runs in Supabase Edge Functions
- **Static site deployment** - Optimized for Vercel/Netlify CDN
- **Client-side routing** - React Router for navigation
- **Progressive enhancement** - Core features work without Web3

### Data Flow
```
User Input → React Components → Services Layer → External APIs
                                      ↓
                            Supabase Edge Functions
                                      ↓
                    ┌─────────────────┴─────────────────┐
                    ↓                 ↓                 ↓
              Google Gemini      Ethereum          Google Maps
                  AI            Blockchain           + Mapbox
```

### Halloween Theme Integration
- **Core identity:** Halloween theme is integral to the TripX experience
- **Hybrid storage:** Halloween data stored in localStorage + Supabase
- **Consistent experience:** All features designed with Halloween aesthetic from the start

## Code Style Guidelines

### TypeScript Standards
- **Strict mode:** Disabled for rapid development (can be enabled post-hackathon)
- **Type safety:** Use interfaces for all data models
- **No `any` types:** Use `unknown` or proper types
- **Explicit return types:** For all exported functions

### React Component Patterns
```typescript
// Functional components with TypeScript
interface ComponentProps {
  title: string;
  onAction?: () => void;
  variant?: 'default' | 'spooky';
}

export const MyComponent: React.FC<ComponentProps> = ({ 
  title, 
  onAction, 
  variant = 'default' 
}) => {
  // Hooks at the top
  const [state, setState] = useState<string>('');
  
  // Event handlers
  const handleClick = () => {
    onAction?.();
  };
  
  // Render
  return (
    <div className="container">
      {/* JSX */}
    </div>
  );
};
```

### File Organization
```
/components
  /halloween          # Halloween-specific components
    HalloweenProvider.tsx
    SpookyCard.tsx
    GhostParticles.tsx
    HalloweenIcons.tsx
  /pages              # Page components
    /Dashboard
    /CreateTrip
    /MyTrips
  /layout             # Layout components
  [shared components] # Reusable UI components

/services             # Business logic & API calls
  aiTripService.ts
  web3Service.ts
  questService.ts
  halloweenBadgeService.ts

/hooks                # Custom React hooks
  useWalletAuth.ts
  useNFTPassport.ts
  useNotifications.ts

/types                # TypeScript interfaces
  types.ts            # Main types
  /transport.ts       # Domain-specific types

/data                 # Static data
  operators.ts
  spookyDestinations.ts
  halloweenQuests.ts

/styles               # Style utilities
  glassEffects.ts
  halloweenTheme.ts

/lib                  # Utility libraries
  supabase.ts
  googleMapsLoader.ts
```

### Naming Conventions
- **Components:** PascalCase (e.g., `SpookyCard.tsx`, `HalloweenProvider.tsx`)
- **Services:** camelCase (e.g., `badgeService.ts`, `spookyDestinationService.ts`)
- **Hooks:** camelCase with `use` prefix (e.g., `useHalloweenTheme.ts`)
- **Types/Interfaces:** PascalCase (e.g., `SpookyDestination`, `HalloweenBadge`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `HALLOWEEN_BADGES`, `SPOOKY_DESTINATIONS`)
- **CSS Classes:** kebab-case with `halloween-` prefix for theme (e.g., `halloween-glow`, `spooky-card`)

### TailwindCSS Usage
- **Prefer Tailwind classes** over inline styles
- **Use theme colors** from `halloweenTheme.ts` configuration
- **Responsive design:** Mobile-first with `sm:`, `md:`, `lg:` breakpoints
- **Custom utilities:** Define in `tailwind.config.js` for reusable patterns

```typescript
// Good: Tailwind classes
<div className="bg-deepPurple text-ghostlyWhite rounded-xl p-6 hover:scale-105 transition">

// Avoid: Inline styles
<div style={{ backgroundColor: '#1a0a2e', color: '#f0e6ff' }}>
```

## Halloween Theme Guidelines

### Color Palette
```typescript
// Primary Colors (backgrounds, main UI)
deepPurple: '#1a0a2e'      // Dark purple backgrounds
midnightBlue: '#0d1b2a'    // Secondary backgrounds
bloodOrange: '#ff6b35'     // Primary CTAs, highlights

// Accent Colors (text, icons, effects)
ghostlyWhite: '#f0e6ff'    // Primary text, light elements
pumpkinOrange: '#ff9500'   // Secondary CTAs, badges
toxicGreen: '#39ff14'      // Success states, special effects

// Gradients
spookyNight: 'linear-gradient(135deg, #1a0a2e 0%, #0d1b2a 50%, #1a0a2e 100%)'
hauntedGlow: 'linear-gradient(180deg, #ff6b35 0%, #ff9500 100%)'
```

### Component Usage
- **SpookyCard:** Use for all card-based UI (trips, quests, achievements)
- **HalloweenIcon:** Use for navigation, badges, and decorative elements
- **GhostParticles:** Background layer on main pages (Dashboard, Profile)
- **HalloweenLoader:** Replace all loading spinners
- **SpookyButton:** Use for primary and secondary CTAs

### Animation Principles
- **Subtle and smooth:** Animations should enhance, not distract
- **Performance first:** Use CSS transforms and opacity (GPU-accelerated)
- **Respect user preferences:** Check `prefers-reduced-motion` media query
- **Framer Motion:** Use for complex animations (particles, celebrations)
- **CSS transitions:** Use for simple hover effects

```typescript
// Respect reduced motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

<motion.div
  animate={prefersReducedMotion ? {} : { y: [0, -20, 0] }}
  transition={{ duration: 2, repeat: Infinity }}
>
```

### Accessibility Requirements
- **Color contrast:** Minimum 4.5:1 for normal text, 3:1 for large text (WCAG AA)
- **Keyboard navigation:** All interactive elements must be keyboard accessible
- **ARIA labels:** Add to all icons and interactive elements
- **Focus indicators:** Visible focus states for all focusable elements
- **Screen reader support:** Semantic HTML and proper ARIA attributes

## Service Layer Patterns

### API Service Structure
```typescript
// services/exampleService.ts
import { supabase } from '../lib/supabase';

export const exampleService = {
  // Fetch data
  async getData(id: string) {
    const { data, error } = await supabase
      .from('table_name')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Create data
  async createData(payload: CreatePayload) {
    const { data, error } = await supabase
      .from('table_name')
      .insert(payload)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};
```

### Error Handling
```typescript
// Consistent error handling pattern
try {
  const result = await someService.doSomething();
  return result;
} catch (error) {
  console.error('Service error:', error);
  // Show user-friendly message
  toast.error('Something went wrong. Please try again.');
  throw error; // Re-throw for component to handle
}
```

### localStorage Management
```typescript
// Consistent localStorage keys
const STORAGE_KEYS = {
  VISITED_SPOOKY: 'tripx_visited_spooky_destinations',
  HALLOWEEN_BADGES: 'tripx_halloween_badges',
  HALLOWEEN_PROGRESS: 'tripx_halloween_progress',
  USER_PREFERENCES: 'tripx_user_preferences'
};

// Always parse/stringify JSON
const getData = () => {
  const raw = localStorage.getItem(STORAGE_KEYS.VISITED_SPOOKY);
  return raw ? JSON.parse(raw) : [];
};
```

## Web3 Integration Patterns

### Wallet Connection
```typescript
// Use wagmi hooks for wallet operations
import { useAccount, useConnect, useDisconnect } from 'wagmi';

const { address, isConnected } = useAccount();
const { connect, connectors } = useConnect();
const { disconnect } = useDisconnect();
```

### Contract Interactions
```typescript
// Use viem for contract calls
import { useWriteContract, useReadContract } from 'wagmi';

// Read contract
const { data: balance } = useReadContract({
  address: TPX_TOKEN_ADDRESS,
  abi: ERC20_ABI,
  functionName: 'balanceOf',
  args: [userAddress]
});

// Write contract
const { writeContract } = useWriteContract();
await writeContract({
  address: TPX_TOKEN_ADDRESS,
  abi: ERC20_ABI,
  functionName: 'transfer',
  args: [recipientAddress, amount]
});
```

## Testing Strategy

### Unit Tests (Vitest)
- Test individual functions and components
- Mock external dependencies (Supabase, APIs)
- Focus on business logic in services

### Property-Based Tests (fast-check)
- Test universal properties across all inputs
- Minimum 100 iterations per property
- Tag with feature name and property number

```typescript
/**
 * **Feature: tripx-core, Property 9: Badge Awarding Threshold Rules**
 * **Validates: Requirements 17.1, 17.2, 17.3**
 */
it('should award Ghost Hunter badge when spooky destinations >= 3', () => {
  fc.assert(
    fc.property(
      fc.integer({ min: 3, max: 100 }),
      (destinationsVisited) => {
        const result = checkBadgeEligibility({
          spookyDestinationsVisited: destinationsVisited
        });
        expect(result.badges).toContain('ghost-hunter');
      }
    ),
    { numRuns: 100 }
  );
});
```

## Performance Guidelines

### Bundle Size Optimization
- **Code splitting:** Lazy load routes and heavy components
- **Tree shaking:** Import only what you need from libraries
- **Image optimization:** Use WebP format, lazy loading
- **Font optimization:** Subset fonts, preload critical fonts

### Runtime Performance
- **Memoization:** Use `useMemo` and `useCallback` for expensive computations
- **Virtual scrolling:** For long lists (quests, trips)
- **Debouncing:** For search inputs and API calls
- **Lazy loading:** For images and non-critical components

```typescript
// Lazy load routes
const SpookyDestinations = lazy(() => import('./pages/SpookyDestinations'));

// Memoize expensive computations
const sortedDestinations = useMemo(() => 
  destinations.sort((a, b) => b.spookinessRating - a.spookinessRating),
  [destinations]
);
```

## Git Workflow

### Commit Message Format
```
type(scope): subject

body (optional)

footer (optional)
```

**Types:** feat, fix, docs, style, refactor, test, chore

**Examples:**
- `feat(halloween): add SpookyCard component`
- `fix(web3): handle wallet connection errors`
- `docs(readme): update installation instructions`

### Branch Strategy
- `main` - Production-ready code
- `develop` - Integration branch
- `feature/halloween-theme` - Feature branches
- `fix/wallet-connection` - Bug fix branches

## Environment Variables

### Required Variables
```env
# Supabase
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...

# Google APIs
VITE_GOOGLE_MAPS_API_KEY=AIza...
VITE_GEMINI_API_KEY=AIza...

# Mapbox
VITE_MAPBOX_TOKEN=pk.eyJ...

# Web3
VITE_WALLETCONNECT_PROJECT_ID=xxx

# Ethereum Contracts (Sepolia)
VITE_TPX_TOKEN_ADDRESS=0x...
VITE_NFT_PASSPORT_ADDRESS=0x...
VITE_ACHIEVEMENT_NFT_ADDRESS=0x...
```

### Security Notes
- **Never commit `.env` files** - Use `.env.example` with placeholders
- **Use Vite prefix** - All env vars must start with `VITE_` to be exposed
- **Rotate keys regularly** - Especially for production deployments

## Deployment Checklist

### Pre-Deployment
- [ ] Run `npm run build` successfully
- [ ] Test production build locally with `npm run preview`
- [ ] Verify all environment variables are set
- [ ] Check bundle size (< 500KB gzipped initial load)
- [ ] Test on mobile devices
- [ ] Verify Web3 connection on Sepolia testnet

### Vercel Deployment
1. Connect GitHub repository
2. Set environment variables in Vercel dashboard
3. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
4. Deploy and test live URL

### Post-Deployment
- [ ] Verify all pages load correctly
- [ ] Test AI trip generation
- [ ] Test wallet connection and transactions
- [ ] Test quest completion flow
- [ ] Check console for errors
- [ ] Verify analytics tracking (if enabled)

## Kiro Usage Best Practices

### Vibe Coding
- Use conversational prompts for rapid prototyping
- Iterate on generated code with follow-up prompts
- Document impressive generations in KIRO_USAGE.md

### Spec-Driven Development
- Start with requirements.md for clear acceptance criteria
- Create design.md with architecture and correctness properties
- Generate tasks.md with actionable implementation steps
- Execute tasks incrementally with Kiro assistance

### Steering Documents
- Keep this document updated as architecture evolves
- Reference in prompts: "Follow the patterns in project-steering.md"
- Use for onboarding new team members or AI sessions

### Agent Hooks
- Automate repetitive tasks (linting, type-checking, testing)
- Trigger on file save, commit, or custom events
- Keep hooks fast (< 5 seconds) to avoid blocking workflow

## Resources & References

### Documentation
- [React Docs](https://react.dev)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [wagmi Docs](https://wagmi.sh)
- [Framer Motion Docs](https://www.framer.com/motion)

### Design Inspiration
- [Dribbble - Halloween UI](https://dribbble.com/search/halloween-ui)
- [Awwwards - Dark Theme](https://www.awwwards.com/websites/dark/)

### Hackathon Resources
- [Kiroween Rules](./kiroweenrules.md)
- [Devpost Submission Guidelines](https://kiroween.devpost.com)

---

**Created:** October 31, 2025
**Last Updated:** December 1, 2025
**Hackathon:** Kiroween 2025 - Frankenstein Category
