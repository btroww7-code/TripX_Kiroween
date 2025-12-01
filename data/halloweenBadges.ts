/**
 * Halloween Badges Data
 * 
 * Collectible badges for Halloween achievements.
 * Requirements: 17.1, 17.2, 17.3
 */

import { HalloweenBadge } from '../types/halloween';

export const HALLOWEEN_BADGES: HalloweenBadge[] = [
  // === COMMON BADGES ===
  {
    id: 'spooky-explorer',
    name: 'Spooky Explorer',
    description: 'Visit your first spooky destination and begin your paranormal journey.',
    icon: 'hauntedCastle',
    rarity: 'common',
    imageUrl: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/badge-spooky-explorer.png',
    requirement: {
      type: 'spooky_destinations',
      count: 1,
      description: 'Visit 1 spooky destination',
    },
  },
  {
    id: 'witch-apprentice',
    name: 'Witch Apprentice',
    description: 'Complete your first Halloween quest and start your magical training.',
    icon: 'witchBroom',
    rarity: 'common',
    imageUrl: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/badge-witch-apprentice.png',
    requirement: {
      type: 'halloween_quests',
      count: 1,
      description: 'Complete 1 Halloween quest',
    },
  },
  {
    id: 'token-collector',
    name: 'Token Collector',
    description: 'Earn your first 100 TPX tokens from Halloween activities.',
    icon: 'candyCorn',
    rarity: 'common',
    imageUrl: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/badge-token-collector.png',
    requirement: {
      type: 'tokens_earned',
      count: 100,
      description: 'Earn 100 TPX tokens',
    },
  },

  // === RARE BADGES ===
  {
    id: 'ghost-hunter',
    name: 'Ghost Hunter',
    description: 'Visit 3 spooky destinations and document your paranormal experiences.',
    icon: 'ghost',
    rarity: 'rare',
    imageUrl: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/badge-ghost-hunter.png',
    requirement: {
      type: 'spooky_destinations',
      count: 3,
      description: 'Visit 3 spooky destinations',
    },
  },
  {
    id: 'quest-seeker',
    name: 'Quest Seeker',
    description: 'Complete 3 Halloween quests and prove your dedication.',
    icon: 'skull',
    rarity: 'rare',
    imageUrl: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/badge-quest-seeker.png',
    requirement: {
      type: 'halloween_quests',
      count: 3,
      description: 'Complete 3 Halloween quests',
    },
  },
  {
    id: 'treasure-hunter',
    name: 'Treasure Hunter',
    description: 'Earn 300 TPX tokens from Halloween activities.',
    icon: 'cauldron',
    rarity: 'rare',
    imageUrl: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/badge-treasure-hunter.png',
    requirement: {
      type: 'tokens_earned',
      count: 300,
      description: 'Earn 300 TPX tokens',
    },
  },

  // === EPIC BADGES ===
  {
    id: 'pumpkin-master',
    name: 'Pumpkin Master',
    description: 'Complete 5 Halloween quests and prove your dedication to the spooky season.',
    icon: 'pumpkin',
    rarity: 'epic',
    imageUrl: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/badge-pumpkin-master.png',
    requirement: {
      type: 'halloween_quests',
      count: 5,
      description: 'Complete 5 Halloween quests',
    },
  },
  {
    id: 'paranormal-expert',
    name: 'Paranormal Expert',
    description: 'Visit 5 spooky destinations and become a paranormal expert.',
    icon: 'bat',
    rarity: 'epic',
    imageUrl: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/badge-paranormal-expert.png',
    requirement: {
      type: 'spooky_destinations',
      count: 5,
      description: 'Visit 5 spooky destinations',
    },
  },
  {
    id: 'wealthy-witch',
    name: 'Wealthy Witch',
    description: 'Earn 500 TPX tokens from Halloween activities.',
    icon: 'witchHat',
    rarity: 'epic',
    imageUrl: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/badge-wealthy-witch.png',
    requirement: {
      type: 'tokens_earned',
      count: 500,
      description: 'Earn 500 TPX tokens',
    },
  },

  // === LEGENDARY BADGES ===
  {
    id: 'candy-collector',
    name: 'Candy Collector',
    description: 'Earn 1000 TPX tokens during the Halloween season through quests and achievements.',
    icon: 'candyCorn',
    rarity: 'legendary',
    imageUrl: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/badge-candy-collector.png',
    requirement: {
      type: 'tokens_earned',
      count: 1000,
      description: 'Earn 1000 TPX tokens in Halloween season',
    },
  },
  {
    id: 'master-of-darkness',
    name: 'Master of Darkness',
    description: 'Visit 10 spooky destinations and become a true Master of Darkness.',
    icon: 'tombstone',
    rarity: 'legendary',
    imageUrl: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/badge-master-of-darkness.png',
    requirement: {
      type: 'spooky_destinations',
      count: 10,
      description: 'Visit 10 spooky destinations',
    },
  },
  {
    id: 'halloween-legend',
    name: 'Halloween Legend',
    description: 'Complete 10 Halloween quests and become a Halloween Legend.',
    icon: 'spider',
    rarity: 'legendary',
    imageUrl: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/badge-halloween-legend.png',
    requirement: {
      type: 'halloween_quests',
      count: 10,
      description: 'Complete 10 Halloween quests',
    },
  },
];
