# Concrete Association Portal (Phase 2.5 Runtime Stabilization)

این پروژه شامل backend با Node.js/Express/Prisma و frontend با React/Vite است.

## Quick Modes

### 1) Frontend-only Preview (بدون backend/DB/Docker)
```cmd
cd /d C:\Users\bavaf\concrete-association-portal\frontend
copy /Y .env.example .env
npm install
npm run dev
```
Open: `http://localhost:5173`

### 2) Full Backend + DB (Docker)
```cmd
cd /d C:\Users\bavaf\concrete-association-portal

docker compose up -d
docker ps

cd /d C:\Users\bavaf\concrete-association-portal\backend
copy /Y .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```
Open: `http://localhost:4000/api/health`

### 3) Full Backend + DB (Local PostgreSQL, no Docker)
```cmd
psql -U postgres
CREATE DATABASE concrete_association_dev;
\q

cd /d C:\Users\bavaf\concrete-association-portal\backend
copy /Y .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

## Backend Scripts
- `npm run prisma:generate`
- `npm run prisma:generate:checksum-bypass` (fallback برای خطای checksum)
- `npm run prisma:migrate`
- `npm run prisma:migrate:checksum-bypass`
- `npm run prisma:deploy`
- `npm run prisma:studio`
- `npm run verify`
- `npm run verify:db`

## Prisma Stability Notes
- `prisma` و `@prisma/client` روی نسخه یکسان و pin شده `5.22.0` تنظیم شده‌اند.
- برای برخی محیط‌ها (403/checksum) می‌توانید از `PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1` استفاده کنید که در اسکریپت‌های checksum-bypass آماده شده است.

## API Highlights
- Auth + OTP routes unchanged.
- Owner-only profile routes:
  - `GET/PUT /api/member-profile/me`
  - `GET/PUT /api/company-profile/me`
