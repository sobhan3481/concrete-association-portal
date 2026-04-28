# Concrete Association Portal (Phase 3 - Factory Registration)

## Phase 3 Summary
- Factory registration/management module added.
- Authenticated users can create/list/view/update/delete only their own factories.
- Factory ownership enforced by `ownerUserId` and relation to `CompanyProfile`.
- Frontend preview mode supports factory list/create/edit/delete without backend.

## Quick Preview (no backend)
```cmd
cd /d C:\Users\bavaf\concrete-association-portal\frontend
copy /Y .env.example .env
npm install
npm run dev
```
Open:
- http://localhost:5173
- http://localhost:5173/factories

## Full backend mode
```cmd
cd /d C:\Users\bavaf\concrete-association-portal

docker compose up -d

cd /d C:\Users\bavaf\concrete-association-portal\backend
copy /Y .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

## Core APIs
- `GET /api/auth/me`
- `GET/PUT /api/member-profile/me`
- `GET/PUT /api/company-profile/me`
- `GET/POST /api/factories`
- `GET/PUT/DELETE /api/factories/:id`
