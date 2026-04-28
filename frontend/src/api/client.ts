import { PREVIEW_MODE } from '../config';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000';

export type ApiError = { message: string };

type AuthUser = {
  id: string;
  username: string;
  fullName: string;
  mobileNumber: string;
  roles: string[];
};

const mockUser: AuthUser = {
  id: 'preview-user',
  username: 'preview.member',
  fullName: 'کاربر نمایشی',
  mobileNumber: '۰۹۱۲۳۴۵۶۷۸۹',
  roles: ['عضو انجمن'],
};

function mockApi<T>(path: string): T {
  if (path === '/api/auth/request-otp') return { message: 'کد تأیید به‌صورت نمایشی ارسال شد.' } as T;
  if (path === '/api/auth/verify-otp') return { message: 'شماره موبایل در حالت نمایشی تأیید شد.' } as T;
  if (path === '/api/auth/register') {
    return {
      accessToken: 'preview-access-token',
      refreshToken: 'preview-refresh-token',
      user: mockUser,
    } as T;
  }
  if (path === '/api/auth/login') {
    return {
      accessToken: 'preview-access-token',
      refreshToken: 'preview-refresh-token',
      user: mockUser,
    } as T;
  }
  if (path === '/api/auth/me') return mockUser as T;
  if (path === '/api/health') return { status: 'ok', previewMode: true } as T;

  throw new Error('این عملیات در حالت پیش‌نمایش شبیه‌سازی نشده است.');
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  token?: string,
): Promise<T> {
  if (PREVIEW_MODE && path.startsWith('/api/auth')) {
    return Promise.resolve(mockApi<T>(path));
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });

  if (!response.ok) {
    const error = (await response.json().catch(() => ({ message: 'خطا در ارتباط با سرور' }))) as ApiError;
    throw new Error(error.message);
  }

  return (await response.json()) as T;
}
