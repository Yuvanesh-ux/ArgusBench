import { Request } from 'express';
import { AuditLogModel } from '../models/AuditLog';
import { logger } from '../utils/logger';
import { AuditLog } from '../types/database';

export interface AuditContext {
  userId?: string;
  action: string;
  resourceType: 'user' | 'project' | 'task' | 'comment' | 'file' | 'session';
  resourceId?: string;
  details?: Record<string, any>;
  req?: Request;
}

export class AuditService {
  public static async log(context: AuditContext): Promise<AuditLog | null> {
    try {
      const ipAddress: string | undefined = context.req ? this.getClientIP(context.req) : undefined;
      const userAgent: string | undefined = context.req ? context.req.get('User-Agent') : undefined;

      const payload: {
        userId?: string;
        action: string;
        resourceType: string;
        resourceId?: string;
        details?: Record<string, any>;
        ipAddress?: string;
        userAgent?: string;
      } = {
        action: context.action,
        resourceType: context.resourceType,
      };
      if (context.userId) payload.userId = context.userId;
      if (context.resourceId) payload.resourceId = context.resourceId;
      if (context.details) payload.details = context.details;
      if (ipAddress !== undefined) payload.ipAddress = ipAddress;
      if (userAgent !== undefined) payload.userAgent = userAgent;

      const auditLog = await AuditLogModel.create(payload);

      logger.info(`Audit log created: ${context.action} on ${context.resourceType}`, {
        userId: context.userId,
        resourceId: context.resourceId,
        auditLogId: auditLog.id,
      });

      return auditLog;
    } catch (error) {
      logger.error('Failed to create audit log:', error);
      return null;
    }
  }

  public static async logUserLogin(userId: string, req: Request, success: boolean): Promise<void> {
    const ctx: AuditContext = {
      action: success ? 'user.login.success' : 'user.login.failed',
      resourceType: 'user',
      resourceId: userId,
      details: {
        success,
        timestamp: new Date().toISOString(),
      },
    };
    if (success) ctx.userId = userId;
    if (req) ctx.req = req;
    await this.log(ctx);
  }

  public static async logUserLogout(userId: string, req: Request): Promise<void> {
    const ctx: AuditContext = {
      userId,
      action: 'user.logout',
      resourceType: 'user',
      resourceId: userId,
    };
    if (req) ctx.req = req;
    await this.log(ctx);
  }

  public static async logUserRegistration(userId: string, email: string, req: Request): Promise<void> {
    const ctx: AuditContext = {
      userId,
      action: 'user.register',
      resourceType: 'user',
      resourceId: userId,
      details: { email },
    };
    if (req) ctx.req = req;
    await this.log(ctx);
  }

  public static async logProjectCreated(projectId: string, userId: string, projectName: string, req?: Request): Promise<void> {
    const ctx: AuditContext = {
      userId,
      action: 'project.created',
      resourceType: 'project',
      resourceId: projectId,
      details: { name: projectName },
    };
    if (req) ctx.req = req;
    await this.log(ctx);
  }

  public static async logProjectUpdated(projectId: string, userId: string, changes: Record<string, any>, req?: Request): Promise<void> {
    const ctx: AuditContext = {
      userId,
      action: 'project.updated',
      resourceType: 'project',
      resourceId: projectId,
      details: { changes },
    };
    if (req) ctx.req = req;
    await this.log(ctx);
  }

  public static async logProjectDeleted(projectId: string, userId: string, projectName: string, req?: Request): Promise<void> {
    const ctx: AuditContext = {
      userId,
      action: 'project.deleted',
      resourceType: 'project',
      resourceId: projectId,
      details: { name: projectName },
    };
    if (req) ctx.req = req;
    await this.log(ctx);
  }

  public static async logTaskCreated(taskId: string, userId: string, taskTitle: string, projectId: string, req?: Request): Promise<void> {
    const ctx: AuditContext = {
      userId,
      action: 'task.created',
      resourceType: 'task',
      resourceId: taskId,
      details: { title: taskTitle, projectId },
    };
    if (req) ctx.req = req;
    await this.log(ctx);
  }

  public static async logTaskUpdated(taskId: string, userId: string, changes: Record<string, any>, req?: Request): Promise<void> {
    const ctx: AuditContext = {
      userId,
      action: 'task.updated',
      resourceType: 'task',
      resourceId: taskId,
      details: { changes },
    };
    if (req) ctx.req = req;
    await this.log(ctx);
  }

  public static async logTaskDeleted(taskId: string, userId: string, taskTitle: string, req?: Request): Promise<void> {
    const ctx: AuditContext = {
      userId,
      action: 'task.deleted',
      resourceType: 'task',
      resourceId: taskId,
      details: { title: taskTitle },
    };
    if (req) ctx.req = req;
    await this.log(ctx);
  }

  public static async logCommentCreated(commentId: string, userId: string, taskId: string, req?: Request): Promise<void> {
    const ctx: AuditContext = {
      userId,
      action: 'comment.created',
      resourceType: 'comment',
      resourceId: commentId,
      details: { taskId },
    };
    if (req) ctx.req = req;
    await this.log(ctx);
  }

  public static async logFileUploaded(fileId: string, userId: string, filename: string, size: number, req?: Request): Promise<void> {
    const ctx: AuditContext = {
      userId,
      action: 'file.uploaded',
      resourceType: 'file',
      resourceId: fileId,
      details: { filename, size },
    };
    if (req) ctx.req = req;
    await this.log(ctx);
  }

  public static async logFileDeleted(fileId: string, userId: string, filename: string, req?: Request): Promise<void> {
    const ctx: AuditContext = {
      userId,
      action: 'file.deleted',
      resourceType: 'file',
      resourceId: fileId,
      details: { filename },
    };
    if (req) ctx.req = req;
    await this.log(ctx);
  }

  public static async logMemberAdded(projectId: string, userId: string, addedUserId: string, role: string, req?: Request): Promise<void> {
    const ctx: AuditContext = {
      userId,
      action: 'project.member.added',
      resourceType: 'project',
      resourceId: projectId,
      details: { addedUserId, role },
    };
    if (req) ctx.req = req;
    await this.log(ctx);
  }

  public static async logMemberRemoved(projectId: string, userId: string, removedUserId: string, req?: Request): Promise<void> {
    const ctx: AuditContext = {
      userId,
      action: 'project.member.removed',
      resourceType: 'project',
      resourceId: projectId,
      details: { removedUserId },
    };
    if (req) ctx.req = req;
    await this.log(ctx);
  }

  public static async getRecentActivity(limit = 50): Promise<any[]> {
    return await AuditLogModel.findRecent(limit);
  }

  public static async getUserActivity(userId: string, limit = 100, offset = 0): Promise<any[]> {
    return await AuditLogModel.findByUser(userId, limit, offset);
  }

  public static async getProjectActivity(projectId: string, limit = 100, offset = 0): Promise<any[]> {
    return await AuditLogModel.findByProject(projectId, limit, offset);
  }

  public static async searchAuditLogs(filters: {
    userId?: string;
    action?: string;
    resourceType?: string;
    ipAddress?: string;
    startDate?: Date;
    endDate?: Date;
  }, limit = 100, offset = 0): Promise<any[]> {
    return await AuditLogModel.searchLogs(filters, limit, offset);
  }

  public static async getActivityStats(startDate?: Date, endDate?: Date): Promise<any[]> {
    return await AuditLogModel.getActionStats(startDate, endDate);
  }

  public static async getUserActivityStats(userId: string, days = 30): Promise<any[]> {
    return await AuditLogModel.getUserActivityStats(userId, days);
  }

  public static async cleanupOldLogs(daysToKeep = 90): Promise<number> {
    const deletedCount = await AuditLogModel.cleanupOldLogs(daysToKeep);
    logger.info(`Cleaned up ${deletedCount} old audit logs`);
    return deletedCount;
  }

  private static getClientIP(req: Request): string {
    const forwarded = req.headers['x-forwarded-for'] as string | undefined;
    const realIP = req.headers['x-real-ip'] as string | undefined;
    
    if (forwarded) {
      const firstIP = forwarded.split(',')[0];
      return firstIP ? firstIP.trim() : 'unknown';
    }
    
    if (realIP) {
      return realIP;
    }
    
    return req.socket?.remoteAddress || 'unknown';
  }
}