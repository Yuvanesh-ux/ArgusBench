import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 50;
  const offset = parseInt(req.query.offset as string) || 0;

  if (limit > 100) {
    throw createError('Limit cannot exceed 100', 400);
  }

  const users = await UserService.getAllUsers(limit, offset);

  res.json({
    success: true,
    data: { users, limit, offset },
  });
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) throw createError('User ID is required', 400);
  const user = await UserService.getUserById(id);

  res.json({
    success: true,
    data: { user },
  });
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) throw createError('User ID is required', 400);
  const { firstName, lastName, avatarUrl } = req.body;

  if (req.user?.userId !== id && req.user?.role !== 'admin') {
    throw createError('Unauthorized to update this user', 403);
  }

  const user = await UserService.updateUser(id, {
    firstName,
    lastName,
    avatarUrl,
  });

  logger.info(`User updated: ${id}`);

  res.json({
    success: true,
    message: 'User updated successfully',
    data: { user },
  });
});

export const updateUserRole = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) throw createError('User ID is required', 400);
  const { role } = req.body;

  if (!['admin', 'manager', 'member'].includes(role)) {
    throw createError('Invalid role', 400);
  }

  const user = await UserService.updateUserRole(id, role);

  logger.info(`User role updated: ${id} -> ${role}`);

  res.json({
    success: true,
    message: 'User role updated successfully',
    data: { user },
  });
});

export const deactivateUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) throw createError('User ID is required', 400);

  if (req.user?.userId === id) {
    throw createError('Cannot deactivate your own account', 400);
  }

  await UserService.deactivateUser(id);

  logger.info(`User deactivated: ${id}`);

  res.json({
    success: true,
    message: 'User deactivated successfully',
  });
});

export const activateUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) throw createError('User ID is required', 400);
  const user = await UserService.activateUser(id);

  logger.info(`User activated: ${id}`);

  res.json({
    success: true,
    message: 'User activated successfully',
    data: { user },
  });
});

export const searchUsers = asyncHandler(async (req: Request, res: Response) => {
  const { q } = req.query;
  const limit = parseInt(req.query.limit as string) || 20;

  if (!q || typeof q !== 'string') {
    throw createError('Search query is required', 400);
  }

  if (q.length < 2) {
    throw createError('Search query must be at least 2 characters', 400);
  }

  const users = await UserService.searchUsers(q, limit);

  res.json({
    success: true,
    data: { users, query: q },
  });
});