# Design & Gamification Stitch (LARI)

## 1. Map Styling & Game Board Aesthetics
*   **Basemap:** Putih tulang (Carto Positron / Custom). Bangunan disamarkan untuk menonjolkan batas wilayah.
*   **Locked Area (Fog of War):** Area di luar kecamatan pengguna saat ini akan ditutupi layer gelap/arsiran yang menandakan area belum bisa dieksplorasi.
*   **District Borders:** Garis pemisah kecamatan digambar tebal (Neo-Brutalism line) untuk memperjelas arena permainan user.

## 2. Dynamic Player Widget (Left-Vertical)
Untuk menghemat ruang layar dan menghindari tumpukan informasi, dashboard menggunakan widget dinamis:
*   **Posisi:** Kiri atas (vertikal).
*   **Menu:** 
    1. ⭐ **Level:** Info progress XP dan Pangkat.
    2. 🏆 **Rank:** Posisi Weekly Leaderboard per Kecamatan.
    3. 🛡️ **Guild:** Status regu (atau CTA untuk bergabung jika level cukup).
    4. ⬡ **Territory:** Jumlah blok/area yang dikuasai.
*   **Interaksi:** Mode *Toggle*. Saat satu ikon ditekan (Push down animation), panel informasi akan muncul (*pop-out*) di sebelah kanannya.

## 3. Floating Action Buttons (Bottom-Right)
*   **Recenter (🎯):** Tombol kecil kotak untuk memusatkan kembali kamera peta ke GPS pengguna. Sangat berguna setelah user bebas menggeser peta.
*   **Start Run (▶️):** Tombol raksasa di kanan bawah.

## 4. Neo-Brutalism Shadow Rule
Semua elemen interaktif (Widget, Button, Panel) **WAJIB** menggunakan gaya Neobrutalism murni:
*   **Bukan drop-shadow bawaan**, melainkan menggunakan `<View>` di-layer belakang dengan offset statis (misal `top-1 left-1` atau `top-2 left-2`) berwarna Solid (Biru Gelap).
*   Saat tombol ditekan (`active:translate-y-1`), elemen depan akan bergeser menutupi bayangan belakangnya, menciptakan ilusi tombol fisik 3D/Cartoonish yang tertekan.
