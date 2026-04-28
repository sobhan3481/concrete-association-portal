import { prisma } from '../config/prisma.js';
import { writeAuditLog } from './audit.service.js';

type CompanyProfileInput = {
  companyName: string;
  brandName?: string;
  nationalId?: string;
  registrationNumber?: string;
  phone?: string;
  province: string;
  city: string;
  address: string;
  postalCode?: string;
  logoUrl?: string;
  description?: string;
};

export async function getMyCompanyProfile(userId: string) {
  const profile = await prisma.companyProfile.findUnique({ where: { userId } });
  if (!profile) {
    return {
      companyName: '',
      brandName: null,
      nationalId: null,
      registrationNumber: null,
      phone: null,
      province: '',
      city: '',
      address: '',
      postalCode: null,
      logoUrl: null,
      description: null,
      companyStatus: 'DRAFT',
    };
  }

  return profile;
}

export async function upsertMyCompanyProfile(userId: string, input: CompanyProfileInput, ipAddress?: string) {
  const memberProfile = await prisma.memberProfile.findUnique({ where: { userId } });
  const companyStatus = input.companyName && input.province && input.city && input.address ? 'SUBMITTED' : 'DRAFT';
  const existing = await prisma.companyProfile.findUnique({ where: { userId } });

  const profile = await prisma.companyProfile.upsert({
    where: { userId },
    update: {
      memberProfileId: memberProfile?.id,
      companyName: input.companyName,
      brandName: input.brandName,
      nationalId: input.nationalId,
      registrationNumber: input.registrationNumber,
      phone: input.phone,
      province: input.province,
      city: input.city,
      address: input.address,
      postalCode: input.postalCode,
      logoUrl: input.logoUrl,
      description: input.description,
      companyStatus,
    },
    create: {
      userId,
      memberProfileId: memberProfile?.id,
      companyName: input.companyName,
      brandName: input.brandName,
      nationalId: input.nationalId,
      registrationNumber: input.registrationNumber,
      phone: input.phone,
      province: input.province,
      city: input.city,
      address: input.address,
      postalCode: input.postalCode,
      logoUrl: input.logoUrl,
      description: input.description,
      companyStatus,
    },
  });

  await writeAuditLog({
    eventType: existing ? 'COMPANY_PROFILE_UPDATED' : 'COMPANY_PROFILE_CREATED',
    target: userId,
    metadata: { companyProfileId: profile.id, companyStatus },
    userId,
    ipAddress,
  });

  return profile;
}
