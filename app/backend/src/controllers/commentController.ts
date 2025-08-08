import { Request, Response } from 'express';
import { CommentService } from '../services/commentService';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

export const createComment = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw createError('Authentication required', 401);
  }

  const { content, taskId, parentId } = req.body;

  if (!taskId) {
    throw createError('Task ID is required', 400);
  }

  const comment = await CommentService.createComment(userId, {
    content,
    taskId,
    parentId,
  });

  logger.info(`Comment created: ${comment.id} on task: ${taskId} by user: ${userId}`);

  res.status(201).json({
    success: true,
    message: 'Comment created successfully',
    data: { comment },
  });
});

export const getTaskComments = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { taskId } = req.params;
  const threaded = req.query.threaded === 'true';

  if (!userId) {
    throw createError('Authentication required', 401);
  }
  if (!taskId) {
    throw createError('Task ID is required', 400);
  }

  const comments = await CommentService.getTaskComments(taskId, userId, threaded);

  res.json({
    success: true,
    data: { comments, threaded },
  });
});

export const getCommentById = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { id } = req.params;

  if (!userId) {
    throw createError('Authentication required', 401);
  }
  if (!id) {
    throw createError('Comment ID is required', 400);
  }

  const comment = await CommentService.getCommentById(id, userId);

  res.json({
    success: true,
    data: { comment },
  });
});

export const updateComment = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { id } = req.params;
  const { content } = req.body;

  if (!userId) {
    throw createError('Authentication required', 401);
  }
  if (!id) {
    throw createError('Comment ID is required', 400);
  }

  const comment = await CommentService.updateComment(id, userId, content);

  logger.info(`Comment updated: ${id} by user: ${userId}`);

  res.json({
    success: true,
    message: 'Comment updated successfully',
    data: { comment },
  });
});

export const deleteComment = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { id } = req.params;

  if (!userId) {
    throw createError('Authentication required', 401);
  }
  if (!id) {
    throw createError('Comment ID is required', 400);
  }

  await CommentService.deleteComment(id, userId);

  logger.info(`Comment deleted: ${id} by user: ${userId}`);

  res.json({
    success: true,
    message: 'Comment deleted successfully',
  });
});

export const getReplies = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { id } = req.params;

  if (!userId) {
    throw createError('Authentication required', 401);
  }
  if (!id) {
    throw createError('Comment ID is required', 400);
  }

  const replies = await CommentService.getReplies(id, userId);

  res.json({
    success: true,
    data: { replies },
  });
});

export const getCommentCount = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { taskId } = req.params;

  if (!userId) {
    throw createError('Authentication required', 401);
  }
  if (!taskId) {
    throw createError('Task ID is required', 400);
  }

  const count = await CommentService.getCommentCount(taskId, userId);

  res.json({
    success: true,
    data: { count },
  });
});

export const searchComments = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { q, projectId } = req.query;

  if (!userId) {
    throw createError('Authentication required', 401);
  }

  if (!q || typeof q !== 'string') {
    throw createError('Search query is required', 400);
  }

  const comments = await CommentService.searchComments(
    userId, 
    q, 
    projectId as string
  );

  res.json({
    success: true,
    data: { comments, query: q },
  });
});