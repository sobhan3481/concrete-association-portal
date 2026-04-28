import { prisma } from '../config/prisma.js';
import { writeAuditLog } from './audit.service.js';

type MaterialInput = {
  materialType: 'CEMENT' | 'COARSE_AGGREGATE' | 'FINE_AGGREGATE' | 'WATER' | 'ADMIXTURE' | 'GEL' | 'POZZOLAN' | 'SLAG' | 'OTHER';
  name: string;
  unit: 'KG' | 'TON' | 'LITER' | 'CUBIC_METER' | 'UNIT';
  unitPrice: number;
  supplierName?: string;
  purchaseSource?: 'COMMODITY_EXCHANGE' | 'FREE_MARKET' | 'DIRECT_SUPPLIER' | 'INTERNAL' | 'OTHER';
  isActive?: boolean;
  notes?: string;
};

async function requireOwnedFactory(factoryId: string, userId: string) {
  const factory = await prisma.factory.findFirst({ where: { id: factoryId, ownerUserId: userId } });
  if (!factory) throw new Error('کارخانه یافت نشد.');
  return factory;
}

export async function listMaterials(factoryId: string, userId: string) {
  await requireOwnedFactory(factoryId, userId);
  return prisma.material.findMany({ where: { factoryId, ownerUserId: userId }, orderBy: { createdAt: 'desc' } });
}

export async function createMaterial(factoryId: string, userId: string, input: MaterialInput, ipAddress?: string) {
  await requireOwnedFactory(factoryId, userId);
  const material = await prisma.material.create({ data: { ...input, unitPrice: input.unitPrice.toString(), factoryId, ownerUserId: userId, isActive: input.isActive ?? true } });
  await writeAuditLog({ eventType: 'MATERIAL_CREATED', target: material.id, metadata: { factoryId, materialId: material.id }, userId, ipAddress });
  return material;
}

export async function getMaterial(id: string, userId: string) {
  const material = await prisma.material.findFirst({ where: { id, ownerUserId: userId } });
  if (!material) throw new Error('ماده اولیه یافت نشد.');
  return material;
}

export async function updateMaterial(id: string, userId: string, input: MaterialInput, ipAddress?: string) {
  const existing = await prisma.material.findFirst({ where: { id, ownerUserId: userId } });
  if (!existing) throw new Error('ماده اولیه یافت نشد.');
  const material = await prisma.material.update({ where: { id }, data: { ...input, unitPrice: input.unitPrice.toString(), isActive: input.isActive ?? true } });
  await writeAuditLog({ eventType: 'MATERIAL_UPDATED', target: material.id, metadata: { factoryId: material.factoryId, materialId: material.id }, userId, ipAddress });
  return material;
}

export async function deleteMaterial(id: string, userId: string, ipAddress?: string) {
  const existing = await prisma.material.findFirst({ where: { id, ownerUserId: userId } });
  if (!existing) throw new Error('ماده اولیه یافت نشد.');
  await prisma.material.delete({ where: { id } });
  await writeAuditLog({ eventType: 'MATERIAL_DELETED', target: id, metadata: { factoryId: existing.factoryId, materialId: id }, userId, ipAddress });
  return { message: 'ماده اولیه حذف شد.' };
}
