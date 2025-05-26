-- Consolidated schema based on migrations 1001 through 1009

-- Tables and initial schema (from 1001, adding missing tables implied by other migrations)

-- Profiles — 1-to-1 with auth.users
create table if not exists public.profiles (
  id text primary key,
  username        text unique,
  full_name       text,
  avatar_url      text,
  website         text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- Blog posts
create table if not exists public.blog_posts (
  id          uuid primary key default gen_random_uuid(),
  author_id   text references public.profiles(id) on delete cascade,
  slug        text not null,
  title       text not null,
  content     text,
  published   boolean default false,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now(),
  unique (slug)                             -- enforce unique slugs
);

-- Saved Drafts (implied by 1003, 1004, 1007)
create table if not exists public.saved_drafts (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references public.profiles(id) on delete cascade,
  content text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Saved Carts (implied by 1003, 1004, 1007)
create table if not exists public.saved_carts (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references public.profiles(id) on delete cascade,
  items jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Family Members (implied by 1003, 1007)
create table if not exists public.family_members (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references public.profiles(id) on delete cascade,
  name text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Family Stories (implied by 1003, 1007)
create table if not exists public.family_stories (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references public.profiles(id) on delete cascade,
  title text not null,
  story text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enum & user roles (from 1001, updated by 1005)
-- Recreate enum with final values
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM pg_type
        WHERE typname = 'app_role'
    ) THEN
        -- If the enum exists, perform the update steps from 1005
        ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'author';
        ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'user';

        CREATE TYPE public.app_role_new AS ENUM ('admin', 'author', 'user');

        ALTER TABLE public.user_roles
          ALTER COLUMN role TYPE public.app_role_new
          USING role::text::public.app_role_new;

        DROP TYPE public.app_role;
        ALTER TYPE public.app_role_new RENAME TO app_role;
    ELSE
        -- If the enum doesn't exist, create it with the final values
        CREATE TYPE public.app_role AS ENUM ('admin', 'author', 'user');
    END IF;
END
$$;

create table if not exists public.user_roles (
  user_id text not null references public.profiles(id) on delete cascade,
  role    public.app_role not null,
  primary key (user_id, role)
);

-- Column type and default updates (from 1007, applied directly in table definitions above)

-- Helpful indexes (from 1001, 1004)
create index if not exists idx_blog_posts_author on public.blog_posts(author_id);
create index if not exists idx_user_roles_user  on public.user_roles(user_id);
create index if not exists idx_family_members_user_id ON family_members(user_id);
create index if not exists idx_saved_drafts_user_id ON saved_drafts(user_id);
create index if not exists idx_saved_carts_user_id ON saved_carts(user_id);

-- Enable RLS (from 1001, 1003)
alter table public.profiles  enable row level security;
alter table public.blog_posts enable row level security;
alter table public.saved_drafts ENABLE ROW LEVEL SECURITY;
alter table public.saved_carts ENABLE ROW LEVEL SECURITY;
alter table public.family_members ENABLE ROW LEVEL SECURITY;
alter table public.family_stories ENABLE ROW level security;
alter table public.user_roles ENABLE ROW LEVEL SECURITY;

-- Policies using auth.jwt()->>'sub' (from 1001, 1003, 1006, 1007, 1008)

-- Profiles: owner can read/write, owner can insert
drop policy if exists "profiles_owner_rw" on public.profiles;
create policy "profiles_owner_rw" on public.profiles
  using  (id = auth.jwt() ->> 'sub') with check (id = auth.jwt() ->> 'sub');

drop policy if exists "profile_owner_insert" on public.profiles;
create policy "profile_owner_insert"
  on public.profiles
  for insert
  with check ( id = auth.jwt() ->> 'sub' );

-- Blog posts: anyone reads published; owner or admin can read/write
drop policy if exists "blog_posts_public_read" on public.blog_posts;
create policy "blog_posts_public_read" on public.blog_posts
  for select using (published = true);

drop policy if exists "blog_posts_owner_rw" on public.blog_posts;
create policy "blog_posts_owner_rw" on public.blog_posts
  using  (author_id = auth.jwt() ->> 'sub'
          or public.has_role(auth.jwt() ->> 'sub','admin'))
  with check (author_id = auth.jwt() ->> 'sub'
          or public.has_role(auth.jwt() ->> 'sub','admin'));

-- Saved drafts
drop policy if exists "Users can manage their drafts" on public.saved_drafts;
drop policy if exists "saved_drafts_owner" on public.saved_drafts;
create policy "saved_drafts_owner" on public.saved_drafts
  using ( user_id = auth.jwt() ->> 'sub' )
  with check ( user_id = auth.jwt() ->> 'sub' );

-- Saved carts
drop policy if exists "Users can manage their carts" on public.saved_carts;
drop policy if exists "saved_carts_owner" on public.saved_carts;
create policy "saved_carts_owner" on public.saved_carts
  using ( user_id = auth.jwt() ->> 'sub' )
  with check ( user_id = auth.jwt() ->> 'sub' );

-- Family members
drop policy if exists "Users can manage their family members" on public.family_members;
drop policy if exists "family_members_owner" on public.family_members;
create policy "family_members_owner" on public.family_members
  using ( user_id = auth.jwt() ->> 'sub' )
  with check ( user_id = auth.jwt() ->> 'sub' );

-- Family stories
drop policy if exists "Users can manage their family stories" on public.family_stories;
drop policy if exists "family_stories_owner" on public.family_stories;
create policy "family_stories_owner" on public.family_stories
  using ( user_id = auth.jwt() ->> 'sub' )
  with check ( user_id = auth.jwt() ->> 'sub' );

-- User roles - restrictive policy, requires RPC for management (from 1003, 1006)
drop policy if exists "Users can manage their roles" on public.user_roles;
drop policy if exists "Users can read their own roles" on public.user_roles;
create policy "Users can read their own roles" on public.user_roles
  for select using (user_id = auth.jwt() ->> 'sub');

-- Optional: Policy to allow service_role full access (from 1006)
drop policy if exists "Service role full access to user roles" on public.user_roles;
create policy "Service role full access to user roles" on public.user_roles
  as permissive for all
  to service_role
  using (true);

-- Helper function: public.has_role (from 1001, updated by 1009)
-- Recreate function to accept text user_id
drop function if exists public.has_role(uuid, public.app_role);
create or replace function public.has_role(_user_id text, _role public.app_role)
returns boolean
language sql stable security definer
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role    = _role
  );
$$; 