import { PREVIEW_MODE } from '../config';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000';

export type ApiError = { message: string };

export type FactoryPayload = {
  name: string;
  province: string;
  city: string;
  address: string;
  landAreaSqm?: number;
  landOwnershipType: 'OWNED' | 'RENTED' | 'PARTNERSHIP' | 'OTHER';
  monthlyRentAmount?: number;
  batchingPlantCount?: number;
  batchingPlantType?: 'WET' | 'DRY' | 'HYBRID';
  batchingPlantBrand?: string;
  dailyProductionCapacityM3?: number;
  cementSiloCount?: number;
  cementSiloCapacityTons?: number;
  hasWaterWell: boolean;
  hasLaboratory: boolean;
  hasWeighbridge: boolean;
  cementPurchaseSource: 'COMMODITY_EXCHANGE' | 'FREE_MARKET' | 'MIXED';
  operationalStatus: 'ACTIVE' | 'SEMI_ACTIVE' | 'INACTIVE';
  notes?: string;
};

type AuthUser = {
  id: string;
  username: string;
  fullName: string;
  mobileNumber: string;
  roles: string[];
};

export type FactoryItem = FactoryPayload & { id: string; createdAt?: string };

let previewFactories: FactoryItem[] = [
  {
    id: 'factory-1',
    name: 'کارخانه بتن غرب',
    province: 'تهران',
    city: 'شهریار',
    address: 'جاده مخصوص، کیلومتر ۲۵',
    landOwnershipType: 'RENTED',
    monthlyRentAmount: 85000000,
    batchingPlantCount: 2,
    batchingPlantType: 'WET',
    batchingPlantBrand: 'Schwing',
    dailyProductionCapacityM3: 320,
    cementSiloCount: 4,
    cementSiloCapacityTons: 420,
    hasWaterWell: true,
    hasLaboratory: true,
    hasWeighbridge: true,
    cementPurchaseSource: 'MIXED',
    operationalStatus: 'ACTIVE',
    notes: 'پروفایل نمایشی کارخانه',
  },
];

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
  if (path === '/api/auth/register' || path === '/api/auth/login') {
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
    previewMemberProfile = { ...previewMemberProfile, ...body, profileStatus: body.fullName ? 'COMPLETE' : 'INCOMPLETE' };
    return previewMemberProfile as T;
  }

  if (path === '/api/company-profile/me' && (!options.method || options.method === 'GET')) return previewCompanyProfile as T;
  if (path === '/api/company-profile/me' && options.method === 'PUT') {
    const body = JSON.parse(String(options.body ?? '{}')) as Record<string, string>;
    previewCompanyProfile = { ...previewCompanyProfile, ...body, companyStatus: body.companyName ? 'SUBMITTED' : 'DRAFT' };
    return previewCompanyProfile as T;
  }

  if (path === '/api/factories' && (!options.method || options.method === 'GET')) return previewFactories as T;
  if (path === '/api/factories' && options.method === 'POST') {
    const body = JSON.parse(String(options.body ?? '{}')) as FactoryPayload;
    const created = { ...body, id: `f-${Date.now()}` };
    previewFactories = [created, ...previewFactories];
    return created as T;
  }

  if (path.startsWith('/api/factories/') && (!options.method || options.method === 'GET')) {
    const id = path.split('/').pop()!;
    const item = previewFactories.find((x) => x.id === id);
    if (!item) throw new Error('کارخانه یافت نشد.');
    return item as T;
  }

  if (path.startsWith('/api/factories/') && options.method === 'PUT') {
    const id = path.split('/').pop()!;
    const body = JSON.parse(String(options.body ?? '{}')) as FactoryPayload;
    previewFactories = previewFactories.map((x) => (x.id === id ? { ...x, ...body } : x));
    const item = previewFactories.find((x) => x.id === id);
    if (!item) throw new Error('کارخانه یافت نشد.');
    return item as T;
  }

  if (path.startsWith('/api/factories/') && options.method === 'DELETE') {
    const id = path.split('/').pop()!;
    previewFactories = previewFactories.filter((x) => x.id !== id);
    return { message: 'کارخانه حذف شد.' } as T;
  }

  if (path === '/api/health') return { status: 'ok', previewMode: true } as T;

  throw new Error('این عملیات در حالت پیش‌نمایش شبیه‌سازی نشده است.');
}

export async function apiRequest<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  if (PREVIEW_MODE) return Promise.resolve(mockApi<T>(path, options));

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

export const listFactories = (token?: string) => apiRequest<FactoryItem[]>('/api/factories', {}, token);
export const getFactory = (id: string, token?: string) => apiRequest<FactoryItem>(`/api/factories/${id}`, {}, token);
export const createFactory = (payload: FactoryPayload, token?: string) =>
  apiRequest<FactoryItem>('/api/factories', { method: 'POST', body: JSON.stringify(payload) }, token);
export const updateFactory = (id: string, payload: FactoryPayload, token?: string) =>
  apiRequest<FactoryItem>(`/api/factories/${id}`, { method: 'PUT', body: JSON.stringify(payload) }, token);
export const deleteFactory = (id: string, token?: string) =>
  apiRequest<{ message: string }>(`/api/factories/${id}`, { method: 'DELETE' }, token);
