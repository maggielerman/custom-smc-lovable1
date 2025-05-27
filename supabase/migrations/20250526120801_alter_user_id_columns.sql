-- Drop foreign key constraints, RLS policies, and indexes depending on user_id UUID type
ALTER TABLE public.saved_carts DROP CONSTRAINT IF EXISTS saved_carts_user_id_fkey;
ALTER TABLE public.family_stories DROP CONSTRAINT IF EXISTS family_stories_user_id_fkey;

-- Drop all policies on these tables to be safe
DROP POLICY IF EXISTS "saved_carts_owner" ON public.saved_carts;
DROP POLICY IF EXISTS "family_stories_owner" ON public.family_stories;
-- Add drops for any other potential policies if known, or list policies in dashboard.

-- Drop indexes on user_id columns (assuming common naming)
DROP INDEX IF EXISTS idx_saved_carts_user_id;
DROP INDEX IF EXISTS idx_family_stories_user_id;
-- Add drops for any other potential indexes if known, or list indexes in dashboard.

-- Alter column types from UUID to TEXT
ALTER TABLE public.saved_carts
ALTER COLUMN user_id TYPE text;

ALTER TABLE public.family_stories
ALTER COLUMN user_id TYPE text;

-- Recreate foreign key constraints with TEXT type
ALTER TABLE public.saved_carts
ADD CONSTRAINT saved_carts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.family_stories
ADD CONSTRAINT family_stories_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Recreate RLS policies using auth.jwt()->>'sub'
CREATE POLICY "saved_carts_owner" ON public.saved_carts
  USING ( user_id = auth.jwt() ->> 'sub' )
  WITH CHECK ( user_id = auth.jwt() ->> 'sub' );

CREATE POLICY "family_stories_owner" ON public.family_stories
  USING ( user_id = auth.jwt() ->> 'sub' )
  WITH CHECK ( user_id = auth.jwt() ->> 'sub' ); 