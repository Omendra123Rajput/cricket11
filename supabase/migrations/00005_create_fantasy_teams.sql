-- Fantasy teams: one per user per contest per match
CREATE TABLE fantasy_teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  contest_id UUID NOT NULL REFERENCES contests(id),
  match_id INT NOT NULL REFERENCES matches(id),
  captain_player_id INT REFERENCES players(id),
  vice_captain_player_id INT REFERENCES players(id),
  total_credits NUMERIC(4,1) NOT NULL CHECK (total_credits <= 100.0),
  total_points NUMERIC(7,1) NOT NULL DEFAULT 0,
  is_locked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, contest_id, match_id)
);

CREATE INDEX idx_fantasy_teams_contest_match ON fantasy_teams(contest_id, match_id);
CREATE INDEX idx_fantasy_teams_user ON fantasy_teams(user_id);
CREATE INDEX idx_fantasy_teams_match ON fantasy_teams(match_id);

CREATE TRIGGER fantasy_teams_updated_at
  BEFORE UPDATE ON fantasy_teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Fantasy team players: 11 players per team
CREATE TABLE fantasy_team_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fantasy_team_id UUID NOT NULL REFERENCES fantasy_teams(id) ON DELETE CASCADE,
  player_id INT NOT NULL REFERENCES players(id),
  is_captain BOOLEAN NOT NULL DEFAULT false,
  is_vice_captain BOOLEAN NOT NULL DEFAULT false,
  points_earned NUMERIC(6,1) NOT NULL DEFAULT 0,
  UNIQUE(fantasy_team_id, player_id)
);

CREATE INDEX idx_ftp_team ON fantasy_team_players(fantasy_team_id);
CREATE INDEX idx_ftp_player ON fantasy_team_players(player_id);
