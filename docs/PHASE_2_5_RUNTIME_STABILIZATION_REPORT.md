# Phase 2.5 Runtime Stabilization Report

## Root cause
- برخی محیط‌ها هنگام دانلود Prisma engines از `binaries.prisma.sh` با خطای 403/checksum مواجه می‌شوند.
- این باعث شکست `prisma generate` و در نتیجه مشکلات runtime در backend می‌شود.
- نبود fallback عملیاتی/مستند، تجربه راه‌اندازی را ناپایدار می‌کرد.

## Prisma strategy chosen
- **Standard Prisma retained with documented network workaround**
- دلیل: نسخه فعلی پروژه پایدار است و تغییر به Rust-free mode در این فاز ضروری نبود.
- اقدامات:
  - pin نسخه‌های `prisma` و `@prisma/client`
  - افزودن اسکریپت‌های checksum-bypass
  - افزودن دستور verify

## What changed
- backend/package scripts:
  - prisma generate/migrate/deploy/studio
  - checksum-bypass scripts
  - verify / verify:db
- pin کردن نسخه‌های Prisma و پکیج‌ها برای ثبات بیشتر.
- بهبود startup backend برای لاگ خطای انسانی و قابل اقدام.
- به‌روزرسانی README و LOCAL_PREVIEW برای سه مسیر اجرایی ویندوز.

## Commands run and results
- frontend build: success
- backend build: success
- prisma generate: success in this environment after dependency stabilization
- prisma generate checksum-bypass: success (fallback verified)
- prisma migrate: failed (no reachable DB in this environment)
- backend dev + health: server started and `/api/health` responded

## Remaining limitations
- بدون دسترسی شبکه صحیح به Prisma binaries، مسیر پیش‌فرض generate ممکن است fail شود.
- بدون PostgreSQL در دسترس، migrate/dev DB-dependent API کامل verify نمی‌شود.

## Exact local run instructions
- در `docs/LOCAL_PREVIEW.md` به‌صورت تفکیک‌شده برای:
  - frontend-only preview
  - backend + Docker PostgreSQL
  - backend + local PostgreSQL (بدون Docker)
