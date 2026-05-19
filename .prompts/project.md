
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
   - Daftar/masuk, simpan dan edit data user
   - Profil publik dengan statistik, XP, jumlah lari, dll

2. **Workout/Run Tracker**
   - Pelacakan lari berbasis GPS & maps real-time (start, pause, stop, finish)
   - Tampilkan jarak, waktu, kecepatan, pace, kalori (algoritma perhitungan tersedia)
   - Auto-save history run

3. **History & Progress**
   - Rekap latihan sebelumnya (per run, per minggu/bulan)
   - Statistik: total jarak, waktu, speed rata-rata, grafik kemajuan

4. **Leaderboard & Gamification**
   - Leaderboard harian/mingguan, statistik per user, XP, badge, pencapaian
   - Posisi user di komunitas, challenge/event, peringkat per level

5. **Social & Sharing**
   - Share hasil/achievement ke media sosial
   - Bagikan statistik/kegiatan ke grup/komunitas lain

6. **Theme Switcher (Modern Minimalis ↔ Glassmorphism)**
   - User dapat ganti tema antara minimalis (solid flat) atau glassmorphism (blur, transparan)
   - Semua komponen UI support dua tema total

7. **Settings**
   - Pengaturan notifikasi, bahasa, preferensi tema, keluar akun

8. **DevTools/Debug (khusus dev/tim internal)**
   - Simulasi GPS, debug panel, log aktivitas sistem

---

## **Bonus Features**
- Onboarding wizard untuk user baru
- Push notification pengingat latihan
- Area dominasi/lari (peta siapa paling aktif di area tertentu)
- Export data
- Support device wearable (fitur ke depan)

---

## **Tech Stack**

### **Front End**
- **React Native** (Expo)
- **TypeScript**
- **shadcn/ui** (adaptif ke RN, experimental)
- **Zustand** (state management) +/atau React Context
- **TanStack Query** (data/cache management)
- **@rnmapbox/maps (MapLibre)** (peta/GPS)
- **dayjs** (waktu)

### **Back End dan Storage**
- **Supabase** (auth, database, real-time, statistik leaderboard, dsb.)

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
