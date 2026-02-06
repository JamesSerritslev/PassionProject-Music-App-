-- Create profile automatically when a new user signs up
-- Role comes from raw_user_meta_data (set during signUp)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, role, display_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'role', 'musician'),
    COALESCE(
      new.raw_user_meta_data->>'display_name',
      split_part(new.email, '@', 1),
      'New User'
    )
  );
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
