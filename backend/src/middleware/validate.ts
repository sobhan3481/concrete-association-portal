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
