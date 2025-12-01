/**
 * Halloween NFT Service
 * 
 * Handles minting and managing Halloween-themed NFTs for spooky destinations and quests.
 * Direct blockchain interactions without Supabase UUID requirements.
 * Requirements: 16.2, 17.1
 */

import { supabase } from '../lib/supabase';
import * as web3Service from './web3Service';

// Halloween NFT metadata templates
export const HALLOWEEN_NFT_METADATA = {
  // Destination NFTs
  'bran-castle': {
    name: "Dracula's Castle Explorer",
    description: "You've visited the legendary Bran Castle in Romania, home of the Dracula legend.",
    image: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/bran-castle.png',
    attributes: [
      { trait_type: 'Location', value: 'Bran Castle, Romania' },
      { trait_type: 'Spookiness', value: '5/5' },
      { trait_type: 'Category', value: 'Vampire' },
      { trait_type: 'Season', value: 'Halloween 2025' },
    ],
  },
  'edinburgh-vaults': {
    name: 'Edinburgh Ghost Hunter',
    description: "You've explored the haunted underground vaults of Edinburgh.",
    image: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/edinburgh-vaults.png',
    attributes: [
      { trait_type: 'Location', value: 'Edinburgh, Scotland' },
      { trait_type: 'Spookiness', value: '5/5' },
      { trait_type: 'Category', value: 'Paranormal' },
      { trait_type: 'Season', value: 'Halloween 2025' },
    ],
  },
  'paris-catacombs': {
    name: 'Catacombs Explorer',
    description: "You've walked among 6 million souls in the Paris Catacombs.",
    image: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/paris-catacombs.png',
    attributes: [
      { trait_type: 'Location', value: 'Paris, France' },
      { trait_type: 'Spookiness', value: '5/5' },
      { trait_type: 'Category', value: 'Ossuary' },
      { trait_type: 'Season', value: 'Halloween 2025' },
    ],
  },
  'chernobyl': {
    name: 'Chernobyl Survivor',
    description: "You've explored the abandoned Chernobyl Exclusion Zone.",
    image: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/chernobyl.png',
    attributes: [
      { trait_type: 'Location', value: 'Pripyat, Ukraine' },
      { trait_type: 'Spookiness', value: '5/5' },
      { trait_type: 'Category', value: 'Abandoned' },
      { trait_type: 'Season', value: 'Halloween 2025' },
      { trait_type: 'Rarity', value: 'Legendary' },
    ],
  },
  'salem-witch-trials': {
    name: 'Witch Trial Historian',
    description: "You've explored the history of the Salem Witch Trials.",
    image: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/salem-witch.png',
    attributes: [
      { trait_type: 'Location', value: 'Salem, Massachusetts' },
      { trait_type: 'Spookiness', value: '4/5' },
      { trait_type: 'Category', value: 'Historical' },
      { trait_type: 'Season', value: 'Halloween 2025' },
    ],
  },
  'tower-of-london': {
    name: 'Tower of Terror Survivor',
    description: "You've explored the haunted Tower of London.",
    image: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/tower-london.png',
    attributes: [
      { trait_type: 'Location', value: 'London, UK' },
      { trait_type: 'Spookiness', value: '5/5' },
      { trait_type: 'Category', value: 'Castle' },
      { trait_type: 'Season', value: 'Halloween 2025' },
    ],
  },
  'bone-church': {
    name: 'Bone Church Pilgrim',
    description: "You've visited the Sedlec Ossuary decorated with 40,000 skeletons.",
    image: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/bone-church.png',
    attributes: [
      { trait_type: 'Location', value: 'Kutná Hora, Czech Republic' },
      { trait_type: 'Spookiness', value: '5/5' },
      { trait_type: 'Category', value: 'Ossuary' },
      { trait_type: 'Season', value: 'Halloween 2025' },
    ],
  },
  'island-of-dolls': {
    name: 'Island of Dolls Explorer',
    description: "You've visited the creepy Island of the Dolls in Mexico.",
    image: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/island-dolls.png',
    attributes: [
      { trait_type: 'Location', value: 'Xochimilco, Mexico' },
      { trait_type: 'Spookiness', value: '5/5' },
      { trait_type: 'Category', value: 'Paranormal' },
      { trait_type: 'Season', value: 'Halloween 2025' },
    ],
  },
  'waverly-hills': {
    name: 'Sanatorium Survivor',
    description: "You've survived a night at Waverly Hills Sanatorium.",
    image: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/waverly-hills.png',
    attributes: [
      { trait_type: 'Location', value: 'Louisville, Kentucky' },
      { trait_type: 'Spookiness', value: '5/5' },
      { trait_type: 'Category', value: 'Hospital' },
      { trait_type: 'Season', value: 'Halloween 2025' },
      { trait_type: 'Rarity', value: 'Legendary' },
    ],
  },
  'eastern-state-penitentiary': {
    name: 'Prison Break Survivor',
    description: "You've explored the haunted Eastern State Penitentiary.",
    image: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/eastern-state.png',
    attributes: [
      { trait_type: 'Location', value: 'Philadelphia, Pennsylvania' },
      { trait_type: 'Spookiness', value: '5/5' },
      { trait_type: 'Category', value: 'Prison' },
      { trait_type: 'Season', value: 'Halloween 2025' },
    ],
  },
  'catacombs-rome': {
    name: 'Capuchin Crypt Explorer',
    description: "You've visited the Capuchin Crypt in Rome with 3,700 skeletal remains.",
    image: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/capuchin-crypt.png',
    attributes: [
      { trait_type: 'Location', value: 'Rome, Italy' },
      { trait_type: 'Spookiness', value: '4/5' },
      { trait_type: 'Category', value: 'Crypt' },
      { trait_type: 'Season', value: 'Halloween 2025' },
    ],
  },
  'poveglia-island': {
    name: 'Poveglia Island Survivor',
    description: "You've visited the haunted Poveglia Island in the Venetian Lagoon.",
    image: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/poveglia.png',
    attributes: [
      { trait_type: 'Location', value: 'Venice, Italy' },
      { trait_type: 'Spookiness', value: '5/5' },
      { trait_type: 'Category', value: 'Island' },
      { trait_type: 'Season', value: 'Halloween 2025' },
      { trait_type: 'Rarity', value: 'Legendary' },
    ],
  },
  'hellfire-caves': {
    name: 'Hellfire Caves Explorer',
    description: "You've explored the mysterious Hellfire Caves of the secret society.",
    image: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/hellfire-caves.png',
    attributes: [
      { trait_type: 'Location', value: 'West Wycombe, UK' },
      { trait_type: 'Spookiness', value: '4/5' },
      { trait_type: 'Category', value: 'Caves' },
      { trait_type: 'Season', value: 'Halloween 2025' },
    ],
  },
  'aokigahara-forest': {
    name: 'Aokigahara Forest Explorer',
    description: "You've walked through the mysterious Sea of Trees at Mount Fuji.",
    image: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/aokigahara.png',
    attributes: [
      { trait_type: 'Location', value: 'Mount Fuji, Japan' },
      { trait_type: 'Spookiness', value: '5/5' },
      { trait_type: 'Category', value: 'Forest' },
      { trait_type: 'Season', value: 'Halloween 2025' },
    ],
  },
  'hill-of-crosses': {
    name: 'Hill of Crosses Pilgrim',
    description: "You've visited the haunting Hill of Crosses in Lithuania.",
    image: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/hill-crosses.png',
    attributes: [
      { trait_type: 'Location', value: 'Šiauliai, Lithuania' },
      { trait_type: 'Spookiness', value: '3/5' },
      { trait_type: 'Category', value: 'Memorial' },
      { trait_type: 'Season', value: 'Halloween 2025' },
    ],
  },
  'prague-cemetery': {
    name: 'Prague Cemetery Explorer',
    description: "You've explored the ancient Old Jewish Cemetery in Prague.",
    image: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/prague-cemetery.png',
    attributes: [
      { trait_type: 'Location', value: 'Prague, Czech Republic' },
      { trait_type: 'Spookiness', value: '4/5' },
      { trait_type: 'Category', value: 'Cemetery' },
      { trait_type: 'Season', value: 'Halloween 2025' },
    ],
  },
  'gettysburg-battlefield': {
    name: 'Gettysburg Ghost Hunter',
    description: "You've walked the haunted grounds of Gettysburg Battlefield.",
    image: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/gettysburg.png',
    attributes: [
      { trait_type: 'Location', value: 'Gettysburg, Pennsylvania' },
      { trait_type: 'Spookiness', value: '4/5' },
      { trait_type: 'Category', value: 'Battlefield' },
      { trait_type: 'Season', value: 'Halloween 2025' },
    ],
  },
  'monte-cristo-homestead': {
    name: 'Monte Cristo Survivor',
    description: "You've survived a visit to Australia's most haunted house.",
    image: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/monte-cristo.png',
    attributes: [
      { trait_type: 'Location', value: 'Junee, Australia' },
      { trait_type: 'Spookiness', value: '5/5' },
      { trait_type: 'Category', value: 'Mansion' },
      { trait_type: 'Season', value: 'Halloween 2025' },
    ],
  },
  'highgate-cemetery': {
    name: 'Highgate Cemetery Explorer',
    description: "You've explored the Gothic Victorian Highgate Cemetery.",
    image: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/highgate.png',
    attributes: [
      { trait_type: 'Location', value: 'London, UK' },
      { trait_type: 'Spookiness', value: '4/5' },
      { trait_type: 'Category', value: 'Cemetery' },
      { trait_type: 'Season', value: 'Halloween 2025' },
    ],
  },

  // Halloween Quest NFTs (from data/halloweenQuests.ts)
  'halloween-ghost-hunter-initiation': {
    name: 'Ghost Hunter Initiation',
    description: 'Completed the Ghost Hunter Initiation quest - your first step into the paranormal world.',
    image: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/ghost-hunter-badge.png',
    attributes: [
      { trait_type: 'Quest', value: 'Ghost Hunter Initiation' },
      { trait_type: 'Difficulty', value: 'Easy' },
      { trait_type: 'Category', value: 'Halloween Quest' },
      { trait_type: 'Season', value: 'Halloween 2025' },
    ],
  },
  'halloween-first-scare': {
    name: 'First Scare',
    description: 'Experienced your first haunted location and lived to tell the tale.',
    image: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/first-scare.png',
    attributes: [
      { trait_type: 'Quest', value: 'First Scare' },
      { trait_type: 'Difficulty', value: 'Easy' },
      { trait_type: 'Category', value: 'Halloween Quest' },
      { trait_type: 'Season', value: 'Halloween 2025' },
    ],
  },
  'halloween-vampire-chronicles': {
    name: 'Vampire Chronicles',
    description: 'Followed in the footsteps of legendary vampires at Bran Castle.',
    image: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/vampire-hunter.png',
    attributes: [
      { trait_type: 'Quest', value: 'Vampire Chronicles' },
      { trait_type: 'Difficulty', value: 'Hard' },
      { trait_type: 'Category', value: 'Halloween Quest' },
      { trait_type: 'Season', value: 'Halloween 2025' },
    ],
  },
  'halloween-witch-trial-historian': {
    name: 'Witch Trial Historian',
    description: 'Explored the dark history of the Salem Witch Trials.',
    image: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/witch-historian.png',
    attributes: [
      { trait_type: 'Quest', value: 'Witch Trial Historian' },
      { trait_type: 'Difficulty', value: 'Medium' },
      { trait_type: 'Category', value: 'Halloween Quest' },
      { trait_type: 'Season', value: 'Halloween 2025' },
    ],
  },
  'halloween-catacombs-explorer': {
    name: 'Catacombs Explorer',
    description: 'Descended into the Paris Catacombs and walked among 6 million souls.',
    image: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/catacombs-explorer.png',
    attributes: [
      { trait_type: 'Quest', value: 'Catacombs Explorer' },
      { trait_type: 'Difficulty', value: 'Hard' },
      { trait_type: 'Category', value: 'Halloween Quest' },
      { trait_type: 'Season', value: 'Halloween 2025' },
    ],
  },
  'halloween-paranormal-investigator': {
    name: 'Paranormal Investigator',
    description: 'Became a true paranormal investigator by visiting 3 different haunted locations.',
    image: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/paranormal-investigator.png',
    attributes: [
      { trait_type: 'Quest', value: 'Paranormal Investigator' },
      { trait_type: 'Difficulty', value: 'Medium' },
      { trait_type: 'Category', value: 'Halloween Quest' },
      { trait_type: 'Season', value: 'Halloween 2025' },
    ],
  },
  'halloween-graveyard-shift': {
    name: 'Graveyard Shift',
    description: 'Visited a historic cemetery or catacombs at night.',
    image: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/graveyard-shift.png',
    attributes: [
      { trait_type: 'Quest', value: 'Graveyard Shift' },
      { trait_type: 'Difficulty', value: 'Hard' },
      { trait_type: 'Category', value: 'Halloween Quest' },
      { trait_type: 'Season', value: 'Halloween 2025' },
    ],
  },
  'halloween-master-of-darkness': {
    name: 'Master of Darkness',
    description: 'Completed 10 spooky destination quests and became a true Master of Darkness.',
    image: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/master-darkness.png',
    attributes: [
      { trait_type: 'Quest', value: 'Master of Darkness' },
      { trait_type: 'Difficulty', value: 'Legendary' },
      { trait_type: 'Category', value: 'Halloween Quest' },
      { trait_type: 'Season', value: 'Halloween 2025' },
      { trait_type: 'Rarity', value: 'Legendary' },
    ],
  },

  // ============================================
  // REGULAR QUEST NFTs (Dashboard Available Quests)
  // ============================================
  'machu-picchu-journey': {
    name: 'Machu Picchu Explorer',
    description: "You've completed the journey to Machu Picchu, one of the New Seven Wonders of the World!",
    image: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/quest-machu-picchu.png',
    attributes: [
      { trait_type: 'Location', value: 'Machu Picchu, Peru' },
      { trait_type: 'Category', value: 'World Wonder' },
      { trait_type: 'Season', value: 'Halloween 2025' },
    ],
  },
  'great-wall-of-china': {
    name: 'Great Wall Conqueror',
    description: "You've walked along the Great Wall of China, one of the most impressive architectural feats in history!",
    image: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/quest-great-wall.png',
    attributes: [
      { trait_type: 'Location', value: 'Beijing, China' },
      { trait_type: 'Category', value: 'World Wonder' },
      { trait_type: 'Season', value: 'Halloween 2025' },
    ],
  },
  'pyramids-of-giza': {
    name: 'Pyramid Explorer',
    description: "You've visited the ancient Pyramids of Giza and the Sphinx, one of the Seven Wonders of the Ancient World!",
    image: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/quest-pyramids-giza.png',
    attributes: [
      { trait_type: 'Location', value: 'Giza, Egypt' },
      { trait_type: 'Category', value: 'Ancient Wonder' },
      { trait_type: 'Season', value: 'Halloween 2025' },
    ],
  },
  'colosseum-exploration': {
    name: 'Colosseum Gladiator',
    description: "You've visited the ancient Colosseum in Rome and stepped back in time!",
    image: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/quest-colosseum.png',
    attributes: [
      { trait_type: 'Location', value: 'Rome, Italy' },
      { trait_type: 'Category', value: 'Historical' },
      { trait_type: 'Season', value: 'Halloween 2025' },
    ],
  },
  '10000-steps-walk-in-warsaw': {
    name: 'Warsaw Walker',
    description: "You've completed a 10,000-step walk through the beautiful streets of Warsaw!",
    image: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/quest-warsaw-walk.png',
    attributes: [
      { trait_type: 'Location', value: 'Warsaw, Poland' },
      { trait_type: 'Category', value: 'Fitness' },
      { trait_type: 'Season', value: 'Halloween 2025' },
    ],
  },
  'taj-mahal-discovery': {
    name: 'Taj Mahal Discoverer',
    description: "You've visited the magnificent Taj Mahal, a symbol of eternal love!",
    image: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/quest-taj-mahal.png',
    attributes: [
      { trait_type: 'Location', value: 'Agra, India' },
      { trait_type: 'Category', value: 'World Wonder' },
      { trait_type: 'Season', value: 'Halloween 2025' },
    ],
  },
  'eiffel-tower-adventure': {
    name: 'Eiffel Tower Adventurer',
    description: "You've visited the iconic Eiffel Tower in Paris!",
    image: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/quest-eiffel-tower.png',
    attributes: [
      { trait_type: 'Location', value: 'Paris, France' },
      { trait_type: 'Category', value: 'Landmark' },
      { trait_type: 'Season', value: 'Halloween 2025' },
    ],
  },
  'statue-of-liberty-visit': {
    name: 'Liberty Explorer',
    description: "You've seen the Statue of Liberty, a symbol of freedom and democracy!",
    image: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/quest-statue-liberty.png',
    attributes: [
      { trait_type: 'Location', value: 'New York, USA' },
      { trait_type: 'Category', value: 'Landmark' },
      { trait_type: 'Season', value: 'Halloween 2025' },
    ],
  },
  'sydney-opera-house': {
    name: 'Sydney Opera House Visitor',
    description: "You've visited the architectural masterpiece that is the Sydney Opera House!",
    image: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/quest-sydney-opera.png',
    attributes: [
      { trait_type: 'Location', value: 'Sydney, Australia' },
      { trait_type: 'Category', value: 'UNESCO Heritage' },
      { trait_type: 'Season', value: 'Halloween 2025' },
    ],
  },
  'warsaw-uprising-museum': {
    name: 'Warsaw Uprising Historian',
    description: "You've explored the Warsaw Uprising Museum and learned about the heroic resistance!",
    image: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/quest-warsaw-uprising.png',
    attributes: [
      { trait_type: 'Location', value: 'Warsaw, Poland' },
      { trait_type: 'Category', value: 'Historical' },
      { trait_type: 'Season', value: 'Halloween 2025' },
    ],
  },
  'big-ben-westminster': {
    name: 'Big Ben Explorer',
    description: "You've explored the historic Big Ben and Westminster area in London!",
    image: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/quest-big-ben.png',
    attributes: [
      { trait_type: 'Location', value: 'London, UK' },
      { trait_type: 'Category', value: 'Landmark' },
      { trait_type: 'Season', value: 'Halloween 2025' },
    ],
  },
  'tokyo-tower-experience': {
    name: 'Tokyo Tower Visitor',
    description: "You've visited Tokyo Tower and enjoyed panoramic views of the city!",
    image: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/quest-tokyo.png',
    attributes: [
      { trait_type: 'Location', value: 'Tokyo, Japan' },
      { trait_type: 'Category', value: 'Landmark' },
      { trait_type: 'Season', value: 'Halloween 2025' },
    ],
  },
  'palace-of-culture-and-science': {
    name: 'Palace of Culture Explorer',
    description: "You've visited the iconic Palace of Culture and Science in Warsaw!",
    image: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/quest-palace-culture.png',
    attributes: [
      { trait_type: 'Location', value: 'Warsaw, Poland' },
      { trait_type: 'Category', value: 'Landmark' },
      { trait_type: 'Season', value: 'Halloween 2025' },
    ],
  },
  'legia-warszawa-stadium-visit': {
    name: 'Legia Warszawa Fan',
    description: "You've visited the iconic Legia Warszawa stadium and experienced Polish football passion!",
    image: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/quest-legia-warszawa.png',
    attributes: [
      { trait_type: 'Location', value: 'Warsaw, Poland' },
      { trait_type: 'Category', value: 'Sports' },
      { trait_type: 'Season', value: 'Halloween 2025' },
    ],
  },
  'coffee-on-francuska-street': {
    name: 'Francuska Street Coffee Lover',
    description: "You've enjoyed a traditional Polish coffee at one of the charming cafes on Francuska Street!",
    image: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/quest-francuska-street.png',
    attributes: [
      { trait_type: 'Location', value: 'Warsaw, Poland' },
      { trait_type: 'Category', value: 'Culinary' },
      { trait_type: 'Season', value: 'Halloween 2025' },
    ],
  },

  // Achievement NFTs
  'ghost-hunter-badge': {
    name: 'Ghost Hunter Badge',
    description: 'Awarded for visiting your first spooky destination.',
    image: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/ghost-hunter-badge.png',
    attributes: [
      { trait_type: 'Type', value: 'Achievement' },
      { trait_type: 'Tier', value: 'Bronze' },
      { trait_type: 'Season', value: 'Halloween 2025' },
    ],
  },
  'paranormal-investigator': {
    name: 'Paranormal Investigator',
    description: 'Awarded for visiting 3 different haunted locations.',
    image: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/paranormal-investigator.png',
    attributes: [
      { trait_type: 'Type', value: 'Achievement' },
      { trait_type: 'Tier', value: 'Silver' },
      { trait_type: 'Season', value: 'Halloween 2025' },
    ],
  },
  'master-darkness': {
    name: 'Master of Darkness',
    description: 'Awarded for completing 10 spooky destination quests.',
    image: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/master-darkness.png',
    attributes: [
      { trait_type: 'Type', value: 'Achievement' },
      { trait_type: 'Tier', value: 'Gold' },
      { trait_type: 'Season', value: 'Halloween 2025' },
      { trait_type: 'Rarity', value: 'Legendary' },
    ],
  },
};

/**
 * Get NFT metadata for a destination or achievement
 */
export const getNFTMetadata = (id: string): typeof HALLOWEEN_NFT_METADATA[keyof typeof HALLOWEEN_NFT_METADATA] | null => {
  return HALLOWEEN_NFT_METADATA[id as keyof typeof HALLOWEEN_NFT_METADATA] || null;
};

/**
 * Generate metadata URI for NFT
 */
export const generateMetadataURI = async (
  destinationId: string,
  userId: string,
  completedAt: Date
): Promise<string> => {
  const metadata = getNFTMetadata(destinationId);
  if (!metadata) {
    // Generate generic metadata
    return `https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/generic-halloween.json`;
  }

  // Add completion timestamp to metadata
  const fullMetadata = {
    ...metadata,
    attributes: [
      ...metadata.attributes,
      { trait_type: 'Completed', value: completedAt.toISOString().split('T')[0] },
      { trait_type: 'Explorer', value: userId.slice(0, 8) },
    ],
  };

  // For production, upload to IPFS or Supabase storage
  // For demo, use pre-generated metadata URLs
  return `https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/metadata/${destinationId}.json`;
};

/**
 * Mint Halloween NFT for a completed destination quest
 */
export const mintHalloweenNFT = async (
  userId: string,
  destinationId: string,
  walletAddress: string
): Promise<{ success: boolean; tokenId?: number; txHash?: string; error?: string }> => {
  try {
    console.log('[HalloweenNFT] Minting NFT for destination:', destinationId);

    // Generate metadata URI
    const metadataURI = await generateMetadataURI(destinationId, userId, new Date());

    // Import and call the mint function
    const { mintAchievementAPI } = await import('./web3ApiClient');
    const result = await mintAchievementAPI(userId, `spooky-${destinationId}`, walletAddress);

    if (result.success && result.data) {
      console.log('[HalloweenNFT] ✅ NFT minted:', result.data);

      // Record in database
      try {
        await supabase.from('nft_transactions').insert({
          user_id: userId,
          quest_id: `spooky-${destinationId}`,
          nft_type: 'achievement',
          token_id: result.data.tokenId,
          tx_hash: result.data.txHash,
          contract_address: import.meta.env.VITE_ACHIEVEMENT_NFT_CONTRACT_ADDRESS,
          status: 'pending',
          metadata_uri: metadataURI,
        });
      } catch (dbError) {
        console.warn('[HalloweenNFT] Failed to record transaction:', dbError);
      }

      return {
        success: true,
        tokenId: result.data.tokenId,
        txHash: result.data.txHash,
      };
    }

    return { success: false, error: result.error || 'Mint failed' };
  } catch (error: any) {
    console.error('[HalloweenNFT] Error:', error);
    return { success: false, error: error.message || 'Unknown error' };
  }
};

/**
 * Get all Halloween NFTs for a user
 */
export const getUserHalloweenNFTs = async (userId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('nft_transactions')
      .select('*')
      .eq('user_id', userId)
      .like('quest_id', 'spooky-%')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('[HalloweenNFT] Error fetching NFTs:', error);
    return [];
  }
};

/**
 * Check if user has NFT for a destination
 */
export const hasNFTForDestination = async (userId: string, destinationId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('nft_transactions')
      .select('id')
      .eq('user_id', userId)
      .eq('quest_id', `spooky-${destinationId}`)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  } catch (error) {
    console.error('[HalloweenNFT] Error checking NFT:', error);
    return false;
  }
};


/**
 * DIRECT HALLOWEEN REWARD FUNCTIONS
 * These bypass Supabase UUID requirements for spooky destination quests
 */

/**
 * Send TPX tokens directly for Halloween quest completion
 * Bypasses the user_quests table which requires UUID
 */
export const sendHalloweenTPXReward = async (
  walletAddress: string,
  amount: number,
  destinationId: string
): Promise<{ success: boolean; txHash?: string; error?: string }> => {
  try {
    console.log('[HalloweenNFT] Sending', amount, 'TPX to', walletAddress, 'for destination:', destinationId);

    if (amount <= 0) {
      return { success: false, error: 'Invalid reward amount' };
    }

    // Direct blockchain transfer - no database lookup needed
    const result = await web3Service.claimTokens(walletAddress, amount);

    if (!result.success) {
      console.error('[HalloweenNFT] TPX transfer failed:', result.error);
      return { success: false, error: result.error || 'Transfer failed' };
    }

    console.log('[HalloweenNFT] ✅ TPX transfer successful:', result.txHash);

    // Log to database (optional, won't fail if it errors)
    try {
      await supabase.from('token_transactions').insert({
        wallet_address: walletAddress.toLowerCase(),
        amount: amount,
        tx_hash: result.txHash,
        status: 'pending',
        type: 'halloween_quest_reward',
        metadata: { destinationId, source: 'spooky_destinations' },
      });
    } catch (logError) {
      console.warn('[HalloweenNFT] Failed to log transaction (non-critical):', logError);
    }

    return { success: true, txHash: result.txHash };
  } catch (error: any) {
    console.error('[HalloweenNFT] TPX reward error:', error);
    return { success: false, error: error.message || 'Unknown error' };
  }
};

/**
 * Mint Halloween NFT directly without database quest lookup
 * Uses pre-defined metadata from HALLOWEEN_NFT_METADATA
 */
export const mintHalloweenNFTDirect = async (
  walletAddress: string,
  destinationId: string,
  userId?: string
): Promise<{ success: boolean; tokenId?: number; txHash?: string; error?: string }> => {
  try {
    console.log('[HalloweenNFT] Direct minting NFT for destination:', destinationId);

    // Get metadata from our predefined templates
    const metadata = getNFTMetadata(destinationId);
    
    // Build the NFT metadata JSON
    const nftMetadata = metadata ? {
      name: metadata.name,
      description: metadata.description,
      image: metadata.image,
      attributes: metadata.attributes,
    } : {
      name: `Spooky Explorer - ${destinationId}`,
      description: `You've completed a spooky destination quest at ${destinationId}!`,
      image: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images/generic-halloween.png',
      attributes: [
        { trait_type: 'Category', value: 'Halloween' },
        { trait_type: 'Season', value: 'Halloween 2025' },
      ],
    };

    // Create a data URI with the metadata encoded as base64 JSON
    const metadataJson = JSON.stringify(nftMetadata);
    const metadataBase64 = btoa(unescape(encodeURIComponent(metadataJson)));
    const metadataURI = `data:application/json;base64,${metadataBase64}`;

    console.log('[HalloweenNFT] Minting with name:', nftMetadata.name);
    console.log('[HalloweenNFT] Image URL:', nftMetadata.image);

    // Direct mint via web3Service - pass questId as third argument
    const questId = `spooky-${destinationId}`;
    const result = await web3Service.mintAchievementNFT(walletAddress, metadataURI, questId);

    if (!result.success) {
      console.error('[HalloweenNFT] NFT mint failed:', result.error);
      return { success: false, error: result.error || 'Mint failed' };
    }

    console.log('[HalloweenNFT] ✅ NFT minted:', result.tokenId, 'tx:', result.txHash);

    // Log to database (optional)
    try {
      await supabase.from('nft_transactions').insert({
        user_id: userId || null,
        quest_id: `spooky-${destinationId}`,
        nft_type: 'halloween_achievement',
        token_id: result.tokenId,
        tx_hash: result.txHash,
        contract_address: import.meta.env.VITE_ACHIEVEMENT_NFT_CONTRACT_ADDRESS,
        status: 'pending',
        metadata_uri: metadataURI,
      });
    } catch (logError) {
      console.warn('[HalloweenNFT] Failed to log NFT transaction (non-critical):', logError);
    }

    return {
      success: true,
      tokenId: result.tokenId,
      txHash: result.txHash,
    };
  } catch (error: any) {
    console.error('[HalloweenNFT] Direct mint error:', error);
    return { success: false, error: error.message || 'Unknown error' };
  }
};
