import { FormEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiRequest } from '../api/client';

type RegisterResponse = {
  accessToken: string;
  refreshToken: string;
  user: { fullName: string };
};

function RegisterPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileNumber, setMobileNumber] = useState<string>(location.state?.mobileNumber ?? '');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');

    try {
      await apiRequest<RegisterResponse>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ mobileNumber, fullName, password }),
      });
      navigate('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ثبت‌نام انجام نشد');
    }
  }

  return (
    <section className="card">
      <h2>ثبت‌نام</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="fullName">نام و نام خانوادگی</label>
        <input id="fullName" value={fullName} onChange={(event) => setFullName(event.target.value)} required />
        <label htmlFor="mobile">شماره موبایل</label>
        <input id="mobile" value={mobileNumber} onChange={(event) => setMobileNumber(event.target.value)} required />
        <label htmlFor="password">رمز عبور</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          minLength={8}
          required
        />
        <button type="submit">ثبت‌نام</button>
      </form>
      {error && <p className="error">{error}</p>}
    </section>
  );
}

export default RegisterPage;
