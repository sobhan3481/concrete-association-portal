import { FormEvent, useEffect, useState } from 'react';
import { apiRequest } from '../api/client';
import { useAuth } from '../auth/AuthContext';

type MemberProfile = {
  memberType: 'INDIVIDUAL' | 'LEGAL_ENTITY';
  fullName: string;
  nationalCode?: string | null;
  positionTitle?: string | null;
  profileStatus: 'INCOMPLETE' | 'COMPLETE';
  approvalStatus: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string | null;
};

const emptyProfile: MemberProfile = {
  memberType: 'INDIVIDUAL',
  fullName: '',
  nationalCode: '',
  positionTitle: '',
  profileStatus: 'INCOMPLETE',
  approvalStatus: 'PENDING_REVIEW',
  rejectionReason: null,
};

function ProfilePage() {
  const { token } = useAuth();
  const [form, setForm] = useState<MemberProfile>(emptyProfile);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');

  useEffect(() => {
    apiRequest<MemberProfile>('/api/member-profile/me', {}, token ?? undefined)
      .then((result) => setForm({ ...emptyProfile, ...result }))
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'خطا در دریافت پروفایل'));
  }, [token]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setOk('');

    try {
      const result = await apiRequest<MemberProfile>(
        '/api/member-profile/me',
        { method: 'PUT', body: JSON.stringify(form) },
        token ?? undefined,
      );
      setForm({ ...emptyProfile, ...result });
      setOk('پروفایل عضو با موفقیت ذخیره شد.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ذخیره اطلاعات انجام نشد');
    }
  }

  return (
    <section className="card auth-card">
      <h2>پروفایل عضو</h2>
      <form onSubmit={onSubmit}>
        <label>نوع عضو</label>
        <select value={form.memberType} onChange={(e) => setForm({ ...form, memberType: e.target.value as MemberProfile['memberType'] })}>
          <option value="INDIVIDUAL">حقیقی</option>
          <option value="LEGAL_ENTITY">حقوقی</option>
        </select>
        <label>نام و نام خانوادگی</label>
        <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
        <label>کد ملی</label>
        <input value={form.nationalCode ?? ''} onChange={(e) => setForm({ ...form, nationalCode: e.target.value })} />
        <label>سمت</label>
        <input value={form.positionTitle ?? ''} onChange={(e) => setForm({ ...form, positionTitle: e.target.value })} />
        <div className="status-box">وضعیت تکمیل: {form.profileStatus === 'COMPLETE' ? 'تکمیل شده' : 'ناقص'}</div>
        <div className="status-box">وضعیت بررسی انجمن: {form.approvalStatus === 'PENDING_REVIEW' ? 'در انتظار بررسی' : form.approvalStatus === 'APPROVED' ? 'تأیید شده' : 'رد شده'}</div>
        {form.rejectionReason && <div className="error">دلیل رد: {form.rejectionReason}</div>}
        <button type="submit">ذخیره پروفایل</button>
      </form>
      {error && <p className="error">{error}</p>}
      {ok && <p className="ok">{ok}</p>}
    </section>
  );
}

export default ProfilePage;
