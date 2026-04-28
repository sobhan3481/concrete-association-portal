import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { getMe, login, register, requestOtp, verifyOtp } from '../services/auth.service.js';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';
import { loginSchema, registerSchema, requestOtpSchema, validateBody, verifyOtpSchema } from '../middleware/validate.js';

export const authRouter = Router();

const otpLimiter = rateLimit({ windowMs: 60_000, limit: 3, standardHeaders: true, legacyHeaders: false });
const loginLimiter = rateLimit({ windowMs: 60_000, limit: 5, standardHeaders: true, legacyHeaders: false });

authRouter.post('/request-otp', otpLimiter, validateBody(requestOtpSchema), async (req, res, next) => {
  try {
    await requestOtp(req.body.mobileNumber, req.ip);
    res.json({ message: 'کد تأیید ارسال شد.' });
  } catch (error) {
    next(error);
  }
});

authRouter.post('/verify-otp', validateBody(verifyOtpSchema), async (req, res, next) => {
  try {
    await verifyOtp(req.body.mobileNumber, req.body.code, req.ip);
    res.json({ message: 'شماره موبایل تأیید شد.' });
  } catch (error) {
    next(error);
  }
});

authRouter.post('/register', validateBody(registerSchema), async (req, res, next) => {
  try {
    const result = await register(req.body, req.ip);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

authRouter.post('/login', loginLimiter, validateBody(loginSchema), async (req, res, next) => {
  try {
    const result = await login(req.body, req.ip);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

authRouter.get('/me', requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const me = await getMe(req.user!.sub);
    res.json(me);
  } catch (error) {
    next(error);
  }
});
