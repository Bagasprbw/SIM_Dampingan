#!/usr/bin/env bash
# Deploy pertama di VPS (akses IP:PORT, tanpa domain)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

if [[ ! -f .env ]]; then
    if [[ -f .env.vps.example ]]; then
        cp .env.vps.example .env
        echo "✓ .env dibuat dari .env.vps.example"
        echo "  Edit .env: APP_KEY, DB_PASSWORD, DB_ROOT_PASSWORD"
        echo "  Generate key: docker compose run --rm backend php artisan key:generate --show"
        exit 0
    fi
    echo "ERROR: .env.vps.example tidak ditemukan."
    exit 1
fi

echo "→ Firewall ufw (port 80/443)..."
sudo ufw allow 80/tcp 2>/dev/null || true
sudo ufw allow 443/tcp 2>/dev/null || true

echo "→ Build & start stack..."
sudo docker compose up -d --build

echo "→ Tunggu backend healthy..."
sleep 15
sudo docker compose ps

IP="$(grep -E '^VPS_PUBLIC_IP=' .env 2>/dev/null | cut -d= -f2 || echo 'IP_VPS')"
PORT="$(grep -E '^APP_PORT=' .env 2>/dev/null | cut -d= -f2 || echo 8080)"

echo ""
echo "Selesai. Langkah berikutnya (sekali saja):"
echo "  sudo docker compose exec backend php artisan db:seed"
echo ""
if [[ "$PORT" == "80" ]]; then
    echo "Akses: http://${IP}"
else
    echo "Akses: http://${IP}:${PORT}"
fi
