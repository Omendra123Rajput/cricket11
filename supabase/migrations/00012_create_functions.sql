-- ============================================================
-- Lock teams when match goes live
-- ============================================================
CREATE OR REPLACE FUNCTION lock_teams_for_match(p_match_id INT)
RETURNS void AS $$
BEGIN
  UPDATE fantasy_teams
  SET is_locked = true
  WHERE match_id = p_match_id AND NOT is_locked;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- Auto-lock teams when match status changes to 'live'
-- ============================================================
CREATE OR REPLACE FUNCTION handle_match_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'live' AND OLD.status = 'upcoming' THEN
    PERFORM lock_teams_for_match(NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_match_status_change
  AFTER UPDATE OF status ON matches
  FOR EACH ROW EXECUTE FUNCTION handle_match_status_change();

-- ============================================================
-- Calculate season leaderboard for a contest + match
-- Assigns +3 (1st), +2 (2nd), -1 (rest)
-- ============================================================
CREATE OR REPLACE FUNCTION update_contest_leaderboard(
  p_contest_id UUID,
  p_match_id INT
)
RETURNS void AS $$
DECLARE
  r RECORD;
  v_rank INT := 0;
  v_position_points INT;
  v_cumulative INT;
BEGIN
  -- Rank users by fantasy points for this match
  FOR r IN
    SELECT
      ft.user_id,
      ft.total_points AS fantasy_pts,
      ROW_NUMBER() OVER (ORDER BY ft.total_points DESC) AS match_rank
    FROM fantasy_teams ft
    WHERE ft.contest_id = p_contest_id
      AND ft.match_id = p_match_id
    ORDER BY ft.total_points DESC
  LOOP
    -- Assign position points
    CASE r.match_rank
      WHEN 1 THEN v_position_points := 3;
      WHEN 2 THEN v_position_points := 2;
      ELSE v_position_points := -1;
    END CASE;

    -- Calculate cumulative across all matches
    SELECT COALESCE(SUM(position_points), 0) + v_position_points
    INTO v_cumulative
    FROM season_leaderboard
    WHERE contest_id = p_contest_id
      AND user_id = r.user_id
      AND match_id != p_match_id;

    -- Upsert leaderboard entry
    INSERT INTO season_leaderboard (contest_id, user_id, match_id, fantasy_points, position_points, cumulative_points, rank)
    VALUES (p_contest_id, r.user_id, p_match_id, r.fantasy_pts, v_position_points, v_cumulative, r.match_rank)
    ON CONFLICT (contest_id, user_id, match_id)
    DO UPDATE SET
      fantasy_points = EXCLUDED.fantasy_points,
      position_points = EXCLUDED.position_points,
      cumulative_points = EXCLUDED.cumulative_points,
      rank = EXCLUDED.rank;

    -- Update contest_members season_points
    UPDATE contest_members
    SET season_points = v_cumulative, rank = r.match_rank
    WHERE contest_id = p_contest_id AND user_id = r.user_id;
  END LOOP;

  -- Update first_place_count on profiles if rank 1
  UPDATE profiles
  SET first_place_count = (
    SELECT COUNT(*) FROM season_leaderboard sl
    WHERE sl.user_id = profiles.id AND sl.rank = 1
  )
  WHERE id IN (
    SELECT user_id FROM fantasy_teams
    WHERE contest_id = p_contest_id AND match_id = p_match_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
