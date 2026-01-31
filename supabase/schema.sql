-- BandScope MVP schema for Supabase
-- Run in SQL Editor after creating your project

-- Enable UUID extension if needed
-- create extension if not exists "uuid-ossp";

-- Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  role text not null check (role in ('musician', 'band', 'venue')),
  display_name text not null,
  avatar_url text,
  location text,
  bio text,
  links jsonb default '[]',
  genres text[],
  instruments text[],
  seeking text[],
  influences text[],
  age int,
  roles text[],
  members jsonb default '[]',
  last_active_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS
alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = user_id);

-- Follows (musicians/bands follow each other)
create table if not exists public.follows (
  follower_id uuid references auth.users(id) on delete cascade not null,
  following_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamptz default now(),
  primary key (follower_id, following_id),
  check (follower_id != following_id)
);

alter table public.follows enable row level security;

create policy "Follows viewable by everyone"
  on public.follows for select using (true);

create policy "Users can manage own follow"
  on public.follows for all
  using (auth.uid() = follower_id);

-- Events (created by bands/venues)
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  created_by uuid references auth.users(id) on delete cascade not null,
  name text not null,
  description text,
  location text,
  event_date date not null,
  event_time text,
  price text,
  image_url text,
  attendee_count int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.events enable row level security;

create policy "Events viewable by everyone"
  on public.events for select using (true);

create policy "Users can insert own events"
  on public.events for insert
  with check (auth.uid() = created_by);

create policy "Users can update own events"
  on public.events for update
  using (auth.uid() = created_by);

create policy "Users can delete own events"
  on public.events for delete
  using (auth.uid() = created_by);

-- Trigger: create profile on signup (optional – or create in app after role selection)
-- create or replace function public.handle_new_user()
-- returns trigger as $$
-- begin
--   insert into public.profiles (user_id, role, display_name)
--   values (new.id, 'musician', coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)));
--   return new;
-- end;
-- $$ language plpgsql security definer;

-- create trigger on_auth_user_created
--   after insert on auth.users
--   for each row execute procedure public.handle_new_user();
