# Quality Assurance (QA) Test Cases

## 1. Manual Test Cases
| Test Case ID | Scenario | Expected Result | Status |
|---|---|---|---|
| TC-01-GPS | Lari menggunakan Fake GPS di android. | Sistem mendeteksi manipulasi, run dibatalkan. | [ ] TODO |
| TC-02-MAP | Lari memotong jalan (lintas area). | Map-matcher melakukan smoothing jalur ke jalan terdekat. | [ ] TODO |

## 2. Automation Test Todo
* [ ] Unit test fungsi calculateDistance() dengan koordinat Haversine.
* [ ] Integration test untuk RPC Supabase saat reset mingguan leaderboard.
