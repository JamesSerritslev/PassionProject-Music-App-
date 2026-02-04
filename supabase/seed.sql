-- BandScope - Seed mock profiles and events
-- Run with: supabase db reset (applies migrations + seed)
-- Or: psql $DATABASE_URL -f supabase/seed.sql

-- Enable extensions
create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

-- Deterministic UUIDs from mock ids (namespace: BandScope seed)
-- u1..u17 = musician/band users, u18..u21 = venue users
-- m1..m13, b1..b4 = musician/band profiles, v1..v4 = venue profiles
do $$
declare
  u_ids uuid[];
  p_ids uuid[];
  i int;
  ns uuid := 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
begin
  -- Generate 21 user UUIDs (u1-u17 for musicians/bands, u18-u21 for venues)
  for i in 1..21 loop
    u_ids[i] := uuid_generate_v5(ns, 'u' || i);
  end loop;

  -- Insert auth users (all use password: password123)
  for i in 1..21 loop
    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at, is_sso_user
    ) values (
      '00000000-0000-0000-0000-000000000000',
      u_ids[i],
      'authenticated',
      'authenticated',
      'seed' || i || '@bandscope.example.com',
      crypt('password123', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{}',
      now(),
      now(),
      false
    )
    on conflict (id) do nothing;

    -- Create identity for email sign-in (required for auth to work)
    insert into auth.identities (
      id, user_id, provider_id, identity_data, provider,
      last_sign_in_at, created_at, updated_at
    ) values (
      uuid_generate_v5(ns, 'identity_u' || i),
      u_ids[i],
      u_ids[i]::text,
      jsonb_build_object('sub', u_ids[i]::text, 'email', 'seed' || i || '@bandscope.example.com'),
      'email',
      now(),
      now(),
      now()
    )
    on conflict do nothing;
  end loop;

  -- Insert profiles (18 musician/band + 4 venue)
  -- Musicians and bands (m1-m13, b1-b4)
  insert into public.profiles (id, user_id, role, display_name, avatar_url, gallery_urls, location, bio, genres, instruments, seeking, influences, age, roles, members, last_active_at) values
  (uuid_generate_v5(ns, 'm1'), u_ids[1], 'musician', 'Alex Rivera', 'https://i.pravatar.cc/400?u=alex-rivera', array['https://picsum.photos/seed/m1a/400/400','https://picsum.photos/seed/m1b/400/400','https://picsum.photos/seed/m1c/400/400'], 'Brooklyn, NY', 'Guitarist and songwriter.', array['Rock','Indie'], array['Guitar','Vocals','Bass','Drums','Keys','Saxophone','Trumpet','Violin','Other'], array['Drummer','Bassist'], array['Radiohead','The Strokes'], 28, array['Lead guitar','Backing vocals'], '[]', now()),
  (uuid_generate_v5(ns, 'b1'), u_ids[2], 'band', 'The Night Owls', 'https://i.pravatar.cc/400?u=night-owls', array['https://picsum.photos/seed/b1a/400/400','https://picsum.photos/seed/b1b/400/400'], 'Manhattan, NY', 'Indie rock band looking for a drummer.', array['Indie','Alternative'], array['Guitar','Bass','Keys'], array['Drummer'], array['Arctic Monkeys','Tame Impala'], null, null, '[{"name":"Jake","age":26},{"name":"Mia","age":24}]', now()),
  (uuid_generate_v5(ns, 'm2'), u_ids[3], 'musician', 'Sam Chen', 'https://i.pravatar.cc/400?u=sam-chen', array['https://picsum.photos/seed/m2a/400/400','https://picsum.photos/seed/m2b/400/400','https://picsum.photos/seed/m2c/400/400','https://picsum.photos/seed/m2d/400/400'], 'Queens, NY', 'Drummer and percussionist.', array['Jazz','Funk'], array['Drums','Percussion'], array['Bands'], array['Questlove','Tony Williams'], 32, array['Drummer'], '[]', now()),
  (uuid_generate_v5(ns, 'm3'), u_ids[4], 'musician', 'Jordan Blake', 'https://i.pravatar.cc/400?u=jordan-blake', array['https://picsum.photos/seed/m3a/400/400','https://picsum.photos/seed/m3b/400/400'], 'Austin, TX', 'Singer-songwriter with a folk edge.', array['Folk','Indie'], array['Vocals','Guitar'], array['Bassist','Drummer'], array['Bon Iver','Fleet Foxes'], 25, array['Lead vocals','Acoustic guitar'], '[]', now()),
  (uuid_generate_v5(ns, 'm4'), u_ids[5], 'musician', 'Marcus Webb', 'https://i.pravatar.cc/400?u=marcus-webb', '{}', 'Chicago, IL', 'Bass player for hire. Funk and soul.', array['Funk','Soul','R&B'], array['Bass'], array['Bands','Session work'], array['Bootsy Collins','Thundercat'], 29, array['Bassist'], '[]', now()),
  (uuid_generate_v5(ns, 'm5'), u_ids[6], 'musician', 'Elena Vasquez', 'https://i.pravatar.cc/400?u=elena-vasquez', array['https://picsum.photos/seed/m5a/400/400'], 'Los Angeles, CA', 'Keys and synth player. Electronic and pop.', array['Electronic','Pop','Synth-pop'], array['Keys','Synth'], array['Bands','Producers'], array['Daft Punk','CHVRCHES'], 27, array['Keys','Synth'], '[]', now()),
  (uuid_generate_v5(ns, 'm6'), u_ids[7], 'musician', 'Derek Holt', 'https://i.pravatar.cc/400?u=derek-holt', '{}', 'Nashville, TN', 'Country and Americana guitarist.', array['Country','Americana','Folk'], array['Guitar','Vocals'], array['Band'], array['Jason Isbell','Sturgill Simpson'], 34, array['Lead guitar','Vocals'], '[]', now()),
  (uuid_generate_v5(ns, 'm7'), u_ids[8], 'musician', 'Priya Sharma', 'https://i.pravatar.cc/400?u=priya-sharma', '{}', 'Seattle, WA', 'Violinist. Classical and indie crossover.', array['Classical','Indie','Post-rock'], array['Violin'], array['Bands','Orchestras'], array['Ólafur Arnalds','Sigur Rós'], 26, array['Violinist'], '[]', now()),
  (uuid_generate_v5(ns, 'm8'), u_ids[9], 'musician', 'Tyler Morgan', 'https://i.pravatar.cc/400?u=tyler-morgan', '{}', 'Denver, CO', 'Multi-instrumentalist. Primarily drums and guitar.', array['Rock','Blues','Alternative'], array['Drums','Guitar'], array['Band'], array['Foo Fighters','Black Keys'], 30, array['Drummer','Rhythm guitar'], '[]', now()),
  (uuid_generate_v5(ns, 'm9'), u_ids[10], 'musician', 'Nina Okonkwo', 'https://i.pravatar.cc/400?u=nina-okonkwo', '{}', 'Atlanta, GA', 'Vocalist. R&B and neo-soul.', array['R&B','Soul','Neo-soul'], array['Vocals'], array['Band','Producers'], array['Erykah Badu','SZA'], 24, array['Lead vocals'], '[]', now()),
  (uuid_generate_v5(ns, 'm10'), u_ids[11], 'musician', 'Oscar Reyes', 'https://i.pravatar.cc/400?u=oscar-reyes', '{}', 'Miami, FL', 'Percussionist. Latin and world music.', array['Latin','World','Afro-Cuban'], array['Percussion','Congas'], array['Bands','Ensembles'], array['Tito Puente','Buena Vista Social Club'], 31, array['Percussionist'], '[]', now()),
  (uuid_generate_v5(ns, 'm11'), u_ids[12], 'musician', 'Zoe Kim', 'https://i.pravatar.cc/400?u=zoe-kim', '{}', 'Portland, OR', 'Saxophonist. Jazz and indie.', array['Jazz','Indie','Soul'], array['Saxophone'], array['Bands','Jazz combos'], array['Kamasi Washington','BADBADNOTGOOD'], 28, array['Saxophonist'], '[]', now()),
  (uuid_generate_v5(ns, 'b2'), u_ids[13], 'band', 'Static Dreams', 'https://i.pravatar.cc/400?u=static-dreams', '{}', 'Philadelphia, PA', 'Post-punk band. Looking for a bassist.', array['Post-punk','Alternative','Shoegaze'], array['Guitar','Drums','Vocals'], array['Bassist'], array['Joy Division','Interpol'], null, null, '[{"name":"Chris","age":27},{"name":"Dana","age":25},{"name":"Evan","age":28}]', now()),
  (uuid_generate_v5(ns, 'b3'), u_ids[14], 'band', 'The Velvet Underground Revival', 'https://i.pravatar.cc/400?u=velvet-revival', '{}', 'Boston, MA', 'Cover band. Classic rock and 70s hits.', array['Classic Rock','Cover/Tribute','Rock'], array['Guitar','Bass','Drums','Keys','Vocals'], array['Lead guitarist'], array['Led Zeppelin','The Who'], null, null, '[{"name":"Frank","age":45},{"name":"Linda","age":42},{"name":"Mike","age":38}]', now()),
  (uuid_generate_v5(ns, 'b4'), u_ids[15], 'band', 'Midnight Echo', 'https://i.pravatar.cc/400?u=midnight-echo', '{}', 'Detroit, MI', 'Electronic duo. Synth and drums.', array['Electronic','Synth-pop','Indie'], array['Synth','Drums','Vocals'], array['Vocalist'], array['The xx','MGMT'], null, null, '[{"name":"Alex","age":23},{"name":"Jordan","age":24}]', now()),
  (uuid_generate_v5(ns, 'm12'), u_ids[16], 'musician', 'Ryan Foster', 'https://i.pravatar.cc/400?u=ryan-foster', '{}', 'Minneapolis, MN', 'Lead guitarist. Metal and hard rock.', array['Metal','Hard Rock'], array['Guitar'], array['Band'], array['Metallica','Tool'], 29, array['Lead guitar'], '[]', now()),
  (uuid_generate_v5(ns, 'm13'), u_ids[17], 'musician', 'Ashley Park', 'https://i.pravatar.cc/400?u=ashley-park', '{}', 'San Francisco, CA', 'Cellist. Chamber and film scoring.', array['Classical','Chamber','Ambient'], array['Cello'], array['Ensembles','Film projects'], array['Max Richter','Hildur Guðnadóttir'], 27, array['Cellist'], '[]', now())
  on conflict (id) do nothing;

  -- Venue profiles (v1-v4) for events
  insert into public.profiles (id, user_id, role, display_name, avatar_url, location, bio, last_active_at) values
  (uuid_generate_v5(ns, 'v1'), u_ids[18], 'venue', 'The Green Room', 'https://i.pravatar.cc/400?u=green-room', 'Brooklyn, NY', 'Intimate venue for live music.', now()),
  (uuid_generate_v5(ns, 'v2'), u_ids[19], 'venue', 'The Blue Note', 'https://i.pravatar.cc/400?u=blue-note', 'Brooklyn, NY', 'Jazz club and performance space.', now()),
  (uuid_generate_v5(ns, 'v3'), u_ids[20], 'venue', 'The Bitter End', 'https://i.pravatar.cc/400?u=bitter-end', 'Greenwich Village, NY', 'Historic singer-songwriter venue.', now()),
  (uuid_generate_v5(ns, 'v4'), u_ids[21], 'venue', 'Saint Vitus Bar', 'https://i.pravatar.cc/400?u=saint-vitus', 'Greenpoint, NY', 'Metal and rock venue.', now())
  on conflict (id) do nothing;
end $$;

-- Insert events (created_by references profile ids)
insert into public.events (id, created_by, name, description, location, event_date, event_time, price, attendee_count) values
(uuid_generate_v5('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'e1'), uuid_generate_v5('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'v1'), 'Open Mic Night', 'Weekly open mic. All genres welcome.', 'The Green Room, Brooklyn', '2026-02-15', '20:00', 'Free', 24),
(uuid_generate_v5('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'e2'), uuid_generate_v5('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'v1'), 'Indie Showcase', 'Three local bands. 21+.', 'Velvet Lounge, Manhattan', '2026-02-20', '19:30', '$15', 12),
(uuid_generate_v5('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'e3'), uuid_generate_v5('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'v2'), 'Jazz Night at The Blue Note', 'Live jazz with local and touring artists. Full bar.', 'The Blue Note, Brooklyn', '2026-02-18', '21:00', '$25', 48),
(uuid_generate_v5('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'e4'), uuid_generate_v5('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b1'), 'The Night Owls Album Release', 'Celebrating our debut EP. Special guests TBA.', 'Baby''s All Right, Brooklyn', '2026-03-01', '20:00', '$12', 89),
(uuid_generate_v5('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'e5'), uuid_generate_v5('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'v3'), 'Open Stage: Singer-Songwriter Night', 'Acoustic performances. Sign up at the door.', 'The Bitter End, Greenwich Village', '2026-02-22', '19:00', 'Free', 34),
(uuid_generate_v5('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'e6'), uuid_generate_v5('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'v4'), 'Metal Mayhem', 'Four local metal bands. All ages.', 'Saint Vitus Bar, Greenpoint', '2026-03-08', '19:30', '$20', 67),
(uuid_generate_v5('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'e7'), uuid_generate_v5('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b2'), 'Static Dreams Live', 'Post-punk night. Us + two support acts.', 'Elsewhere, Bushwick', '2026-03-15', '20:30', '$18', 42)
on conflict (id) do nothing;
