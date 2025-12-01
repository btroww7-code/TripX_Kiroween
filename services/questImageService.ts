/**
 * Quest Image Service
 * 
 * Maps quest locations to NFT images for minting.
 * Used when quests from database don't have image_url set.
 */

const SUPABASE_NFT_BASE = 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/nft-images';

// Map location keywords to image files
const LOCATION_IMAGE_MAP: Record<string, string> = {
  // Famous landmarks
  'eiffel tower': `${SUPABASE_NFT_BASE}/quest-eiffel-tower.png`,
  'paris': `${SUPABASE_NFT_BASE}/quest-eiffel-tower.png`,
  'colosseum': `${SUPABASE_NFT_BASE}/quest-colosseum.png`,
  'rome': `${SUPABASE_NFT_BASE}/quest-colosseum.png`,
  'big ben': `${SUPABASE_NFT_BASE}/quest-big-ben.png`,
  'westminster': `${SUPABASE_NFT_BASE}/quest-big-ben.png`,
  'london': `${SUPABASE_NFT_BASE}/quest-big-ben.png`,
  'statue of liberty': `${SUPABASE_NFT_BASE}/quest-statue-liberty.png`,
  'new york': `${SUPABASE_NFT_BASE}/quest-statue-liberty.png`,
  'taj mahal': `${SUPABASE_NFT_BASE}/quest-taj-mahal.png`,
  'agra': `${SUPABASE_NFT_BASE}/quest-taj-mahal.png`,
  'great wall': `${SUPABASE_NFT_BASE}/quest-great-wall.png`,
  'beijing': `${SUPABASE_NFT_BASE}/quest-great-wall.png`,
  'china': `${SUPABASE_NFT_BASE}/quest-great-wall.png`,
  'machu picchu': `${SUPABASE_NFT_BASE}/quest-machu-picchu.png`,
  'peru': `${SUPABASE_NFT_BASE}/quest-machu-picchu.png`,
  'sydney opera': `${SUPABASE_NFT_BASE}/quest-sydney-opera.png`,
  'sydney': `${SUPABASE_NFT_BASE}/quest-sydney-opera.png`,
  'christ redeemer': `${SUPABASE_NFT_BASE}/quest-christ-redeemer.png`,
  'rio': `${SUPABASE_NFT_BASE}/quest-christ-redeemer.png`,
  'petra': `${SUPABASE_NFT_BASE}/quest-petra.png`,
  'jordan': `${SUPABASE_NFT_BASE}/quest-petra.png`,
  'pyramids': `${SUPABASE_NFT_BASE}/quest-pyramids-giza.png`,
  'giza': `${SUPABASE_NFT_BASE}/quest-pyramids-giza.png`,
  'egypt': `${SUPABASE_NFT_BASE}/quest-pyramids-giza.png`,
  'sphinx': `${SUPABASE_NFT_BASE}/quest-pyramids-giza.png`,
  
  // European cities
  'barcelona': `${SUPABASE_NFT_BASE}/quest-barcelona.png`,
  'sagrada': `${SUPABASE_NFT_BASE}/quest-barcelona.png`,
  'amsterdam': `${SUPABASE_NFT_BASE}/quest-amsterdam.png`,
  'prague': `${SUPABASE_NFT_BASE}/quest-prague.png`,
  'vienna': `${SUPABASE_NFT_BASE}/quest-vienna.png`,
  
  // Asian destinations
  'tokyo': `${SUPABASE_NFT_BASE}/quest-tokyo.png`,
  'tokyo tower': `${SUPABASE_NFT_BASE}/quest-tokyo.png`,
  'kyoto': `${SUPABASE_NFT_BASE}/quest-kyoto.png`,
  'fushimi': `${SUPABASE_NFT_BASE}/quest-kyoto.png`,
  'bangkok': `${SUPABASE_NFT_BASE}/quest-bangkok.png`,
  'thailand': `${SUPABASE_NFT_BASE}/quest-bangkok.png`,
  'singapore': `${SUPABASE_NFT_BASE}/quest-singapore.png`,
  'marina bay': `${SUPABASE_NFT_BASE}/quest-singapore.png`,
  
  // Americas
  'grand canyon': `${SUPABASE_NFT_BASE}/quest-grand-canyon.png`,
  'arizona': `${SUPABASE_NFT_BASE}/quest-grand-canyon.png`,
  'niagara': `${SUPABASE_NFT_BASE}/quest-niagara-falls.png`,
  
  // Warsaw specific
  'warsaw': `${SUPABASE_NFT_BASE}/quest-warsaw-walk.png`,
  'palace of culture': `${SUPABASE_NFT_BASE}/quest-palace-culture-v2.png`,
  'palac kultury': `${SUPABASE_NFT_BASE}/quest-palace-culture-v2.png`,
  'uprising museum': `${SUPABASE_NFT_BASE}/quest-warsaw-uprising-v2.png`,
  'powstania warszawskiego': `${SUPABASE_NFT_BASE}/quest-warsaw-uprising-v2.png`,
  'francuska': `${SUPABASE_NFT_BASE}/quest-francuska-street.png`,
  'legia': `${SUPABASE_NFT_BASE}/quest-legia-warszawa.png`,
  'legia warszawa': `${SUPABASE_NFT_BASE}/quest-legia-warszawa.png`,
  'stadion legii': `${SUPABASE_NFT_BASE}/quest-legia-warszawa.png`,
};

/**
 * Get NFT image URL for a quest based on its title and location
 */
export function getQuestImageUrl(title: string, location: string): string {
  const searchText = `${title} ${location}`.toLowerCase();
  
  // Check each keyword
  for (const [keyword, imageUrl] of Object.entries(LOCATION_IMAGE_MAP)) {
    if (searchText.includes(keyword)) {
      return imageUrl;
    }
  }
  
  // Default fallback
  return `${SUPABASE_NFT_BASE}/achievement-default.png`;
}

/**
 * Get all available quest images
 */
export function getAllQuestImages(): Record<string, string> {
  return { ...LOCATION_IMAGE_MAP };
}
