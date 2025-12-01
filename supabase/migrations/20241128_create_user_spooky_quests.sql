-- Create user_spooky_quests table for Halloween spooky destination quests
-- This table stores per-user progress on spooky destination quests

CREATE TABLE IF NOT EXISTS user_spooky_quests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  quest_id TEXT NOT NULL,
  destination_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  requirements JSONB DEFAULT '[]'::jsonb,
  xp_reward INTEGER DEFAULT 0,
  tpx_reward INTEGER DEFAULT 0,
  nft_reward BOOLEAN DEFAULT false,
  nft_image_url TEXT,
  difficulty TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'in_progress', 'completed', 'claimed')),
  completed_at TIMESTAMPTZ,
  claimed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Unique constraint: one quest per user per destination
  UNIQUE(user_id, quest_id)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_user_spooky_quests_user_id ON user_spooky_quests(user_id);
CREATE INDEX IF NOT EXISTS idx_user_spooky_quests_status ON user_spooky_quests(status);
CREATE INDEX IF NOT EXISTS idx_user_spooky_quests_destination ON user_spooky_quests(destination_id);

-- Enable Row Level Security
ALTER TABLE user_spooky_quests ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own quests
CREATE POLICY "Users can view own spooky quests" ON user_spooky_quests
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own quests
CREATE POLICY "Users can insert own spooky quests" ON user_spooky_quests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own quests
CREATE POLICY "Users can update own spooky quests" ON user_spooky_quests
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can delete their own quests
CREATE POLICY "Users can delete own spooky quests" ON user_spooky_quests
  FOR DELETE USING (auth.uid() = user_id);

-- Policy: Service role can do anything (for admin operations)
CREATE POLICY "Service role full access" ON user_spooky_quests
  FOR ALL USING (auth.role() = 'service_role');

-- Comment on table
COMMENT ON TABLE user_spooky_quests IS 'Stores user progress on Halloween spooky destination quests';
