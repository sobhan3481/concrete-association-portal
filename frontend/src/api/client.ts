import { PREVIEW_MODE } from '../config';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000';

export type ApiError = { message: string };

export type MaterialPayload = {
  materialType: 'CEMENT' | 'COARSE_AGGREGATE' | 'FINE_AGGREGATE' | 'WATER' | 'ADMIXTURE' | 'GEL' | 'POZZOLAN' | 'SLAG' | 'OTHER';
  name: string;
  unit: 'KG' | 'TON' | 'LITER' | 'CUBIC_METER' | 'UNIT';
  unitPrice: number;
  supplierName?: string;
  purchaseSource?: 'COMMODITY_EXCHANGE' | 'FREE_MARKET' | 'DIRECT_SUPPLIER' | 'INTERNAL' | 'OTHER';
  isActive: boolean;
  notes?: string;
};

export type MixDesignPayload = {
  title: string;
  concreteGrade: number;
  resistanceClass?: string;
  slumpMm?: number;
  targetStrengthMpa?: number;
  wasteFactorPercent?: number;
  labCostPerM3?: number;
  isActive: boolean;
  notes?: string;
};

export type MixDesignItemPayload = { materialId: string; quantity: number; unit: 'KG' | 'TON' | 'LITER' | 'CUBIC_METER' | 'UNIT' };

export type MachineryPayload = {
  machineryType: 'LOADER' | 'MIXER' | 'DUMP_TRUCK' | 'STATIONARY_PUMP' | 'BOOM_PUMP';
  ownershipType: 'OWNED' | 'RENTED' | 'LEASED' | 'OTHER';
  title: string;
  quantity: number;
  brand?: string;
  model?: string;
  manufactureYear?: number;
  capacityValue?: number;
  capacityUnit?: string;
  boomLengthMeters?: number;
  monthlyRentAmount?: number;
  depreciationMonthlyAmount?: number;
  fuelCostMonthly?: number;
  maintenanceCostMonthly?: number;
  driverOrOperatorCostMonthly?: number;
  isActive: boolean;
  notes?: string;
};

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
export type MachineryItem = MachineryPayload & { id: string; factoryId: string; createdAt?: string };
export type MaterialItem = MaterialPayload & { id: string; factoryId: string };
export type MixDesignItem = MixDesignItemPayload & { id: string; unitPriceSnapshot?: number; totalCost?: number };
export type MixDesignItemModel = MixDesignPayload & { id: string; factoryId: string; directMaterialCostPerM3: number; calculatedCostPerM3: number; items?: MixDesignItem[] };

let previewFactories: FactoryItem[] = [
  {
    id: 'mock-factory-1',
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


let previewMachinery: MachineryItem[] = [
  {
    id: 'mach-1',
    factoryId: 'mock-factory-1',
    machineryType: 'LOADER',
    ownershipType: 'OWNED',
    title: 'لودر اصلی کارخانه',
    quantity: 2,
    brand: 'Caterpillar',
    model: '950H',
    manufactureYear: 2019,
    capacityValue: 3,
    capacityUnit: 'مترمکعب',
    fuelCostMonthly: 120000000,
    maintenanceCostMonthly: 45000000,
    driverOrOperatorCostMonthly: 60000000,
    isActive: true,
    notes: 'ماشین‌آلات نمایشی',
  },
];

let previewMaterials: MaterialItem[] = [{ id: 'mat-1', factoryId: 'mock-factory-1', materialType: 'CEMENT', name: 'سیمان تیپ ۲', unit: 'TON', unitPrice: 2800000, purchaseSource: 'COMMODITY_EXCHANGE', isActive: true }];

let previewMixDesigns: MixDesignItemModel[] = [{ id: 'mix-1', factoryId: 'mock-factory-1', title: 'طرح پایه ۳۵۰', concreteGrade: 350, resistanceClass: 'C30', slumpMm: 80, wasteFactorPercent: 2, labCostPerM3: 120000, directMaterialCostPerM3: 0, calculatedCostPerM3: 0, isActive: true, items: [] }];

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


  const listMachineryMatch = path.match(/^\/api\/factories\/([^/]+)\/machinery$/);
  if (listMachineryMatch && (!options.method || options.method === 'GET')) {
    const factoryId = listMachineryMatch[1];
    return previewMachinery.filter((x) => x.factoryId === factoryId) as T;
  }
  if (listMachineryMatch && options.method === 'POST') {
    const factoryId = listMachineryMatch[1];
    const body = JSON.parse(String(options.body ?? '{}')) as MachineryPayload;
    const created: MachineryItem = { ...body, id: `m-${Date.now()}`, factoryId };
    previewMachinery = [created, ...previewMachinery];
    return created as T;
  }

  if (path.startsWith('/api/machinery/') && (!options.method || options.method === 'GET')) {
    const id = path.split('/').pop()!;
    const item = previewMachinery.find((x) => x.id === id);
    if (!item) throw new Error('ماشین‌آلات یافت نشد.');
    return item as T;
  }
  if (path.startsWith('/api/machinery/') && options.method === 'PUT') {
    const id = path.split('/').pop()!;
    const body = JSON.parse(String(options.body ?? '{}')) as MachineryPayload;
    previewMachinery = previewMachinery.map((x) => (x.id === id ? { ...x, ...body } : x));
    const item = previewMachinery.find((x) => x.id === id);
    if (!item) throw new Error('ماشین‌آلات یافت نشد.');
    return item as T;
  }
  if (path.startsWith('/api/machinery/') && options.method === 'DELETE') {
    const id = path.split('/').pop()!;
    previewMachinery = previewMachinery.filter((x) => x.id !== id);
    return { message: 'ماشین‌آلات حذف شد.' } as T;
  }


  const materialsMatch = path.match(/^\/api\/factories\/([^/]+)\/materials$/);
  if (materialsMatch && (!options.method || options.method === 'GET')) {
    const factoryId = materialsMatch[1];
    return previewMaterials.filter((x) => x.factoryId === factoryId) as T;
  }
  if (materialsMatch && options.method === 'POST') {
    const factoryId = materialsMatch[1];
    const body = JSON.parse(String(options.body ?? '{}')) as MaterialPayload;
    const created: MaterialItem = { ...body, id: `mat-${Date.now()}`, factoryId };
    previewMaterials = [created, ...previewMaterials];
    return created as T;
  }
  if (path.startsWith('/api/materials/') && (!options.method || options.method === 'GET')) {
    const id = path.split('/').pop()!;
    const item = previewMaterials.find((x) => x.id === id);
    if (!item) throw new Error('ماده اولیه یافت نشد.');
    return item as T;
  }
  if (path.startsWith('/api/materials/') && options.method === 'PUT') {
    const id = path.split('/').pop()!;
    const body = JSON.parse(String(options.body ?? '{}')) as MaterialPayload;
    previewMaterials = previewMaterials.map((x) => x.id === id ? { ...x, ...body } : x);
    const item = previewMaterials.find((x) => x.id === id);
    if (!item) throw new Error('ماده اولیه یافت نشد.');
    return item as T;
  }
  if (path.startsWith('/api/materials/') && options.method === 'DELETE') {
    const id = path.split('/').pop()!;
    previewMaterials = previewMaterials.filter((x) => x.id !== id);
    return { message: 'ماده اولیه حذف شد.' } as T;
  }

  const mixesMatch = path.match(/^\/api\/factories\/([^/]+)\/mix-designs$/);
  if (mixesMatch && (!options.method || options.method === 'GET')) {
    const factoryId = mixesMatch[1];
    return previewMixDesigns.filter((x) => x.factoryId === factoryId) as T;
  }
  if (mixesMatch && options.method === 'POST') {
    const factoryId = mixesMatch[1];
    const body = JSON.parse(String(options.body ?? '{}')) as MixDesignPayload;
    const created: MixDesignItemModel = { ...body, id: `mix-${Date.now()}`, factoryId, directMaterialCostPerM3: 0, calculatedCostPerM3: 0, items: [] };
    previewMixDesigns = [created, ...previewMixDesigns];
    return created as T;
  }
  if (path.startsWith('/api/mix-designs/') && (!options.method || options.method === 'GET')) {
    const id = path.split('/')[3];
    const item = previewMixDesigns.find((x) => x.id === id);
    if (!item) throw new Error('طرح اختلاط یافت نشد.');
    return item as T;
  }
  if (path.startsWith('/api/mix-designs/') && options.method === 'PUT' && !path.endsWith('/items')) {
    const id = path.split('/')[3];
    const body = JSON.parse(String(options.body ?? '{}')) as MixDesignPayload;
    previewMixDesigns = previewMixDesigns.map((x) => x.id === id ? { ...x, ...body } : x);
    const item = previewMixDesigns.find((x) => x.id === id);
    if (!item) throw new Error('طرح اختلاط یافت نشد.');
    return item as T;
  }
  if (path.startsWith('/api/mix-designs/') && options.method === 'DELETE') {
    const id = path.split('/')[3];
    previewMixDesigns = previewMixDesigns.filter((x) => x.id !== id);
    return { message: 'طرح اختلاط حذف شد.' } as T;
  }
  if (path.startsWith('/api/mix-designs/') && options.method === 'PUT' && path.endsWith('/items')) {
    const id = path.split('/')[3];
    const body = JSON.parse(String(options.body ?? '{}')) as { items: MixDesignItemPayload[] };
    const design = previewMixDesigns.find((x) => x.id === id);
    if (!design) throw new Error('طرح اختلاط یافت نشد.');

    let direct = 0;
    const newItems = body.items.map((it, idx) => {
      const mat = previewMaterials.find((m) => m.id === it.materialId);
      if (!mat) throw new Error('برخی مواد اولیه معتبر نیستند.');
      let total = 0;
      if (mat.unit === it.unit) total = it.quantity * mat.unitPrice;
      else if (mat.unit === 'TON' && it.unit === 'KG') total = (it.quantity / 1000) * mat.unitPrice;
      else if (mat.unit === 'KG' && it.unit === 'TON') total = (it.quantity * 1000) * mat.unitPrice;
      else throw new Error('واحد ماده با واحد آیتم سازگار نیست.');
      direct += total;
      return { id: `mdi-${Date.now()}-${idx}`, ...it, unitPriceSnapshot: mat.unitPrice, totalCost: total };
    });

    const lab = Number(design.labCostPerM3 ?? 0);
    const waste = Number(design.wasteFactorPercent ?? 0);
    const calc = direct + lab + (direct * waste / 100);

    previewMixDesigns = previewMixDesigns.map((x) => x.id === id ? { ...x, items: newItems, directMaterialCostPerM3: direct, calculatedCostPerM3: calc } : x);
    return previewMixDesigns.find((x) => x.id === id) as T;
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

export const listMachinery = (factoryId: string, token?: string) =>
  apiRequest<MachineryItem[]>(`/api/factories/${factoryId}/machinery`, {}, token);
export const getMachinery = (id: string, token?: string) =>
  apiRequest<MachineryItem>(`/api/machinery/${id}`, {}, token);
export const createMachinery = (factoryId: string, payload: MachineryPayload, token?: string) =>
  apiRequest<MachineryItem>(`/api/factories/${factoryId}/machinery`, { method: 'POST', body: JSON.stringify(payload) }, token);
export const updateMachinery = (id: string, payload: MachineryPayload, token?: string) =>
  apiRequest<MachineryItem>(`/api/machinery/${id}`, { method: 'PUT', body: JSON.stringify(payload) }, token);
export const deleteMachinery = (id: string, token?: string) =>
  apiRequest<{ message: string }>(`/api/machinery/${id}`, { method: 'DELETE' }, token);

export const listMaterials = (factoryId: string, token?: string) => apiRequest<MaterialItem[]>(`/api/factories/${factoryId}/materials`, {}, token);
export const getMaterial = (id: string, token?: string) => apiRequest<MaterialItem>(`/api/materials/${id}`, {}, token);
export const createMaterial = (factoryId: string, payload: MaterialPayload, token?: string) => apiRequest<MaterialItem>(`/api/factories/${factoryId}/materials`, { method: 'POST', body: JSON.stringify(payload) }, token);
export const updateMaterial = (id: string, payload: MaterialPayload, token?: string) => apiRequest<MaterialItem>(`/api/materials/${id}`, { method: 'PUT', body: JSON.stringify(payload) }, token);
export const deleteMaterial = (id: string, token?: string) => apiRequest<{ message: string }>(`/api/materials/${id}`, { method: 'DELETE' }, token);
export const listMixDesigns = (factoryId: string, token?: string) => apiRequest<MixDesignItemModel[]>(`/api/factories/${factoryId}/mix-designs`, {}, token);
export const getMixDesign = (id: string, token?: string) => apiRequest<MixDesignItemModel>(`/api/mix-designs/${id}`, {}, token);
export const createMixDesign = (factoryId: string, payload: MixDesignPayload, token?: string) => apiRequest<MixDesignItemModel>(`/api/factories/${factoryId}/mix-designs`, { method: 'POST', body: JSON.stringify(payload) }, token);
export const updateMixDesign = (id: string, payload: MixDesignPayload, token?: string) => apiRequest<MixDesignItemModel>(`/api/mix-designs/${id}`, { method: 'PUT', body: JSON.stringify(payload) }, token);
export const deleteMixDesign = (id: string, token?: string) => apiRequest<{ message: string }>(`/api/mix-designs/${id}`, { method: 'DELETE' }, token);
export const updateMixDesignItems = (id: string, items: MixDesignItemPayload[], token?: string) => apiRequest<MixDesignItemModel>(`/api/mix-designs/${id}/items`, { method: 'PUT', body: JSON.stringify({ items }) }, token);
