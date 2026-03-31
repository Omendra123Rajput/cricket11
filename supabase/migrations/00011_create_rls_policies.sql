-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE contests ENABLE ROW LEVEL SECURITY;
ALTER TABLE contest_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE fantasy_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE fantasy_team_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_match_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE fantasy_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE season_leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PROFILES
-- ============================================================
CREATE POLICY "profiles_select_all"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================================
-- PLAYERS (read-only for users, write via service role)
-- ============================================================
CREATE POLICY "players_select_all"
  ON players FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================
-- MATCHES (read-only for users, write via service role)
-- ============================================================
CREATE POLICY "matches_select_all"
  ON matches FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================
-- CONTESTS
-- ============================================================
CREATE POLICY "contests_select_member"
  ON contests FOR SELECT
  TO authenticated
  USING (
    id IN (SELECT contest_id FROM contest_members WHERE user_id = auth.uid())
  );

CREATE POLICY "contests_insert_auth"
  ON contests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "contests_update_admin"
  ON contests FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- ============================================================
-- CONTEST MEMBERS
-- ============================================================
CREATE POLICY "contest_members_select"
  ON contest_members FOR SELECT
  TO authenticated
  USING (
    contest_id IN (SELECT contest_id FROM contest_members WHERE user_id = auth.uid())
  );

CREATE POLICY "contest_members_insert"
  ON contest_members FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "contest_members_delete_own"
  ON contest_members FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================
-- FANTASY TEAMS
-- ============================================================
CREATE POLICY "fantasy_teams_select_contest"
  ON fantasy_teams FOR SELECT
  TO authenticated
  USING (
    contest_id IN (SELECT contest_id FROM contest_members WHERE user_id = auth.uid())
  );

CREATE POLICY "fantasy_teams_insert_own"
  ON fantasy_teams FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND NOT is_locked
  );

CREATE POLICY "fantasy_teams_update_own"
  ON fantasy_teams FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id AND NOT is_locked)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- FANTASY TEAM PLAYERS
-- ============================================================
CREATE POLICY "ftp_select_contest"
  ON fantasy_team_players FOR SELECT
  TO authenticated
  USING (
    fantasy_team_id IN (
      SELECT ft.id FROM fantasy_teams ft
      JOIN contest_members cm ON cm.contest_id = ft.contest_id
      WHERE cm.user_id = auth.uid()
    )
  );

CREATE POLICY "ftp_insert_own"
  ON fantasy_team_players FOR INSERT
  TO authenticated
  WITH CHECK (
    fantasy_team_id IN (
      SELECT id FROM fantasy_teams
      WHERE user_id = auth.uid() AND NOT is_locked
    )
  );

CREATE POLICY "ftp_delete_own"
  ON fantasy_team_players FOR DELETE
  TO authenticated
  USING (
    fantasy_team_id IN (
      SELECT id FROM fantasy_teams
      WHERE user_id = auth.uid() AND NOT is_locked
    )
  );

-- ============================================================
-- LIVE MATCH STATS (read-only for users)
-- ============================================================
CREATE POLICY "live_stats_select_all"
  ON live_match_stats FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================
-- FANTASY POINTS (read-only for users)
-- ============================================================
CREATE POLICY "fantasy_points_select_all"
  ON fantasy_points FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================
-- SEASON LEADERBOARD
-- ============================================================
CREATE POLICY "leaderboard_select_contest"
  ON season_leaderboard FOR SELECT
  TO authenticated
  USING (
    contest_id IN (SELECT contest_id FROM contest_members WHERE user_id = auth.uid())
  );

-- ============================================================
-- BADGES (read-only)
-- ============================================================
CREATE POLICY "badges_select_all"
  ON badges FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================
-- USER BADGES
-- ============================================================
CREATE POLICY "user_badges_select_all"
  ON user_badges FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================
-- AUDIT LOGS (users see only their own)
-- ============================================================
CREATE POLICY "audit_logs_select_own"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "audit_logs_insert_auth"
  ON audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
