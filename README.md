# BandScope – Music Networking App

A music networking platform for musicians, bands, and venues. Built from the [BandScope Project Spec](BandScope-Project-Spec.md) and [Navigation Flow](BandScope-Navigation-Flow.md).

## Tech stack

- **React 18** + **TypeScript** + **Vite**
- **React Router** for navigation
- **Supabase** for auth and data (optional; app runs in mock mode without env)

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Without Supabase configured, use **Log in** with any email/password to enter demo mode.

### If `npm install` fails on Windows (EPERM / esbuild UNKNOWN)

1. **Close** Cursor/VS Code and any terminals using this folder.
2. **Delete** the `node_modules` folder and `package-lock.json` in the project (File Explorer or `rmdir /s /q node_modules` and `del package-lock.json` in Command Prompt).
3. **Optional:** Add the project folder to Windows Defender exclusions (Windows Security → Virus & threat protection → Manage settings → Exclusions) so the esbuild binary isn’t blocked.
4. Open a **new** terminal in the project and run:
   ```bash
   npm install
   ```
5. If it still fails, try installing with scripts skipped, then run the dev server (Vite may still work):
   ```bash
   npm install --ignore-scripts
   npm run dev
   ```

## Supabase (optional)

1. Create a project at [supabase.com](https://supabase.com).
2. Copy `.env.example` to `.env` and set:
   - `VITE_SUPABASE_URL` – project URL
   - `VITE_SUPABASE_ANON_KEY` – anon/public key
3. Run the SQL in `supabase/schema.sql` (create this from the spec) to create `profiles`, `events`, and `follows` tables.
4. **Profile pictures**: Create an `avatars` bucket in Supabase Dashboard: **Storage** → **New bucket** → name: `avatars`, **Public bucket**: on. Or deploy the `ensure-avatars-bucket` Edge Function (`supabase functions deploy ensure-avatars-bucket`) so the app can create it automatically when needed.

Without these env vars, the app uses mock data and mock auth so you can click through all flows.

## MVP features

- **Auth**: Login, signup, role selection (musician / band / venue), profile setup
- **Hero**: Feed of musician/band profile cards, search by name/location
- **Profiles**: Own profile (edit, settings, my events), other profiles (view, follow)
- **Events**: List upcoming events, event detail, create event (band/venue), my events
- **More**: Settings placeholder, logout

## Project structure

```
src/
  components/     # BottomNav, ProfileCard
  context/        # AuthContext
  data/           # mock.ts (profiles, events, following)
  lib/            # supabase client and types
  pages/          # Login, Signup, ProfileSetup, Hero, Profile, Events, More, Settings, etc.
```

## Design

- **Colors**: Dark grey background (`#1e1e1e` / `#2a2a2a`), green accent `#4caf50`
- **Typography**: DM Sans, 16px minimum body
- **Layout**: Mobile-first, bottom nav (Home, Events, Profile, More), 44px minimum tap targets

## Scripts

- `npm run dev` – start dev server
- `npm run build` – production build
- `npm run preview` – preview production build
