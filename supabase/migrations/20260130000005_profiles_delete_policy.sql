-- Allow users to delete their own profile
create policy "Users can delete own profile"
  on public.profiles for delete
  using (auth.uid() = user_id);
