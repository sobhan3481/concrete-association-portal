# Phase 2 Implementation Report — Member & Company Profile

## What changed
- اضافه شدن مدل‌های `MemberProfile` و `CompanyProfile` در Prisma.
- اضافه شدن APIهای owner-only برای مشاهده/ویرایش پروفایل عضو و شرکت.
- تنظیم login اصلی روی mobile+password بدون نیاز اجباری OTP.
- حفظ کامل endpointهای OTP برای آینده.
- تکمیل داشبورد و صفحات پروفایل/شرکت در frontend.
- توسعه preview mode برای کار بدون backend.

## Files created/modified
- Backend:
  - `backend/prisma/schema.prisma`
  - `backend/prisma/migrations/0002_phase2_profiles/migration.sql`
  - `backend/src/config/env.ts`
  - `backend/src/middleware/validate.ts`
  - `backend/src/routes/member-profile.route.ts`
  - `backend/src/routes/company-profile.route.ts`
  - `backend/src/services/member-profile.service.ts`
  - `backend/src/services/company-profile.service.ts`
  - `backend/src/services/auth.service.ts`
  - `backend/src/server.ts`
  - `backend/.env.example`
- Frontend:
  - `frontend/src/api/client.ts`
  - `frontend/src/App.tsx`
  - `frontend/src/pages/DashboardPage.tsx`
  - `frontend/src/pages/ProfilePage.tsx`
  - `frontend/src/pages/CompanyPage.tsx`
  - `frontend/src/pages/LoginPage.tsx`
  - `frontend/src/pages/RegisterPage.tsx`
  - `frontend/src/styles/app.css`
  - `frontend/.env.example`
- Docs:
  - `README.md`
  - `docs/ARCHITECTURE.md`
  - `docs/SECURITY.md`
  - `docs/LOCAL_PREVIEW.md`
  - `docs/PHASE_2_IMPLEMENTATION_REPORT.md`

## API endpoints
- `GET /api/member-profile/me`
- `PUT /api/member-profile/me`
- `GET /api/company-profile/me`
- `PUT /api/company-profile/me`

## Database models
- `MemberProfile` با `userId @unique`
- `CompanyProfile` با `userId @unique`
- enumهای جدید: `MemberType`, `ProfileStatus`, `ApprovalStatus`, `CompanyStatus`

## Security controls
- JWT auth برای همه مسیرهای پروفایل.
- جلوگیری از IDOR با استفاده صرف از `userId` کاربر لاگین‌شده.
- اعتبارسنجی server-side با zod.
- audit log برای create/update پروفایل عضو و شرکت.

## Commands run
- `npm install` (frontend)
- `npm run build` (frontend)
- `npm install` (backend)
- `npm run prisma:generate` (backend)
- `npm run build` (backend)

## Known limitations
- در فاز ۲ upload باینری لوگو پیاده‌سازی نشده و `logoUrl` استفاده می‌شود.
- پنل admin برای approve/reject در scope فاز ۲ نیست.

## Next phase recommendation
- فاز ۳: Factory Registration با حفظ مالکیت داده و سیاست‌های anti-IDOR.
