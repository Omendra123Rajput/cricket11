-- Players table: IPL player master data (pre-seeded)
CREATE TABLE players (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  team TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('WK', 'BAT', 'AR', 'BOWL')),
  credit_value NUMERIC(3,1) NOT NULL CHECK (credit_value BETWEEN 4.0 AND 15.0),
  image_url TEXT,
  is_overseas BOOLEAN NOT NULL DEFAULT false,
  batting_style TEXT,
  bowling_style TEXT,
  meta JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_players_team ON players(team);
CREATE INDEX idx_players_role ON players(role);
CREATE INDEX idx_players_team_role ON players(team, role);
