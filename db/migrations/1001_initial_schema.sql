-- 2024‑06‑24 initial schema and RLS setup
-- Profiles — 1‑to‑1 with auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
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
  author_id   uuid references public.profiles(id) on delete cascade,
  slug        text not null,
  title       text not null,
  content     text,
  published   boolean default false,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now(),
  unique (slug)                             -- enforce unique slugs
);

-- Enum & user roles
create type if not exists public.app_role as enum ('admin','editor');

create table if not exists public.user_roles (
  user_id uuid references public.profiles(id) on delete cascade,
  role    public.app_role not null,
  primary key (user_id, role)
);

-- Helpful indexes
create index if not exists idx_blog_posts_author on public.blog_posts(author_id);
create index if not exists idx_user_roles_user  on public.user_roles(user_id);

-- Enable RLS
alter table public.profiles  enable row level security;
alter table public.blog_posts enable row level security;

-- Profiles: owner can read/write
create policy profiles_owner_rw on public.profiles
  using  (id = auth.uid()) with check (id = auth.uid());

-- Blog posts: anyone reads published; owner or admin can read/write
create policy blog_posts_public_read on public.blog_posts
  for select using (published = true);

create policy blog_posts_owner_rw on public.blog_posts
  using  (author_id = auth.uid() 
          or public.has_role(auth.uid(),'admin'))
  with check (author_id = auth.uid() 
          or public.has_role(auth.uid(),'admin'));

-- Helper function: public.has_role
create or replace function public.has_role(_user_id uuid, _role public.app_role)
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