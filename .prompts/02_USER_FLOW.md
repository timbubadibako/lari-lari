# User Flow & UI/UX Wireframe Mapping

## 1. Core User Flow (Tracking Run)
1. **Home/Dashboard**: Menampilkan peta wilayah sekitar, posisi user, dan tombol "Start Run".
2. **Countdown**: Setelah klik Start, muncul countdown 3 detik (dengan animasi angka besar).
3. **Active Tracking (HUD)**: Menampilkan stats (Jarak, Waktu, Pace, Kalori) dan rute real-time di peta.
4. **Pause/Stop**: User dapat menekan tombol stop (hold to stop) untuk mengakhiri sesi.
5. **Review & Sync**: Menampilkan ringkasan lari, wilayah baru yang dikuasai, dan XP yang didapat. Klik "Save" untuk sinkronisasi ke Supabase.

## 2. Design System Tokens (Figma Alignment)
* **Primary Color:** Electric Blue (#007AFF) atau Vibrant Orange (#FF9500) untuk aksi utama.
* **Dark Mode Accent:** Neon Cyan / Purple untuk tema Glassmorphism.
* **Typography:** Montserrat atau Inter (Modern & Clean). Untuk angka stats menggunakan Font Monospaced agar tidak bergeser saat angka berubah.
* **Glassmorphism:** Background blur (15-20px), border transparan putih (0.2 opacity), dan sedikit bayangan lembut.

## 3. Screen Checklist
* [ ] **Screen 01: Dashboard (Game Map)**: Map utama (Putih Tulang) dengan Fog of War kecamatan. Dilengkapi Dynamic Vertical Widget di Kiri dan FAB Recenter + Start di Kanan Bawah.
* [ ] **Screen 02: Active Run (HUD Mode)**: Fokus pada statistik lari dengan visibilitas tinggi saat bergerak.
* [ ] **Screen 03: Guild & Rank Panel**: Modal *pop-out* dari Vertical Widget.
* [ ] **Screen 04: User Profile & Achievements**: Galeri badge dan statistik akumulatif.

