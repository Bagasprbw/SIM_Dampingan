#!/usr/bin/env bash
# Pindah deploy VPS ke port 80 (standar HTTP, sesuai firewall 80/443 Tencent)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

if [[ ! -f .env ]]; then
    echo "ERROR: .env tidak ada. Jalankan: cp .env.vps.example .env"
    exit 1
fi

IP="$(grep -E '^VPS_PUBLIC_IP=' .env 2>/dev/null | cut -d= -f2 || true)"
IP="${IP:-101.32.253.13}"

echo "→ Update .env ke APP_PORT=80..."
sed -i 's/^APP_PORT=.*/APP_PORT=80/' .env
sed -i "s|^APP_URL=.*|APP_URL=http://${IP}|" .env
sed -i "s|^FRONTEND_URL=.*|FRONTEND_URL=http://${IP}|" .env

echo "→ Firewall ufw (port 80)..."
sudo ufw allow 80/tcp 2>/dev/null || true
sudo ufw allow 443/tcp 2>/dev/null || true

echo "→ Restart stack..."
sudo docker compose down
sudo docker compose up -d --build

sleep 15
sudo docker compose ps

echo ""
echo "→ Cache config Laravel..."
sudo docker compose exec -T backend php artisan config:cache 2>/dev/null || true

echo ""
echo "Selesai. Akses: http://${IP}"
echo "Tes: curl -I http://127.0.0.1"
