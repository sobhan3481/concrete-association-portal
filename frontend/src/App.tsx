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
import ProfilePage from './pages/ProfilePage';
import CompanyPage from './pages/CompanyPage';
import FactoriesPage from './pages/FactoriesPage';
import FactoryFormPage from './pages/FactoryFormPage';
import MachineryPage from './pages/MachineryPage';
import MachineryFormPage from './pages/MachineryFormPage';
import MixDesignItemsPage from './pages/MixDesignItemsPage';
import MixDesignFormPage from './pages/MixDesignFormPage';
import MixDesignsPage from './pages/MixDesignsPage';
import MaterialFormPage from './pages/MaterialFormPage';
import MaterialsPage from './pages/MaterialsPage';

function App() {
  const { token, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <h1>پرتال انجمن بتن</h1>
          <p className="subtitle">سامانه دیجیتال مدیریت اعضا و شرکت‌ها</p>
        </div>
        <nav>
          <Link to="/">خانه</Link>
          {token && <Link to="/dashboard">داشبورد</Link>}
          {token && <Link to="/profile">پروفایل</Link>}
          {token && <Link to="/company">شرکت</Link>}
          {token && <Link to="/factories">کارخانه‌ها</Link>}
          {token && <Link to="/factories">ماشین‌آلات</Link>}
          {token && <Link to="/factories">مواد اولیه</Link>}
          {token && <Link to="/factories">طرح اختلاط</Link>}
          {!token && <Link to="/login">ورود</Link>}
          {!token && <Link to="/register">ثبت‌نام</Link>}
          {!token && <Link to="/request-otp">دریافت کد تأیید</Link>}
          {token && (
            <button type="button" onClick={logout} className="btn-link">
              خروج
            </button>
          )}
        </nav>
      </header>

      {PREVIEW_MODE && <p className="preview-badge">حالت پیش‌نمایش</p>}

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
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company"
            element={
              <ProtectedRoute>
                <CompanyPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/factories"
            element={
              <ProtectedRoute>
                <FactoriesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/factories/new"
            element={
              <ProtectedRoute>
                <FactoryFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/factories/:id/edit"
            element={
              <ProtectedRoute>
                <FactoryFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/factories/:factoryId/machinery"
            element={
              <ProtectedRoute>
                <MachineryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/factories/:factoryId/machinery/new"
            element={
              <ProtectedRoute>
                <MachineryFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/machinery/:id/edit"
            element={
              <ProtectedRoute>
                <MachineryFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/factories/:factoryId/materials"
            element={
              <ProtectedRoute>
                <MaterialsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/factories/:factoryId/materials/new"
            element={
              <ProtectedRoute>
                <MaterialFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/materials/:id/edit"
            element={
              <ProtectedRoute>
                <MaterialFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/factories/:factoryId/mix-designs"
            element={
              <ProtectedRoute>
                <MixDesignsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/factories/:factoryId/mix-designs/new"
            element={
              <ProtectedRoute>
                <MixDesignFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mix-designs/:id/edit"
            element={
              <ProtectedRoute>
                <MixDesignFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mix-designs/:id/items"
            element={
              <ProtectedRoute>
                <MixDesignItemsPage />
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
