import dotenv from 'dotenv';
dotenv.config();

import { createServer } from 'http';
import app, { initializeApp } from './app';
import { initializeSocketService } from './services/socketService';
import { logger } from './utils/logger';

const PORT = Number(process.env.PORT || 5000);
const HOST = process.env.HOST || '0.0.0.0';

const startServer = async () => {
  try {
    await initializeApp();
    
    const server = createServer(app);
    initializeSocketService(server);
    
    server.listen(PORT, HOST as string, () => {
      logger.info(`TaskFlow server running on ${HOST}:${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV}`);
      logger.info('WebSocket server initialized');
    });

    const gracefulShutdown = () => {
      logger.info('Shutting down gracefully...');
      server.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();