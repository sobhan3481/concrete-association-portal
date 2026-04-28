# Concrete Association Portal (Phase 5 - Materials & Mix Design)

## Phase 5 Summary
- مواد اولیه و طرح اختلاط برای هر کارخانه اضافه شد.
- هزینه مستقیم مصالح و هزینه محاسبه‌شده هر مترمکعب در طرح اختلاط محاسبه می‌شود.
- دسترسی‌ها owner-scoped هستند و داده رقبا نمایش داده نمی‌شود.
- Preview mode بدون backend برای materials/mix-design فعال است.

## Quick Preview (no backend)
```cmd
cd /d C:\Users\bavaf\concrete-association-portal\frontend
copy /Y .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```
Open:
- http://localhost:5173/factories/mock-factory-1/materials
- http://localhost:5173/factories/mock-factory-1/mix-designs

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
