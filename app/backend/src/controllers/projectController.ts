import { Request, Response } from 'express';
import { ProjectService } from '../services/projectService';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

export const createProject = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw createError('Authentication required', 401);
  }

  const { name, description, color, isPublic } = req.body;

  const project = await ProjectService.createProject(userId, {
    name,
    description,
    color,
    isPublic,
  });

  logger.info(`Project created: ${project.id} by user: ${userId}`);

  res.status(201).json({
    success: true,
    message: 'Project created successfully',
    data: { project },
  });
});

export const getUserProjects = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw createError('Authentication required', 401);
  }

  const projects = await ProjectService.getUserProjects(userId);

  res.json({
    success: true,
    data: { projects },
  });
});

export const getProjectById = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { id } = req.params;

  if (!userId) {
    throw createError('Authentication required', 401);
  }
  if (!id) {
    throw createError('Project ID is required', 400);
  }

  const project = await ProjectService.getProjectById(id, userId);

  res.json({
    success: true,
    data: { project },
  });
});

export const updateProject = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { id } = req.params;
  const { name, description, color, isPublic } = req.body;

  if (!userId) {
    throw createError('Authentication required', 401);
  }
  if (!id) {
    throw createError('Project ID is required', 400);
  }

  const project = await ProjectService.updateProject(id, userId, {
    name,
    description,
    color,
    isPublic,
  });

  logger.info(`Project updated: ${id} by user: ${userId}`);

  res.json({
    success: true,
    message: 'Project updated successfully',
    data: { project },
  });
});

export const deleteProject = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { id } = req.params;

  if (!userId) {
    throw createError('Authentication required', 401);
  }
  if (!id) {
    throw createError('Project ID is required', 400);
  }

  await ProjectService.deleteProject(id, userId);

  logger.info(`Project deleted: ${id} by user: ${userId}`);

  res.json({
    success: true,
    message: 'Project deleted successfully',
  });
});

export const addMember = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { id } = req.params;
  const { userId: targetUserId, role } = req.body;

  if (!userId) {
    throw createError('Authentication required', 401);
  }
  if (!id) {
    throw createError('Project ID is required', 400);
  }

  if (!targetUserId) {
    throw createError('Target user ID is required', 400);
  }

  const member = await ProjectService.addMember(id, userId, targetUserId, role);

  logger.info(`Member added to project: ${id}, user: ${targetUserId}, role: ${role}`);

  res.status(201).json({
    success: true,
    message: 'Member added successfully',
    data: { member },
  });
});

export const removeMember = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { id, memberId } = req.params;

  if (!userId) {
    throw createError('Authentication required', 401);
  }
  if (!id) {
    throw createError('Project ID is required', 400);
  }
  if (!memberId) {
    throw createError('Member ID is required', 400);
  }

  await ProjectService.removeMember(id, userId, memberId);

  logger.info(`Member removed from project: ${id}, user: ${memberId}`);

  res.json({
    success: true,
    message: 'Member removed successfully',
  });
});

export const updateMemberRole = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { id, memberId } = req.params;
  const { role } = req.body;

  if (!userId) {
    throw createError('Authentication required', 401);
  }
  if (!id) {
    throw createError('Project ID is required', 400);
  }
  if (!memberId) {
    throw createError('Member ID is required', 400);
  }

  if (!['admin', 'manager', 'member'].includes(role)) {
    throw createError('Invalid role', 400);
  }

  const member = await ProjectService.updateMemberRole(id, userId, memberId, role);

  logger.info(`Member role updated in project: ${id}, user: ${memberId}, new role: ${role}`);

  res.json({
    success: true,
    message: 'Member role updated successfully',
    data: { member },
  });
});

export const getProjectMembers = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { id } = req.params;

  if (!userId) {
    throw createError('Authentication required', 401);
  }
  if (!id) {
    throw createError('Project ID is required', 400);
  }

  const members = await ProjectService.getProjectMembers(id, userId);

  res.json({
    success: true,
    data: { members },
  });
});

export const searchProjects = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { q } = req.query;

  if (!userId) {
    throw createError('Authentication required', 401);
  }

  if (!q || typeof q !== 'string') {
    throw createError('Search query is required', 400);
  }

  const projects = await ProjectService.searchProjects(userId, q);

  res.json({
    success: true,
    data: { projects, query: q },
  });
});