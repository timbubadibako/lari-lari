# LARI - Master Development TODO

## Phase 1: Architecture & UI Overhaul (Current Focus)
- [ ] **UI Migration (Midnight Sapphire):** Apply the new "Midnight Sapphire" glassmorphism theme across all screens using `NativeWind`. Use `DM Serif Display` and `Jost` fonts.
- [ ] **Navigation System:** Implement the "Floating Tactical Island" (Style A) or "Obsidian Dock" (Style B) from `navbars.html`.
- [ ] **Interaction Logic Implementation:** 
  - Code the "Hold to Pause" (2s) safety feature in the `tracking.tsx` screen.
  - Code the "Double Tap to Claim" logic for closing territory loops.

## Phase 2: Lightweight Tracking Mechanics
- [ ] **Turf.js Pipeline:** Integrate `@turf/simplify` (Douglas-Peucker) to smooth raw GPS location arrays.
- [ ] **Chain-Code Extraction:** Implement `@turf/bearing` logic to drop redundant middle coordinates on straight paths, saving only Inflection Points.
- [ ] **Client-Side Loop Detection:** Use Turf.js to detect if the current coordinate is within 20m of the starting coordinate to trigger a "Closed Loop".

## Phase 3: Backend Integration (Supabase + PostGIS)
- [ ] **Database Migration:** Apply `SCHEMA.sql` to Supabase.
- [ ] **RPC Consolidation Function:** Write the Supabase RPC function that uses PostGIS `ST_Union` to merge a user's newly captured Polygon with their existing `MultiPolygon` in the `user_territories` table.
- [ ] **Leaderboard Cron Job:** Setup `pg_cron` in Supabase to update the `leaderboard_cache` table every 15 minutes.

## Phase 4: Gamification & Polish
- [ ] **Guild System:** Implement Guild creation and assigning "Dominion Colors" to users.
- [ ] **Social Share Export:** Implement the UI from `share.html` and use `react-native-view-shot` to export the image for Instagram Stories.
- [ ] **Haptics & Audio:** Add subtle vibration (`expo-haptics`) and UI sounds (e.g., on "Hold to Pause" success or "Mission Complete").
