# Quality Assurance (QA) Test Cases

## 1. Manual Test Cases
| Test Case ID | Scenario | Expected Result | Status |
|---|---|---|---|
| TC-01-GPS | Lari menggunakan Fake GPS di android. | Sistem mendeteksi manipulasi (`mocked` flag), run dibatalkan. | [ ] TODO |
| TC-02-MAP | Lari dengan sinyal GPS yang bergoyang (jitter). | Turf.js Douglas-Peucker melakukan smoothing sehingga garis tetap lurus/tajam. | [ ] TODO |
| TC-03-LOOP | Pengguna berlari membentuk lintasan melingkar kembali ke titik awal. | Sistem mendeteksi *Closed-Boundary*, mengisi warna (fill) poligon, dan menandai wilayah diklaim. | [ ] TODO |
| TC-04-DISTRICT | Pengguna mengklaim wilayah yang melewati batas kecamatan. | Poligon di-clip secara otomatis mengikuti GeoJSON batas kecamatan. | [ ] TODO |

## 2. Automation Test Todo
* [ ] Unit test fungsi `Turf.js` untuk mendeteksi *self-intersection* pada array koordinat.
* [ ] Integration test untuk sinkronisasi `GEOMETRY` antara Zustand store dan PostGIS Supabase.
