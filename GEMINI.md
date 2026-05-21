# Project: LARI (StrideIO) - Engineering Mandates

## Visual Identity: Neobrutalism Tactical
- **Chunky Borders:** Always use `border-[3px]` or `border-4` with dark slate/black colors.
- **Offset Shadows:** No soft CSS shadows. Use absolute `View` backgrounds with offsets like `top-1 left-1`.
- **Contrast:** Red (`#C72222`), Teal/Biru-Muda (`#8CC7C4`), and Biru-Gelap (`#2C5A64`) over Silver-White background.
- **Typography:** Bold `outfit` or monospaced fonts for tactical data.

## Architectural Standards: Modularity & Stability
- **Modular Dashboard:** Keep `app/index.tsx` lean. Move UI components to `components/dashboard/`.
- **Absolute Overlays:** To prevent "Couldn't find a navigation context" errors, all absolute overlays (Victory Modals, Safe Mode) MUST use pure React Native `<Text>` with inline styles, bypassing NativeWind's context dependency.
- **Store-Driven Logic:** All GPS and territory logic MUST live in `lib/store.ts` (Zustand).

## Geospatial Engine (Turf.js + PostGIS)
- **Closed-Loop Detection:** Loop closure requires > 5 points and a proximity of < 35 meters.
- **Dominion Merge:** Use server-side `consolidate_user_territories` (ST_Union) to merge user territories into a single MultiPolygon.
- **Session History:** Historical run paths are preserved in `runs` table even if the live territory is merged.

## Navigation & Auth
- **Auth Guard:** Protected routes are managed by `AuthGuard` in `_layout.tsx`.
- **Global Nav:** `BottomNav` is manually injected into screens to ensure context stability.
- **Safe Mode:** Integrated lock screen for battery-efficient pocket tracking.
