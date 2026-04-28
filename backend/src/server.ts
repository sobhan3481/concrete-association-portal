import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './config/env.js';
import { authRouter } from './routes/auth.route.js';
import { healthRouter } from './routes/health.route.js';
import { memberProfileRouter } from './routes/member-profile.route.js';
import { companyProfileRouter } from './routes/company-profile.route.js';
import { factoryRouter } from './routes/factory.route.js';
import { factoryMachineryRouter, machineryRouter } from './routes/machinery.route.js';
import { factoryMaterialRouter, materialRouter } from './routes/material.route.js';
import { factoryMixDesignRouter, mixDesignRouter } from './routes/mix-design.route.js';
import { errorHandler } from './middleware/error-handler.js';
import { ensureRolesSeeded } from './services/role.service.js';
import { prisma } from './config/prisma.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());

app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/member-profile', memberProfileRouter);
app.use('/api/company-profile', companyProfileRouter);
app.use('/api/factories', factoryRouter);
app.use('/api/factories/:factoryId/machinery', factoryMachineryRouter);
app.use('/api/machinery', machineryRouter);
app.use('/api/factories/:factoryId/materials', factoryMaterialRouter);
app.use('/api/materials', materialRouter);
app.use('/api/factories/:factoryId/mix-designs', factoryMixDesignRouter);
app.use('/api/mix-designs', mixDesignRouter);
app.use(errorHandler);

async function initializeDatabase() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    await ensureRolesSeeded();
    console.log('Database connection and role seeding completed.');
  } catch (error) {
    console.error('Database initialization failed. Backend is running but DB-dependent APIs may fail.');
    console.error('Run: npm run prisma:generate (or prisma:generate:checksum-bypass), then check DATABASE_URL and PostgreSQL.');
    console.error(error);
  }
}

async function bootstrap() {
  app.listen(env.port, () => {
    console.log(`Backend running on http://localhost:${env.port}`);
  });

  await initializeDatabase();
}

bootstrap().catch(async (error) => {
  console.error('Fatal startup error:', error);
  await prisma.$disconnect();
  process.exit(1);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
