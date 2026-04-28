import { Router } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';
import { companyProfileSchema, validateBody } from '../middleware/validate.js';
import { getMyCompanyProfile, upsertMyCompanyProfile } from '../services/company-profile.service.js';

export const companyProfileRouter = Router();

companyProfileRouter.get('/me', requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const profile = await getMyCompanyProfile(req.user!.sub);
    res.json(profile);
  } catch (error) {
    next(error);
  }
});

companyProfileRouter.put('/me', requireAuth, validateBody(companyProfileSchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    const profile = await upsertMyCompanyProfile(req.user!.sub, req.body, req.ip);
    res.json(profile);
  } catch (error) {
    next(error);
  }
});
