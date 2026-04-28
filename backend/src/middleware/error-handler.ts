import { NextFunction, Request, Response } from 'express';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  const message = err instanceof Error ? err.message : 'خطای داخلی سرور رخ داد.';
  const status = /یافت نشد/.test(message)
    ? 404
    : /نامعتبر|منقضی|نادرست|ابتدا|بیش از حد|قبلاً/.test(message)
      ? 400
      : 500;
  res.status(status).json({ message });
}
