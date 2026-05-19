# Product Requirement Document (PRD) - Lari (LARI)

## 1. Objective & Background
* **Problem Statement:** Aplikasi lari tradisional seringkali terasa membosankan dan kurang memberikan motivasi jangka panjang selain dari sekadar angka statistik.
* **Value Proposition:** Lari menggabungkan pelacakan lari yang akurat dengan gamifikasi "Territory Capture" dan estetika modern (Glassmorphism), mengubah rutinitas lari menjadi petualangan menaklukkan wilayah.
* **Success Metrics (KPIs):** 
    - Retensi pengguna mingguan (WAU).
    - Jumlah wilayah yang berhasil diklaim/dipertahankan per hari.
    - Aktivitas berbagi pencapaian (Social Sharing) ke platform eksternal.

## 2. User Persona & Scope
* **Target User:** Pelari kasual hingga hobiis yang menyukai tantangan kompetitif, kolektor pencapaian (achievement hunters), dan penggemar desain UI modern.
* **In-Scope (Fase 1):** 
    - Autentikasi user & Profil dasar.
    - GPS Tracking real-time dengan rute peta.
    - Sistem "Capture Territory" (Grid-based).
    - Leaderboard wilayah & global.
    - Dual-theme (Minimalist & Glassmorphism).
* **Out-of-Scope (Fase Selanjutnya):** 
    - Integrasi perangkat wearable (Apple Watch/Garmin).
    - Fitur komunitas/grup (Clubs).
    - Event lari resmi/Virtual run berbayar.

## 3. Functional Requirements (User Stories)
* [US-01] Sebagai pengguna, saya ingin melacak rute lari saya secara real-time agar saya bisa melihat progress jarak dan waktu saya.
* [US-02] Sebagai pengguna, saya ingin membuat wilayah (Territory) dengan cara berlari membentuk jalur tertutup (closed boundary) agar area di dalamnya menjadi milik saya.
* [US-03] Sebagai pengguna, saya ingin bisa melanjutkan rute lari yang belum tertutup pada hari berikutnya, agar saya bisa mengklaim wilayah yang luas tanpa harus menyelesaikannya dalam satu hari.
* [US-04] Sebagai pengguna, saya ingin wilayah yang saya klaim dipotong secara otomatis sesuai batas administratif kecamatan (District Clipping), agar permainan terstruktur per wilayah.
* [US-05] Sebagai pengguna, saya ingin mengganti tema aplikasi menjadi Glassmorphism agar mendapatkan visual yang lebih estetik dan futuristik.
* [US-06] Sebagai pengguna, saya ingin mendapatkan XP dan Badge setelah lari agar merasa dihargai atas usaha saya.

## 4. Non-Functional Requirements
* **Security:** Data lokasi dienkripsi saat dikirim dan disimpan. Deteksi anti-cheat aktif.
* **Performance:** Render peta maksimal 1.5x area layar untuk efisiensi baterai dan memori. Logika kalkulasi geometri poligon (closed loop & intersection dengan batas kecamatan) harus dioptimalkan agar tidak lag.
* **Availability:** Mendukung sinkronisasi data offline saat sinyal GPS/Internet tidak stabil.
