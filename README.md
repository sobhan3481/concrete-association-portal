# Concrete Association Portal

فاز ۱ این مخزن، یک زیرساخت اجرایی برای پرتال امن انجمن بتن را فراهم می‌کند.

## ساختار پروژه

```text
/backend
  /src
    /ConcreteAssociation.Api
    /ConcreteAssociation.Application
    /ConcreteAssociation.Domain
    /ConcreteAssociation.Infrastructure
  /tests
    /ConcreteAssociation.Tests
/frontend
/docs
/docker
```

## پیش‌نیازها
- .NET SDK 8.0+
- Node.js 20+
- Docker (اختیاری برای PostgreSQL محلی)
- PostgreSQL 16+

## اجرای دیتابیس محلی
```bash
docker compose -f docker/docker-compose.yml up -d
```

## تنظیم متغیرهای محیطی
- backend: کپی از `backend/.env.example`
- frontend: کپی از `frontend/.env.example`

## اجرای Backend
```bash
cd backend
dotnet restore ConcreteAssociation.sln
dotnet ef database update --project src/ConcreteAssociation.Infrastructure --startup-project src/ConcreteAssociation.Api
dotnet run --project src/ConcreteAssociation.Api
```

Health endpoint:
- `GET http://localhost:5080/api/health`

Auth endpoints:
- `POST /api/auth/request-otp`
- `POST /api/auth/verify-otp`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

## اجرای Frontend
```bash
cd frontend
npm install
npm run dev
```

## یادداشت‌های امنیتی فاز ۱
- OTP hash شده ذخیره می‌شود.
- Password hash با الگوریتم امن ASP.NET Identity.
- Rate limiting روی درخواست OTP و Login فعال است.
- Audit log برای رویدادهای اصلی احراز هویت فعال است.
- CORS برای frontend محلی محدود شده است.

## فاز بعدی (Phase 2)
- پیاده‌سازی Member/Company Profile
- تایید عضویت انجمن
- طراحی policyهای tenant isolation در لایه application
