-- Fix storage RLS for avatars bucket
-- Supabase requires: TO authenticated, and SELECT for upsert to work

-- Drop existing policies if they exist (idempotent)
drop policy if exists "Users can upload own avatar" on storage.objects;
drop policy if exists "Users can update own avatar" on storage.objects;
drop policy if exists "Users can delete own avatar" on storage.objects;

-- Insert: authenticated users can upload to their own folder (path: {user_id}/avatar.ext)
create policy "Users can upload own avatar"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Select: allow anyone to read avatars (public bucket). Also needed for upsert overwrite.
create policy "Avatars are publicly readable"
  on storage.objects for select
  using (bucket_id = 'avatars');

-- Update: for upsert overwrite
create policy "Users can update own avatar"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Delete: users can remove their own avatar
create policy "Users can delete own avatar"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
