# Technical Design Document (TDD)

## 1. System Architecture
* **Frontend:** React Native (Expo) dengan TypeScript.
* **Backend:** Supabase (PostgreSQL, Auth, Realtime).
* **Maps:** MapLibre dengan Mapbox tiles atau OpenStreetMap.
* **State Management:** Zustand (untuk tracking state, theme, dan user data).
* **Storage:** Expo SecureStore untuk kredensial sensitif.

## 2. Core Algorithm Specification
### Territory Capture (Closed-Loop Gamification)
*   **Path Tracking:** Menggunakan `expo-location` untuk merekam array of `[longitude, latitude]`.
*   **Multi-day Continuation:** Path yang belum menjadi *closed loop* akan disimpan di database (Supabase) dengan status `pending`. User dapat melanjutkannya keesokan harinya dari titik terakhir.
*   **Closed-Boundary Detection:** Menggunakan `Turf.js` (contoh: `@turf/boolean-point-in-polygon` atau algoritma *self-intersection*). Jika titik lari terbaru bersinggungan/dekat dengan titik awal (radius ~20 meter), area di dalamnya akan tertutup dan di-fill dengan warna solid pengguna.
*   **District Clipping:** Menggunakan data batas kecamatan (GeoJSON). Saat *closed loop* terbentuk, wilayah yang diklaim akan di-*intersect* dengan poligon kecamatan menggunakan `@turf/intersect`. Wilayah yang berada di luar batas kecamatan akan dipotong (dibuang). Sistem ini modular agar bisa diskalakan ke kabupaten/provinsi.

### Map Rendering (Neobrutalism & Fog of War)
*   **Basemap:** Warna putih tulang (`#F8F9FA`), bangunan 3D disisakan namun warnanya disederhanakan.
*   **Fog of War / Locked Area:** Wilayah kecamatan lain diberi lapisan (layer) berwarna abu-abu gelap transparan atau pola arsiran (hatching) yang menandakan area belum terbuka untuk interaksi.

### Anti-Cheat & Vehicle Detection

* **Speed Threshold:** Jika kecepatan rata-rata > 25 km/jam (batas lari manusia tercepat) selama > 10 detik, sesi ditandai sebagai `SUSPICIOUS`.
* **Pattern Analysis:** Mendeteksi akselerasi yang tidak wajar (seperti kendaraan bermotor).
* **GPS Mocking:** Menggunakan library Expo Location untuk mendeteksi apakah `mocked` flag bernilai true.

## 3. Security & Infrastructure
* **API Security:** Penggunaan Supabase RLS (Row Level Security) untuk memastikan user hanya bisa mengubah data lari milik mereka sendiri.
* **Caching:** Menggunakan TanStack Query untuk caching data leaderboard dan profil agar aplikasi tetap responsif.
