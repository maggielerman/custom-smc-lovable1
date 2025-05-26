-- ╭──────────────────────────────────────────────────────────╮
-- │  PREP: Temporarily disable RLS to change column types    │
-- ╰──────────────────────────────────────────────────────────╯
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_carts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_stories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_drafts DISABLE ROW LEVEL SECURITY;

-- ╭──────────────────────────────────────────────────────────╮
-- │  TEMP: Drop foreign key constraint on saved_carts.user_id │
-- ╰──────────────────────────────────────────────────────────╯
ALTER TABLE public.saved_carts
DROP CONSTRAINT IF EXISTS saved_carts_user_id_fkey;

-- 1) ╭──────────────────────────────────────────────────────────╮
--    │  ALTER COLUMN TYPES ⇒ text                              │
--    ╰──────────────────────────────────────────────────────────╯
-- Profiles (primary key is the auth owner)
alter table public.profiles
  alter column id type text using id::text;

-- Any table that stores "owner / user" pointers
alter table public.saved_carts
  alter column user_id type text using user_id::text;

alter table public.family_stories
  alter column user_id type text using user_id::text;

alter table public.saved_drafts
  alter column user_id type text using user_id::text;

-- repeat for any others, e.g. custom_books, orders, etc.
-- alter table public.<table> alter column user_id type text using user_id::text;

----------------------------------------------------------------
-- 2) ╭──────────────────────────────────────────────────────────╮
--    │  DEFAULTS: auto-fill with current Clerk sub             │
--    ╰──────────────────────────────────────────────────────────╯
-- (only where inserts originate from the client)

alter table public.saved_carts
  alter column user_id set default (auth.jwt() ->> 'sub');

alter table public.family_stories
  alter column user_id set default (auth.jwt() ->> 'sub');

alter table public.saved_drafts
  alter column user_id set default (auth.jwt() ->> 'sub');

-- Profiles primary key
alter table public.profiles
  alter column id set default (auth.jwt() ->> 'sub');

----------------------------------------------------------------
-- 3) ╭──────────────────────────────────────────────────────────╮
--    │  Re-enable RLS and create policies using auth.jwt()->>'sub'│
-- ╰──────────────────────────────────────────────────────────╯
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_drafts ENABLE ROW LEVEL SECURITY;

-- ╭──────────────────────────────────────────────────────────╮
-- │  TEMP: Recreate foreign key constraint on saved_carts.user_id │
-- ╰──────────────────────────────────────────────────────────╯
ALTER TABLE public.saved_carts
ADD CONSTRAINT saved_carts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Profiles
drop policy if exists "profile_owner" on public.profiles;
create policy "profile_owner"
  on public.profiles
  using ( id = auth.jwt() ->> 'sub' );

-- Saved carts
drop policy if exists "saved_carts_owner" on public.saved_carts;
create policy "saved_carts_owner"
  on public.saved_carts
  using ( user_id = auth.jwt() ->> 'sub' );

-- Family stories
drop policy if exists "family_stories_owner" on public.family_stories;
create policy "family_stories_owner"
  on public.family_stories
  using ( user_id = auth.jwt() ->> 'sub' );

-- Saved drafts
drop policy if exists "saved_drafts_owner" on public.saved_drafts;
create policy "saved_drafts_owner"
  on public.saved_drafts
  using ( user_id = auth.jwt() ->> 'sub' ); 