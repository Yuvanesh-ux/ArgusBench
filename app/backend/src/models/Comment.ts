import { Comment } from '../types/database';
import { query, insertOne, updateById, findById, deleteById } from '../database/query';

export class CommentModel {
  static async create(commentData: {
    content: string;
    taskId: string;
    authorId: string;
    parentId?: string | undefined;
  }): Promise<Comment> {
    return await insertOne<Comment>('comments', {
      content: commentData.content,
      task_id: commentData.taskId,
      author_id: commentData.authorId,
      parent_id: commentData.parentId,
    });
  }

  static async findById(id: string): Promise<Comment | null> {
    return findById<Comment>('comments', id);
  }

  static async findByTaskId(taskId: string): Promise<any[]> {
    const result = await query(`
      SELECT 
        c.*,
        u.first_name as author_first_name,
        u.last_name as author_last_name,
        u.email as author_email,
        u.avatar_url as author_avatar
      FROM comments c
      LEFT JOIN users u ON c.author_id = u.id
      WHERE c.task_id = $1
      ORDER BY c.created_at ASC
    `, [taskId]);
    
    return result.rows;
  }

  static async updateById(id: string, updates: Partial<Comment>): Promise<Comment | null> {
    return updateById<Comment>('comments', id, updates);
  }

  static async deleteById(id: string): Promise<boolean> {
    return deleteById('comments', id);
  }

  static async findWithDetails(id: string): Promise<any> {
    const result = await query(`
      SELECT 
        c.*,
        u.first_name as author_first_name,
        u.last_name as author_last_name,
        u.email as author_email,
        u.avatar_url as author_avatar,
        t.title as task_title,
        t.project_id
      FROM comments c
      LEFT JOIN users u ON c.author_id = u.id
      LEFT JOIN tasks t ON c.task_id = t.id
      WHERE c.id = $1
    `, [id]);
    
    return result.rows[0] || null;
  }

  static async findReplies(parentId: string): Promise<any[]> {
    const result = await query(`
      SELECT 
        c.*,
        u.first_name as author_first_name,
        u.last_name as author_last_name,
        u.email as author_email,
        u.avatar_url as author_avatar
      FROM comments c
      LEFT JOIN users u ON c.author_id = u.id
      WHERE c.parent_id = $1
      ORDER BY c.created_at ASC
    `, [parentId]);
    
    return result.rows;
  }

  static async getThreadedComments(taskId: string): Promise<any[]> {
    const result = await query(`
      WITH RECURSIVE comment_tree AS (
        SELECT 
          c.*,
          u.first_name as author_first_name,
          u.last_name as author_last_name,
          u.email as author_email,
          u.avatar_url as author_avatar,
          0 as depth,
          ARRAY[c.created_at] as path
        FROM comments c
        LEFT JOIN users u ON c.author_id = u.id
        WHERE c.task_id = $1 AND c.parent_id IS NULL
        
        UNION ALL
        
        SELECT 
          c.*,
          u.first_name as author_first_name,
          u.last_name as author_last_name,
          u.email as author_email,
          u.avatar_url as author_avatar,
          ct.depth + 1,
          ct.path || c.created_at
        FROM comments c
        LEFT JOIN users u ON c.author_id = u.id
        INNER JOIN comment_tree ct ON c.parent_id = ct.id
        WHERE ct.depth < 5
      )
      SELECT * FROM comment_tree
      ORDER BY path
    `, [taskId]);
    
    return result.rows;
  }

  static async getCommentCount(taskId: string): Promise<number> {
    const result = await query(
      'SELECT COUNT(*) as count FROM comments WHERE task_id = $1',
      [taskId]
    );
    return parseInt(result.rows[0]?.count || '0');
  }

  static async deleteTaskComments(taskId: string): Promise<boolean> {
    const result = await query(
      'DELETE FROM comments WHERE task_id = $1',
      [taskId]
    );
    return result.rowCount > 0;
  }

  static async searchComments(
    userId: string,
    searchTerm: string,
    projectId?: string,
    limit = 50
  ): Promise<any[]> {
    let whereClause = `
      t.project_id IN (
        SELECT pm.project_id FROM project_members pm WHERE pm.user_id = $1
      )
      AND c.content ILIKE $2
    `;
    
    const params = [userId, `%${searchTerm}%`];
    let paramCount = 2;

    if (projectId) {
      whereClause += ` AND t.project_id = $${++paramCount}`;
      params.push(projectId);
    }

    const result = await query(`
      SELECT 
        c.*,
        u.first_name as author_first_name,
        u.last_name as author_last_name,
        u.email as author_email,
        t.title as task_title,
        t.id as task_id
      FROM comments c
      LEFT JOIN users u ON c.author_id = u.id
      LEFT JOIN tasks t ON c.task_id = t.id
      WHERE ${whereClause}
      ORDER BY c.created_at DESC
      LIMIT $${++paramCount}
    `, [...params, limit]);

    return result.rows;
  }
}