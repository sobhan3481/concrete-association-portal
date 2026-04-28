import { prisma } from '../config/prisma.js';
import { writeAuditLog } from './audit.service.js';

type FactoryInput = {
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
  hasWaterWell?: boolean;
  hasLaboratory?: boolean;
  hasWeighbridge?: boolean;
  cementPurchaseSource?: 'COMMODITY_EXCHANGE' | 'FREE_MARKET' | 'MIXED';
  operationalStatus?: 'ACTIVE' | 'SEMI_ACTIVE' | 'INACTIVE';
  notes?: string;
};

function normalizeDecimal(value?: number) {
  return value === undefined ? undefined : value.toString();
}

async function requireCompanyProfile(userId: string) {
  const companyProfile = await prisma.companyProfile.findUnique({ where: { userId } });
  if (!companyProfile) throw new Error('ابتدا اطلاعات شرکت را تکمیل کنید.');
  return companyProfile;
}

export async function listFactories(userId: string) {
  return prisma.factory.findMany({ where: { ownerUserId: userId }, orderBy: { createdAt: 'desc' } });
}

export async function getFactoryById(userId: string, id: string) {
  const factory = await prisma.factory.findFirst({ where: { id, ownerUserId: userId } });
  if (!factory) throw new Error('کارخانه یافت نشد.');
  return factory;
}

export async function createFactory(userId: string, input: FactoryInput, ipAddress?: string) {
  const companyProfile = await requireCompanyProfile(userId);

  const factory = await prisma.factory.create({
    data: {
      companyProfileId: companyProfile.id,
      ownerUserId: userId,
      name: input.name,
      province: input.province,
      city: input.city,
      address: input.address,
      landAreaSqm: normalizeDecimal(input.landAreaSqm),
      landOwnershipType: input.landOwnershipType,
      monthlyRentAmount: normalizeDecimal(input.monthlyRentAmount),
      batchingPlantCount: input.batchingPlantCount,
      batchingPlantType: input.batchingPlantType,
      batchingPlantBrand: input.batchingPlantBrand,
      dailyProductionCapacityM3: normalizeDecimal(input.dailyProductionCapacityM3),
      cementSiloCount: input.cementSiloCount,
      cementSiloCapacityTons: normalizeDecimal(input.cementSiloCapacityTons),
      hasWaterWell: Boolean(input.hasWaterWell),
      hasLaboratory: Boolean(input.hasLaboratory),
      hasWeighbridge: Boolean(input.hasWeighbridge),
      cementPurchaseSource: input.cementPurchaseSource ?? 'MIXED',
      operationalStatus: input.operationalStatus ?? 'ACTIVE',
      notes: input.notes,
    },
  });

  await writeAuditLog({
    eventType: 'FACTORY_CREATED',
    target: factory.id,
    metadata: { action: 'create', factoryId: factory.id, companyProfileId: companyProfile.id },
    userId,
    ipAddress,
  });

  return factory;
}

export async function updateFactory(userId: string, id: string, input: FactoryInput, ipAddress?: string) {
  const existing = await prisma.factory.findFirst({ where: { id, ownerUserId: userId } });
  if (!existing) throw new Error('کارخانه یافت نشد.');

  const factory = await prisma.factory.update({
    where: { id: existing.id },
    data: {
      name: input.name,
      province: input.province,
      city: input.city,
      address: input.address,
      landAreaSqm: normalizeDecimal(input.landAreaSqm),
      landOwnershipType: input.landOwnershipType,
      monthlyRentAmount: normalizeDecimal(input.monthlyRentAmount),
      batchingPlantCount: input.batchingPlantCount,
      batchingPlantType: input.batchingPlantType,
      batchingPlantBrand: input.batchingPlantBrand,
      dailyProductionCapacityM3: normalizeDecimal(input.dailyProductionCapacityM3),
      cementSiloCount: input.cementSiloCount,
      cementSiloCapacityTons: normalizeDecimal(input.cementSiloCapacityTons),
      hasWaterWell: Boolean(input.hasWaterWell),
      hasLaboratory: Boolean(input.hasLaboratory),
      hasWeighbridge: Boolean(input.hasWeighbridge),
      cementPurchaseSource: input.cementPurchaseSource ?? 'MIXED',
      operationalStatus: input.operationalStatus ?? 'ACTIVE',
      notes: input.notes,
    },
  });

  await writeAuditLog({
    eventType: 'FACTORY_UPDATED',
    target: factory.id,
    metadata: { action: 'update', factoryId: factory.id, companyProfileId: factory.companyProfileId },
    userId,
    ipAddress,
  });

  return factory;
}

export async function deleteFactory(userId: string, id: string, ipAddress?: string) {
  const existing = await prisma.factory.findFirst({ where: { id, ownerUserId: userId } });
  if (!existing) throw new Error('کارخانه یافت نشد.');

  await prisma.factory.delete({ where: { id: existing.id } });
  await writeAuditLog({
    eventType: 'FACTORY_DELETED',
    target: existing.id,
    metadata: { action: 'delete', factoryId: existing.id, companyProfileId: existing.companyProfileId },
    userId,
    ipAddress,
  });

  return { message: 'کارخانه حذف شد.' };
}
