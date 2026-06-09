#!/bin/sh
# Backup database ke folder host ./backups/
# Jalankan manual atau via cron host: 0 2 * * * /opt/sim-dampingan/docker/scripts/backup-db.sh

set -e

ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
BACKUP_DIR="${ROOT_DIR}/backups"
TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
FILENAME="sim_dampingan_${TIMESTAMP}.sql.gz"

mkdir -p "${BACKUP_DIR}"

cd "${ROOT_DIR}"

# shellcheck disable=SC1091
set -a
[ -f .env ] && . ./.env
set +a

docker compose exec -T db mariadb-dump \
  -u"${DB_USERNAME}" \
  -p"${DB_PASSWORD}" \
  "${DB_DATABASE}" | gzip > "${BACKUP_DIR}/${FILENAME}"

echo "Backup tersimpan: ${BACKUP_DIR}/${FILENAME}"
