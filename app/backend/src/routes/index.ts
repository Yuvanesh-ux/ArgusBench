import { Router } from 'express';
import authRoutes from './auth';
import userRoutes from './users';
import projectRoutes from './projects';
import taskRoutes from './tasks';
import commentRoutes from './comments';
import fileRoutes from './files';
import aiRoutes from './ai';
import webhookRoutes from './webhooks';
import mlRoutes from './ml';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/projects', projectRoutes);
router.use('/tasks', taskRoutes);
router.use('/comments', commentRoutes);
router.use('/files', fileRoutes);
router.use('/ai', aiRoutes);
router.use('/webhooks', webhookRoutes);
router.use('/ml', mlRoutes);

export default router;