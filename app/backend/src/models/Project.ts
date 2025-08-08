import { Project, ProjectMember } from '../types/database';
import { query, insertOne, updateById, findById, deleteById } from '../database/query';

export class ProjectModel {
  static async create(projectData: {
    name: string;
    description?: string;
    ownerId: string;
    color?: string;
    isPublic?: boolean;
  }): Promise<Project> {
    const project = await insertOne<Project>('projects', {
      name: projectData.name,
      description: projectData.description,
      owner_id: projectData.ownerId,
      color: projectData.color || '#3B82F6',
      is_public: projectData.isPublic || false,
    });
    
    await this.addMember(project.id, projectData.ownerId, 'admin');
    return project;
  }

  static async findById(id: string): Promise<Project | null> {
    return findById<Project>('projects', id);
  }

  static async findByOwner(ownerId: string): Promise<Project[]> {
    const result = await query(
      'SELECT * FROM projects WHERE owner_id = $1 ORDER BY updated_at DESC',
      [ownerId]
    );
    return result.rows;
  }

  static async findUserProjects(userId: string): Promise<(Project & { user_role: string })[]> {
    const result = await query(`
      SELECT p.*, pm.role as user_role 
      FROM projects p 
      INNER JOIN project_members pm ON p.id = pm.project_id 
      WHERE pm.user_id = $1 
      ORDER BY p.updated_at DESC
    `, [userId]);
    return result.rows;
  }

  static async updateById(id: string, updates: Partial<Project>): Promise<Project | null> {
    return updateById<Project>('projects', id, updates);
  }

  static async deleteById(id: string): Promise<boolean> {
    return deleteById('projects', id);
  }

  static async addMember(projectId: string, userId: string, role: 'admin' | 'manager' | 'member' = 'member'): Promise<ProjectMember> {
    const existingMember = await query(
      'SELECT * FROM project_members WHERE project_id = $1 AND user_id = $2',
      [projectId, userId]
    );

    if (existingMember.rows.length > 0) {
      throw new Error('User is already a member of this project');
    }

    return insertOne<ProjectMember>('project_members', {
      project_id: projectId,
      user_id: userId,
      role,
    });
  }

  static async removeMember(projectId: string, userId: string): Promise<boolean> {
    const result = await query(
      'DELETE FROM project_members WHERE project_id = $1 AND user_id = $2',
      [projectId, userId]
    );
    return result.rowCount > 0;
  }

  static async updateMemberRole(
    projectId: string, 
    userId: string, 
    role: 'admin' | 'manager' | 'member'
  ): Promise<ProjectMember | null> {
    const result = await query(
      'UPDATE project_members SET role = $1 WHERE project_id = $2 AND user_id = $3 RETURNING *',
      [role, projectId, userId]
    );
    return result.rows[0] || null;
  }

  static async getMembers(projectId: string): Promise<any[]> {
    const result = await query(`
      SELECT u.id, u.email, u.first_name, u.last_name, u.avatar_url, pm.role, pm.joined_at
      FROM users u
      INNER JOIN project_members pm ON u.id = pm.user_id
      WHERE pm.project_id = $1
      ORDER BY pm.joined_at ASC
    `, [projectId]);
    return result.rows;
  }

  static async getMemberRole(projectId: string, userId: string): Promise<string | null> {
    const result = await query(
      'SELECT role FROM project_members WHERE project_id = $1 AND user_id = $2',
      [projectId, userId]
    );
    return result.rows[0]?.role || null;
  }

  static async isMember(projectId: string, userId: string): Promise<boolean> {
    const result = await query(
      'SELECT 1 FROM project_members WHERE project_id = $1 AND user_id = $2',
      [projectId, userId]
    );
    return result.rows.length > 0;
  }

  static async getPublicProjects(limit = 20, offset = 0): Promise<Project[]> {
    const result = await query(
      'SELECT * FROM projects WHERE is_public = true ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    return result.rows;
  }

  static async searchProjects(searchTerm: string, userId: string, limit = 20): Promise<Project[]> {
    const result = await query(`
      SELECT DISTINCT p.* 
      FROM projects p
      INNER JOIN project_members pm ON p.id = pm.project_id
      WHERE pm.user_id = $1 
      AND (p.name ILIKE $2 OR p.description ILIKE $2)
      ORDER BY p.updated_at DESC
      LIMIT $3
    `, [userId, `%${searchTerm}%`, limit]);
    return result.rows;
  }
}