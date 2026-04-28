import { useEffect, useState } from 'react';
import { apiRequest } from '../api/client';
import { useAuth } from '../auth/AuthContext';

type Profile = {
  fullName: string;
  username: string;
  mobileNumber: string;
  roles: string[];
};

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
    <section className="card">
      <h2>داشبورد</h2>
      {error && <p className="error">{error}</p>}
      {profile && (
        <ul>
          <li>نام: {profile.fullName}</li>
          <li>نام کاربری: {profile.username}</li>
          <li>شماره موبایل: {profile.mobileNumber}</li>
          <li>نقش‌ها: {profile.roles.join('، ')}</li>
        </ul>
      )}
    </section>
  );
}

export default DashboardPage;
