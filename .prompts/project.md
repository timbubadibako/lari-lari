
---

# **LARI – Running & Activity Gamification App**

## **Project Overview**
LARI adalah aplikasi mobile (iOS & Android) berbasis React Native dengan tujuan utama: 
- Mendukung aktivitas lari/jalan sehat
- Menggabungkan pencatatan olahraga, pelacakan GPS, serta **gamifikasi** (leaderboard, badge, XP, challenge)
- Berorientasi pengalaman modern, simple, dan cepat, dengan desain adaptif (minimalis dan glassmorphism)
- Mendukung fitur sosial dan berbagi progress

---

## **Core Features / Fitur Utama**

1. **User Authentication & Profile**
   - Daftar/masuk instant (tanpa verifikasi email untuk alur game yang cepat)
   - Profil publik dengan statistik, XP, jumlah wilayah, dll

2. **Workout/Run Tracker (Pure Geometry GPS)**
   - Pelacakan lari murni menggunakan koordinat GPS (tanpa Map Matching API luar)
   - Tampilkan jarak (Turf.js Haversine), waktu, pace, kalori
   - *Douglas-Peucker Smoothing* untuk menghilangkan GPS jitter secara real-time.

3. **Territory Capture (Closed-Loop Gameplay)**
   - Pengguna mengklaim wilayah dengan berlari membentuk jalur tertutup (Closed Boundary).
   - Rute dapat dilanjutkan di hari berikutnya (Multi-day runs).
   - Wilayah akan dipotong otomatis mengikuti batas kecamatan (District Clipping).

4. **Leaderboard & Guild System**
   - Leaderboard mingguan per kecamatan.
   - Sistem Regu/Guild terkunci hingga pengguna mencapai Level 10.

5. **Theme & Aesthetics (Neobrutalism)**
   - Tema *Neobrutalism* / Cartoonish Board Game. 
   - UI menggunakan bayangan blok solid 3D (bukan blur), tombol *squircle*, dan warna kontras tinggi.
   - Peta menggunakan gaya "Putih Tulang" (*Positron Light*) dengan bangunan disamarkan agar rute/wilayah pemain sangat menonjol.

6. **Dynamic Dashboard Widget**
   - Panel informasi vertikal di kiri atas yang bisa di-toggle untuk menghemat ruang peta.
   - Memisahkan status Level, Rank, Guild, dan Area.

7. **Settings & DevTools**
   - Pengaturan profil dan keluar akun.
   - Simulasi GPS, debug panel, log aktivitas sistem.

---

## **Tech Stack**

### **Front End**
- **React Native** (Expo SDK 54)
- **TypeScript**
- **NativeWind v4** (Tailwind CSS untuk React Native)
- **Zustand** (State management)
- **@maplibre/maplibre-react-native** (Peta/GPS engine)
- **@turf/turf** (Geospatial logic: distance, bearing, simplify, polygon intersections)

### **Back End dan Storage**
- **Supabase** (Auth, PostgreSQL)
- **PostGIS** (Menyimpan tipe data GEOMETRY LineString dan Polygon untuk rute lari)

### **Other / Utility**
- **dotenv** (env config)
- **react-native-svg/vector-icons** (icon, aset UI)
- **Expo Dev Client** (untuk support modul native: MapLibre, dst.)

---

## **Key Algorithm & Logic**

1. **Tracker & GPS**
   - Start/stop session
   - Sampling lokasi setiap interval
   - Kalibrasi *distance* (Haversine atau geodesic), pace, speed, calories (bobot user × jarak)

2. **Leaderboard**
   - Skor dihitung dari total jarak, waktu, leveling XP
   - Penentuan ranking dengan realtime update dari Supabase

3. **Gamification**
   - Badge achievement logic (unlock saat capai milestone)
   - XP: per run, per week streak, konsistensi

4. **Theme Switching**
   - Context global untuk state tema (`minimalist` / `glass`)
   - Adaptive styling di seluruh komponen
   - Rendering ulang hanya bagian style, data tetap persist

5. **Sharing & Social**
   - Fungsi capture screenshot hasil, export via API/Supabase, share link/gambar

6. **Offline Caching**
   - Data latihan tetap tersimpan lokal, sync ketika online

---

## **Folder Structure (Rekomendasi Ringkas)**
```
src/
  features/
    map/
    workout/
    history/
    social/
    profile/
    share/
    dev/
  lib/
    supabase.ts
    storage.ts
  components/
    ui/
  assets/
.prompts/  # Semua file markdown prompt (DESIGN_STITCH.md, AGENTS.md, TODO.md, SOUNDS.md, dll)
```

---

## **Documentation/Prompt System**
- Semua **prompt, panduan agent, instruksi desain, todo** disimpan rapi di `.prompts/`
- Standar nama: DESIGN_STITCH.md, AGENTS.md, TODO.md, SOUNDS.md, ONBOARDING.md, dsb.

---

## **Design Philosophy**
- Clean, modern, ramah pemula
- Seluruh data utama harus mudah diakses satu tangan
- Aksen warna sesuai palette, UI tidak dibebani grafis berlebihan
- Gamifikasi harus motivating, tidak mengganggu usability
- Support visual minoritas (A11y contrast OK)
- Tema adaptif sepenuhnya untuk kenyamanan berbagai selera user

---

## **Deliverable**
- Mobile app Android & iOS
- Kode siap deployment (Expo EAS)
- Figma/Design file
- `.prompts/` documentation untuk agent dan pengembangan
- Setup Supabase & Map Libre siap integrasi

---

**Summary singkat:**  
LARI adalah aplikasi mobile health & running tracker, mengedepankan gamifikasi, desain modern-minimalis & tema glass adaptif, peta live, leaderboard, dan social sharing – dibangun full stack React Native, Supabase, MapLibre, dengan architecture modular dan dokumentasi lengkap.
