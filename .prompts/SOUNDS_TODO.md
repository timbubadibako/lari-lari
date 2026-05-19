# SOUNDS & ANIMATION TODO

## 1. Audio Placement & Guidelines
Semua file audio ditempatkan di direktori `assets/sounds/`. Gunakan format yang dioptimalkan seperti `.mp3` atau `.wav` yang telah dikompresi agar ukuran aplikasi tetap ringan.

### Checklist Audio
- [ ] `lari_start.wav` - Suara peluit atau efek energetik saat tombol "Start" ditekan.
- [ ] `lari_pause.wav` - Suara "fade out" atau nada turun saat sesi di-pause (manual/auto-pause).
- [ ] `lari_resume.wav` - Suara semangat saat lari dilanjutkan.
- [ ] `lari_finish.wav` - Efek suara kemenangan (victory/success) saat menyelesaikan lari.
- [ ] `lap_completed.wav` - Notifikasi pendek (chime) setiap melewati kelipatan 1 KM.
- [ ] `achieve_badge.wav` - Efek suara positif saat mendapatkan badge/achievement baru.
- [ ] `level_up.wav` - Suara epik singkat saat pengguna naik level.

## 2. Animation TODO (Lottie / React Native Reanimated)
Semua aset animasi ditempatkan di direktori `assets/animations/`.

### Checklist Animasi
- [ ] **Countdown 3-2-1**: Animasi angka besar sebelum sesi lari benar-benar dimulai.
- [ ] **GPS Pulse**: Animasi *pulsing/radar* pada marker pengguna di peta saat sedang mencari atau menyesuaikan sinyal GPS.
- [ ] **Confetti**: Animasi partikel perayaan (konfeti) saat pengguna memecahkan *Personal Best* atau naik level.
- [ ] **Theme Transition**: Transisi UI yang *smooth* (tanpa kedip) saat pengguna beralih antara tema Minimalis dan Glassmorphism.
- [ ] **Skeleton Loading**: Animasi loading state untuk History lari dan Profile pengguna.
