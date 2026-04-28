# اجرای پیش‌نمایش محلی (فقط Frontend)

در این حالت نیازی به Docker، PostgreSQL یا Backend ندارید.

## Windows CMD
```cmd
cd /d C:\Users\bavaf\concrete-association-portal\frontend
copy /Y .env.example .env
npm install
npm run dev
```

Preview URL:
- http://localhost:5173

## Preview Mode
در فایل `.env` مقدار زیر فعال باشد:

```env
VITE_PREVIEW_MODE=true
```

رفتار در این حالت:
- ورود با موبایل + رمز عبور به‌صورت mock انجام می‌شود.
- ثبت‌نام موفق شبیه‌سازی می‌شود.
- داشبورد وضعیت پروفایل عضو/شرکت را نشان می‌دهد.
- صفحه پروفایل عضو و صفحه شرکت امکان ذخیره mock دارند.
- badge واضح «حالت پیش‌نمایش» نمایش داده می‌شود.

## اتصال به backend واقعی
```env
VITE_PREVIEW_MODE=false
VITE_API_BASE_URL=http://localhost:4000
```
