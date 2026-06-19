-- Create invitations table
CREATE TABLE IF NOT EXISTS invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Metadata
  slug TEXT NOT NULL UNIQUE,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  
  -- Invitation content
  title TEXT,
  welcome_message TEXT,
  main_question TEXT,
  sender_name TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  place TEXT NOT NULL,
  food TEXT[] DEFAULT ARRAY[]::TEXT[],
  dress_color TEXT,
  love_letter TEXT,
  
  -- Extended fields
  theme TEXT,
  animation TEXT,
  image_url TEXT,
  music_url TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_expires_at CHECK (expires_at > created_at)
);

-- Indexes for performance
CREATE INDEX idx_invitations_user_id ON invitations(user_id);
CREATE INDEX idx_invitations_slug ON invitations(slug);
CREATE INDEX idx_invitations_is_published ON invitations(is_published);
CREATE INDEX idx_invitations_expires_at ON invitations(expires_at);

-- Enable RLS
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

-- RLS: Users can view their own invitations, anyone can view published invitations
CREATE POLICY "Users can view their own invitations" ON invitations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view published invitations" ON invitations
  FOR SELECT USING (is_published = TRUE);

-- RLS: Users can insert and update their own invitations
CREATE POLICY "Users can insert their own invitations" ON invitations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own invitations" ON invitations
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own invitations" ON invitations
  FOR DELETE USING (auth.uid() = user_id);
