import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest, listFactories } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import { PREVIEW_MODE } from '../config';

type Profile = {
  fullName: string;
  mobileNumber: string;
};

type MemberProfile = {
  profileStatus: 'INCOMPLETE' | 'COMPLETE';
  approvalStatus: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
};

type CompanyProfile = {
  companyName: string;
  companyStatus: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
};

function DashboardPage() {
  const { token } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [memberProfile, setMemberProfile] = useState<MemberProfile | null>(null);
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);
  const [factoryCount, setFactoryCount] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [me, member, company, factories] = await Promise.all([
          apiRequest<Profile>('/api/auth/me', {}, token ?? undefined),
          apiRequest<MemberProfile>('/api/member-profile/me', {}, token ?? undefined),
          apiRequest<CompanyProfile>('/api/company-profile/me', {}, token ?? undefined),
          listFactories(token ?? undefined),
        ]);
        setProfile(me);
        setMemberProfile(member);
        setCompanyProfile(company);
        setFactoryCount(factories.length);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'امکان دریافت اطلاعات کاربر وجود ندارد.');
      }
    }

    void loadData();
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
            <li>شماره موبایل: {profile.mobileNumber}</li>
            <li>وضعیت تکمیل پروفایل: {memberProfile?.profileStatus === 'COMPLETE' ? 'تکمیل شده' : 'ناقص'}</li>
            <li>وضعیت عضویت: {memberProfile?.approvalStatus === 'APPROVED' ? 'تأیید شده' : memberProfile?.approvalStatus === 'REJECTED' ? 'رد شده' : 'در انتظار بررسی'}</li>
            <li>اطلاعات شرکت: {companyProfile?.companyName ? `${companyProfile.companyName} (${companyProfile.companyStatus})` : 'ثبت نشده'}</li>
            <li>تعداد کارخانه‌ها: {factoryCount}</li>
          </ul>

          <div className="cta-row">
            <Link className="cta-primary" to="/profile">تکمیل/ویرایش پروفایل</Link>
            <Link className="cta-secondary" to="/company">ثبت/ویرایش شرکت</Link>
            <Link className="cta-secondary" to="/factories">مدیریت کارخانه‌ها</Link>
          </div>

          <div className="status-grid">
            <article className="status-card"><h3>کارخانه‌ها</h3><p>{factoryCount} واحد ثبت شده</p></article>
            <article className="status-card disabled"><h3>ماشین‌آلات</h3><p>به‌زودی</p></article>
            <article className="status-card disabled"><h3>پیشنهاد قیمت</h3><p>به‌زودی</p></article>
          </div>
        </>
      )}
    </section>
  );
}

export default DashboardPage;
