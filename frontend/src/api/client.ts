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

let previewMemberProfile = {
  memberType: 'INDIVIDUAL',
  fullName: 'کاربر نمایشی',
  nationalCode: '0012345678',
  positionTitle: 'نماینده شرکت',
  profileStatus: 'COMPLETE',
  approvalStatus: 'PENDING_REVIEW',
  rejectionReason: null,
};

let previewCompanyProfile = {
  companyName: 'بتن آماده نمونه',
  brandName: 'نمونه بتن',
  nationalId: '14001234567',
  registrationNumber: '556677',
  phone: '02188990011',
  province: 'تهران',
  city: 'تهران',
  address: 'تهران، جاده مخصوص، پلاک ۱۲',
  postalCode: '1234567890',
  logoUrl: 'https://example.com/logo.png',
  description: 'پروفایل نمایشی شرکت برای بررسی UI',
  companyStatus: 'SUBMITTED',
};

const mockUser: AuthUser = {
  id: 'preview-user',
  username: 'preview.member',
  fullName: 'کاربر نمایشی',
  mobileNumber: '09123456789',
  roles: ['MEMBER'],
};

function mockApi<T>(path: string, options: RequestInit): T {
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
  if (path === '/api/member-profile/me' && (!options.method || options.method === 'GET')) return previewMemberProfile as T;
  if (path === '/api/member-profile/me' && options.method === 'PUT') {
    const body = JSON.parse(String(options.body ?? '{}')) as Record<string, string>;
    previewMemberProfile = {
      ...previewMemberProfile,
      ...body,
      profileStatus: body.fullName ? 'COMPLETE' : 'INCOMPLETE',
      approvalStatus: body.fullName ? 'PENDING_REVIEW' : previewMemberProfile.approvalStatus,
    };
    return previewMemberProfile as T;
  }

  if (path === '/api/company-profile/me' && (!options.method || options.method === 'GET')) return previewCompanyProfile as T;
  if (path === '/api/company-profile/me' && options.method === 'PUT') {
    const body = JSON.parse(String(options.body ?? '{}')) as Record<string, string>;
    previewCompanyProfile = {
      ...previewCompanyProfile,
      ...body,
      companyStatus: body.companyName && body.province && body.city && body.address ? 'SUBMITTED' : 'DRAFT',
    };
    return previewCompanyProfile as T;
  }

  if (path === '/api/health') return { status: 'ok', previewMode: true } as T;

  throw new Error('این عملیات در حالت پیش‌نمایش شبیه‌سازی نشده است.');
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  token?: string,
): Promise<T> {
  if (PREVIEW_MODE) {
    return Promise.resolve(mockApi<T>(path, options));
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
