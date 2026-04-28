import { prisma } from '../config/prisma.js';

const ROLE_NAMES = ['MEMBER', 'ASSOCIATION_ADMIN', 'SYSTEM_ADMIN'] as const;

export async function ensureRolesSeeded() {
  for (const roleName of ROLE_NAMES) {
    await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName },
    });
  }
}
