import { Link } from 'react-router-dom';
import { PREVIEW_MODE } from '../config';

const features = [
  'احراز هویت موبایلی',
  'ثبت اطلاعات شرکت و کارخانه',
  'ثبت ماشین‌آلات و ظرفیت تولید',
  'پیشنهاد قیمت بتن و خدمات حمل',
  'امنیت اطلاعات اعضا',
  'گزارش‌های انجمن',
];

function LandingPage() {
  return (
    <div className="landing">
      <section className="hero card">
        <h2>پرتال رسمی انجمن بتن</h2>
        <p>
          یک بستر یکپارچه برای احراز هویت اعضا، مدیریت اطلاعات کلیدی صنعت بتن و ارائه تحلیل‌های قابل اتکا برای تصمیم‌گیری‌های
          انجمن.
        </p>
        <div className="cta-row">
          <Link to="/login" className="cta-primary">
            ورود اعضا
          </Link>
          <Link to="/register" className="cta-secondary">
            ثبت‌نام عضو جدید
          </Link>
          <Link to="/request-otp" className="cta-secondary">
            دریافت کد تأیید
          </Link>
        </div>
        {PREVIEW_MODE && <p className="hint">این صفحه در حالت پیش‌نمایش فاز ۱ نمایش داده می‌شود.</p>}
      </section>

      <section className="features-grid">
        {features.map((feature) => (
          <article key={feature} className="card feature-card">
            <h3>{feature}</h3>
            <p>این قابلیت در مسیر توسعه سامانه قرار دارد و ساختار اولیه آن برای فازهای بعدی آماده شده است.</p>
          </article>
        ))}
      </section>
    </div>
  );
}

export default LandingPage;
