# SIM Dampingan — Mentora


Sistem Informasi Manajemen Dampingan MPM Muhammadiyah.

| Folder | Stack |
|--------|-------|
| `frontend/` | React 19 + Vite + Tailwind |
| `backend/` | Laravel 13 + PHP 8.3 + MySQL/MariaDB |

---

## Urutan besar (gambaran)

```
1. Development lokal (tanpa Docker)     ← sehari-hari coding
2. Docker lokal (opsional)              ← uji stack production di laptop
3. Push ke GitHub main                  ← CI: test + build image
4. VPS + domain                         ← deploy pertama kali (manual)
5. CI/CD otomatis                       ← setelah VPS + secrets siap
```

---

## A. Development lokal (tanpa Docker)

Urutan yang biasa dipakai saat coding:

```bash
# 1. Database — pastikan MariaDB/MySQL jalan
# 2. Backend
cd backend
cp .env.example .env          # sesuaikan DB_*
php artisan key:generate
composer install
php artisan migrate
php artisan db:seed           # manual, superadmin saja (lihat DatabaseSeeder)
php artisan serve             # http://localhost:8000

# 3. Frontend (terminal baru)
cd frontend
npm install
npm run dev                   # http://localhost:5173
```

Login default setelah seed: `superadmin` / `password`

---

## B. Docker — urutan pertama kali (lokal atau VPS)

### Prasyarat

- Docker Engine + Docker Compose v2
- Port `8080` (atau ubah `APP_PORT` di `.env`) belum dipakai aplikasi lain

### Langkah berurutan

```bash
# 1. Clone repo (kalau di server)
git clone <url-repo> sim-dampingan
cd sim-dampingan

# 2. Buat file environment
cp .env.docker.example .env

# 3. Edit .env — WAJIB isi minimal:
#    - APP_KEY          → generate: cd backend && php artisan key:generate --show
#    - DB_PASSWORD
#    - DB_ROOT_PASSWORD
#    - APP_URL          → https://domain-kamu.com (atau http://localhost:8080 untuk uji lokal)
#    - FRONTEND_URL
#    - VITE_API_URL     → harus sesuai domain + /api (dipakai saat build frontend)
#    - VITE_SUPERADMIN_WA

# 4. Build & jalankan semua service
docker compose up -d --build
#    Urutan otomatis di dalam Docker:
#    db (tunggu healthy) → backend (migrate + cache) → nginx + scheduler

# 5. Cek container jalan
docker compose ps

# 6. Seed database — MANUAL, sekali saja (tidak otomatis)
docker compose exec backend php artisan db:seed

# 7. Buka aplikasi
#    http://localhost:8080
```

### Apa yang jalan di dalam Docker?

| Service | Peran |
|---------|-------|
| `nginx` | Serve React + proxy `/api` ke Laravel + file `/storage` |
| `backend` | PHP-FPM, API Laravel |
| `db` | MariaDB 11, data di volume `sim-dampingan-db-data` |
| `scheduler` | `php artisan schedule:work` (prune log harian) |

### Perintah berguna

```bash
docker compose logs -f backend      # lihat log Laravel
docker compose restart backend
docker compose exec backend php artisan migrate --force
./docker/scripts/backup-db.sh       # backup DB ke folder backups/
```

### Data aman — penting

| Perintah | Efek |
|----------|------|
| `docker compose down` | Stop container, **data tetap** |
| `docker compose down -v` | **HAPUS database & upload** — jangan di production |

---

## C. VPS pakai IP publik / domain

Contoh IP: `101.32.253.13` → akses sementara: **http://101.32.253.13:8080**

Firewall cloud (Tencent) tetap cukup buka **22, 80, 443** — port 8080 tidak perlu dibuka publik.

### Urutan di VPS

```bash
git clone <url-repo> sim-dampingan
cd sim-dampingan
git checkout production
git pull

cp .env.vps.example .env
nano .env
# WAJIB: APP_KEY, DB_PASSWORD, DB_ROOT_PASSWORD

chmod +x docker/scripts/vps-first-deploy.sh
sudo ./docker/scripts/vps-first-deploy.sh

sudo docker compose exec backend php artisan db:seed
```

Buka sementara: **http://101.32.253.13:8080**

### Kalau mau pindah ke mode port 80 langsung:

```bash
git pull
chmod +x docker/scripts/vps-use-port80.sh
sudo ./docker/scripts/vps-use-port80.sh
```

### Firewall

| Lapisan | Port yang perlu |
|---------|-----------------|
| Security Group Tencent | **80**, **443**, 22 |
| ufw Ubuntu | `sudo ufw allow 80/tcp` |

`VITE_API_URL=/api` → tidak perlu rebuild saat ganti IP/domain.

---

## D. Domain + HTTPS (opsional, nanti)

Urutan saat pakai subdomain/domain:

```
1. Beli / siapkan VPS (Ubuntu dst.)
2. Install Docker di VPS
3. Deploy aplikasi (bagian B) di VPS
4. DNS domain → A record ke IP VPS
5. Install nginx + certbot DI HOST (bukan di container)
6. Copy & sesuaikan: docker/nginx/host-reverse-proxy.example.conf
7. SSL terminate di nginx host → proxy_pass ke 127.0.0.1:8080
```

Domain kamu sudah HTTPS di luar → cukup arahkan ke IP VPS, lalu nginx host yang handle sertifikat dan proxy ke `8080`.

---

## E. Strategi branch (main vs production)

| Fase | Branch di laptop | Branch di VPS | CI/CD deploy |
|------|------------------|---------------|--------------|
| **Sekarang (manual)** | `feature/*` / `main` | `production` atau `main` | Matikan (`ENABLE_DEPLOY=false`) |
| **Stabil** | merge ke `main` | `git pull` branch yang sama | Opsional |
| **Otomatis** | merge ke `production` | auto via SSH | `ENABLE_DEPLOY=true` |

**Rekomendasi untuk kamu sekarang:**

1. **Coding** tetap di branch feature / `main` di laptop.
2. **VPS pertama kali:** clone repo → `git checkout production` (atau `main` kalau belum ada branch production).
3. **Jangan wajib tunggu branch production** — yang penting kode yang di-clone di VPS sudah siap + `.env` VPS benar.
4. **Nanti CI/CD:** merge ke `production` → push → GitHub Actions deploy otomatis (workflow sudah support `main` dan `production`).

```bash
# Contoh: siapkan branch production di GitHub
git checkout main
git pull
git checkout -b production
git push -u origin production
```

VPS manual update nanti:

```bash
cd /opt/sim-dampingan
git pull origin production
docker compose up -d --build
docker compose exec backend php artisan migrate --force
```

---

## F. CI/CD GitHub — urutan setup

### Fase 1: Tanpa VPS (sekarang)

Setiap **push ke `main`**:

1. GitHub Actions jalankan test backend + lint/build frontend  
2. Build image Docker → push ke **GitHub Container Registry** (`ghcr.io`)  
3. Job deploy **dilewati** (belum ada VPS)

Tidak perlu setting apa pun untuk build image — `GITHUB_TOKEN` otomatis.

### Fase 2: Setelah VPS siap

Urutan konfigurasi (sekali):

```
1. Siapkan VPS + deploy manual pertama (bagian B & C)
2. Buat user deploy + SSH key
3. Di GitHub repo → Settings:

   Variables:
   - ENABLE_DEPLOY = true

   Secrets:
   - SSH_HOST          → IP VPS
   - SSH_USER          → user deploy
   - SSH_PRIVATE_KEY   → private key SSH
   - DEPLOY_PATH       → /opt/sim-dampingan
   - VITE_API_URL      → https://domain-kamu.com/api
   - VITE_SUPERADMIN_WA

4. Di server .env tambahkan:
   BACKEND_IMAGE=ghcr.io/<username>/<repo>/backend:latest
   NGINX_IMAGE=ghcr.io/<username>/<repo>/nginx:latest
```

### Fase 3: Deploy otomatis (setiap push main)

```
Push ke main
  → Test
  → Build & push image ke GHCR
  → SSH ke VPS
  → docker compose pull
  → docker compose up -d --no-build
  → php artisan migrate --force
```

Seed **tidak** dijalankan otomatis di CI/CD.

---

## E. Ringkasan file Docker

```
sim-dampingan/
├── docker-compose.yml              # Stack utama
├── docker-compose.prod.yml         # Override pakai image GHCR
├── .env.docker.example             # Template → copy jadi .env
├── docker/
│   ├── nginx/                    # Frontend build + reverse proxy
│   ├── php/                      # Laravel PHP-FPM
│   └── scripts/
│       ├── backend-entrypoint.sh # migrate + cache (tanpa seed)
│       └── backup-db.sh
└── .github/workflows/deploy.yml  # CI/CD
```

---

## F. Troubleshooting singkat

| Masalah | Cek |
|---------|-----|
| Frontend API error / CORS | `VITE_API_URL` harus benar **saat** `docker compose build` |
| 502 / API tidak jalan | `docker compose logs backend` |
| DB connection refused | `docker compose ps` — tunggu `db` healthy |
| Upload/foto tidak muncul | volume `sim-dampingan-backend-storage` + `/storage` URL |
| Reset password gagal | migration `must_change_password` sudah jalan? |

---

## Lisensi & kontributor

Proyek internal MPM — Mentora.
