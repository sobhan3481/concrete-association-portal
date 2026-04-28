# Local Run Modes (Phase 2.5)

این پروژه دو حالت اصلی دارد:

1) Frontend-only preview (بدون backend)
2) Full backend + database

---

## A) Frontend-only Preview (Windows CMD)

```cmd
cd /d C:\Users\bavaf\concrete-association-portal
git pull

cd /d C:\Users\bavaf\concrete-association-portal\frontend
copy /Y .env.example .env
npm install
npm run dev
```

Open:
- http://localhost:5173

این حالت به Docker/PostgreSQL/Prisma/backend نیاز ندارد.

---

## B) Full Backend Mode with Docker PostgreSQL (Windows CMD)

```cmd
cd /d C:\Users\bavaf\concrete-association-portal
git pull
docker compose up -d
docker ps

cd /d C:\Users\bavaf\concrete-association-portal\backend
copy /Y .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

Open:
- http://localhost:4000/api/health

If Prisma checksum error appears:
```cmd
npm run prisma:generate:checksum-bypass
npm run prisma:migrate:checksum-bypass
```

---

## C) Full Backend Mode without Docker (Local PostgreSQL on Windows)

ابتدا PostgreSQL را نصب کنید.

```cmd
psql -U postgres
CREATE DATABASE concrete_association_dev;
\q
```

سپس:

```cmd
cd /d C:\Users\bavaf\concrete-association-portal\backend
copy /Y .env.example .env
```

Ensure `backend\.env` contains:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/concrete_association_dev?schema=public
PORT=4000
CORS_ORIGIN=http://localhost:5173
AUTH_REQUIRE_OTP_FOR_REGISTRATION=false
```

Then:

```cmd
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

Open:
- http://localhost:4000/api/health

Fallback for checksum issue:
```cmd
npm run prisma:generate:checksum-bypass
npm run prisma:migrate:checksum-bypass
```
