# Lari Master Design System

## 1. Visual Identity & Mood
**Lari** adalah platform health-tracking yang modern, energetik, dan profesional. Desain difokuskan pada kejelasan data (Data Clarity) dan gamifikasi yang memotivasi tanpa terlihat "childish".

*   **Mood:** Dinamis, Terpercaya, Futuristik, Atletik.
*   **Gaya Utama:** **Modern Minimalism** dengan sentuhan **Glassmorphism** pada komponen overlay.
*   **Strategi Warna:** Menggunakan warna biru "Electric" untuk tracking dan hijau "Emerald" untuk kesuksesan/kesehatan.

## 2. Color Palette
| Role | Hex | Tailwind Class | Usage |
|------|-----|----------------|-------|
| **Primary** | `#0891B2` | `bg-cyan-600` | Branding utama, tombol primer |
| **Secondary** | `#22D3EE` | `bg-cyan-400` | Aksen, grafik progress |
| **CTA/Success**| `#059669` | `bg-emerald-600`| Start Run, Klaim wilayah, Goal tercapai |
| **Background** | `#F8FAFC` | `bg-slate-50` | Background utama (Light Mode) |
| **Surface** | `#FFFFFF` | `bg-white` | Card, Modals |
| **Text Main** | `#0F172A` | `text-slate-900` | Heading dan body text utama |
| **Text Muted** | `#475569` | `text-slate-600` | Label, instruksi tambahan |

## 3. Typography
*   **Heading Font:** `Outfit` (Dynamic, Startup vibes)
*   **Body Font:** `Inter` atau `Rubik` (High readability for data)
*   **Stats Font:** `JetBrains Mono` atau `Roboto Mono` (Menghindari angka bergeser saat tracking real-time)

## 4. UI Components Strategy (UI-UX Pro Max Alignment)
*   **Cards:** Gunakan `rounded-2xl` (16px) dengan shadow lembut `shadow-sm`.
*   **Buttons:** State hover harus stabil. Tambahkan `transition-all duration-200 active:scale-95`.
*   **Glassmorphism (Overlays):** 
    - `bg-white/80` (Light mode) atau `bg-slate-900/80` (Dark mode)
    - `backdrop-blur-md` (12-16px)
    - Border tipis: `border border-white/20`
*   **Icons:** Gunakan **Lucide React** atau **Heroicons**. Dilarang menggunakan emoji.

## 5. UX Guidelines for Lari
1.  **Gaze & Focus:** Pastikan tombol "Start Run" adalah elemen paling mencolok (High Contrast).
2.  **Immediate Feedback:** Gunakan haptic feedback (getaran) dan suara (dari `SOUNDS_TODO.md`) saat klik tombol utama.
3.  **Data Hierarchy:** Angka statistik (Jarak/Pace) harus berukuran besar (Headline-XL) agar mudah dibaca saat berlari.
4.  **Map Constraints:** Pastikan peta tidak memenuhi memori dengan membatasi render area sekitar 1.5x layar.

---
*Persisted via ui-ux-pro-max skill.*
