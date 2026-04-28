# Concrete Association Portal (Phase 4 - Machinery Management)

## Phase 4 Summary
- Machinery management per factory added.
- User can manage machinery only for owned factories.
- Dashboard now shows factory count and machinery count.
- Preview mode supports machinery list/create/edit/delete without backend.

## Quick Preview (no backend)
```cmd
cd /d C:\Users\bavaf\concrete-association-portal\frontend
copy /Y .env.example .env
npm install
npm run dev
```
Open:
- http://localhost:5173
- http://localhost:5173/factories/mock-factory-1/machinery

## Full backend mode with DB
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
Open:
- http://localhost:4000/api/health
