# FinanceHub

Enterprise-grade, multi-tenant financial platform built with Spring Boot.

## Quick start (dev)

Prereqs: Java 17+, Maven 3.9+, Docker, Docker Compose

```bash
# Build and test
mvn -f app/financehub/pom.xml -B -ntp verify

# Run app
mvn -f app/financehub/pom.xml -B -ntp spring-boot:run

# Or via Docker Compose (DB, Redis, Keycloak, app)
docker compose -f app/financehub/docker-compose.yml up -d --build
```

Backend: http://localhost:8080  Frontend: http://localhost:5173

## Endpoints
- GET `/health` basic JSON health
- Actuator `/actuator` (health/info/prometheus exposed)
- Auth: `GET /api/auth/me`
- Admin: `POST /api/admin/tenants`, `GET /api/admin/tenants`, `GET /api/admin/audit`
- Accounts: `GET /api/accounts`, `GET /api/accounts/{id}`, `POST /api/accounts`, `GET /api/accounts/{id}/ledger`
- Transactions: `GET /api/transactions`, `POST /api/transactions`, `GET /api/transactions/{id}`, `POST /api/transactions/{id}/reverse`
- Reports: `POST /api/reports/{type}`, `GET /api/reports`, `GET /api/reports/{id}/download`
- Files: `POST /api/files/upload`, `GET /api/files/{id}/download`
- Notifications: `GET /api/notifications`, `GET /api/notifications/ping`

## Modules
- Spring Boot (web, security, data-jpa, validation, actuator, flyway, cache)
- Frontend (React + Vite + TS)


