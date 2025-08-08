import { Request, Response } from 'express';
import { TaskService } from '../services/taskService';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

export const createTask = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw createError('Authentication required', 401);
  }

  const { title, description, status, priority, projectId, assigneeId, dueDate } = req.body;

  if (!projectId) {
    throw createError('Project ID is required', 400);
  }

  const task = await TaskService.createTask(userId, {
    title,
    description,
    status,
    priority,
    projectId,
    assigneeId,
    dueDate,
  });

  logger.info(`Task created: ${task.id} in project: ${projectId} by user: ${userId}`);

  res.status(201).json({
    success: true,
    message: 'Task created successfully',
    data: { task },
  });
});

export const getTaskById = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { id } = req.params;

  if (!userId) {
    throw createError('Authentication required', 401);
  }
  if (!id) {
    throw createError('Task ID is required', 400);
  }

  const task = await TaskService.getTaskById(id, userId);

  res.json({
    success: true,
    data: { task },
  });
});

export const getProjectTasks = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { projectId } = req.params;

  if (!userId) {
    throw createError('Authentication required', 401);
  }
  if (!projectId) {
    throw createError('Project ID is required', 400);
  }

  const tasks = await TaskService.getProjectTasks(projectId, userId);

  res.json({
    success: true,
    data: { tasks },
  });
});

export const updateTask = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { id } = req.params;
  const { title, description, status, priority, assigneeId, dueDate } = req.body;

  if (!userId) {
    throw createError('Authentication required', 401);
  }
  if (!id) {
    throw createError('Task ID is required', 400);
  }

  const task = await TaskService.updateTask(id, userId, {
    title,
    description,
    status,
    priority,
    assigneeId,
    dueDate,
  });

  logger.info(`Task updated: ${id} by user: ${userId}`);

  res.json({
    success: true,
    message: 'Task updated successfully',
    data: { task },
  });
});

export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { id } = req.params;

  if (!userId) {
    throw createError('Authentication required', 401);
  }
  if (!id) {
    throw createError('Task ID is required', 400);
  }

  await TaskService.deleteTask(id, userId);

  logger.info(`Task deleted: ${id} by user: ${userId}`);

  res.json({
    success: true,
    message: 'Task deleted successfully',
  });
});

export const getUserTasks = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw createError('Authentication required', 401);
  }

  const tasks = await TaskService.getUserTasks(userId);

  res.json({
    success: true,
    data: { tasks },
  });
});

export const searchTasks = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { q, status, priority, assigneeId, projectId } = req.query;

  if (!userId) {
    throw createError('Authentication required', 401);
  }

  if (!q || typeof q !== 'string') {
    throw createError('Search query is required', 400);
  }

  const tasks = await TaskService.searchTasks(userId, q, {
    status: status as string,
    priority: priority as string,
    assigneeId: assigneeId as string,
    projectId: projectId as string,
  });

  res.json({
    success: true,
    data: { tasks, query: q },
  });
});

export const getTaskStats = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { projectId } = req.params;

  if (!userId) {
    throw createError('Authentication required', 401);
  }
  if (!projectId) {
    throw createError('Project ID is required', 400);
  }

  const stats = await TaskService.getTaskStats(projectId, userId);

  res.json({
    success: true,
    data: { stats },
  });
});

export const getUserTaskStats = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw createError('Authentication required', 401);
  }

  const stats = await TaskService.getUserTaskStats(userId);

  res.json({
    success: true,
    data: { stats },
  });
});