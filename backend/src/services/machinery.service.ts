import { prisma } from '../config/prisma.js';
import { writeAuditLog } from './audit.service.js';

type MachineryInput = {
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
  isActive?: boolean;
  notes?: string;
};

function dec(value?: number) {
  return value === undefined ? undefined : value.toString();
}

async function requireOwnedFactory(factoryId: string, userId: string) {
  const factory = await prisma.factory.findFirst({ where: { id: factoryId, ownerUserId: userId } });
  if (!factory) throw new Error('کارخانه یافت نشد.');
  return factory;
}

export async function listMachineryByFactory(factoryId: string, userId: string) {
  await requireOwnedFactory(factoryId, userId);
  return prisma.machinery.findMany({ where: { factoryId, ownerUserId: userId }, orderBy: { createdAt: 'desc' } });
}

export async function createMachinery(factoryId: string, userId: string, input: MachineryInput, ipAddress?: string) {
  const factory = await requireOwnedFactory(factoryId, userId);

  const machinery = await prisma.machinery.create({
    data: {
      factoryId: factory.id,
      ownerUserId: userId,
      machineryType: input.machineryType,
      ownershipType: input.ownershipType,
      title: input.title,
      quantity: input.quantity,
      brand: input.brand,
      model: input.model,
      manufactureYear: input.manufactureYear,
      capacityValue: dec(input.capacityValue),
      capacityUnit: input.capacityUnit,
      boomLengthMeters: dec(input.boomLengthMeters),
      monthlyRentAmount: dec(input.monthlyRentAmount),
      depreciationMonthlyAmount: dec(input.depreciationMonthlyAmount),
      fuelCostMonthly: dec(input.fuelCostMonthly),
      maintenanceCostMonthly: dec(input.maintenanceCostMonthly),
      driverOrOperatorCostMonthly: dec(input.driverOrOperatorCostMonthly),
      isActive: input.isActive ?? true,
      notes: input.notes,
    },
  });

  await writeAuditLog({
    eventType: 'MACHINERY_CREATED',
    target: machinery.id,
    metadata: { action: 'create', machineryId: machinery.id, factoryId: machinery.factoryId, machineryType: machinery.machineryType },
    userId,
    ipAddress,
  });

  return machinery;
}

export async function getMachineryById(id: string, userId: string) {
  const machinery = await prisma.machinery.findFirst({ where: { id, ownerUserId: userId } });
  if (!machinery) throw new Error('ماشین‌آلات یافت نشد.');
  return machinery;
}

export async function updateMachinery(id: string, userId: string, input: MachineryInput, ipAddress?: string) {
  const existing = await prisma.machinery.findFirst({ where: { id, ownerUserId: userId } });
  if (!existing) throw new Error('ماشین‌آلات یافت نشد.');

  await requireOwnedFactory(existing.factoryId, userId);

  const machinery = await prisma.machinery.update({
    where: { id: existing.id },
    data: {
      machineryType: input.machineryType,
      ownershipType: input.ownershipType,
      title: input.title,
      quantity: input.quantity,
      brand: input.brand,
      model: input.model,
      manufactureYear: input.manufactureYear,
      capacityValue: dec(input.capacityValue),
      capacityUnit: input.capacityUnit,
      boomLengthMeters: dec(input.boomLengthMeters),
      monthlyRentAmount: dec(input.monthlyRentAmount),
      depreciationMonthlyAmount: dec(input.depreciationMonthlyAmount),
      fuelCostMonthly: dec(input.fuelCostMonthly),
      maintenanceCostMonthly: dec(input.maintenanceCostMonthly),
      driverOrOperatorCostMonthly: dec(input.driverOrOperatorCostMonthly),
      isActive: input.isActive ?? true,
      notes: input.notes,
    },
  });

  await writeAuditLog({
    eventType: 'MACHINERY_UPDATED',
    target: machinery.id,
    metadata: { action: 'update', machineryId: machinery.id, factoryId: machinery.factoryId, machineryType: machinery.machineryType },
    userId,
    ipAddress,
  });

  return machinery;
}

export async function deleteMachinery(id: string, userId: string, ipAddress?: string) {
  const existing = await prisma.machinery.findFirst({ where: { id, ownerUserId: userId } });
  if (!existing) throw new Error('ماشین‌آلات یافت نشد.');

  await prisma.machinery.delete({ where: { id: existing.id } });
  await writeAuditLog({
    eventType: 'MACHINERY_DELETED',
    target: existing.id,
    metadata: { action: 'delete', machineryId: existing.id, factoryId: existing.factoryId, machineryType: existing.machineryType },
    userId,
    ipAddress,
  });

  return { message: 'ماشین‌آلات حذف شد.' };
}
