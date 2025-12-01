/**
 * Halloween Quests Data
 * 
 * Special Halloween-themed quests for the Kiroween hackathon.
 * Requirements: 16.2
 */

// Using Quest interface from types.ts
// These quests have category: 'halloween' for filtering

export interface HalloweenQuestData {
  id: string;
  title: string;
  description: string;
  category: 'halloween';
  difficulty: 'easy' | 'medium' | 'hard' | 'legendary';
  xpReward: number;
  tokenReward: number;
  nftReward: boolean;
  nftImageUrl?: string;
  location: {
    name: string;
    coordinates: { lat: number; lng: number };
  };
  requirements: string[];
  timeLimit: string;
  status: 'available' | 'in_progress' | 'completed' | 'claimed';
  destinationId?: string; // Link to spooky destination
}

export const HALLOWEEN_QUESTS: HalloweenQuestData[] = [
  // === STARTER QUESTS ===
  {
    id: 'halloween-ghost-hunter-initiation',
    title: 'Ghost Hunter Initiation',
    description: 'Visit your first spooky destination and document paranormal activity. Take photos, record sounds, and share your experience.',
    category: 'halloween',
    difficulty: 'easy',
    xpReward: 100,
    tokenReward: 50,
    nftReward: true,
    nftImageUrl: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/ghost-hunter-badge.png',
    location: {
      name: 'Any Spooky Destination',
      coordinates: { lat: 0, lng: 0 },
    },
    requirements: [
      'Visit 1 spooky destination',
      'Take 3 photos',
      'Write a short experience report',
    ],
    timeLimit: '7 days',
    status: 'available',
  },
  {
    id: 'halloween-first-scare',
    title: 'First Scare',
    description: 'Experience your first haunted location. Document the atmosphere and any unusual occurrences.',
    category: 'halloween',
    difficulty: 'easy',
    xpReward: 75,
    tokenReward: 25,
    nftReward: true,
    nftImageUrl: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/first-scare.png',
    location: {
      name: 'Any Haunted Location',
      coordinates: { lat: 0, lng: 0 },
    },
    requirements: [
      'Visit any haunted location',
      'Stay for at least 30 minutes',
      'Document your experience',
    ],
    timeLimit: '3 days',
    status: 'available',
  },

  // === LOCATION-SPECIFIC QUESTS ===
  {
    id: 'halloween-vampire-chronicles',
    title: 'Vampire Chronicles',
    description: 'Follow in the footsteps of legendary vampires. Visit Bran Castle and uncover the truth behind Dracula.',
    category: 'halloween',
    difficulty: 'hard',
    xpReward: 500,
    tokenReward: 100,
    nftReward: true,
    nftImageUrl: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/vampire-hunter.png',
    location: {
      name: "Bran Castle, Romania",
      coordinates: { lat: 45.5152, lng: 25.3673 },
    },
    requirements: [
      'Visit Bran Castle',
      'Complete the Vampire Legends Tour',
      'Learn about Vlad the Impaler',
      'Take a photo at the castle entrance',
    ],
    timeLimit: '21 days',
    status: 'available',
    destinationId: 'bran-castle',
  },
  {
    id: 'halloween-witch-trial-historian',
    title: 'Witch Trial Historian',
    description: 'Explore the history of witch trials in Salem. Visit key locations and learn about this dark chapter in history.',
    category: 'halloween',
    difficulty: 'medium',
    xpReward: 400,
    tokenReward: 80,
    nftReward: true,
    nftImageUrl: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/witch-historian.png',
    location: {
      name: 'Salem, Massachusetts',
      coordinates: { lat: 42.5195, lng: -70.8967 },
    },
    requirements: [
      'Visit Salem Witch Trial Memorial',
      'Complete the Witch Trial Walking Tour',
      'Visit the Witch Museum',
      'Write a reflection on historical injustice',
    ],
    timeLimit: '14 days',
    status: 'available',
    destinationId: 'salem-witch-trials',
  },
  {
    id: 'halloween-catacombs-explorer',
    title: 'Catacombs Explorer',
    description: 'Descend into the Paris Catacombs and walk among 6 million souls. Document the bone arrangements and history.',
    category: 'halloween',
    difficulty: 'hard',
    xpReward: 550,
    tokenReward: 110,
    nftReward: true,
    nftImageUrl: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/catacombs-explorer.png',
    location: {
      name: 'Paris Catacombs, France',
      coordinates: { lat: 48.8338, lng: 2.3324 },
    },
    requirements: [
      'Complete the official Catacombs tour',
      'Document 10 unique bone arrangements',
      'Learn about the history of the ossuary',
      'Take photos (where permitted)',
    ],
    timeLimit: '14 days',
    status: 'available',
    destinationId: 'paris-catacombs',
  },
  {
    id: 'halloween-edinburgh-ghost-hunt',
    title: 'Edinburgh Ghost Hunt',
    description: 'Explore the haunted underground vaults of Edinburgh. Participate in a paranormal investigation.',
    category: 'halloween',
    difficulty: 'hard',
    xpReward: 500,
    tokenReward: 100,
    nftReward: true,
    nftImageUrl: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/edinburgh-ghost.png',
    location: {
      name: 'Edinburgh Underground Vaults',
      coordinates: { lat: 55.9486, lng: -3.1864 },
    },
    requirements: [
      'Complete a ghost tour of the vaults',
      'Participate in paranormal investigation',
      'Document any unusual experiences',
      'Visit at least 3 different chambers',
    ],
    timeLimit: '7 days',
    status: 'available',
    destinationId: 'edinburgh-vaults',
  },
  {
    id: 'halloween-chernobyl-survivor',
    title: 'Chernobyl Survivor',
    description: 'Explore the abandoned city of Pripyat in the Chernobyl Exclusion Zone. Document the ghost town frozen in time.',
    category: 'halloween',
    difficulty: 'legendary',
    xpReward: 1000,
    tokenReward: 300,
    nftReward: true,
    nftImageUrl: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/chernobyl-survivor.png',
    location: {
      name: 'Chernobyl Exclusion Zone, Ukraine',
      coordinates: { lat: 51.3890, lng: 30.0992 },
    },
    requirements: [
      'Complete official guided tour',
      'Visit Reactor 4 viewing area',
      'Explore abandoned Pripyat',
      'Document the ghost town atmosphere',
      'Learn about the 1986 disaster',
    ],
    timeLimit: '30 days',
    status: 'available',
    destinationId: 'chernobyl',
  },
  {
    id: 'halloween-bone-church-pilgrimage',
    title: 'Bone Church Pilgrimage',
    description: 'Visit the Sedlec Ossuary and witness art made from 40,000 human skeletons.',
    category: 'halloween',
    difficulty: 'medium',
    xpReward: 400,
    tokenReward: 80,
    nftReward: true,
    nftImageUrl: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/bone-church.png',
    location: {
      name: 'Sedlec Ossuary, Czech Republic',
      coordinates: { lat: 49.9617, lng: 15.2881 },
    },
    requirements: [
      'Visit the Sedlec Ossuary',
      'Document the bone chandelier',
      'Learn about the Black Death connection',
      'Take photos of the bone decorations',
    ],
    timeLimit: '14 days',
    status: 'available',
    destinationId: 'bone-church',
  },
  {
    id: 'halloween-island-of-dolls',
    title: 'Island of the Dolls',
    description: 'Navigate to the creepy Island of the Dolls in Mexico and document the hanging dolls.',
    category: 'halloween',
    difficulty: 'hard',
    xpReward: 550,
    tokenReward: 120,
    nftReward: true,
    nftImageUrl: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/island-dolls.png',
    location: {
      name: 'Xochimilco, Mexico City',
      coordinates: { lat: 19.2833, lng: -99.0833 },
    },
    requirements: [
      'Take boat tour to the island',
      'Document at least 20 different dolls',
      'Learn about Don Julián\'s story',
      'Spend at least 1 hour on the island',
    ],
    timeLimit: '21 days',
    status: 'available',
    destinationId: 'island-of-dolls',
  },
  {
    id: 'halloween-tower-of-london',
    title: 'Tower of Terror',
    description: 'Explore the Tower of London and learn about its dark history of executions and torture.',
    category: 'halloween',
    difficulty: 'medium',
    xpReward: 450,
    tokenReward: 90,
    nftReward: true,
    nftImageUrl: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/tower-london.png',
    location: {
      name: 'Tower of London, UK',
      coordinates: { lat: 51.5081, lng: -0.0759 },
    },
    requirements: [
      'Complete Yeoman Warder tour',
      'Visit the execution site',
      'See the ravens',
      'Learn about Anne Boleyn\'s ghost',
    ],
    timeLimit: '7 days',
    status: 'available',
    destinationId: 'tower-of-london',
  },
  {
    id: 'halloween-eastern-state',
    title: 'Prison Break',
    description: 'Explore the crumbling Eastern State Penitentiary and experience Terror Behind the Walls.',
    category: 'halloween',
    difficulty: 'hard',
    xpReward: 500,
    tokenReward: 100,
    nftReward: true,
    nftImageUrl: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/eastern-state.png',
    location: {
      name: 'Philadelphia, Pennsylvania',
      coordinates: { lat: 39.9683, lng: -75.1727 },
    },
    requirements: [
      'Complete day tour of the prison',
      'Visit Al Capone\'s cell',
      'Experience Terror Behind the Walls (October)',
      'Document the decay and atmosphere',
    ],
    timeLimit: '14 days',
    status: 'available',
    destinationId: 'eastern-state-penitentiary',
  },
  {
    id: 'halloween-waverly-hills',
    title: 'Sanatorium Survivor',
    description: 'Spend a night at Waverly Hills Sanatorium, one of the most haunted places in America.',
    category: 'halloween',
    difficulty: 'legendary',
    xpReward: 800,
    tokenReward: 200,
    nftReward: true,
    nftImageUrl: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/waverly-hills.png',
    location: {
      name: 'Louisville, Kentucky',
      coordinates: { lat: 38.1606, lng: -85.8342 },
    },
    requirements: [
      'Complete overnight paranormal investigation',
      'Explore the Death Tunnel',
      'Document any paranormal activity',
      'Learn about the tuberculosis history',
    ],
    timeLimit: '30 days',
    status: 'available',
    destinationId: 'waverly-hills',
  },

  // === ACHIEVEMENT QUESTS ===
  {
    id: 'halloween-paranormal-investigator',
    title: 'Paranormal Investigator',
    description: 'Become a true paranormal investigator by visiting 3 different haunted locations.',
    category: 'halloween',
    difficulty: 'medium',
    xpReward: 300,
    tokenReward: 150,
    nftReward: true,
    nftImageUrl: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/paranormal-investigator.png',
    location: {
      name: 'Multiple Spooky Destinations',
      coordinates: { lat: 0, lng: 0 },
    },
    requirements: [
      'Visit 3 different spooky destinations',
      'Complete a paranormal activity at each location',
      'Collect evidence (photos, recordings, notes)',
      'Submit a comparative analysis',
    ],
    timeLimit: '30 days',
    status: 'available',
  },
  {
    id: 'halloween-graveyard-shift',
    title: 'Graveyard Shift',
    description: 'Visit a historic cemetery or catacombs at night. Experience the atmosphere and learn about the history.',
    category: 'halloween',
    difficulty: 'hard',
    xpReward: 500,
    tokenReward: 250,
    nftReward: true,
    nftImageUrl: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/graveyard-shift.png',
    location: {
      name: 'Historic Cemetery or Catacombs',
      coordinates: { lat: 0, lng: 0 },
    },
    requirements: [
      'Visit a cemetery/catacombs during evening hours',
      'Complete a guided night tour',
      'Document 5 interesting historical facts',
      'Share your experience with photos',
    ],
    timeLimit: '14 days',
    status: 'available',
  },
  {
    id: 'halloween-master-of-darkness',
    title: 'Master of Darkness',
    description: 'Complete 10 spooky destination quests and become a true Master of Darkness.',
    category: 'halloween',
    difficulty: 'legendary',
    xpReward: 2000,
    tokenReward: 500,
    nftReward: true,
    nftImageUrl: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/master-darkness.png',
    location: {
      name: 'Worldwide',
      coordinates: { lat: 0, lng: 0 },
    },
    requirements: [
      'Complete 10 spooky destination quests',
      'Earn at least 5000 XP from Halloween quests',
      'Collect 5 Halloween NFTs',
      'Visit destinations in at least 3 countries',
    ],
    timeLimit: '90 days',
    status: 'available',
  },
];
