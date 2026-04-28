import dotenv from 'dotenv';

dotenv.config();

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 4000),
  databaseUrl: required('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/concrete_association_dev?schema=public'),
  jwtSecret: required('JWT_SECRET', 'replace_with_very_long_random_secret'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '30m',
  jwtRefreshDays: Number(process.env.JWT_REFRESH_EXPIRES_DAYS ?? '7'),
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
};
