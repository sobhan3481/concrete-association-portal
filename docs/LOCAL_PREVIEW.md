# Local Run Modes (Phase 4)

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
- http://localhost:5173/factories
- http://localhost:5173/factories/mock-factory-1/machinery

## B) Full backend + DB mode (Windows CMD)
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

If checksum issue appears:
```cmd
npm run prisma:generate:checksum-bypass
npm run prisma:migrate:checksum-bypass
```
