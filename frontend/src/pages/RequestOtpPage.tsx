import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../api/client';

function RequestOtpPage() {
  const [mobileNumber, setMobileNumber] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setMessage('');

    try {
      await apiRequest<{ message: string }>('/api/auth/request-otp', {
        method: 'POST',
        body: JSON.stringify({ mobileNumber }),
      });
      setMessage('کد تأیید ارسال شد.');
      navigate('/verify-otp', { state: { mobileNumber } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در ارسال کد تأیید');
    }
  }

  return (
    <section className="card auth-card">
      <h2>دریافت کد تأیید</h2>
      <p>برای شروع ثبت‌نام، شماره موبایل خود را وارد کنید.</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="mobile">شماره موبایل</label>
        <input id="mobile" value={mobileNumber} onChange={(event) => setMobileNumber(event.target.value)} required />
        <button type="submit">ارسال کد</button>
      </form>
      {message && <p className="ok">{message}</p>}
      {error && <p className="error">{error}</p>}
    </section>
  );
}

export default RequestOtpPage;
