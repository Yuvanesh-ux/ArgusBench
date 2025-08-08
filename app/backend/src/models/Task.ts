import { Task } from '../types/database';
import { query, insertOne, updateById, findById, deleteById } from '../database/query';

export class TaskModel {
  static async create(taskData: {
    title: string;
    description?: string | undefined;
    status?: 'todo' | 'in_progress' | 'review' | 'done' | undefined;
    priority?: 'low' | 'medium' | 'high' | 'urgent' | undefined;
    projectId: string;
    assigneeId?: string | undefined;
    creatorId: string;
    dueDate?: Date | undefined;
  }): Promise<Task> {
    return await insertOne<Task>('tasks', {
      title: taskData.title,
      description: taskData.description,
      status: taskData.status || 'todo',
      priority: taskData.priority || 'medium',
      project_id: taskData.projectId,
      assignee_id: taskData.assigneeId,
      creator_id: taskData.creatorId,
      due_date: taskData.dueDate,
    });
  }

  static async findById(id: string): Promise<Task | null> {
    return findById<Task>('tasks', id);
  }

  static async findByProjectId(projectId: string): Promise<Task[]> {
    const result = await query(
      'SELECT * FROM tasks WHERE project_id = $1 ORDER BY created_at DESC',
      [projectId]
    );
    return result.rows;
  }

  static async findByAssignee(assigneeId: string): Promise<Task[]> {
    const result = await query(
      'SELECT * FROM tasks WHERE assignee_id = $1 ORDER BY created_at DESC',
      [assigneeId]
    );
    return result.rows;
  }

  static async findByCreator(creatorId: string): Promise<Task[]> {
    const result = await query(
      'SELECT * FROM tasks WHERE creator_id = $1 ORDER BY created_at DESC',
      [creatorId]
    );
    return result.rows;
  }

  static async updateById(id: string, updates: Partial<Task>): Promise<Task | null> {
    if (updates.status === 'done' && !updates.completed_at) {
      updates.completed_at = new Date();
    } else if (updates.status !== 'done') {
      updates.completed_at = null;
    }
    
    return updateById<Task>('tasks', id, updates);
  }

  static async deleteById(id: string): Promise<boolean> {
    return deleteById('tasks', id);
  }

  static async findWithDetails(id: string): Promise<any> {
    const result = await query(`
      SELECT 
        t.*,
        creator.first_name as creator_first_name,
        creator.last_name as creator_last_name,
        creator.email as creator_email,
        assignee.first_name as assignee_first_name,
        assignee.last_name as assignee_last_name,
        assignee.email as assignee_email,
        p.name as project_name
      FROM tasks t
      LEFT JOIN users creator ON t.creator_id = creator.id
      LEFT JOIN users assignee ON t.assignee_id = assignee.id
      LEFT JOIN projects p ON t.project_id = p.id
      WHERE t.id = $1
    `, [id]);
    
    return result.rows[0] || null;
  }

  static async findProjectTasksWithDetails(projectId: string): Promise<any[]> {
    const result = await query(`
      SELECT 
        t.*,
        creator.first_name as creator_first_name,
        creator.last_name as creator_last_name,
        assignee.first_name as assignee_first_name,
        assignee.last_name as assignee_last_name
      FROM tasks t
      LEFT JOIN users creator ON t.creator_id = creator.id
      LEFT JOIN users assignee ON t.assignee_id = assignee.id
      WHERE t.project_id = $1
      ORDER BY t.created_at DESC
    `, [projectId]);
    
    return result.rows;
  }

  static async searchTasks(
    userId: string, 
    searchTerm: string, 
    filters?: {
      status?: string;
      priority?: string;
      assigneeId?: string;
      projectId?: string;
    },
    limit = 50
  ): Promise<Task[]> {
    let whereClause = `
      t.project_id IN (
        SELECT pm.project_id FROM project_members pm WHERE pm.user_id = $1
      )
      AND (t.title ILIKE $2 OR t.description ILIKE $2)
    `;
    
    const params = [userId, `%${searchTerm}%`];
    let paramCount = 2;

    if (filters?.status) {
      whereClause += ` AND t.status = $${++paramCount}`;
      params.push(filters.status);
    }

    if (filters?.priority) {
      whereClause += ` AND t.priority = $${++paramCount}`;
      params.push(filters.priority);
    }

    if (filters?.assigneeId) {
      whereClause += ` AND t.assignee_id = $${++paramCount}`;
      params.push(filters.assigneeId);
    }

    if (filters?.projectId) {
      whereClause += ` AND t.project_id = $${++paramCount}`;
      params.push(filters.projectId);
    }

    const result = await query(`
      SELECT t.* FROM tasks t
      WHERE ${whereClause}
      ORDER BY t.updated_at DESC
      LIMIT $${++paramCount}
    `, [...params, limit]);

    return result.rows;
  }

  static async getTaskStats(projectId: string): Promise<any> {
    const result = await query(`
      SELECT 
        status,
        priority,
        COUNT(*) as count
      FROM tasks 
      WHERE project_id = $1 
      GROUP BY status, priority
    `, [projectId]);

    return result.rows;
  }

  static async getUserTaskStats(userId: string): Promise<any> {
    const result = await query(`
      SELECT 
        status,
        COUNT(*) as count
      FROM tasks 
      WHERE assignee_id = $1
      GROUP BY status
    `, [userId]);

    return result.rows;
  }

  static async findTasksDueBetween(start: Date, end: Date): Promise<{ rows: any[] }> {
    const result = await query(
      'SELECT * FROM tasks WHERE due_date >= $1 AND due_date < $2',
      [start, end]
    );
    return { rows: result.rows };
  }
}