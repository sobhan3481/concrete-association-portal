import { Router } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';
import { mixDesignItemsSchema, mixDesignSchema, validateBody } from '../middleware/validate.js';
import { createMixDesign, deleteMixDesign, getMixDesign, listMixDesigns, updateMixDesign, updateMixDesignItems } from '../services/mix-design.service.js';

export const factoryMixDesignRouter = Router({ mergeParams: true });
export const mixDesignRouter = Router();

factoryMixDesignRouter.get('/', requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    res.json(await listMixDesigns(req.params.factoryId, req.user!.sub));
  } catch (error) {
    next(error);
  }
});

factoryMixDesignRouter.post('/', requireAuth, validateBody(mixDesignSchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    res.status(201).json(await createMixDesign(req.params.factoryId, req.user!.sub, req.body, req.ip));
  } catch (error) {
    next(error);
  }
});

mixDesignRouter.get('/:id', requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    res.json(await getMixDesign(req.params.id, req.user!.sub));
  } catch (error) {
    next(error);
  }
});

mixDesignRouter.put('/:id', requireAuth, validateBody(mixDesignSchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    res.json(await updateMixDesign(req.params.id, req.user!.sub, req.body, req.ip));
  } catch (error) {
    next(error);
  }
});

mixDesignRouter.delete('/:id', requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    res.json(await deleteMixDesign(req.params.id, req.user!.sub, req.ip));
  } catch (error) {
    next(error);
  }
});

mixDesignRouter.put('/:id/items', requireAuth, validateBody(mixDesignItemsSchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    res.json(await updateMixDesignItems(req.params.id, req.user!.sub, req.body.items, req.ip));
  } catch (error) {
    next(error);
  }
});

mixDesignRouter.get('/:id/items', requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const design = await getMixDesign(req.params.id, req.user!.sub);
    res.json(design.items);
  } catch (error) {
    next(error);
  }
});
