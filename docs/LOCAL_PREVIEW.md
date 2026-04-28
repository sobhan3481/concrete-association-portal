# Local Run Modes (Phase 5)

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
- http://localhost:5173/factories/mock-factory-1/materials
- http://localhost:5173/factories/mock-factory-1/mix-designs

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
