import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../api/client';
import { useAuth } from '../auth/AuthContext';

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: { fullName: string };
};

function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');

    try {
      const response = await apiRequest<LoginResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ login, password }),
      });
      setAuth(response.accessToken, response.refreshToken, response.user.fullName);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ورود ناموفق بود');
    }
  }

  return (
    <section className="card auth-card">
      <h2>ورود اعضا</h2>
      <p>با شماره موبایل (یا نام کاربری) وارد پرتال شوید.</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="login">شماره موبایل (یا نام کاربری)</label>
        <input id="login" value={login} onChange={(event) => setLogin(event.target.value)} required />
        <label htmlFor="password">رمز عبور</label>
        <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        <button type="submit">ورود به داشبورد</button>
      </form>
      {error && <p className="error">{error}</p>}
    </section>
  );
}

export default LoginPage;
