# Concrete Association Portal (Phase 1 - Node.js Fullstack Foundation)

این مخزن اکنون با **Node.js + TypeScript** برای backend و **React + Vite** برای frontend بوت‌استرپ شده است.

## Stack
- Backend: Node.js + Express + TypeScript + Prisma
- Database: PostgreSQL
- Frontend: React + TypeScript + Vite (RTL Persian UI)

## Project Structure
```text
/backend
  /prisma
  /src
/frontend
/docker-compose.yml
```

## Local URLs
- Backend: `http://localhost:4000`
- Frontend: `http://localhost:5173`
- Health Check: `http://localhost:4000/api/health`

## 1) Run Database
```bash
docker compose up -d
```

## 2) Run Backend
```bash
cd backend
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate deploy
npm run dev
```

## 3) Run Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Implemented Phase 1 Endpoints
- `POST /api/auth/request-otp`
- `POST /api/auth/verify-otp`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/health`

## Security Baseline
- Password hashing (`bcryptjs`)
- JWT access token auth
- Hashed OTP storage (`SHA-256`)
- Rate limiting for OTP request and login
- Request validation (`zod`)
- Audit logging for OTP/login/register
- Role model seed: `MEMBER`, `ASSOCIATION_ADMIN`, `SYSTEM_ADMIN`

## Out of Scope in this Phase
Company profile, factories, machinery, materials, mix design, costing, pricing proposals, and admin reporting are intentionally not implemented yet.
