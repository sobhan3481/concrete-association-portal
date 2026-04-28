import { Link, Navigate, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import RequestOtpPage from './pages/RequestOtpPage';
import VerifyOtpPage from './pages/VerifyOtpPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './auth/AuthContext';
import { PREVIEW_MODE } from './config';

function App() {
  const { token, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <h1>پرتال انجمن بتن</h1>
          <p className="subtitle">سامانه دیجیتال مدیریت اعضا، کارخانه‌ها و پیشنهادهای قیمت</p>
        </div>
        <nav>
          <Link to="/">خانه</Link>
          {!token && <Link to="/login">ورود</Link>}
          {!token && <Link to="/register">ثبت‌نام</Link>}
          {!token && <Link to="/request-otp">دریافت کد تأیید</Link>}
          {token && <Link to="/dashboard">داشبورد</Link>}
          {token && (
            <button type="button" onClick={logout} className="btn-link">
              خروج
            </button>
          )}
        </nav>
      </header>

      {PREVIEW_MODE && <p className="preview-badge">حالت پیش‌نمایش فاز ۱ فعال است (بدون اتصال به backend)</p>}

      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/request-otp" element={<RequestOtpPage />} />
          <Route path="/verify-otp" element={<VerifyOtpPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
