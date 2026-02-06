-- BandScope - Add gallery_urls to profiles (for existing deployments)
-- Migration: 20260130000001
-- Use this if you already have profiles table from schema.sql without gallery_urls

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

alter table public.profiles
  add column if not exists gallery_urls text[] default '{}';
