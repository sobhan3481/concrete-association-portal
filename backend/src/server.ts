import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './config/env.js';
import { authRouter } from './routes/auth.route.js';
import { healthRouter } from './routes/health.route.js';
import { memberProfileRouter } from './routes/member-profile.route.js';
import { companyProfileRouter } from './routes/company-profile.route.js';
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
app.use(errorHandler);

async function bootstrap() {
  await ensureRolesSeeded();
  app.listen(env.port, () => {
    console.log(`Backend running on http://localhost:${env.port}`);
  });
}

bootstrap().catch(async (error) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
