# CLAUDE.md

## Workflow Orchestration

### 1. Plan Mode Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity

### 2. Subagent Strategy
- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One task per subagent for focused execution

### 3. Self-Improvement Loop
- After ANY correction from the user: update tasks/lessons.md with the pattern
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project

## Workflow

### 4. Verification Before Done
- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness

### 5. Demand Elegance (Balanced)
- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes - don't over-engineer
- Challenge your own work before presenting it

### 6. Autonomous Bug Fixing
- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests -- then resolve them
- Zero context switching required from the user
- Go fix failing CI tests without being told how

## Task Management

1. **Plan First**: Write plan to tasks/todo.md with checkable items
2. **Verify Plan**: Check in before starting implementation
3. **Track Progress**: Mark items complete as you go
4. **Explain Changes**: High-level summary at each step
5. **Document Results**: Add review section to tasks/todo.md
6. **Capture Lessons**: Update tasks/lessons.md after corrections

## Core Principles

- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact**: Only touch what's necessary. No side effects with new bugs.

---

## Project Context

### Tech Stack
- Next.js 16 (App Router) + TypeScript + Tailwind CSS + shadcn/ui + Framer Motion
- Supabase (PostgreSQL + Auth + Realtime) — free tier
- CricAPI (api.cricapi.com/v1) free tier — 100 hits/day limit
- Client-side polling (30s) hits DB cache; real API called max every 5 min
- Vercel free tier deployment

### Architecture Decisions
- **Single Supabase backend**: Auth + DB + Realtime in one service
- **DB-as-cache for live scores**: `sync-scores` checks `matches.last_synced_at` — if < 5 min, returns DB data without API call. Saves API hits (100/day limit), works across all Vercel instances (no cold-start loss)
- **Scorecard costs 10 hits per call** (`hitsUsed: 10`), currentMatches costs 1 hit. Budget: ~10 scorecard calls/day max
- **Fixture sync required on first run**: Call `GET /api/cricket/sync-fixtures` (with CRON_SECRET) to populate `matches.external_id` from real CricAPI UUIDs. Without this, sync-scores skips all matches.
- **IPL 2026 series_id**: `87c62aac-bc3c-4738-ab93-19da0690488f` (hardcoded constant, doesn't change mid-season)
- **Configurable scoring**: Contest scoring rules stored as JSONB, default rules in `supabase/seed/scoring_rules.json`
- **RLS everywhere**: Row Level Security on all 13 tables; service role only for cron/admin writes
- **Season points**: +3 (1st) / +2 (2nd) / -1 (rest) per match contest

### Key Paths
- `supabase/migrations/` — 12 SQL migration files (tables, RLS, functions)
- `supabase/seed/` — players.sql (200 players), matches.sql (78 matches), badges.sql, scoring_rules.json
- `src/types/database.ts` — All TypeScript types matching schema
- `src/lib/supabase/` — client, server, admin, middleware helpers
- `src/lib/utils/constants.ts` — IPL teams, roles, constraints, season points, IPL_2026_SERIES_ID
- `src/lib/cricket/cricapi.ts` — CricAPI adapter (getMatches, getScorecard, getSeriesMatches)
- `src/lib/cricket/api-client.ts` — Unified client with in-memory cache (schedule/stats only)
- `src/lib/cricket/team-normalizer.ts` — Full team name → DB abbreviation mapping
- `src/lib/cricket/player-matcher.ts` — Jaro-Winkler fuzzy matching + alias table for player names
- `src/app/api/cricket/sync-fixtures/` — Maps CricAPI match UUIDs to DB matches (run first!)
- `src/app/api/cricket/sync-scores/` — Live score sync with DB-level cache (5 min interval)
- `tasks/todo.md` — Progress tracker
- `tasks/lessons.md` — Self-improvement log

### Build & Run
```bash
npm run dev          # Start dev server (turbopack)
npm run build        # Production build
npm run lint         # ESLint
npm run test         # Run vitest (28 tests)
npm run test:watch   # Vitest watch mode
```

### Phase Status
- Phase 1: Foundation ✅ (scaffold, auth, landing, dashboard, nav)
- Phase 2: Data Layer ✅ (schema, migrations, RLS, seed data, types)
- Phase 3: Contest System ✅ (create, join, invite links, detail page, leaderboard)
- Phase 4: Team Builder ✅ (Dream11-style UI, role tabs, credit bar, captain/VC, validation, save)
- Phase 5: Cricket API ✅ (CricAPI adapter, cache, sync-scores route, polling hook)
- Phase 6: Scoring + Leaderboard ✅ (scoring engine, post-match processing, leaderboard ranking)
- Phase 7: Realtime + Live Experience ✅ (realtime leaderboard hook, countdown timer, live scorecard, leaderboard table with rank animations, points breakdown modal, match leaderboard page)
- Phase 8: Gamification ✅ (badge evaluation engine, badge-card/badge-grid components, streak tracking, auto-award on match processing, profile page with live badges)
- Phase 9: Analytics + UI Polish ✅ (skeleton loaders, page transitions, error boundaries, analytics page with bar chart, OG metadata)
- Phase 10: Hardening ✅ (28 vitest tests for scoring engine + team validator, CRON_SECRET on API routes, .env.example updated)
- Phase 11: Cricket API Fix ✅ (fixture sync route, DB-as-cache for live scores, Jaro-Winkler player matching)

### First-Run Checklist (new deployment)
1. Run `GET /api/cricket/sync-fixtures` with `Authorization: Bearer {CRON_SECRET}` to populate `external_id`
2. Verify response shows `matched >= 4` for IPL 2026 matches
3. Test `GET /api/cricket/sync-scores?matchId={id}` on a matched match
