# اجرای پیش‌نمایش محلی (فقط Frontend)

در این حالت نیازی به Docker، PostgreSQL یا Backend ندارید.

## Windows CMD
```cmd
cd /d C:\Users\bavaf\concrete-association-portal\frontend
copy /Y .env.example .env
npm install
npm run dev
```

آدرس پیش‌نمایش:
- http://localhost:5173

## Preview Mode
در فایل `.env` مقدار زیر باید فعال باشد:

```env
VITE_PREVIEW_MODE=true
```

رفتار در این حالت:
- درخواست OTP شبیه‌سازی می‌شود
- تایید OTP شبیه‌سازی می‌شود
- ثبت‌نام شبیه‌سازی می‌شود
- ورود شبیه‌سازی می‌شود
- داشبورد با کاربر نمایشی باز می‌شود
- خروج از حساب کار می‌کند

## بازگشت به حالت واقعی API
برای اتصال به backend:

```env
VITE_PREVIEW_MODE=false
VITE_API_BASE_URL=http://localhost:4000
```
