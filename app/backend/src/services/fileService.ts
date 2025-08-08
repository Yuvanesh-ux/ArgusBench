import { FileModel } from '../models/File';
import { TaskModel } from '../models/Task';
import { ProjectModel } from '../models/Project';
import { createError } from '../middleware/errorHandler';
import { getFileType } from '../middleware/upload';
import { File } from '../types/database';
import fs from 'fs';
import path from 'path';

export class FileService {
  static async uploadFile(
    userId: string,
    file: Express.Multer.File,
    metadata: {
      taskId?: string;
      projectId?: string;
    }
  ): Promise<File> {
    if (metadata.taskId) {
      const task = await TaskModel.findById(metadata.taskId);
      if (!task) {
        throw createError('Task not found', 404);
      }

      const isMember = await ProjectModel.isMember(task.project_id, userId);
      if (!isMember) {
        throw createError('Access denied to this project', 403);
      }

      metadata.projectId = task.project_id;
    } else if (metadata.projectId) {
      const isMember = await ProjectModel.isMember(metadata.projectId, userId);
      if (!isMember) {
        throw createError('Access denied to this project', 403);
      }
    } else {
      throw createError('Either taskId or projectId must be provided', 400);
    }

    const fileType = getFileType(file.mimetype);

    return await FileModel.create({
      filename: file.filename,
      originalName: file.originalname,
      filePath: file.path,
      fileSize: file.size,
      mimeType: file.mimetype,
      fileType,
      taskId: metadata.taskId,
      projectId: metadata.projectId,
      uploadedBy: userId,
    });
  }

  static async getFileById(fileId: string, userId: string): Promise<any> {
    const file = await FileModel.findWithDetails(fileId);
    if (!file) {
      throw createError('File not found', 404);
    }

    if (file.project_id) {
      const isMember = await ProjectModel.isMember(file.project_id, userId);
      if (!isMember && file.uploaded_by !== userId) {
        throw createError('Access denied', 403);
      }
    } else if (file.uploaded_by !== userId) {
      throw createError('Access denied', 403);
    }

    return file;
  }

  static async downloadFile(fileId: string, userId: string): Promise<{ filePath: string; originalName: string; mimeType: string }> {
    const file = await this.getFileById(fileId, userId);
    
    if (!fs.existsSync(file.file_path)) {
      throw createError('File not found on disk', 404);
    }

    return {
      filePath: file.file_path,
      originalName: file.original_name,
      mimeType: file.mime_type,
    };
  }

  static async deleteFile(fileId: string, userId: string): Promise<void> {
    const file = await FileModel.findWithDetails(fileId);
    if (!file) {
      throw createError('File not found', 404);
    }

    const canDelete = file.uploaded_by === userId;
    
    if (!canDelete && file.project_id) {
      const memberRole = await ProjectModel.getMemberRole(file.project_id, userId);
      if (memberRole === 'admin' || memberRole === 'manager') {
        // Allow project admins/managers to delete files
      } else {
        throw createError('Insufficient permissions to delete this file', 403);
      }
    } else if (!canDelete) {
      throw createError('You can only delete your own files', 403);
    }

    const deleted = await FileModel.deleteById(fileId);
    if (!deleted) {
      throw createError('Failed to delete file record', 500);
    }

    try {
      if (fs.existsSync(file.file_path)) {
        fs.unlinkSync(file.file_path);
      }
    } catch (error) {
      console.error('Failed to delete file from disk:', error);
    }
  }

  static async getTaskFiles(taskId: string, userId: string): Promise<File[]> {
    const task = await TaskModel.findById(taskId);
    if (!task) {
      throw createError('Task not found', 404);
    }

    const isMember = await ProjectModel.isMember(task.project_id, userId);
    if (!isMember) {
      throw createError('Access denied to this project', 403);
    }

    return await FileModel.findByTaskId(taskId);
  }

  static async getProjectFiles(projectId: string, userId: string): Promise<File[]> {
    const isMember = await ProjectModel.isMember(projectId, userId);
    if (!isMember) {
      throw createError('Access denied to this project', 403);
    }

    return await FileModel.findByProjectId(projectId);
  }

  static async getUserFiles(userId: string): Promise<File[]> {
    return await FileModel.findByUploader(userId);
  }

  static async searchFiles(
    userId: string,
    searchTerm: string,
    filters?: {
      fileType?: string;
      projectId?: string;
      taskId?: string;
    }
  ): Promise<File[]> {
    if (!searchTerm || searchTerm.trim().length < 2) {
      throw createError('Search term must be at least 2 characters', 400);
    }

    return await FileModel.searchFiles(userId, searchTerm, filters);
  }

  static async getStorageStats(userId: string): Promise<any> {
    const userStats = await FileModel.getStorageStats(userId);
    
    const totalSize = userStats.reduce((sum: number, stat: any) => sum + parseInt(stat.total_size || '0'), 0);
    const totalFiles = userStats.reduce((sum: number, stat: any) => sum + parseInt(stat.count || '0'), 0);

    return {
      byType: userStats,
      totals: {
        files: totalFiles,
        size: totalSize,
        sizeFormatted: this.formatFileSize(totalSize),
      },
    };
  }

  private static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}