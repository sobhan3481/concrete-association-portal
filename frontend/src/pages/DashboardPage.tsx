import { useEffect, useState } from 'react';
import { apiRequest } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import { PREVIEW_MODE } from '../config';

type Profile = {
  fullName: string;
  username: string;
  mobileNumber: string;
  roles: string[];
};

const statusCards = ['وضعیت عضویت', 'تکمیل پروفایل', 'کارخانه‌های ثبت‌شده', 'پیشنهاد قیمت'];

function DashboardPage() {
  const { token } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProfile() {
      try {
        const result = await apiRequest<Profile>('/api/auth/me', {}, token ?? undefined);
        setProfile(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'امکان دریافت اطلاعات کاربر وجود ندارد.');
      }
    }

    void loadProfile();
  }, [token]);

  return (
    <section className="card dashboard">
      <h2>داشبورد</h2>
      {PREVIEW_MODE && <p className="hint">این داشبورد در حالت پیش‌نمایش اجرا شده و به backend متصل نیست.</p>}
      {error && <p className="error">{error}</p>}
      {profile && (
        <>
          <ul className="profile-list">
            <li>نام کاربر: {profile.fullName}</li>
            <li>نقش: {profile.roles.join('، ')}</li>
            <li>موبایل: {profile.mobileNumber}</li>
          </ul>
          <div className="status-grid">
            {statusCards.map((card) => (
              <article className="status-card" key={card}>
                <h3>{card}</h3>
                <p>آماده برای تکمیل در فاز بعدی</p>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default DashboardPage;
