# TODO – Lari Master Task & Activity Checklist

## Phase 1: Core Mechanics (Current Focus)
- [x] Project setup, folder, base theme/provider
- [x] Basic Documentation (PRD, TDD, Flow, etc.)
- [x] Map Dashboard UI (Neo-Brutalism, Dynamic Widget, Recenter, Resumable HUD)
- [x] Fix Location Errors & Permissions
- [x] Supabase Core Setup & Auth Infrastructure
- [x] Implement Turf.js (Smoothing & Inflection Point Extraction)
- [x] Closed-Boundary Polygon Capture Logic
- [x] Supabase Data Sync (Saving routes & Polygons to PostGIS)
- [x] Tactical HUD Refinement (2:1 Ratio, Safe Mode, 2s Long Press)
- [x] Mission Complete Summary Modal (Neobrutalism Light)

## Phase 2: Gamification & Scale (Upcoming)
- [ ] District Clipping Logic dengan GeoJSON (Batas Kecamatan Kabupaten Kuningan)
- [ ] Open Path Persistence & 48h Expiration (Cicil Wilayah)
- [ ] Social Media Share Templates (IG Story, Image Export)
- [ ] Multi-Tier Leaderboard Logic (Kecamatan -> Kabupaten -> Provinsi)
- [ ] Season Reset System (Mingguan/Bulanan) via Supabase Cron Jobs (pg_cron)
- [ ] Guild/Regu System & Co-op Territory Capture
- [ ] Background Location Task Manager (Expo Location)
- [ ] Final Testing & QA (Manual/Auto)

## Feedback & Next Session Priority
Besok kita akan masuk ke tahap **"Strategi Wilayah & Ekspansi"**. Kita akan fokus ke akurasi batasan wilayah dan fitur berbagi.

1. **District Clipping (Kecamatan):** Kita bakal pake data GeoJSON batas kecamatan di Kuningan. Jadi wilayah lu gak bakal "bocor" ke kecamatan tetangga, harus tetep rapi kepotong batas administratif.
2. **Open Path & Expiration (48 Jam):** Kita aktifkan fitur nyambung rute lari kemarin ke hari ini, tapi ada batas waktu biar gak curang.
3. **Share Templates:** Bikin desain kartu "Mission Accomplished" yang siap pamer di Instagram Story dengan gaya Neobrutalism tajam.

---

gemini --resume 6cb9adfa-0f02-4ae9-88f7-03207eee668b
gemini --resume 6cb9adfa-0f02-4ae9-88f7-03207eee668b