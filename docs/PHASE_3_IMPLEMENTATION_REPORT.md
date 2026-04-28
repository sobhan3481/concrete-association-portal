# Phase 3 Implementation Report — Factory Registration

## What changed
- مدل Factory به Prisma اضافه شد با مالکیت مستقیم `ownerUserId` و ارتباط با `CompanyProfile`.
- API کامل کارخانه‌ها (CRUD) با auth و owner filtering اضافه شد.
- اعتبارسنجی server-side برای ورودی‌های کارخانه اضافه شد.
- Audit log برای create/update/delete کارخانه اضافه شد.
- UI مدیریت کارخانه (لیست/ثبت/ویرایش/حذف) به frontend اضافه شد.
- داشبورد تعداد کارخانه‌ها را نمایش می‌دهد و دکمه مدیریت فعال شد.
- preview mode برای factory CRUD تکمیل شد.

## Files changed
- `backend/prisma/schema.prisma`
- `backend/prisma/migrations/0003_phase3_factories/migration.sql`
- `backend/src/middleware/validate.ts`
- `backend/src/routes/factory.route.ts`
- `backend/src/services/factory.service.ts`
- `backend/src/middleware/error-handler.ts`
- `backend/src/server.ts`
- `frontend/src/api/client.ts`
- `frontend/src/App.tsx`
- `frontend/src/pages/DashboardPage.tsx`
- `frontend/src/pages/FactoriesPage.tsx`
- `frontend/src/pages/FactoryFormPage.tsx`
- `frontend/src/styles/app.css`
- `README.md`
- `docs/ARCHITECTURE.md`
- `docs/SECURITY.md`
- `docs/LOCAL_PREVIEW.md`
- `docs/PHASE_3_IMPLEMENTATION_REPORT.md`

## API endpoints
- `GET /api/factories`
- `GET /api/factories/:id`
- `POST /api/factories`
- `PUT /api/factories/:id`
- `DELETE /api/factories/:id`

## Ownership/security rules
- تمام endpointها نیازمند JWT هستند.
- همه queryها با `ownerUserId = currentUserId` فیلتر می‌شوند.
- دسترسی به کارخانه دیگران با 404 امن پاسخ داده می‌شود.
- بدون CompanyProfile ایجاد کارخانه مجاز نیست.

## Preview mode
- مسیر `/factories` در preview بدون backend قابل استفاده است.
- create/edit/delete به‌صورت mock و stateful شبیه‌سازی می‌شود.

## Commands run
- frontend: `npm install`, `npm run build`
- backend: `npm install`, `npm run prisma:generate`, `npm run build`
- backend migrate/dev: در صورت نبود DB ممکن است fail شود (با توضیح شفاف گزارش شده)

## Known limitations
- verify کامل migrate نیازمند PostgreSQL در دسترس است.

## Next phase recommendation
- فاز ۴: Machinery Management
