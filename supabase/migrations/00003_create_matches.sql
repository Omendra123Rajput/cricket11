-- Matches table: IPL schedule
CREATE TABLE matches (
  id SERIAL PRIMARY KEY,
  external_id TEXT UNIQUE,
  season INT NOT NULL DEFAULT 2026,
  match_number INT,
  team_home TEXT NOT NULL,
  team_away TEXT NOT NULL,
  venue TEXT,
  city TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'upcoming'
    CHECK (status IN ('upcoming', 'live', 'completed', 'abandoned')),
  toss_winner TEXT,
  toss_decision TEXT,
  result_summary TEXT,
  scorecard JSONB NOT NULL DEFAULT '{}',
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_matches_status ON matches(status);
CREATE INDEX idx_matches_start_time ON matches(start_time);
CREATE INDEX idx_matches_season_status ON matches(season, status);
