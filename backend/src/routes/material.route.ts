import { Router } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';
import { materialSchema, validateBody } from '../middleware/validate.js';
import { createMaterial, deleteMaterial, getMaterial, listMaterials, updateMaterial } from '../services/material.service.js';

export const factoryMaterialRouter = Router({ mergeParams: true });
export const materialRouter = Router();

factoryMaterialRouter.get('/', requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const items = await listMaterials(req.params.factoryId, req.user!.sub);
    res.json(items);
  } catch (error) {
    next(error);
  }
});

factoryMaterialRouter.post('/', requireAuth, validateBody(materialSchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    const item = await createMaterial(req.params.factoryId, req.user!.sub, req.body, req.ip);
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
});

materialRouter.get('/:id', requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    res.json(await getMaterial(req.params.id, req.user!.sub));
  } catch (error) {
    next(error);
  }
});

materialRouter.put('/:id', requireAuth, validateBody(materialSchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    res.json(await updateMaterial(req.params.id, req.user!.sub, req.body, req.ip));
  } catch (error) {
    next(error);
  }
});

materialRouter.delete('/:id', requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    res.json(await deleteMaterial(req.params.id, req.user!.sub, req.ip));
  } catch (error) {
    next(error);
  }
});
