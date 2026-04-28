import { Router } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';
import { factorySchema, validateBody } from '../middleware/validate.js';
import { createFactory, deleteFactory, getFactoryById, listFactories, updateFactory } from '../services/factory.service.js';

export const factoryRouter = Router();

factoryRouter.get('/', requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const items = await listFactories(req.user!.sub);
    res.json(items);
  } catch (error) {
    next(error);
  }
});

factoryRouter.get('/:id', requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const item = await getFactoryById(req.user!.sub, req.params.id);
    res.json(item);
  } catch (error) {
    next(error);
  }
});

factoryRouter.post('/', requireAuth, validateBody(factorySchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    const item = await createFactory(req.user!.sub, req.body, req.ip);
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
});

factoryRouter.put('/:id', requireAuth, validateBody(factorySchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    const item = await updateFactory(req.user!.sub, req.params.id, req.body, req.ip);
    res.json(item);
  } catch (error) {
    next(error);
  }
});

factoryRouter.delete('/:id', requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const result = await deleteFactory(req.user!.sub, req.params.id, req.ip);
    res.json(result);
  } catch (error) {
    next(error);
  }
});
