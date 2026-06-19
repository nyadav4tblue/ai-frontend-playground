-- Create invitation_responses table
CREATE TABLE IF NOT EXISTS invitation_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
  
  -- Response data
  accepted BOOLEAN NOT NULL,
  selected_date TEXT,
  selected_place TEXT,
  selected_food TEXT[] DEFAULT ARRAY[]::TEXT[],
  selected_dress TEXT,
  
  -- Client info
  device TEXT,
  browser TEXT,
  
  -- Timestamps
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  
  CONSTRAINT valid_submission CHECK (submitted_at <= created_at + INTERVAL '1 second')
);

-- Indexes for performance
CREATE INDEX idx_invitation_responses_invitation_id ON invitation_responses(invitation_id);
CREATE INDEX idx_invitation_responses_created_at ON invitation_responses(created_at);
CREATE INDEX idx_invitation_responses_accepted ON invitation_responses(accepted);

-- Enable RLS
ALTER TABLE invitation_responses ENABLE ROW LEVEL SECURITY;

-- RLS: Anyone can insert responses (anonymous guests)
CREATE POLICY "Anyone can submit invitation responses" ON invitation_responses
  FOR INSERT WITH CHECK (TRUE);

-- RLS: Only invitation owner can view responses, or admins
CREATE POLICY "Invitation owners can view their responses" ON invitation_responses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM invitations
      WHERE invitations.id = invitation_responses.invitation_id
      AND invitations.user_id = auth.uid()
    )
  );
