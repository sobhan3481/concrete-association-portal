import { prisma } from '../config/prisma.js';

export async function writeAuditLog(params: {
  eventType: string;
  target: string;
  metadata: unknown;
  userId?: string;
  ipAddress?: string;
}) {
  await prisma.auditLog.create({
    data: {
      eventType: params.eventType,
      target: params.target,
      metadata: params.metadata as object,
      userId: params.userId,
      ipAddress: params.ipAddress,
    },
  });
}
