import { Router } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';
import { memberProfileSchema, validateBody } from '../middleware/validate.js';
import { getMyMemberProfile, upsertMyMemberProfile } from '../services/member-profile.service.js';

export const memberProfileRouter = Router();

memberProfileRouter.get('/me', requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const profile = await getMyMemberProfile(req.user!.sub);
    res.json(profile);
  } catch (error) {
    next(error);
  }
});

memberProfileRouter.put('/me', requireAuth, validateBody(memberProfileSchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    const profile = await upsertMyMemberProfile(req.user!.sub, req.body, req.ip);
    res.json(profile);
  } catch (error) {
    next(error);
  }
});
