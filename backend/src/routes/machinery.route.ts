import { Router } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';
import { machinerySchema, validateBody } from '../middleware/validate.js';
import { createMachinery, deleteMachinery, getMachineryById, listMachineryByFactory, updateMachinery } from '../services/machinery.service.js';

export const factoryMachineryRouter = Router({ mergeParams: true });
export const machineryRouter = Router();

factoryMachineryRouter.get('/', requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const items = await listMachineryByFactory(req.params.factoryId, req.user!.sub);
    res.json(items);
  } catch (error) {
    next(error);
  }
});

factoryMachineryRouter.post('/', requireAuth, validateBody(machinerySchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    const item = await createMachinery(req.params.factoryId, req.user!.sub, req.body, req.ip);
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
});

machineryRouter.get('/:id', requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const item = await getMachineryById(req.params.id, req.user!.sub);
    res.json(item);
  } catch (error) {
    next(error);
  }
});

machineryRouter.put('/:id', requireAuth, validateBody(machinerySchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    const item = await updateMachinery(req.params.id, req.user!.sub, req.body, req.ip);
    res.json(item);
  } catch (error) {
    next(error);
  }
});

machineryRouter.delete('/:id', requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const result = await deleteMachinery(req.params.id, req.user!.sub, req.ip);
    res.json(result);
  } catch (error) {
    next(error);
  }
});
