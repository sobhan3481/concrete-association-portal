# معماری فاز ۱

## Backend
- `ConcreteAssociation.Domain`: موجودیت‌های پایه احراز هویت (`User`, `Role`, `UserRole`, `OtpRequest`, `RefreshToken`, `AuditLog`).
- `ConcreteAssociation.Application`: DTOها، قرارداد سرویس احراز هویت، قراردادهای OTP، توکن، هش رمز عبور، لاگ حسابرسی.
- `ConcreteAssociation.Infrastructure`: EF Core DbContext، پیاده‌سازی سرویس احراز هویت، JWT، OTP توسعه‌ای، Rate limit + seed نقش‌ها.
- `ConcreteAssociation.Api`: کنترلرهای REST (`/api/health`, `/api/auth/*`)، احراز هویت JWT، CORS، Rate limiting و middleware خطا.

## Frontend
- React + TypeScript + Vite
- مسیرها: صفحه فرود، درخواست OTP، تأیید OTP، ثبت‌نام، ورود، داشبورد محافظت‌شده.
- `AuthContext` برای نگهداری state ورود در localStorage.
- API client متمرکز برای فراخوانی backend.

## Database Foundation
- PostgreSQL + EF Core migration اولیه برای جداول احراز هویت و حسابرسی.
- محدودیت‌ها: unique روی mobile/username/role name و کلید خارجی‌های اصلی.

## مسیر توسعه فازهای بعدی
- فاز ۲: ماژول Member/Company روی همین پایه `User` و نقش‌ها سوار می‌شود.
- فاز ۳+: جداول کارخانه، ماشین‌آلات، مواد، طراحی اختلاط، هزینه و قیمت‌گذاری به‌صورت افزایشی اضافه می‌شود.
