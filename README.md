# Concrete Association Portal (Phase 2 - Member & Company Profile)

این مخزن شامل پیاده‌سازی **Node.js + TypeScript** برای backend و **React + Vite** برای frontend است.

## Stack
- Backend: Node.js + Express + TypeScript + Prisma
- Database: PostgreSQL
- Frontend: React + TypeScript + Vite (RTL Persian UI)

## فاز ۲ چه چیزهایی اضافه شد؟
- ورود اصلی با **موبایل + رمز عبور** (OTP اجباری نیست).
- پروفایل عضو (`/api/member-profile/me`) برای مشاهده/ویرایش اطلاعات مالک همان حساب.
- پروفایل شرکت (`/api/company-profile/me`) برای مشاهده/ویرایش اطلاعات مالک همان حساب.
- داشبورد با نمایش وضعیت تکمیل پروفایل، وضعیت عضویت و وضعیت پرونده شرکت.
- حالت Preview مستقل از backend برای بررسی سریع UI.

## Auth Note (Phase 2)
- مسیرهای OTP حذف نشده‌اند و برای آینده فعال هستند.
- با `AUTH_REQUIRE_OTP_FOR_REGISTRATION=false` ثبت‌نام بدون OTP واقعی انجام می‌شود.
- در آینده با اتصال پنل SMS می‌توان OTP را اجباری کرد.

## Run Frontend Preview Only (بدون backend)
```cmd
cd /d C:\Users\bavaf\concrete-association-portal\frontend
copy /Y .env.example .env
npm install
npm run dev
```

Preview URL:
- `http://localhost:5173`

## Run Backend (with DB)
```bash
cd backend
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

## Main Endpoints
- `POST /api/auth/request-otp`
- `POST /api/auth/verify-otp`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/member-profile/me`
- `PUT /api/member-profile/me`
- `GET /api/company-profile/me`
- `PUT /api/company-profile/me`
- `GET /api/health`

## Security Baseline
- Password hashing (`bcryptjs`)
- JWT access token auth
- Rate limiting for login and OTP request
- Zod validation on server-side
- Audit logging for auth/profile/company changes
- Owner-only profile access (anti-IDOR)
