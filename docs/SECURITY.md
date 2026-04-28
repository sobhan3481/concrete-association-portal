# امنیت فاز ۱

## طراحی احراز هویت
- ورود با `mobile یا username + password`.
- رمز عبور با `PasswordHasher` هش می‌شود و plaintext ذخیره نمی‌شود.
- JWT برای دسترسی کوتاه‌مدت و Refresh Token هش‌شده در دیتابیس.

## طراحی OTP
- OTP شش رقمی با انقضا (۲ دقیقه) و سقف تلاش (۵ بار).
- OTP به‌صورت هش (SHA-256) در دیتابیس ذخیره می‌شود.
- ارسال OTP فقط با `IOtpSender` abstraction؛ در Development فقط log می‌شود.
- Rate limit برای endpoint درخواست OTP اعمال شده است.

## Rate Limiting
- `/api/auth/request-otp`: حداکثر ۳ درخواست در هر ۱ دقیقه برای هر IP.
- `/api/auth/login`: حداکثر ۵ درخواست در هر ۱ دقیقه برای هر IP.

## Audit Logging
- رویدادهای `OTP_REQUESTED`, `OTP_VERIFIED`, `USER_REGISTERED`, `LOGIN_SUCCESS`, `LOGIN_FAILURE` در `AuditLogs` ثبت می‌شوند.

## CORS و Secret Management
- CORS فقط برای originهای تعریف‌شده در config.
- مقادیر secrets باید از env vars یا secret manager تزریق شوند.
- فایل `.env.example` فقط template است و secret واقعی ندارد.

## برنامه Tenant Isolation و Anti-IDOR (فازهای بعد)
- تمام رکوردهای domain باید `OwnerMemberId/CompanyId` داشته باشند.
- همه queryها باید scope-based filtering داشته باشند (tenant-bound).
- APIها نباید ID خام متعلق به tenant دیگر را برگردانند یا بپذیرند بدون policy.
- policy-based authorization برای owner/admin از فاز ۲ اضافه می‌شود.
