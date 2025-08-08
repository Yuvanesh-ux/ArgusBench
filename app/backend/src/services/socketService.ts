import { Server as SocketServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import { verifyAccessToken } from '../utils/jwt';
import { ProjectModel } from '../models/Project';
import { logger } from '../utils/logger';

export class SocketService {
  private io: SocketServer;
  private connectedUsers: Map<string, string> = new Map();

  constructor(server: HttpServer) {
    this.io = new SocketServer(server, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
      },
    });

    this.setupMiddleware();
    this.setupEventHandlers();
  }

  private setupMiddleware() {
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          return next(new Error('Authentication required'));
        }

        const decoded = verifyAccessToken(token);
        socket.data.user = decoded;
        
        logger.info(`WebSocket connection authenticated: ${decoded.userId}`);
        next();
      } catch (error) {
        logger.error('WebSocket authentication failed:', error);
        next(new Error('Authentication failed'));
      }
    });
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket) => {
      const userId = socket.data.user.userId;
      
      this.connectedUsers.set(socket.id, userId);
      logger.info(`User connected via WebSocket: ${userId}`);

      socket.on('join-project', async (projectId: string) => {
        try {
          const isMember = await ProjectModel.isMember(projectId, userId);
          if (isMember) {
            socket.join(`project:${projectId}`);
            logger.info(`User ${userId} joined project room: ${projectId}`);
          }
        } catch (error) {
          logger.error('Error joining project room:', error);
        }
      });

      socket.on('leave-project', (projectId: string) => {
        socket.leave(`project:${projectId}`);
        logger.info(`User ${userId} left project room: ${projectId}`);
      });

      socket.on('join-task', async (taskId: string) => {
        try {
          socket.join(`task:${taskId}`);
          logger.info(`User ${userId} joined task room: ${taskId}`);
        } catch (error) {
          logger.error('Error joining task room:', error);
        }
      });

      socket.on('leave-task', (taskId: string) => {
        socket.leave(`task:${taskId}`);
        logger.info(`User ${userId} left task room: ${taskId}`);
      });

      socket.on('typing-start', (data: { taskId: string; commentId?: string }) => {
        socket.to(`task:${data.taskId}`).emit('user-typing', {
          userId,
          userName: `${socket.data.user.firstName} ${socket.data.user.lastName}`,
          taskId: data.taskId,
          commentId: data.commentId,
        });
      });

      socket.on('typing-stop', (data: { taskId: string }) => {
        socket.to(`task:${data.taskId}`).emit('user-stopped-typing', {
          userId,
          taskId: data.taskId,
        });
      });

      socket.on('disconnect', () => {
        this.connectedUsers.delete(socket.id);
        logger.info(`User disconnected from WebSocket: ${userId}`);
      });
    });
  }

  public notifyTaskUpdate(taskId: string, projectId: string, event: string, data: any) {
    this.io.to(`task:${taskId}`).emit('task-updated', {
      event,
      taskId,
      data,
      timestamp: new Date().toISOString(),
    });

    this.io.to(`project:${projectId}`).emit('project-activity', {
      type: 'task-update',
      event,
      taskId,
      data,
      timestamp: new Date().toISOString(),
    });

    logger.info(`WebSocket notification sent - Task ${event}: ${taskId}`);
  }

  public notifyCommentUpdate(commentId: string, taskId: string, projectId: string, event: string, data: any) {
    this.io.to(`task:${taskId}`).emit('comment-updated', {
      event,
      commentId,
      taskId,
      data,
      timestamp: new Date().toISOString(),
    });

    this.io.to(`project:${projectId}`).emit('project-activity', {
      type: 'comment-update',
      event,
      commentId,
      taskId,
      data,
      timestamp: new Date().toISOString(),
    });

    logger.info(`WebSocket notification sent - Comment ${event}: ${commentId}`);
  }

  public notifyProjectUpdate(projectId: string, event: string, data: any) {
    this.io.to(`project:${projectId}`).emit('project-updated', {
      event,
      projectId,
      data,
      timestamp: new Date().toISOString(),
    });

    logger.info(`WebSocket notification sent - Project ${event}: ${projectId}`);
  }

  public notifyUserUpdate(userId: string, event: string, data: any) {
    const userSockets = Array.from(this.connectedUsers.entries())
      .filter(([_, uid]) => uid === userId)
      .map(([socketId]) => socketId);

    userSockets.forEach(socketId => {
      this.io.to(socketId).emit('user-updated', {
        event,
        userId,
        data,
        timestamp: new Date().toISOString(),
      });
    });

    logger.info(`WebSocket notification sent - User ${event}: ${userId}`);
  }

  public notifyFileUpdate(fileId: string, taskId: string, projectId: string, event: string, data: any) {
    if (taskId) {
      this.io.to(`task:${taskId}`).emit('file-updated', {
        event,
        fileId,
        taskId,
        data,
        timestamp: new Date().toISOString(),
      });
    }

    this.io.to(`project:${projectId}`).emit('project-activity', {
      type: 'file-update',
      event,
      fileId,
      taskId,
      data,
      timestamp: new Date().toISOString(),
    });

    logger.info(`WebSocket notification sent - File ${event}: ${fileId}`);
  }

  public getConnectedUsers(): string[] {
    return Array.from(new Set(this.connectedUsers.values()));
  }

  public getConnectionCount(): number {
    return this.connectedUsers.size;
  }
}

let socketService: SocketService | null = null;

export const initializeSocketService = (server: HttpServer): SocketService => {
  socketService = new SocketService(server);
  return socketService;
};

export const getSocketService = (): SocketService => {
  if (!socketService) {
    throw new Error('Socket service not initialized');
  }
  return socketService;
};