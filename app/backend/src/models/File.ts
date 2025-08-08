import { File } from '../types/database';
import { query, insertOne, findById, deleteById } from '../database/query';

export class FileModel {
  static async create(fileData: {
    filename: string;
    originalName: string;
    filePath: string;
    fileSize: number;
    mimeType: string;
    fileType: 'image' | 'document' | 'archive' | 'other';
    taskId?: string | undefined;
    projectId?: string | undefined;
    uploadedBy: string;
  }): Promise<File> {
    return await insertOne<File>('files', {
      filename: fileData.filename,
      original_name: fileData.originalName,
      file_path: fileData.filePath,
      file_size: fileData.fileSize,
      mime_type: fileData.mimeType,
      file_type: fileData.fileType,
      task_id: fileData.taskId,
      project_id: fileData.projectId,
      uploaded_by: fileData.uploadedBy,
    });
  }

  static async findById(id: string): Promise<File | null> {
    return findById<File>('files', id);
  }

  static async findByTaskId(taskId: string): Promise<File[]> {
    const result = await query(
      'SELECT * FROM files WHERE task_id = $1 ORDER BY created_at DESC',
      [taskId]
    );
    return result.rows;
  }

  static async findByProjectId(projectId: string): Promise<File[]> {
    const result = await query(
      'SELECT * FROM files WHERE project_id = $1 ORDER BY created_at DESC',
      [projectId]
    );
    return result.rows;
  }

  static async findByUploader(uploaderId: string): Promise<File[]> {
    const result = await query(
      'SELECT * FROM files WHERE uploaded_by = $1 ORDER BY created_at DESC',
      [uploaderId]
    );
    return result.rows;
  }

  static async deleteById(id: string): Promise<boolean> {
    return deleteById('files', id);
  }

  static async findWithDetails(id: string): Promise<any> {
    const result = await query(`
      SELECT 
        f.*,
        u.first_name as uploader_first_name,
        u.last_name as uploader_last_name,
        u.email as uploader_email,
        t.title as task_title,
        p.name as project_name
      FROM files f
      LEFT JOIN users u ON f.uploaded_by = u.id
      LEFT JOIN tasks t ON f.task_id = t.id
      LEFT JOIN projects p ON f.project_id = p.id
      WHERE f.id = $1
    `, [id]);
    
    return result.rows[0] || null;
  }

  static async getStorageStats(userId?: string): Promise<any> {
    let whereClause = '';
    const params = [];

    if (userId) {
      whereClause = 'WHERE uploaded_by = $1';
      params.push(userId);
    }

    const result = await query(`
      SELECT 
        file_type,
        COUNT(*) as count,
        SUM(file_size) as total_size
      FROM files 
      ${whereClause}
      GROUP BY file_type
    `, params);

    return result.rows;
  }

  static async searchFiles(
    userId: string,
    searchTerm: string,
    filters?: {
      fileType?: string;
      projectId?: string;
      taskId?: string;
    },
    limit = 50
  ): Promise<File[]> {
    let whereClause = `
      (f.project_id IN (
        SELECT pm.project_id FROM project_members pm WHERE pm.user_id = $1
      ) OR f.uploaded_by = $1)
      AND (f.original_name ILIKE $2 OR f.filename ILIKE $2)
    `;
    
    const params = [userId, `%${searchTerm}%`];
    let paramCount = 2;

    if (filters?.fileType) {
      whereClause += ` AND f.file_type = $${++paramCount}`;
      params.push(filters.fileType);
    }

    if (filters?.projectId) {
      whereClause += ` AND f.project_id = $${++paramCount}`;
      params.push(filters.projectId);
    }

    if (filters?.taskId) {
      whereClause += ` AND f.task_id = $${++paramCount}`;
      params.push(filters.taskId);
    }

    const result = await query(`
      SELECT f.* FROM files f
      WHERE ${whereClause}
      ORDER BY f.created_at DESC
      LIMIT $${++paramCount}
    `, [...params, limit]);

    return result.rows;
  }
}