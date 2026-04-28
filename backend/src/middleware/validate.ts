import { NextFunction, Request, Response } from 'express';
import { z, ZodSchema } from 'zod';

export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ message: 'ورودی نامعتبر است.', errors: result.error.flatten() });
      return;
    }

    req.body = result.data;
    next();
  };
}

const optionalTrimmed = z.string().trim().max(500).optional().or(z.literal('').transform(() => undefined));

export const requestOtpSchema = z.object({ mobileNumber: z.string().trim().min(1) });
export const verifyOtpSchema = z.object({ mobileNumber: z.string().trim().min(1), code: z.string().trim().min(4).max(6) });
export const registerSchema = z.object({
  mobileNumber: z.string().trim().min(1),
  fullName: z.string().trim().min(3).max(120),
  password: z.string().min(8).max(72),
});
export const loginSchema = z.object({ login: z.string().trim().min(1), password: z.string().min(8).max(72) });

export const memberProfileSchema = z.object({
  memberType: z.enum(['INDIVIDUAL', 'LEGAL_ENTITY']),
  fullName: z.string().trim().min(3).max(120),
  nationalCode: z.string().trim().regex(/^\d{10}$/, 'کد ملی باید ۱۰ رقم باشد.').optional().or(z.literal('').transform(() => undefined)),
  positionTitle: z.string().trim().max(80).optional().or(z.literal('').transform(() => undefined)),
});

export const companyProfileSchema = z.object({
  companyName: z.string().trim().min(2).max(160),
  brandName: z.string().trim().max(160).optional().or(z.literal('').transform(() => undefined)),
  nationalId: z.string().trim().max(20).optional().or(z.literal('').transform(() => undefined)),
  registrationNumber: z.string().trim().max(40).optional().or(z.literal('').transform(() => undefined)),
  phone: z.string().trim().max(20).optional().or(z.literal('').transform(() => undefined)),
  province: z.string().trim().min(2).max(80),
  city: z.string().trim().min(2).max(80),
  address: z.string().trim().min(5).max(500),
  postalCode: z.string().trim().regex(/^\d{10}$/, 'کد پستی باید ۱۰ رقم باشد.').optional().or(z.literal('').transform(() => undefined)),
  logoUrl: z.string().trim().url('آدرس لوگو معتبر نیست.').max(500).optional().or(z.literal('').transform(() => undefined)),
  description: optionalTrimmed,
});


const optionalPositive = z.coerce.number().positive().optional();
const optionalNonNegativeInt = z.coerce.number().int().min(0).optional();

export const factorySchema = z.object({
  name: z.string().trim().min(2).max(160),
  province: z.string().trim().min(2).max(80),
  city: z.string().trim().min(2).max(80),
  address: z.string().trim().min(5).max(500),
  landAreaSqm: optionalPositive,
  landOwnershipType: z.enum(['OWNED', 'RENTED', 'PARTNERSHIP', 'OTHER']),
  monthlyRentAmount: optionalPositive,
  batchingPlantCount: optionalNonNegativeInt,
  batchingPlantType: z.enum(['WET', 'DRY', 'HYBRID']).optional(),
  batchingPlantBrand: z.string().trim().max(120).optional().or(z.literal('').transform(() => undefined)),
  dailyProductionCapacityM3: optionalPositive,
  cementSiloCount: optionalNonNegativeInt,
  cementSiloCapacityTons: optionalPositive,
  hasWaterWell: z.boolean().default(false),
  hasLaboratory: z.boolean().default(false),
  hasWeighbridge: z.boolean().default(false),
  cementPurchaseSource: z.enum(['COMMODITY_EXCHANGE', 'FREE_MARKET', 'MIXED']).default('MIXED'),
  operationalStatus: z.enum(['ACTIVE', 'SEMI_ACTIVE', 'INACTIVE']).default('ACTIVE'),
  notes: z.string().trim().max(1000).optional().or(z.literal('').transform(() => undefined)),
});


const currentYear = new Date().getFullYear();
const optionalMoney = z.coerce.number().positive().optional();

export const machinerySchema = z.object({
  machineryType: z.enum(['LOADER', 'MIXER', 'DUMP_TRUCK', 'STATIONARY_PUMP', 'BOOM_PUMP']),
  ownershipType: z.enum(['OWNED', 'RENTED', 'LEASED', 'OTHER']),
  title: z.string().trim().min(2).max(160),
  quantity: z.coerce.number().int().min(1),
  brand: z.string().trim().max(100).optional().or(z.literal('').transform(() => undefined)),
  model: z.string().trim().max(100).optional().or(z.literal('').transform(() => undefined)),
  manufactureYear: z.coerce.number().int().min(1970).max(currentYear + 1).optional(),
  capacityValue: z.coerce.number().positive().optional(),
  capacityUnit: z.string().trim().max(30).optional().or(z.literal('').transform(() => undefined)),
  boomLengthMeters: z.coerce.number().positive().optional(),
  monthlyRentAmount: optionalMoney,
  depreciationMonthlyAmount: optionalMoney,
  fuelCostMonthly: optionalMoney,
  maintenanceCostMonthly: optionalMoney,
  driverOrOperatorCostMonthly: optionalMoney,
  isActive: z.boolean().default(true),
  notes: z.string().trim().max(1000).optional().or(z.literal('').transform(() => undefined)),
});


export const materialSchema = z.object({
  materialType: z.enum(['CEMENT', 'COARSE_AGGREGATE', 'FINE_AGGREGATE', 'WATER', 'ADMIXTURE', 'GEL', 'POZZOLAN', 'SLAG', 'OTHER']),
  name: z.string().trim().min(2).max(160),
  unit: z.enum(['KG', 'TON', 'LITER', 'CUBIC_METER', 'UNIT']),
  unitPrice: z.coerce.number().positive(),
  supplierName: z.string().trim().max(120).optional().or(z.literal('').transform(() => undefined)),
  purchaseSource: z.enum(['COMMODITY_EXCHANGE', 'FREE_MARKET', 'DIRECT_SUPPLIER', 'INTERNAL', 'OTHER']).optional(),
  isActive: z.boolean().default(true),
  notes: z.string().trim().max(1000).optional().or(z.literal('').transform(() => undefined)),
});

export const mixDesignSchema = z.object({
  title: z.string().trim().min(2).max(160),
  concreteGrade: z.coerce.number().int().min(100).max(500),
  resistanceClass: z.string().trim().max(20).optional().or(z.literal('').transform(() => undefined)),
  slumpMm: z.coerce.number().int().min(0).optional(),
  targetStrengthMpa: z.coerce.number().positive().optional(),
  wasteFactorPercent: z.coerce.number().min(0).optional().default(0),
  labCostPerM3: z.coerce.number().min(0).optional().default(0),
  isActive: z.boolean().default(true),
  notes: z.string().trim().max(1000).optional().or(z.literal('').transform(() => undefined)),
});

export const mixDesignItemsSchema = z.object({
  items: z.array(z.object({
    materialId: z.string().min(1),
    quantity: z.coerce.number().positive(),
    unit: z.enum(['KG', 'TON', 'LITER', 'CUBIC_METER', 'UNIT']),
  })).min(1),
});
