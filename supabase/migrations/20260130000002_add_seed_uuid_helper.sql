-- Deterministic UUID helper for seeding (avoids uuid_generate_v5 which may not exist on Supabase)
CREATE OR REPLACE FUNCTION public.seed_uuid(ns text, name text)
RETURNS uuid
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT (
    substring(md5(ns || name), 1, 8) || '-' ||
    substring(md5(ns || name), 9, 4) || '-' ||
    substring(md5(ns || name), 13, 4) || '-' ||
    substring(md5(ns || name), 17, 4) || '-' ||
    substring(md5(ns || name), 21, 12)
  )::uuid;
$$;
