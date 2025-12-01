# Design Document: NFT Passport System

## Overview

The NFT Passport system creates blockchain-based travel profiles on Ethereum Sepolia. The system uses ERC-721 smart contracts with an admin wallet paying gas fees so users can mint for free. The passport display features Halloween-themed visual effects.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  NFTPassport Component                                    │  │
│  │  - Display passport with Halloween overlay               │  │
│  │  - Show stats and tier                                    │  │
│  │  - Mint/Update buttons                                    │  │
│  └────────────────────────┬─────────────────────────────────┘  │
└────────────────────────────┼────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              SERVICES (web3Service.ts)                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  mintNFTPassport() - Admin wallet pays gas               │  │
│  │  getNFTPassportTokenId() - Verify ownership              │  │
│  │  updateNFTPassportMetadata() - Update stats              │  │
│  │  readContractWithFallback() - Multi-RPC reliability      │  │
│  └────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│           ETHEREUM SEPOLIA BLOCKCHAIN                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  NFT Passport Smart Contract (ERC-721)                   │  │
│  │  - mint(address to, string metadataURI, string tier)     │  │
│  │  - updateMetadata(tokenId, URI, tier)                    │  │
│  │  - ownerOf(tokenId) → address                            │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### NFT Metadata

```typescript
interface NFTPassportMetadata {
  name: string;
  description: string;
  image: string;
  attributes: [
    { trait_type: "Level", value: number },
    { trait_type: "XP", value: number },
    { trait_type: "Tier", value: string },
    { trait_type: "Trips Completed", value: number },
    { trait_type: "Quests Completed", value: number }
  ];
}
```

### Tier Calculation

```typescript
function calculateTier(level: number): string {
  if (level >= 76) return 'Diamond';
  if (level >= 51) return 'Platinum';
  if (level >= 26) return 'Gold';
  if (level >= 11) return 'Silver';
  return 'Bronze';
}
```

### Multi-RPC Fallback

```typescript
const RPC_PROVIDERS = [
  'https://ethereum-sepolia.publicnode.com',
  'https://rpc.sepolia.org',
  'https://ethereum-sepolia-rpc.publicnode.com',
  'https://1rpc.io/sepolia'
];

async function readContractWithFallback(params: any): Promise<any> {
  for (const rpc of RPC_PROVIDERS) {
    try {
      const client = createPublicClient({
        chain: sepolia,
        transport: http(rpc, { timeout: 10000 })
      });
      return await client.readContract(params);
    } catch (error) {
      continue;
    }
  }
  throw new Error('All RPCs failed');
}
```

### Halloween Passport Overlay

```typescript
// components/halloween/HalloweenPassportOverlay.tsx
const HalloweenPassportOverlay: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none">
    {/* Animated cobweb corners */}
    <motion.div className="absolute top-0 left-0">
      <HalloweenIcon name="cobweb" />
    </motion.div>
    
    {/* Mystical border glow */}
    <motion.div
      className="absolute inset-0 rounded-2xl"
      style={{ border: '2px solid transparent', background: 'gradient...' }}
      animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
    />
    
    {/* Floating candle flames */}
    <div className="absolute bottom-4 left-4 flex gap-2">
      {[...Array(3)].map((_, i) => (
        <motion.div key={i} animate={{ y: [0, -5, 0] }}>🕯️</motion.div>
      ))}
    </div>
  </div>
);
```

## Testing Strategy

- Unit tests for tier calculation
- Integration tests with mock contract
- Multi-RPC fallback tests
