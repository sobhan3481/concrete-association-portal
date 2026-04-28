# Security Baseline (Phase 2)

## Authentication
- ورود اصلی فعلی: **شماره موبایل + رمز عبور**.
- ورود با username نیز برای سازگاری عقب‌رو فعال مانده است.
- OTP endpointها حفظ شده‌اند تا در آینده با پنل SMS واقعی متصل شوند.
- `AUTH_REQUIRE_OTP_FOR_REGISTRATION=false` در فاز ۲ باعث می‌شود ثبت‌نام بدون OTP اجباری انجام شود.

## Authorization & Data Isolation
- مسیرهای `/api/member-profile/me` و `/api/company-profile/me` همگی با JWT محافظت می‌شوند.
- کاربر فقط روی داده متعلق به `userId` خودش عملیات انجام می‌دهد.
- endpoint عمومی برای خواندن پروفایل کاربران دیگر وجود ندارد (Anti-IDOR).

## Validation & Input Safety
- تمام ورودی‌ها با `zod` در backend اعتبارسنجی می‌شوند.
- طول رشته‌ها و فرمت فیلدهای حساس مانند کد ملی/کد پستی/URL لوگو بررسی می‌شود.

## Audit Logging
رخدادهای ثبت‌شده:
- `USER_REGISTERED`, `LOGIN_SUCCESS`, `LOGIN_FAILURE`
- `MEMBER_PROFILE_CREATED`, `MEMBER_PROFILE_UPDATED`
- `COMPANY_PROFILE_CREATED`, `COMPANY_PROFILE_UPDATED`

## Secrets & Sensitive Data
- hash رمز عبور/refresh token/OTP ذخیره می‌شود و در API خروجی داده نمی‌شود.
- secretها در `.env` مدیریت می‌شوند و نباید commit شوند.
