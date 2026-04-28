# Architecture (Phase 1)

## Backend (Express + TypeScript)
- `src/server.ts`: app bootstrap, security middleware, route wiring, role seeding.
- `src/routes`: API routes (`/api/health`, `/api/auth/*`).
- `src/services`: auth logic, role seeding, audit logging.
- `src/middleware`: auth guard, validation, centralized error handler.
- `prisma/`: schema and SQL migration.

## Frontend (React + Vite)
- Persian RTL pages for landing, OTP request/verify, register, login, dashboard.
- Route guard for protected dashboard.
- Shared API client and auth context.

## Database
Prisma models implemented:
- `User`, `Role`, `UserRole`
- `OtpRequest`, `MobileVerification`
- `RefreshToken`, `AuditLog`

## Expansion Path
Phase 2 will add Member/Company profile modules on top of current user + role + auth baseline.
