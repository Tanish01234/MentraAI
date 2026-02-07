-- User Preferences Table
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Learning Preferences
  study_mode TEXT DEFAULT 'mixed',
  difficulty_level TEXT DEFAULT 'intermediate',
  response_length TEXT DEFAULT 'balanced',
  explanation_style TEXT DEFAULT 'with_examples',
  
  -- AI Behavior
  ai_tone TEXT DEFAULT 'friendly',
  language_mix TEXT DEFAULT 'balanced',
  quiz_frequency TEXT DEFAULT 'weekly',
  reminder_notifications BOOLEAN DEFAULT true,
  
  -- Study Goals
  daily_study_time INTEGER DEFAULT 30,
  weekly_quiz_target INTEGER DEFAULT 5,
  focus_subjects TEXT[],
  exam_date DATE,
  
  -- Interface
  theme TEXT DEFAULT 'auto',
  font_size TEXT DEFAULT 'medium',
  animations_enabled BOOLEAN DEFAULT true,
  compact_mode BOOLEAN DEFAULT false,
  
  -- Privacy
  analytics_enabled BOOLEAN DEFAULT true,
  personalization_enabled BOOLEAN DEFAULT true,
  email_notifications BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_user_preferences_user ON user_preferences(user_id);

-- Auto-update timestamp
CREATE OR REPLACE FUNCTION update_user_preferences_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS user_preferences_updated_at ON user_preferences;
CREATE TRIGGER user_preferences_updated_at
BEFORE UPDATE ON user_preferences
FOR EACH ROW
EXECUTE FUNCTION update_user_preferences_timestamp();

-- Enable RLS
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Users can view own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can update own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can insert own preferences" ON user_preferences;

CREATE POLICY "Users can view own preferences"
  ON user_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);
