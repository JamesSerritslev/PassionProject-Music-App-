-- BandScope MVP - Initial Database Schema
-- Migration: 20260130000000
-- Based on BandScope-Project-Spec.md and frontend design

-- =============================================================================
-- PROFILES
-- Extends auth.users with role-specific data (musician, band, venue)
-- =============================================================================

-- Enable uuid-ossp extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  role text not null check (role in ('musician', 'band', 'venue')),
  display_name text not null,
  avatar_url text,
  gallery_urls text[] default '{}',
  location text,
  bio text,
  links jsonb default '[]',
  genres text[] default '{}',
  instruments text[] default '{}',
  seeking text[] default '{}',
  influences text[] default '{}',
  age int,
  roles text[] default '{}',
  members jsonb default '[]',
  last_active_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Index for feed queries (exclude venues per spec)
create index if not exists idx_profiles_role on public.profiles(role);

-- Index for search (name, location)
create index if not exists idx_profiles_display_name on public.profiles(display_name);
create index if not exists idx_profiles_location on public.profiles(location);

-- Enable RLS
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

-- =============================================================================
-- FOLLOWS
-- Musicians/bands follow other profiles (Instagram-style)
-- follower_id: the user doing the following (auth.uid())
-- following_id: the profile being followed
-- =============================================================================
create table if not exists public.follows (
  follower_id uuid references auth.users(id) on delete cascade not null,
  following_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz default now(),
  primary key (follower_id, following_id)
);

-- Index for "who does user X follow"
create index if not exists idx_follows_follower on public.follows(follower_id);

-- Index for "who follows profile X"
create index if not exists idx_follows_following on public.follows(following_id);

alter table public.follows enable row level security;

create policy "Follows viewable by everyone"
  on public.follows for select using (true);

create policy "Users can manage own follows"
  on public.follows for all
  using (auth.uid() = follower_id);

-- =============================================================================
-- EVENTS
-- Created by bands and venues (profiles with role band or venue)
-- =============================================================================
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  created_by uuid references public.profiles(id) on delete cascade not null,
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

-- Index for events feed (upcoming events)
create index if not exists idx_events_date on public.events(event_date);

-- Index for "my events" (band/venue profile)
create index if not exists idx_events_created_by on public.events(created_by);

alter table public.events enable row level security;

create policy "Events viewable by everyone"
  on public.events for select using (true);

create policy "Profile owners can insert events"
  on public.events for insert
  with check (
    auth.uid() = (select user_id from public.profiles where id = created_by)
    and exists (
      select 1 from public.profiles p
      where p.id = created_by and p.role in ('band', 'venue')
    )
  );

create policy "Profile owners can update own events"
  on public.events for update
  using (
    auth.uid() = (select user_id from public.profiles where id = created_by)
  );

create policy "Profile owners can delete own events"
  on public.events for delete
  using (
    auth.uid() = (select user_id from public.profiles where id = created_by)
  );

-- =============================================================================
-- UPDATED_AT TRIGGERS
-- Auto-update updated_at on profile and event changes
-- =============================================================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger events_updated_at
  before update on public.events
  for each row execute procedure public.handle_updated_at();
