import { CommentModel } from '../models/Comment';
import { TaskModel } from '../models/Task';
import { ProjectModel } from '../models/Project';
import { createError } from '../middleware/errorHandler';
import { Comment } from '../types/database';

export class CommentService {
  static async createComment(
    userId: string,
    commentData: {
      content: string;
      taskId: string;
      parentId?: string;
    }
  ): Promise<Comment> {
    if (!commentData.content || commentData.content.trim().length === 0) {
      throw createError('Comment content is required', 400);
    }

    if (commentData.content.length > 2000) {
      throw createError('Comment cannot exceed 2000 characters', 400);
    }

    const task = await TaskModel.findById(commentData.taskId);
    if (!task) {
      throw createError('Task not found', 404);
    }

    const isMember = await ProjectModel.isMember(task.project_id, userId);
    if (!isMember) {
      throw createError('Access denied to this project', 403);
    }

    if (commentData.parentId) {
      const parentComment = await CommentModel.findById(commentData.parentId);
      if (!parentComment) {
        throw createError('Parent comment not found', 404);
      }

      if (parentComment.task_id !== commentData.taskId) {
        throw createError('Parent comment does not belong to this task', 400);
      }

      if (parentComment.parent_id) {
        throw createError('Cannot reply to a reply (max 2 levels)', 400);
      }
    }

    return await CommentModel.create({
      content: commentData.content.trim(),
      taskId: commentData.taskId,
      authorId: userId,
      parentId: commentData.parentId ?? undefined,
    });
  }

  static async getTaskComments(taskId: string, userId: string, threaded = false): Promise<any[]> {
    const task = await TaskModel.findById(taskId);
    if (!task) {
      throw createError('Task not found', 404);
    }

    const isMember = await ProjectModel.isMember(task.project_id, userId);
    if (!isMember) {
      throw createError('Access denied to this project', 403);
    }

    if (threaded) {
      return await CommentModel.getThreadedComments(taskId);
    } else {
      return await CommentModel.findByTaskId(taskId);
    }
  }

  static async getCommentById(commentId: string, userId: string): Promise<any> {
    const comment = await CommentModel.findWithDetails(commentId);
    if (!comment) {
      throw createError('Comment not found', 404);
    }

    const isMember = await ProjectModel.isMember(comment.project_id, userId);
    if (!isMember) {
      throw createError('Access denied', 403);
    }

    return comment;
  }

  static async updateComment(
    commentId: string,
    userId: string,
    content: string
  ): Promise<Comment> {
    if (!content || content.trim().length === 0) {
      throw createError('Comment content is required', 400);
    }

    if (content.length > 2000) {
      throw createError('Comment cannot exceed 2000 characters', 400);
    }

    const comment = await CommentModel.findWithDetails(commentId);
    if (!comment) {
      throw createError('Comment not found', 404);
    }

    if (comment.author_id !== userId) {
      throw createError('You can only edit your own comments', 403);
    }

    const isMember = await ProjectModel.isMember(comment.project_id, userId);
    if (!isMember) {
      throw createError('Access denied', 403);
    }

    const updatedComment = await CommentModel.updateById(commentId, {
      content: content.trim(),
    });

    if (!updatedComment) {
      throw createError('Failed to update comment', 500);
    }

    return updatedComment;
  }

  static async deleteComment(commentId: string, userId: string): Promise<void> {
    const comment = await CommentModel.findWithDetails(commentId);
    if (!comment) {
      throw createError('Comment not found', 404);
    }

    const memberRole = await ProjectModel.getMemberRole(comment.project_id, userId);
    if (!memberRole) {
      throw createError('Access denied', 403);
    }

    const canDelete = comment.author_id === userId || 
                     memberRole === 'admin' || 
                     memberRole === 'manager';

    if (!canDelete) {
      throw createError('Insufficient permissions to delete this comment', 403);
    }

    const deleted = await CommentModel.deleteById(commentId);
    if (!deleted) {
      throw createError('Failed to delete comment', 500);
    }
  }

  static async getReplies(commentId: string, userId: string): Promise<any[]> {
    const comment = await CommentModel.findWithDetails(commentId);
    if (!comment) {
      throw createError('Comment not found', 404);
    }

    const isMember = await ProjectModel.isMember(comment.project_id, userId);
    if (!isMember) {
      throw createError('Access denied', 403);
    }

    return await CommentModel.findReplies(commentId);
  }

  static async getCommentCount(taskId: string, userId: string): Promise<number> {
    const task = await TaskModel.findById(taskId);
    if (!task) {
      throw createError('Task not found', 404);
    }

    const isMember = await ProjectModel.isMember(task.project_id, userId);
    if (!isMember) {
      throw createError('Access denied to this project', 403);
    }

    return await CommentModel.getCommentCount(taskId);
  }

  static async searchComments(
    userId: string,
    searchTerm: string,
    projectId?: string
  ): Promise<any[]> {
    if (!searchTerm || searchTerm.trim().length < 2) {
      throw createError('Search term must be at least 2 characters', 400);
    }

    return await CommentModel.searchComments(userId, searchTerm, projectId);
  }
}