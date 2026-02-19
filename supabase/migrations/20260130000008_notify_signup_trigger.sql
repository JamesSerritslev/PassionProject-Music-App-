-- Enable pg_net for HTTP calls from Postgres
create extension if not exists pg_net with schema extensions;

-- Function that fires an HTTP POST to the notify-signup Edge Function
create or replace function public.notify_signup_email()
returns trigger
language plpgsql
security definer
as $$
declare
  edge_url text;
  service_key text;
begin
  edge_url := current_setting('app.settings.supabase_url', true);
  service_key := current_setting('app.settings.service_role_key', true);

  -- Only fire if both settings are available
  if edge_url is not null and service_key is not null then
    perform net.http_post(
      url := edge_url || '/functions/v1/notify-signup',
      headers := jsonb_build_object(
        'Authorization', 'Bearer ' || service_key,
        'Content-Type', 'application/json'
      ),
      body := jsonb_build_object(
        'user_id', NEW.user_id,
        'role', NEW.role,
        'display_name', NEW.display_name
      )
    );
  end if;

  return NEW;
end;
$$;

-- Trigger on profiles INSERT (fires when a new user completes profile)
drop trigger if exists on_profile_created_notify on public.profiles;
create trigger on_profile_created_notify
  after insert on public.profiles
  for each row
  execute function public.notify_signup_email();
