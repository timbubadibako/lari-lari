# TODO – Lari Master Task & Activity Checklist

## Phase 1: Core Mechanics (Current Focus)
- [x] Project setup, folder, base theme/provider
- [x] Basic Documentation (PRD, TDD, Flow, etc.)
- [x] Map Dashboard UI (Neo-Brutalism, Dynamic Widget, Recenter, Resumable HUD)
- [x] Fix Location Errors & Permissions
- [x] Supabase Core Setup & Auth Infrastructure
- [ ] Implement Turf.js (Smoothing & Inflection Point Extraction)
- [ ] Closed-Boundary Polygon Capture Logic
- [ ] Supabase Data Sync (Saving routes to PostGIS)
- [ ] Custom MapLibre `style.json` (Detailing roads and buildings)

## Phase 2: Gamification & Scale (Upcoming)
- [ ] Background Location Task Manager (Expo Location)
- [ ] District Clipping Logic dengan GeoJSON (Batas Kecamatan)
- [ ] Multi-Tier Leaderboard Logic (Kecamatan -> Kabupaten -> Provinsi)
- [ ] Season Reset System (Mingguan/Bulanan) via Supabase Cron Jobs (pg_cron)
- [ ] Guild/Regu System & Co-op Territory Capture
- [ ] Badge & XP System UI
- [ ] Final Testing & QA (Manual/Auto)

## Feedback & Next Session Priority
Besok kita akan masuk ke tahap **"Menghidupkan Mesin Game"**. Fokus utamanya adalah merangkai algoritma Turf.js dengan data Supabase.

1. **Algoritma Poligon Tertutup (Closed-Loop):** Kita akan bikin sistem yang ngecek setiap titik GPS lu. Kalau titik akhir lu "menyentuh" titik awal lu (radius 10-20 meter), sistem bakal otomatis *snap* dan ngebentuk sebuah Area (Polygon).
2. **Data Compression (Chain-Code):** Kita bakal terapin filter `bearing` (sudut arah). Jadi rute lari lu gak menuh-menuhin database dengan ribuan koordinat, melainkan cuma belokan-belokan pentingnya aja.
3. **Save to PostGIS:** Rute yang berhasil lu tutup itu bakal kita lempar ke tabel `runs` dan `territories` di Supabase, biar langsung kelihatan merah di peta lu.

---

**Sistem Season & Leaderboard Berjenjang:** Ide lu untuk nge-skala *Rank* dari Kecamatan -> Kabupaten -> Provinsi dengan *Season Reset* itu **brilian**. Itu persis strategi e-Sport! Gue udah tambahin ini ke "Phase 2". Kita bisa eksekusi ini pake *Edge Functions* dan *pg_cron* di Supabase nanti, biar reset *Season*-nya jalan otomatis tiap Minggu jam 00:00 tanpa membebani aplikasi di HP user.

*Update setiap perkembangan task.*

gemini --resume 6cb9adfa-0f02-4ae9-88f7-03207eee668b