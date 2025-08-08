import { ProjectModel } from '../models/Project';
import { createError } from '../middleware/errorHandler';
import { Project } from '../types/database';

export class ProjectService {
  static async createProject(
    userId: string,
    projectData: {
      name: string;
      description?: string;
      color?: string;
      isPublic?: boolean;
    }
  ): Promise<Project> {
    if (!projectData.name || projectData.name.trim().length === 0) {
      throw createError('Project name is required', 400);
    }

    if (projectData.name.length > 255) {
      throw createError('Project name cannot exceed 255 characters', 400);
    }

    return await ProjectModel.create({
      ...projectData,
      ownerId: userId,
    });
  }

  static async getUserProjects(userId: string): Promise<(Project & { user_role: string })[]> {
    return await ProjectModel.findUserProjects(userId);
  }

  static async getProjectById(projectId: string, userId: string): Promise<Project> {
    const project = await ProjectModel.findById(projectId);
    if (!project) {
      throw createError('Project not found', 404);
    }

    const isMember = await ProjectModel.isMember(projectId, userId);
    if (!isMember && !project.is_public) {
      throw createError('Access denied', 403);
    }

    return project;
  }

  static async updateProject(
    projectId: string,
    userId: string,
    updates: {
      name?: string;
      description?: string;
      color?: string;
      isPublic?: boolean;
    }
  ): Promise<Project> {
    const project = await ProjectModel.findById(projectId);
    if (!project) {
      throw createError('Project not found', 404);
    }

    const memberRole = await ProjectModel.getMemberRole(projectId, userId);
    if (!memberRole || !['admin', 'manager'].includes(memberRole)) {
      throw createError('Insufficient permissions to update project', 403);
    }

    if (updates.name && updates.name.trim().length === 0) {
      throw createError('Project name cannot be empty', 400);
    }

    const updateData: Partial<Project> = {};
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.color !== undefined) updateData.color = updates.color;
    if (updates.isPublic !== undefined) updateData.is_public = updates.isPublic;

    const updatedProject = await ProjectModel.updateById(projectId, updateData);
    if (!updatedProject) {
      throw createError('Failed to update project', 500);
    }

    return updatedProject;
  }

  static async deleteProject(projectId: string, userId: string): Promise<void> {
    const project = await ProjectModel.findById(projectId);
    if (!project) {
      throw createError('Project not found', 404);
    }

    if (project.owner_id !== userId) {
      throw createError('Only the project owner can delete the project', 403);
    }

    const deleted = await ProjectModel.deleteById(projectId);
    if (!deleted) {
      throw createError('Failed to delete project', 500);
    }
  }

  static async addMember(
    projectId: string,
    userId: string,
    targetUserId: string,
    role: 'admin' | 'manager' | 'member' = 'member'
  ): Promise<any> {
    const project = await ProjectModel.findById(projectId);
    if (!project) {
      throw createError('Project not found', 404);
    }

    const memberRole = await ProjectModel.getMemberRole(projectId, userId);
    if (!memberRole || !['admin', 'manager'].includes(memberRole)) {
      throw createError('Insufficient permissions to add members', 403);
    }

    try {
      return await ProjectModel.addMember(projectId, targetUserId, role);
    } catch (error) {
      if (error instanceof Error && error.message.includes('already a member')) {
        throw createError('User is already a member of this project', 409);
      }
      throw createError('Failed to add member', 500);
    }
  }

  static async removeMember(
    projectId: string,
    userId: string,
    targetUserId: string
  ): Promise<void> {
    const project = await ProjectModel.findById(projectId);
    if (!project) {
      throw createError('Project not found', 404);
    }

    if (project.owner_id === targetUserId) {
      throw createError('Cannot remove the project owner', 400);
    }

    const memberRole = await ProjectModel.getMemberRole(projectId, userId);
    if (!memberRole || !['admin', 'manager'].includes(memberRole)) {
      if (userId !== targetUserId) {
        throw createError('Insufficient permissions to remove members', 403);
      }
    }

    const removed = await ProjectModel.removeMember(projectId, targetUserId);
    if (!removed) {
      throw createError('Member not found or failed to remove', 404);
    }
  }

  static async updateMemberRole(
    projectId: string,
    userId: string,
    targetUserId: string,
    role: 'admin' | 'manager' | 'member'
  ): Promise<any> {
    const project = await ProjectModel.findById(projectId);
    if (!project) {
      throw createError('Project not found', 404);
    }

    const memberRole = await ProjectModel.getMemberRole(projectId, userId);
    if (!memberRole || memberRole !== 'admin') {
      throw createError('Only project admins can update member roles', 403);
    }

    if (project.owner_id === targetUserId && role !== 'admin') {
      throw createError('Project owner must remain admin', 400);
    }

    const updatedMember = await ProjectModel.updateMemberRole(projectId, targetUserId, role);
    if (!updatedMember) {
      throw createError('Member not found or failed to update role', 404);
    }

    return updatedMember;
  }

  static async getProjectMembers(projectId: string, userId: string): Promise<any[]> {
    const isMember = await ProjectModel.isMember(projectId, userId);
    if (!isMember) {
      throw createError('Access denied', 403);
    }

    return await ProjectModel.getMembers(projectId);
  }

  static async searchProjects(userId: string, searchTerm: string): Promise<Project[]> {
    if (!searchTerm || searchTerm.trim().length < 2) {
      throw createError('Search term must be at least 2 characters', 400);
    }

    return await ProjectModel.searchProjects(searchTerm, userId);
  }
}