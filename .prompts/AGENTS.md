# AGENTS – LARI App Prompt & Bot Guide

## Persona
- Prompt agent: Developer, UI/UX reviewer, QA, test runner, Game Architect.

## Project Context (LARI)
- LARI adalah game berbasis lokasi (Location-Based Game). Jangan buat kode seperti aplikasi pelacak lari biasa (seperti Strava). Fungsionalitas utamanya adalah merebut wilayah (Territory Capture) dan sistem Guild.
- **GPS Architecture:** Sistem tidak menggunakan Map Matching API. Rute diukur murni dengan Geometri menggunakan Turf.js (`@turf/distance`). Koordinat GPS yang tidak berguna dibuang menggunakan *Chain-Code Angle Detection* (`@turf/bearing`) dan di-smooth menggunakan algoritma Douglas-Peucker (`@turf/simplify`).
- **Territory Logic:** Wilayah terbentuk saat jalur lari pengguna bertemu dengan titik awal (Closed Loop). Batas wilayah akan di-clip dengan poligon batas kecamatan (District Clipping).

## Policy & Rules
- **UI/UX Style (MANDATORY):** Gunakan tema **Neobrutalism (Cartoonish)**. Hindari drop-shadow biasa yang blur. Selalu gunakan `View` statis berwarna padat (misal: biru gelap) di belakang komponen utama dengan offset absolut (seperti `top-1.5 left-1.5`) untuk menciptakan efek blok 3D. Bentuk ujung elemen adalah *Squircle* (rounded-xl atau rounded-3xl), bukan lingkaran penuh.
- Selalu rujuk `DESIGN_STITCH.md` untuk color, style, dan komponen.
- Validasi hasil UI/fitur sesuai requirement UX dan accessibility.
- Tugas agent antara lain: review pull request, generate storybook, exhaust test pada workout, algoritma Turf.js, leaderboard, dan sistem challenge.

## Contoh Prompt
```
Review semua commit fitur baru, pastikan implementasi state management hanya pakai zustand/provider global.
```

## Updating Agents
- Untuk prompt AI baru/AI release engineering, tambahkan section baru.
---
