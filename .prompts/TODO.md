# TODO – Lari Master Task & Activity Checklist

- [x] Project setup, folder, base theme/provider
- [x] Basic Documentation (PRD, TDD, Flow, etc.)
- [x] Map Dashboard UI (Neo-Brutalism, Dynamic Widget, Recenter, Resumable HUD)
- [x] Fix Location Errors & Permissions
- [ ] Implement Supabase Auth & Profile Setup
- [ ] Setup Turf.js for Closed-Boundary Polygon Capture
- [ ] District Clipping Logic with GeoJSON
- [ ] Background Location Task Manager (Expo Location)
- [ ] State management (Zustand) full integration for saving runs
- [ ] Leaderboard & XP/Badge system UI & API
- [ ] Custom MapLibre `style.json` (Detailing roads and buildings)
- [ ] Final Testing & QA (Manual/Auto)

## Next Session Priority
1. **Supabase Schema & Auth:** Siapkan tabel `users`, `runs` (tipe geometry PostGIS), dan `territories`.
2. **Turf.js Integration:** Buat fungsi algoritma yang mengecek apakah array `route` saat ini membentuk poligon tertutup (bertemu di titik awal).
3. **Map Customization:** Masukkan data JSON dari Mapbox Studio ke dalam `assets/style-map-custom.json`.

---

**Update setiap perkembangan task.**