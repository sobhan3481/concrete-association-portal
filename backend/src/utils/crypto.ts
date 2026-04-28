import crypto from 'crypto';

export function sha256(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex');
}

export function generateOtpCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}
