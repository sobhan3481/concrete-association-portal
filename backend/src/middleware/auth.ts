import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { JwtPayload } from '../types/auth.js';

export type AuthenticatedRequest = Request & {
  user?: JwtPayload;
};

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'توکن ارسال نشده است.' });
    return;
  }

  const token = header.slice(7);
  try {
    req.user = jwt.verify(token, env.jwtSecret) as JwtPayload;
    next();
  } catch {
    res.status(401).json({ message: 'توکن نامعتبر است.' });
  }
}
