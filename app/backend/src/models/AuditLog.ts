import { AuditLog } from '../types/database';
import { query, insertOne } from '../database/query';

export class AuditLogModel {
  static async create(logData: {
    userId?: string;
    action: string;
    resourceType: string;
    resourceId?: string;
    details?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<AuditLog> {
    return await insertOne<AuditLog>('audit_logs', {
      user_id: logData.userId,
      action: logData.action,
      resource_type: logData.resourceType,
      resource_id: logData.resourceId,
      details: logData.details ? JSON.stringify(logData.details) : null,
      ip_address: logData.ipAddress,
      user_agent: logData.userAgent,
    });
  }

  static async findByUser(
    userId: string,
    limit = 100,
    offset = 0
  ): Promise<any[]> {
    const result = await query(`
      SELECT 
        al.*,
        u.first_name,
        u.last_name,
        u.email
      FROM audit_logs al
      LEFT JOIN users u ON al.user_id = u.id
      WHERE al.user_id = $1
      ORDER BY al.created_at DESC
      LIMIT $2 OFFSET $3
    `, [userId, limit, offset]);
    
    return result.rows;
  }

  static async findByResource(
    resourceType: string,
    resourceId: string,
    limit = 50
  ): Promise<any[]> {
    const result = await query(`
      SELECT 
        al.*,
        u.first_name,
        u.last_name,
        u.email
      FROM audit_logs al
      LEFT JOIN users u ON al.user_id = u.id
      WHERE al.resource_type = $1 AND al.resource_id = $2
      ORDER BY al.created_at DESC
      LIMIT $3
    `, [resourceType, resourceId, limit]);
    
    return result.rows;
  }

  static async findByProject(
    projectId: string,
    limit = 200,
    offset = 0
  ): Promise<any[]> {
    const result = await query(`
      SELECT 
        al.*,
        u.first_name,
        u.last_name,
        u.email
      FROM audit_logs al
      LEFT JOIN users u ON al.user_id = u.id
      WHERE (
        (al.resource_type = 'project' AND al.resource_id = $1)
        OR (al.resource_type = 'task' AND al.resource_id IN (
          SELECT id FROM tasks WHERE project_id = $1
        ))
        OR (al.resource_type = 'comment' AND al.resource_id IN (
          SELECT c.id FROM comments c
          JOIN tasks t ON c.task_id = t.id
          WHERE t.project_id = $1
        ))
        OR (al.resource_type = 'file' AND al.resource_id IN (
          SELECT id FROM files WHERE project_id = $1
        ))
      )
      ORDER BY al.created_at DESC
      LIMIT $2 OFFSET $3
    `, [projectId, limit, offset]);
    
    return result.rows;
  }

  static async findRecent(limit = 100): Promise<any[]> {
    const result = await query(`
      SELECT 
        al.*,
        u.first_name,
        u.last_name,
        u.email
      FROM audit_logs al
      LEFT JOIN users u ON al.user_id = u.id
      ORDER BY al.created_at DESC
      LIMIT $1
    `, [limit]);
    
    return result.rows;
  }

  static async searchLogs(
    filters: {
      userId?: string;
      action?: string;
      resourceType?: string;
      ipAddress?: string;
      startDate?: Date;
      endDate?: Date;
    },
    limit = 100,
    offset = 0
  ): Promise<any[]> {
    let whereClause = '1 = 1';
    const params: any[] = [];
    let paramCount = 0;

    if (filters.userId) {
      whereClause += ` AND al.user_id = $${++paramCount}`;
      params.push(filters.userId);
    }

    if (filters.action) {
      whereClause += ` AND al.action ILIKE $${++paramCount}`;
      params.push(`%${filters.action}%`);
    }

    if (filters.resourceType) {
      whereClause += ` AND al.resource_type = $${++paramCount}`;
      params.push(filters.resourceType);
    }

    if (filters.ipAddress) {
      whereClause += ` AND al.ip_address = $${++paramCount}`;
      params.push(filters.ipAddress);
    }

    if (filters.startDate) {
      whereClause += ` AND al.created_at >= $${++paramCount}`;
      params.push(filters.startDate);
    }

    if (filters.endDate) {
      whereClause += ` AND al.created_at <= $${++paramCount}`;
      params.push(filters.endDate);
    }

    const result = await query(`
      SELECT 
        al.*,
        u.first_name,
        u.last_name,
        u.email
      FROM audit_logs al
      LEFT JOIN users u ON al.user_id = u.id
      WHERE ${whereClause}
      ORDER BY al.created_at DESC
      LIMIT $${++paramCount} OFFSET $${++paramCount}
    `, [...params, limit, offset]);
    
    return result.rows;
  }

  static async getActionStats(
    startDate?: Date,
    endDate?: Date
  ): Promise<any[]> {
    let whereClause = '1 = 1';
    const params: any[] = [];
    let paramCount = 0;

    if (startDate) {
      whereClause += ` AND created_at >= $${++paramCount}`;
      params.push(startDate);
    }

    if (endDate) {
      whereClause += ` AND created_at <= $${++paramCount}`;
      params.push(endDate);
    }

    const result = await query(`
      SELECT 
        action,
        resource_type,
        COUNT(*) as count,
        COUNT(DISTINCT user_id) as unique_users
      FROM audit_logs 
      WHERE ${whereClause}
      GROUP BY action, resource_type
      ORDER BY count DESC
    `, params);
    
    return result.rows;
  }

  static async getUserActivityStats(
    userId: string,
    days = 30
  ): Promise<any[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const result = await query(`
      SELECT 
        DATE(created_at) as date,
        action,
        resource_type,
        COUNT(*) as count
      FROM audit_logs 
      WHERE user_id = $1 AND created_at >= $2
      GROUP BY DATE(created_at), action, resource_type
      ORDER BY date DESC, count DESC
    `, [userId, startDate]);
    
    return result.rows;
  }

  static async cleanupOldLogs(daysToKeep = 90): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const result = await query(
      'DELETE FROM audit_logs WHERE created_at < $1',
      [cutoffDate]
    );
    
    return result.rowCount || 0;
  }
}