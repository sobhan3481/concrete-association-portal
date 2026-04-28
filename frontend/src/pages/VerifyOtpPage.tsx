import { FormEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiRequest } from '../api/client';

function VerifyOtpPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileNumber, setMobileNumber] = useState<string>(location.state?.mobileNumber ?? '');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');

    try {
      await apiRequest<{ message: string }>('/api/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ mobileNumber, code }),
      });
      navigate('/register', { state: { mobileNumber } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'کد تأیید نامعتبر است');
    }
  }

  return (
    <section className="card">
      <h2>تأیید شماره موبایل</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="mobile">شماره موبایل</label>
        <input id="mobile" value={mobileNumber} onChange={(event) => setMobileNumber(event.target.value)} required />
        <label htmlFor="code">کد تأیید</label>
        <input id="code" value={code} onChange={(event) => setCode(event.target.value)} required />
        <button type="submit">تأیید</button>
      </form>
      {error && <p className="error">{error}</p>}
    </section>
  );
}

export default VerifyOtpPage;
