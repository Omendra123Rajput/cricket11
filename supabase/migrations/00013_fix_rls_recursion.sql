-- Fix infinite recursion between contests and contest_members RLS policies.
-- The old policies created a circular dependency:
--   contests_select_member → reads contest_members → contest_members_select → reads contest_members (self-ref)
-- Fix: use direct user_id check instead of self-referencing subquery.

-- Drop the recursive policies
DROP POLICY IF EXISTS "contest_members_select" ON contest_members;
DROP POLICY IF EXISTS "contests_select_member" ON contests;

-- contest_members: users can see rows in contests they belong to.
-- Simple user_id check avoids self-referencing subquery.
CREATE POLICY "contest_members_select"
  ON contest_members FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- contests: members can see a contest if they're in it, OR they created it.
-- The created_by check lets the creator see the contest immediately after insert
-- (before being added to contest_members).
CREATE POLICY "contests_select_member"
  ON contests FOR SELECT
  TO authenticated
  USING (
    auth.uid() = created_by
    OR id IN (SELECT contest_id FROM contest_members WHERE user_id = auth.uid())
  );
