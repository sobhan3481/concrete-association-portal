import { prisma } from '../config/prisma.js';
import { writeAuditLog } from './audit.service.js';

type MemberProfileInput = {
  memberType: 'INDIVIDUAL' | 'LEGAL_ENTITY';
  fullName: string;
  nationalCode?: string;
  positionTitle?: string;
};

export async function getMyMemberProfile(userId: string) {
  const profile = await prisma.memberProfile.findUnique({ where: { userId } });
  if (!profile) {
    return {
      memberType: null,
      fullName: '',
      nationalCode: null,
      positionTitle: null,
      profileStatus: 'INCOMPLETE',
      approvalStatus: 'PENDING_REVIEW',
      rejectionReason: null,
    };
  }

  return profile;
}

export async function upsertMyMemberProfile(userId: string, input: MemberProfileInput, ipAddress?: string) {
  const profileStatus = input.fullName && input.memberType ? 'COMPLETE' : 'INCOMPLETE';
  const approvalStatus = 'PENDING_REVIEW';

  const existing = await prisma.memberProfile.findUnique({ where: { userId } });
  const profile = await prisma.memberProfile.upsert({
    where: { userId },
    update: {
      memberType: input.memberType,
      fullName: input.fullName,
      nationalCode: input.nationalCode,
      positionTitle: input.positionTitle,
      profileStatus,
      approvalStatus,
      rejectionReason: null,
    },
    create: {
      userId,
      memberType: input.memberType,
      fullName: input.fullName,
      nationalCode: input.nationalCode,
      positionTitle: input.positionTitle,
      profileStatus,
      approvalStatus,
    },
  });

  await writeAuditLog({
    eventType: existing ? 'MEMBER_PROFILE_UPDATED' : 'MEMBER_PROFILE_CREATED',
    target: userId,
    metadata: { memberProfileId: profile.id, profileStatus, approvalStatus },
    userId,
    ipAddress,
  });

  return profile;
}
