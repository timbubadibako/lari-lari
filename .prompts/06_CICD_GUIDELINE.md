# CI/CD Deployment Guideline

## 1. Branching Strategy (GitFlow Lite)
* **main**: Kode stabil siap rilis produksi.
* **develop**: Integrasi fitur baru untuk testing staging.
* **feature/*** : Tempat pengerjaan fitur spesifik (misal: feature/anti-cheat).

## 2. Pipeline Triggers
* **On Pull Request to develop**: Jalankan Linter & Jest Unit Test.
* **On Push to main**: Jalankan validasi skema database Supabase & trigger build/deploy otomatis.
