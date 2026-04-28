import { prisma } from '../config/prisma.js';
import { writeAuditLog } from './audit.service.js';

type MixDesignInput = {
  title: string;
  concreteGrade: number;
  resistanceClass?: string;
  slumpMm?: number;
  targetStrengthMpa?: number;
  wasteFactorPercent?: number;
  labCostPerM3?: number;
  isActive?: boolean;
  notes?: string;
};

type MixItemInput = { materialId: string; quantity: number; unit: 'KG' | 'TON' | 'LITER' | 'CUBIC_METER' | 'UNIT' };

async function requireOwnedFactory(factoryId: string, userId: string) {
  const factory = await prisma.factory.findFirst({ where: { id: factoryId, ownerUserId: userId } });
  if (!factory) throw new Error('کارخانه یافت نشد.');
}

function calcItemTotal(materialUnit: string, unit: string, qty: number, unitPrice: number) {
  if (materialUnit === unit) return qty * unitPrice;
  if (materialUnit === 'TON' && unit === 'KG') return (qty / 1000) * unitPrice;
  if (materialUnit === 'KG' && unit === 'TON') return (qty * 1000) * unitPrice;
  throw new Error('واحد ماده با واحد آیتم سازگار نیست.');
}

export async function listMixDesigns(factoryId: string, userId: string) {
  await requireOwnedFactory(factoryId, userId);
  return prisma.mixDesign.findMany({ where: { factoryId, ownerUserId: userId }, orderBy: { createdAt: 'desc' } });
}

export async function createMixDesign(factoryId: string, userId: string, input: MixDesignInput, ipAddress?: string) {
  await requireOwnedFactory(factoryId, userId);
  const design = await prisma.mixDesign.create({
    data: {
      factoryId,
      ownerUserId: userId,
      ...input,
      targetStrengthMpa: input.targetStrengthMpa?.toString(),
      wasteFactorPercent: (input.wasteFactorPercent ?? 0).toString(),
      labCostPerM3: (input.labCostPerM3 ?? 0).toString(),
      directMaterialCostPerM3: '0',
      calculatedCostPerM3: '0',
      isActive: input.isActive ?? true,
    },
  });
  await writeAuditLog({ eventType: 'MIX_DESIGN_CREATED', target: design.id, metadata: { factoryId, mixDesignId: design.id }, userId, ipAddress });
  return design;
}

export async function getMixDesign(id: string, userId: string) {
  const design = await prisma.mixDesign.findFirst({ where: { id, ownerUserId: userId }, include: { items: true } });
  if (!design) throw new Error('طرح اختلاط یافت نشد.');
  return design;
}

export async function updateMixDesign(id: string, userId: string, input: MixDesignInput, ipAddress?: string) {
  const existing = await prisma.mixDesign.findFirst({ where: { id, ownerUserId: userId } });
  if (!existing) throw new Error('طرح اختلاط یافت نشد.');
  const design = await prisma.mixDesign.update({ where: { id }, data: { ...input, targetStrengthMpa: input.targetStrengthMpa?.toString(), wasteFactorPercent: (input.wasteFactorPercent ?? 0).toString(), labCostPerM3: (input.labCostPerM3 ?? 0).toString(), isActive: input.isActive ?? true } });
  await writeAuditLog({ eventType: 'MIX_DESIGN_UPDATED', target: id, metadata: { factoryId: design.factoryId, mixDesignId: id }, userId, ipAddress });
  return design;
}

export async function deleteMixDesign(id: string, userId: string, ipAddress?: string) {
  const existing = await prisma.mixDesign.findFirst({ where: { id, ownerUserId: userId } });
  if (!existing) throw new Error('طرح اختلاط یافت نشد.');
  await prisma.mixDesign.delete({ where: { id } });
  await writeAuditLog({ eventType: 'MIX_DESIGN_DELETED', target: id, metadata: { factoryId: existing.factoryId, mixDesignId: id }, userId, ipAddress });
  return { message: 'طرح اختلاط حذف شد.' };
}

export async function updateMixDesignItems(id: string, userId: string, items: MixItemInput[], ipAddress?: string) {
  const design = await prisma.mixDesign.findFirst({ where: { id, ownerUserId: userId } });
  if (!design) throw new Error('طرح اختلاط یافت نشد.');

  const materials = await prisma.material.findMany({ where: { id: { in: items.map((x) => x.materialId) }, ownerUserId: userId, factoryId: design.factoryId } });
  if (materials.length !== items.length) throw new Error('برخی مواد اولیه معتبر نیستند.');

  let direct = 0;
  const mapped = items.map((it) => {
    const m = materials.find((x) => x.id === it.materialId)!;
    const unitPrice = Number(m.unitPrice);
    const total = calcItemTotal(m.unit, it.unit, it.quantity, unitPrice);
    direct += total;
    return { materialId: it.materialId, quantity: it.quantity.toString(), unit: it.unit, unitPriceSnapshot: unitPrice.toString(), totalCost: total.toString() };
  });

  const wastePercent = Number(design.wasteFactorPercent);
  const labCost = Number(design.labCostPerM3);
  const calculated = direct + labCost + direct * (wastePercent / 100);

  const updated = await prisma.$transaction(async (tx) => {
    await tx.mixDesignItem.deleteMany({ where: { mixDesignId: id } });
    if (mapped.length > 0) await tx.mixDesignItem.createMany({ data: mapped.map((x) => ({ ...x, mixDesignId: id })) });
    return tx.mixDesign.update({ where: { id }, data: { directMaterialCostPerM3: direct.toString(), calculatedCostPerM3: calculated.toString() }, include: { items: true } });
  });

  await writeAuditLog({
    eventType: 'MIX_DESIGN_ITEMS_UPDATED',
    target: id,
    metadata: { factoryId: design.factoryId, mixDesignId: id, directMaterialCostPerM3: direct, calculatedCostPerM3: calculated },
    userId,
    ipAddress,
  });

  return updated;
}
