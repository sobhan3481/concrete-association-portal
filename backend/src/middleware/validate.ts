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

export const requestOtpSchema = z.object({ mobileNumber: z.string().min(1) });
export const verifyOtpSchema = z.object({ mobileNumber: z.string().min(1), code: z.string().min(4).max(6) });
export const registerSchema = z.object({
  mobileNumber: z.string().min(1),
  fullName: z.string().min(3),
  password: z.string().min(8),
});
export const loginSchema = z.object({ login: z.string().min(1), password: z.string().min(8) });
