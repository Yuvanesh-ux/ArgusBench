import { TaskModel } from '../models/Task';
import { ProjectModel } from '../models/Project';
import { UserModel } from '../models/User';
import { createError } from '../middleware/errorHandler';
import { Task } from '../types/database';

export class TaskService {
  static async createTask(
    userId: string,
    taskData: {
      title: string;
      description?: string;
      status?: 'todo' | 'in_progress' | 'review' | 'done';
      priority?: 'low' | 'medium' | 'high' | 'urgent';
      projectId: string;
      assigneeId?: string;
      dueDate?: string;
    }
  ): Promise<Task> {
    if (!taskData.title || taskData.title.trim().length === 0) {
      throw createError('Task title is required', 400);
    }

    if (taskData.title.length > 255) {
      throw createError('Task title cannot exceed 255 characters', 400);
    }

    const isMember = await ProjectModel.isMember(taskData.projectId, userId);
    if (!isMember) {
      throw createError('Access denied to this project', 403);
    }

    if (taskData.assigneeId) {
      const assignee = await UserModel.findById(taskData.assigneeId);
      if (!assignee) {
        throw createError('Assignee not found', 404);
      }

      const assigneeIsMember = await ProjectModel.isMember(taskData.projectId, taskData.assigneeId);
      if (!assigneeIsMember) {
        throw createError('Assignee is not a member of this project', 400);
      }
    }

    const dueDate = taskData.dueDate ? new Date(taskData.dueDate) : undefined;
    if (dueDate && isNaN(dueDate.getTime())) {
      throw createError('Invalid due date format', 400);
    }

    return await TaskModel.create({
      title: taskData.title,
      description: taskData.description ?? '',
      status: taskData.status ?? 'todo',
      priority: taskData.priority ?? 'medium',
      projectId: taskData.projectId,
      assigneeId: taskData.assigneeId ?? undefined,
      creatorId: userId,
      dueDate: dueDate ?? undefined,
    });
  }

  static async getTaskById(taskId: string, userId: string): Promise<any> {
    const task = await TaskModel.findWithDetails(taskId);
    if (!task) {
      throw createError('Task not found', 404);
    }
    return task;
  }

  static async getProjectTasks(projectId: string, userId: string): Promise<any[]> {
    const isMember = await ProjectModel.isMember(projectId, userId);
    if (!isMember) {
      throw createError('Access denied to this project', 403);
    }

    return await TaskModel.findProjectTasksWithDetails(projectId);
  }

  static async updateTask(
    taskId: string,
    userId: string,
    updates: {
      title?: string;
      description?: string;
      status?: 'todo' | 'in_progress' | 'review' | 'done';
      priority?: 'low' | 'medium' | 'high' | 'urgent';
      assigneeId?: string | null;
      dueDate?: string | null;
    }
  ): Promise<Task> {
    const task = await TaskModel.findById(taskId);
    if (!task) {
      throw createError('Task not found', 404);
    }

    const memberRole = await ProjectModel.getMemberRole(task.project_id, userId);
    if (!memberRole) {
      throw createError('Access denied', 403);
    }

    const canEdit = memberRole === 'admin' || 
                   memberRole === 'manager' || 
                   task.creator_id === userId || 
                   task.assignee_id === userId;

    if (!canEdit) {
      throw createError('Insufficient permissions to update this task', 403);
    }

    if (updates.title && updates.title.trim().length === 0) {
      throw createError('Task title cannot be empty', 400);
    }

    if (updates.title && updates.title.length > 255) {
      throw createError('Task title cannot exceed 255 characters', 400);
    }

    if (updates.assigneeId) {
      const assignee = await UserModel.findById(updates.assigneeId);
      if (!assignee) {
        throw createError('Assignee not found', 404);
      }

      const assigneeIsMember = await ProjectModel.isMember(task.project_id, updates.assigneeId);
      if (!assigneeIsMember) {
        throw createError('Assignee is not a member of this project', 400);
      }
    }

    const updateData: Partial<Task> = {};
    
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.priority !== undefined) updateData.priority = updates.priority;
    if (updates.assigneeId !== undefined) updateData.assignee_id = updates.assigneeId ?? undefined as any;
    
    if (updates.dueDate !== undefined) {
      if (updates.dueDate === null) {
        updateData.due_date = undefined as any;
      } else {
        const dueDate = new Date(updates.dueDate);
        if (isNaN(dueDate.getTime())) {
          throw createError('Invalid due date format', 400);
        }
        updateData.due_date = dueDate;
      }
    }

    const updatedTask = await TaskModel.updateById(taskId, updateData);
    if (!updatedTask) {
      throw createError('Failed to update task', 500);
    }

    return updatedTask;
  }

  static async deleteTask(taskId: string, userId: string): Promise<void> {
    const task = await TaskModel.findById(taskId);
    if (!task) {
      throw createError('Task not found', 404);
    }

    const memberRole = await ProjectModel.getMemberRole(task.project_id, userId);
    if (!memberRole) {
      throw createError('Access denied', 403);
    }

    const canDelete = memberRole === 'admin' || 
                     memberRole === 'manager' || 
                     task.creator_id === userId;

    if (!canDelete) {
      throw createError('Insufficient permissions to delete this task', 403);
    }

    const deleted = await TaskModel.deleteById(taskId);
    if (!deleted) {
      throw createError('Failed to delete task', 500);
    }
  }

  static async getUserTasks(userId: string): Promise<Task[]> {
    return await TaskModel.findByAssignee(userId);
  }

  static async searchTasks(
    userId: string,
    searchTerm: string,
    filters?: {
      status?: string;
      priority?: string;
      assigneeId?: string;
      projectId?: string;
    }
  ): Promise<Task[]> {
    if (!searchTerm || searchTerm.trim().length < 2) {
      throw createError('Search term must be at least 2 characters', 400);
    }

    return await TaskModel.searchTasks(userId, searchTerm, filters);
  }

  static async getTaskStats(projectId: string, userId: string): Promise<any> {
    const isMember = await ProjectModel.isMember(projectId, userId);
    if (!isMember) {
      throw createError('Access denied to this project', 403);
    }

    return await TaskModel.getTaskStats(projectId);
  }

  static async getUserTaskStats(userId: string): Promise<any> {
    return await TaskModel.getUserTaskStats(userId);
  }
}