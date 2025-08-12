#!/usr/bin/env bash
set -euo pipefail

TENANT_SLUG=${1:-demo-tenant}
TENANT_NAME=${2:-Demo Tenant}

echo "Seeding tenant via API..."
curl -s -X POST http://localhost:8080/api/admin/tenants \
  -H 'Content-Type: application/json' \
  -d '{"slug":"'"$TENANT_SLUG"'","name":"'"$TENANT_NAME"'"}' | jq .

echo "Done."


