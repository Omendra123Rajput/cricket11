-- Contests table: private friend leagues
CREATE TABLE contests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES profiles(id),
  invite_code TEXT UNIQUE NOT NULL,
  season INT NOT NULL DEFAULT 2026,
  max_members INT NOT NULL DEFAULT 50,
  scoring_rules JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_contests_invite_code ON contests(invite_code);
CREATE INDEX idx_contests_created_by ON contests(created_by);

-- Contest members junction table
CREATE TABLE contest_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contest_id UUID NOT NULL REFERENCES contests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  season_points INT NOT NULL DEFAULT 0,
  rank INT,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(contest_id, user_id)
);

CREATE INDEX idx_contest_members_contest ON contest_members(contest_id);
CREATE INDEX idx_contest_members_user ON contest_members(user_id);
CREATE INDEX idx_contest_members_season_pts ON contest_members(contest_id, season_points DESC);
