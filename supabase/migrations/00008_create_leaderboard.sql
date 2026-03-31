-- Season leaderboard: per-contest, per-user, per-match results
CREATE TABLE season_leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contest_id UUID NOT NULL REFERENCES contests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id),
  match_id INT NOT NULL REFERENCES matches(id),
  fantasy_points NUMERIC(7,1) NOT NULL DEFAULT 0,
  position_points INT NOT NULL DEFAULT 0,
  cumulative_points INT NOT NULL DEFAULT 0,
  rank INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(contest_id, user_id, match_id)
);

CREATE INDEX idx_leaderboard_contest ON season_leaderboard(contest_id);
CREATE INDEX idx_leaderboard_contest_cumulative ON season_leaderboard(contest_id, cumulative_points DESC);
CREATE INDEX idx_leaderboard_user ON season_leaderboard(user_id);
