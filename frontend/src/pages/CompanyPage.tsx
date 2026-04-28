import { FormEvent, useEffect, useState } from 'react';
import { apiRequest } from '../api/client';
import { useAuth } from '../auth/AuthContext';

type CompanyProfile = {
  companyName: string;
  brandName?: string | null;
  nationalId?: string | null;
  registrationNumber?: string | null;
  phone?: string | null;
  province: string;
  city: string;
  address: string;
  postalCode?: string | null;
  logoUrl?: string | null;
  description?: string | null;
  companyStatus: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
};

const emptyCompany: CompanyProfile = {
  companyName: '',
  brandName: '',
  nationalId: '',
  registrationNumber: '',
  phone: '',
  province: '',
  city: '',
  address: '',
  postalCode: '',
  logoUrl: '',
  description: '',
  companyStatus: 'DRAFT',
};

function CompanyPage() {
  const { token } = useAuth();
  const [form, setForm] = useState<CompanyProfile>(emptyCompany);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');

  useEffect(() => {
    apiRequest<CompanyProfile>('/api/company-profile/me', {}, token ?? undefined)
      .then((result) => setForm({ ...emptyCompany, ...result }))
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'خطا در دریافت اطلاعات شرکت'));
  }, [token]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setOk('');

    try {
      const result = await apiRequest<CompanyProfile>(
        '/api/company-profile/me',
        { method: 'PUT', body: JSON.stringify(form) },
        token ?? undefined,
      );
      setForm({ ...emptyCompany, ...result });
      setOk('اطلاعات شرکت با موفقیت ذخیره شد.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ذخیره اطلاعات انجام نشد');
    }
  }

  return (
    <section className="card">
      <h2>پروفایل شرکت</h2>
      <form onSubmit={onSubmit}>
        <label>نام شرکت</label><input value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} required />
        <label>برند تجاری</label><input value={form.brandName ?? ''} onChange={(e) => setForm({ ...form, brandName: e.target.value })} />
        <label>شناسه ملی</label><input value={form.nationalId ?? ''} onChange={(e) => setForm({ ...form, nationalId: e.target.value })} />
        <label>شماره ثبت</label><input value={form.registrationNumber ?? ''} onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })} />
        <label>تلفن ثابت</label><input value={form.phone ?? ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <label>استان</label><input value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })} required />
        <label>شهر</label><input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
        <label>آدرس</label><textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
        <label>کد پستی</label><input value={form.postalCode ?? ''} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} />
        <label>آدرس لوگو</label><input value={form.logoUrl ?? ''} onChange={(e) => setForm({ ...form, logoUrl: e.target.value })} />
        <label>توضیحات</label><textarea value={form.description ?? ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <div className="status-box">وضعیت پرونده شرکت: {form.companyStatus === 'SUBMITTED' ? 'ارسال شده' : form.companyStatus === 'APPROVED' ? 'تأیید شده' : form.companyStatus === 'REJECTED' ? 'رد شده' : 'پیش‌نویس'}</div>
        <button type="submit">ذخیره اطلاعات شرکت</button>
      </form>
      <p className="hint">در فاز ۲ آپلود فایل لوگو پیاده‌سازی نشده و از فیلد آدرس لوگو استفاده می‌شود.</p>
      {error && <p className="error">{error}</p>}
      {ok && <p className="ok">{ok}</p>}
    </section>
  );
}

export default CompanyPage;
