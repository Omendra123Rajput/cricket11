-- Fantasy points: calculated points breakdown per player per match
CREATE TABLE fantasy_points (
  id SERIAL PRIMARY KEY,
  match_id INT NOT NULL REFERENCES matches(id),
  player_id INT NOT NULL REFERENCES players(id),
  points_breakdown JSONB NOT NULL DEFAULT '{}',
  total_points NUMERIC(6,1) NOT NULL DEFAULT 0,
  calculated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(match_id, player_id)
);

CREATE INDEX idx_fantasy_points_match ON fantasy_points(match_id);
CREATE INDEX idx_fantasy_points_player ON fantasy_points(player_id);
