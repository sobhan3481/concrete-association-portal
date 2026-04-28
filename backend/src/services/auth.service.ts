import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env.js';
import { prisma } from '../config/prisma.js';
import { sha256, generateOtpCode } from '../utils/crypto.js';
import { isValidMobile, normalizeMobile } from '../utils/mobile.js';
import { writeAuditLog } from './audit.service.js';
import { JwtPayload } from '../types/auth.js';

const OTP_EXPIRATION_SECONDS = 120;
const OTP_RESEND_SECONDS = 60;
const OTP_MAX_ATTEMPTS = 5;

function signAccessToken(payload: JwtPayload): string {
  const options: SignOptions = { expiresIn: env.jwtExpiresIn as SignOptions['expiresIn'] };
  return jwt.sign(payload, env.jwtSecret, options);
}

function createRefreshToken(): string {
  return crypto.randomUUID() + crypto.randomUUID();
}

import crypto from 'crypto';

export async function requestOtp(mobileInput: string, ipAddress?: string) {
  if (!isValidMobile(mobileInput)) throw new Error('شماره موبایل معتبر نیست.');

  const mobile = normalizeMobile(mobileInput);
  const last = await prisma.otpRequest.findFirst({
    where: { mobileNumber: mobile },
    orderBy: { createdAt: 'desc' },
  });

  if (last && Date.now() - last.createdAt.getTime() < OTP_RESEND_SECONDS * 1000) {
    throw new Error('درخواست بیش از حد مجاز است. لطفاً کمی بعد تلاش کنید.');
  }

  const code = generateOtpCode();
  await prisma.otpRequest.create({
    data: {
      mobileNumber: mobile,
      otpHash: sha256(code),
      expiresAt: new Date(Date.now() + OTP_EXPIRATION_SECONDS * 1000),
      maxAttempts: OTP_MAX_ATTEMPTS,
    },
  });

  if (env.nodeEnv === 'development') {
    console.log(`DEV OTP for ${mobile}: ${code}`);
  }

  await writeAuditLog({ eventType: 'OTP_REQUESTED', target: mobile, metadata: { mobile }, ipAddress });
}

export async function verifyOtp(mobileInput: string, code: string, ipAddress?: string) {
  const mobile = normalizeMobile(mobileInput);
  const otp = await prisma.otpRequest.findFirst({
    where: { mobileNumber: mobile, isVerified: false },
    orderBy: { createdAt: 'desc' },
  });

  if (!otp || otp.expiresAt.getTime() < Date.now()) throw new Error('کد تأیید منقضی شده است.');
  if (otp.attemptCount >= otp.maxAttempts) throw new Error('تعداد تلاش بیش از حد مجاز است.');

  const passed = sha256(code) === otp.otpHash;
  await prisma.otpRequest.update({
    where: { id: otp.id },
    data: {
      attemptCount: { increment: 1 },
      isVerified: passed,
      verifiedAt: passed ? new Date() : null,
    },
  });

  if (!passed) throw new Error('کد تأیید نادرست است.');

  await prisma.mobileVerification.upsert({
    where: { mobileNumber: mobile },
    update: { verifiedAt: new Date() },
    create: { mobileNumber: mobile, verifiedAt: new Date() },
  });

  await writeAuditLog({ eventType: 'OTP_VERIFIED', target: mobile, metadata: { mobile }, ipAddress });
}

export async function register(data: { mobileNumber: string; fullName: string; password: string }, ipAddress?: string) {
  const mobile = normalizeMobile(data.mobileNumber);
  if (!isValidMobile(mobile)) throw new Error('شماره موبایل معتبر نیست.');

  const verification = await prisma.mobileVerification.findUnique({ where: { mobileNumber: mobile } });
  if (env.authRequireOtpForRegistration && (!verification || Date.now() - verification.verifiedAt.getTime() > 15 * 60 * 1000)) {
    throw new Error('ابتدا شماره موبایل را تأیید کنید.');
  }

  const exists = await prisma.user.findUnique({ where: { mobileNumber: mobile } });
  if (exists) throw new Error('این شماره قبلاً ثبت شده است.');

  const username = await generateUsername();
  const passwordHash = await bcrypt.hash(data.password, 12);
  const memberRole = await prisma.role.findUniqueOrThrow({ where: { name: 'MEMBER' } });

  const user = await prisma.user.create({
    data: {
      username,
      fullName: data.fullName.trim(),
      mobileNumber: mobile,
      passwordHash,
      isMobileVerified: Boolean(verification),
      userRoles: { create: [{ roleId: memberRole.id }] },
    },
    include: { userRoles: { include: { role: true } } },
  });

  const roles = user.userRoles.map((x: { role: { name: string } }) => x.role.name);
  const accessToken = signAccessToken({ sub: user.id, username: user.username, mobileNumber: user.mobileNumber, roles });
  const refreshToken = createRefreshToken();
  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: sha256(refreshToken),
      expiresAt: new Date(Date.now() + env.jwtRefreshDays * 24 * 60 * 60 * 1000),
    },
  });

  await writeAuditLog({ eventType: 'USER_REGISTERED', target: user.mobileNumber, metadata: { userId: user.id }, userId: user.id, ipAddress });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      mobileNumber: user.mobileNumber,
      roles,
    },
  };
}

export async function login(data: { login: string; password: string }, ipAddress?: string) {
  const candidateMobile = normalizeMobile(data.login);
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ mobileNumber: candidateMobile }, { username: data.login.trim() }],
    },
    include: { userRoles: { include: { role: true } } },
  });

  if (!user || !(await bcrypt.compare(data.password, user.passwordHash))) {
    await writeAuditLog({ eventType: 'LOGIN_FAILURE', target: data.login, metadata: { login: data.login }, ipAddress });
    throw new Error('نام کاربری/رمز عبور نادرست است.');
  }

  const roles = user.userRoles.map((x: { role: { name: string } }) => x.role.name);
  const accessToken = signAccessToken({ sub: user.id, username: user.username, mobileNumber: user.mobileNumber, roles });
  const refreshToken = createRefreshToken();

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: sha256(refreshToken),
      expiresAt: new Date(Date.now() + env.jwtRefreshDays * 24 * 60 * 60 * 1000),
    },
  });

  await writeAuditLog({ eventType: 'LOGIN_SUCCESS', target: data.login, metadata: { userId: user.id }, userId: user.id, ipAddress });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      mobileNumber: user.mobileNumber,
      roles,
    },
  };
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { userRoles: { include: { role: true } } },
  });

  if (!user) throw new Error('کاربر یافت نشد.');

  return {
    id: user.id,
    username: user.username,
    fullName: user.fullName,
    mobileNumber: user.mobileNumber,
    roles: user.userRoles.map((x: { role: { name: string } }) => x.role.name),
  };
}

async function generateUsername(): Promise<string> {
  for (let i = 0; i < 10; i += 1) {
    const candidate = `ca${Math.floor(100000 + Math.random() * 900000)}`;
    const exists = await prisma.user.findUnique({ where: { username: candidate } });
    if (!exists) return candidate;
  }
  return `ca${crypto.randomUUID().replace(/-/g, '').slice(0, 10)}`;
}
