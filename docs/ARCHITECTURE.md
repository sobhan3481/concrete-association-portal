# Architecture (Phase 2.5)

## Backend (Express + TypeScript + Prisma)
- `src/server.ts`: route wiring + startup lifecycle.
  - HTTP server starts first.
  - DB initialization/role seeding runs with clear logging.
  - On DB failure, process keeps running for health checks but DB-dependent APIs may fail.
- `src/routes/auth.route.ts`: OTP + register/login/me.
- `src/routes/member-profile.route.ts`: owner-only `GET/PUT /me`.
- `src/routes/company-profile.route.ts`: owner-only `GET/PUT /me`.

## Prisma Layer
- `prisma` and `@prisma/client` pinned to the same version (`5.22.0`) for stability.
- SQL migrations live in `backend/prisma/migrations/*`.
- Scripts provide normal and checksum-bypass Prisma flows.

## Frontend
- Preview mode (`VITE_PREVIEW_MODE=true`) fully مستقل از backend.
- Real mode calls backend APIs via `VITE_API_BASE_URL`.

## Data Ownership Rules
- Member/company profiles are scoped to authenticated `userId`.
- No public listing/id-based read endpoints for these profiles.
