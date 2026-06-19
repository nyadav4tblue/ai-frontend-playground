-- Create invitation_views table (for tracking opens/visits)
CREATE TABLE IF NOT EXISTS invitation_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
  
  -- View metadata
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ip_address INET,
  user_agent TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_invitation_views_invitation_id ON invitation_views(invitation_id);
CREATE INDEX idx_invitation_views_viewed_at ON invitation_views(viewed_at);
CREATE INDEX idx_invitation_views_created_at ON invitation_views(created_at);

-- Enable RLS
ALTER TABLE invitation_views ENABLE ROW LEVEL SECURITY;

-- RLS: Anyone can insert view records (anonymous tracking)
CREATE POLICY "Anyone can record invitation views" ON invitation_views
  FOR INSERT WITH CHECK (TRUE);

-- RLS: Only invitation owner can view analytics
CREATE POLICY "Invitation owners can view their analytics" ON invitation_views
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM invitations
      WHERE invitations.id = invitation_views.invitation_id
      AND invitations.user_id = auth.uid()
    )
  );
