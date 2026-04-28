# Architecture (Phase 2)

## Backend (Express + TypeScript)
- `src/server.ts`: app bootstrap, امنیت پایه و route wiring.
- `src/routes/auth.route.ts`: احراز هویت (OTP + register/login/me).
- `src/routes/member-profile.route.ts`: فقط endpointهای `me` برای پروفایل عضو.
- `src/routes/company-profile.route.ts`: فقط endpointهای `me` برای پروفایل شرکت.
- `src/services/*`: منطق auth، audit، member profile، company profile.
- `src/middleware/*`: auth guard + validation + error handler.

## Frontend (React + Vite)
- صفحات: خانه، ورود، ثبت‌نام، درخواست/تأیید OTP، داشبورد، پروفایل عضو، پروفایل شرکت.
- Route protection برای داشبورد/پروفایل/شرکت.
- Preview mode با mock کامل برای auth/member/company.

## Database Layer
Prisma models:
- `User`, `Role`, `UserRole`, `OtpRequest`, `MobileVerification`, `RefreshToken`, `AuditLog`
- `MemberProfile` (one-to-one با `User`)
- `CompanyProfile` (one-to-one با `User`)

## Profile Ownership Rules
- هر کاربر فقط رکورد `memberProfile` خود را می‌خواند/ویرایش می‌کند.
- هر کاربر فقط رکورد `companyProfile` خود را می‌خواند/ویرایش می‌کند.
- endpoint لیستی یا ID-based عمومی برای پروفایل‌ها ارائه نشده است.

## Future Expansion Path (Phase 3)
- افزودن ماژول ثبت کارخانه به‌صورت لایه‌ای روی `CompanyProfile`.
- افزودن نقش/سیاست Association Admin برای تایید نهایی پرونده‌ها.
