-- Badge Definitions
INSERT INTO badges (slug, name, description, icon, category, criteria) VALUES
-- Batting badges
('century-maker', 'Century Maker', 'Your captain scored 100+ fantasy points in a match', '💯', 'batting', '{"type": "captain_points_gte", "value": 100}'),
('dream-team', 'Dream Team', 'Scored 200+ total fantasy points in a single match', '⭐', 'batting', '{"type": "team_points_gte", "value": 200}'),
('six-machine', 'Six Machine', 'Picked a player who hit 5+ sixes in a match', '🔥', 'batting', '{"type": "player_sixes_gte", "value": 5}'),

-- Bowling badges
('wicket-master', 'Wicket Master', 'Picked a bowler who took 4+ wickets', '🎯', 'bowling', '{"type": "player_wickets_gte", "value": 4}'),
('maiden-king', 'Maiden King', 'Picked a bowler who bowled 2+ maiden overs', '👑', 'bowling', '{"type": "player_maidens_gte", "value": 2}'),

-- Streak badges
('streak-3', 'Hat Trick', 'Participated in 3 consecutive match contests', '🏏', 'streak', '{"type": "streak_gte", "value": 3}'),
('streak-5', 'Iron Streak', 'Participated in 5 consecutive match contests', '🔥', 'streak', '{"type": "streak_gte", "value": 5}'),
('streak-10', 'Unstoppable', 'Participated in 10 consecutive match contests', '💪', 'streak', '{"type": "streak_gte", "value": 10}'),

-- Social badges
('first-contest', 'Welcome Aboard', 'Joined your first contest', '🎉', 'social', '{"type": "contests_joined_gte", "value": 1}'),
('contest-creator', 'League Founder', 'Created your first contest', '🏆', 'social', '{"type": "contests_created_gte", "value": 1}'),
('full-house', 'Full House', 'Joined a contest with 10+ members', '🏟️', 'social', '{"type": "contest_members_gte", "value": 10}'),

-- Special badges
('podium-finish', 'Podium Finish', 'Finished in top 2 in 3 different match contests', '🥇', 'special', '{"type": "top2_finishes_gte", "value": 3}'),
('underdog', 'Underdog Hero', 'A player under 7.0 credits scored 50+ points for you', '🐕', 'special', '{"type": "low_credit_high_score", "credit_max": 7.0, "points_min": 50}'),
('captain-clutch', 'Captain Clutch', 'Your captain was the top scorer 3 times', '🎖️', 'special', '{"type": "captain_top_scorer_gte", "value": 3}'),
('season-champion', 'Season Champion', 'Finished #1 in a season leaderboard', '🏆', 'special', '{"type": "season_rank", "value": 1}'),
('comeback-king', 'Comeback King', 'Went from bottom half to top 3 in season leaderboard', '📈', 'special', '{"type": "comeback", "from_bottom_half": true, "to_top": 3}'),
('perfect-pick', 'Perfect Pick', 'All 11 of your players scored 20+ fantasy points', '✨', 'special', '{"type": "all_players_scored_gte", "value": 20}'),
('loyal-fan', 'Loyal Fan', 'Played every single match in the season', '❤️', 'special', '{"type": "matches_played_gte", "value": 74}');
