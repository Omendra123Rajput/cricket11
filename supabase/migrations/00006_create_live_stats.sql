-- Live match stats: per-player performance in a match
CREATE TABLE live_match_stats (
  id SERIAL PRIMARY KEY,
  match_id INT NOT NULL REFERENCES matches(id),
  player_id INT NOT NULL REFERENCES players(id),
  runs_scored INT NOT NULL DEFAULT 0,
  balls_faced INT NOT NULL DEFAULT 0,
  fours INT NOT NULL DEFAULT 0,
  sixes INT NOT NULL DEFAULT 0,
  strike_rate NUMERIC(6,2) NOT NULL DEFAULT 0,
  overs_bowled NUMERIC(3,1) NOT NULL DEFAULT 0,
  wickets INT NOT NULL DEFAULT 0,
  runs_conceded INT NOT NULL DEFAULT 0,
  maidens INT NOT NULL DEFAULT 0,
  economy NUMERIC(5,2) NOT NULL DEFAULT 0,
  catches INT NOT NULL DEFAULT 0,
  stumpings INT NOT NULL DEFAULT 0,
  run_outs INT NOT NULL DEFAULT 0,
  is_duck BOOLEAN NOT NULL DEFAULT false,
  is_not_out BOOLEAN NOT NULL DEFAULT false,
  in_playing_xi BOOLEAN NOT NULL DEFAULT true,
  lbw_bowled_count INT NOT NULL DEFAULT 0,
  direct_run_outs INT NOT NULL DEFAULT 0,
  raw_data JSONB NOT NULL DEFAULT '{}',
  last_synced_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(match_id, player_id)
);

CREATE INDEX idx_live_stats_match ON live_match_stats(match_id);
CREATE INDEX idx_live_stats_player ON live_match_stats(player_id);
