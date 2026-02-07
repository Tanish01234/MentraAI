-- Leaderboard System Database Schema
-- Run this in Supabase SQL Editor

-- Create leaderboard_scores table
CREATE TABLE IF NOT EXISTS leaderboard_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  total_score INTEGER DEFAULT 0,
  total_xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  quizzes_completed INTEGER DEFAULT 0,
  weekly_score INTEGER DEFAULT 0,
  last_quiz_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- Create indexes for fast ranking queries
CREATE INDEX IF NOT EXISTS idx_leaderboard_weekly_score ON leaderboard_scores(weekly_score DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_total_score ON leaderboard_scores(total_score DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_user ON leaderboard_scores(user_id);

-- Auto-update timestamp function
CREATE OR REPLACE FUNCTION update_leaderboard_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-updating timestamp
DROP TRIGGER IF EXISTS leaderboard_updated_at ON leaderboard_scores;
CREATE TRIGGER leaderboard_updated_at
BEFORE UPDATE ON leaderboard_scores
FOR EACH ROW
EXECUTE FUNCTION update_leaderboard_timestamp();

-- Enable Row Level Security
ALTER TABLE leaderboard_scores ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view leaderboard" ON leaderboard_scores;
DROP POLICY IF EXISTS "Users can update own score" ON leaderboard_scores;
DROP POLICY IF EXISTS "Users can insert own score" ON leaderboard_scores;

-- Anyone can view leaderboard data
CREATE POLICY "Anyone can view leaderboard"
  ON leaderboard_scores FOR SELECT
  USING (true);

-- Users can only update their own scores
CREATE POLICY "Users can update own score"
  ON leaderboard_scores FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can insert their own score
CREATE POLICY "Users can insert own score"
  ON leaderboard_scores FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create a view for ranked leaderboard
CREATE OR REPLACE VIEW leaderboard_ranked AS
SELECT 
  ROW_NUMBER() OVER (ORDER BY weekly_score DESC, total_xp DESC) as rank,
  id,
  user_id,
  username,
  total_score,
  total_xp,
  level,
  quizzes_completed,
  weekly_score,
  last_quiz_at,
  created_at,
  updated_at
FROM leaderboard_scores
ORDER BY weekly_score DESC, total_xp DESC;

-- Grant access to the view
GRANT SELECT ON leaderboard_ranked TO authenticated;
GRANT SELECT ON leaderboard_ranked TO anon;
