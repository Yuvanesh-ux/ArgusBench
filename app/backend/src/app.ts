import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import rateLimit from 'express-rate-limit';
import { connectRedis } from './database/connection';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';
import { securityMiddleware } from './middleware/security';
import { loggingMiddleware } from './middleware/logging';
import routes from './routes';

const app = express();

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '15') * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX || '100'),
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(cors({
  origin: '*',
  credentials: true,
}));

app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(securityMiddleware);
app.use(loggingMiddleware);

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api', routes);

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

app.use(errorHandler);

export const initializeApp = async () => {
  try {
    await connectRedis();
    logger.info('Database and Redis connections established');
  } catch (error) {
    logger.error('Failed to initialize app:', error);
    process.exit(1);
  }
};

export default app;