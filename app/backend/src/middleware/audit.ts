import { Request, Response, NextFunction } from 'express';
import { AuditService, AuditContext } from '../services/auditService';

export const auditMiddleware = (action: string, resourceType: 'user' | 'project' | 'task' | 'comment' | 'file' | 'session') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const originalSend = res.send;

    res.send = function(data) {
      const statusCode = res.statusCode;
      const userId = req.user?.userId;
      const resourceId = req.params.id || req.params.projectId || req.params.taskId;

      if (statusCode >= 200 && statusCode < 400 && userId) {
        setImmediate(() => {
          const context: AuditContext = {
            userId,
            action,
            resourceType,
            details: {
              method: req.method,
              path: req.path,
              statusCode,
              body: req.method !== 'GET' ? req.body : undefined,
            },
          };
          if (resourceId) context.resourceId = resourceId;
          context.req = req;
          AuditService.log(context);
        });
      }

      return originalSend.call(this, data);
    };

    next();
  };
};