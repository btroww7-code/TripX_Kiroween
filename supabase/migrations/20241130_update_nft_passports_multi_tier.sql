-- Migration: Update nft_passports table to support multiple tiers per user
-- Each user can mint one NFT passport per tier (bronze, silver, gold, platinum)

-- First, drop the existing unique constraint on user_id (if exists)
ALTER TABLE nft_passports DROP CONSTRAINT IF EXISTS nft_passports_user_id_key;

-- Add composite unique constraint on (user_id, tier)
-- This allows each user to have one passport per tier
ALTER TABLE nft_passports ADD CONSTRAINT nft_passports_user_id_tier_key UNIQUE (user_id, tier);

-- Add index for faster lookups by user_id
CREATE INDEX IF NOT EXISTS idx_nft_passports_user_id ON nft_passports(user_id);

-- Add index for faster lookups by tier
CREATE INDEX IF NOT EXISTS idx_nft_passports_tier ON nft_passports(tier);

-- Update RLS policies to allow users to have multiple passports
-- (existing policies should work, but let's make sure)

-- Comment explaining the change
COMMENT ON TABLE nft_passports IS 'NFT Passport collection - users can mint one passport per tier (bronze, silver, gold, platinum)';
