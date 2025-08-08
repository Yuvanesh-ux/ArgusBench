import { Request, Response } from 'express';
import { FileService } from '../services/fileService';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

export const uploadFile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw createError('Authentication required', 401);
  }

  if (!req.file) {
    throw createError('No file uploaded', 400);
  }

  const { taskId, projectId } = req.body;

  const file = await FileService.uploadFile(userId, req.file, {
    taskId,
    projectId,
  });

  logger.info(`File uploaded: ${file.id} by user: ${userId}`);

  res.status(201).json({
    success: true,
    message: 'File uploaded successfully',
    data: { file },
  });
});

export const uploadMultipleFiles = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw createError('Authentication required', 401);
  }

  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) {
    throw createError('No files uploaded', 400);
  }

  const { taskId, projectId } = req.body;
  const uploadedFiles = [];

  for (const file of files) {
    const uploadedFile = await FileService.uploadFile(userId, file, {
      taskId,
      projectId,
    });
    uploadedFiles.push(uploadedFile);
  }

  logger.info(`Multiple files uploaded: ${uploadedFiles.length} files by user: ${userId}`);

  res.status(201).json({
    success: true,
    message: `${uploadedFiles.length} files uploaded successfully`,
    data: { files: uploadedFiles },
  });
});

export const getFileById = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { id } = req.params;

  if (!userId) {
    throw createError('Authentication required', 401);
  }
  if (!id) {
    throw createError('File ID is required', 400);
  }

  const file = await FileService.getFileById(id, userId);

  res.json({
    success: true,
    data: { file },
  });
});

export const downloadFile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { id } = req.params;

  if (!userId) {
    throw createError('Authentication required', 401);
  }
  if (!id) {
    throw createError('File ID is required', 400);
  }

  const fileData = await FileService.downloadFile(id, userId);

  res.setHeader('Content-Type', fileData.mimeType);
  res.setHeader('Content-Disposition', `attachment; filename="${fileData.originalName}"`);
  res.sendFile(fileData.filePath);

  logger.info(`File downloaded: ${id} by user: ${userId}`);
});

export const deleteFile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { id } = req.params;

  if (!userId) {
    throw createError('Authentication required', 401);
  }
  if (!id) {
    throw createError('File ID is required', 400);
  }

  await FileService.deleteFile(id, userId);

  logger.info(`File deleted: ${id} by user: ${userId}`);

  res.json({
    success: true,
    message: 'File deleted successfully',
  });
});

export const getTaskFiles = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { taskId } = req.params;

  if (!userId) {
    throw createError('Authentication required', 401);
  }
  if (!taskId) {
    throw createError('Task ID is required', 400);
  }

  const files = await FileService.getTaskFiles(taskId, userId);

  res.json({
    success: true,
    data: { files },
  });
});

export const getProjectFiles = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { projectId } = req.params;

  if (!userId) {
    throw createError('Authentication required', 401);
  }
  if (!projectId) {
    throw createError('Project ID is required', 400);
  }

  const files = await FileService.getProjectFiles(projectId, userId);

  res.json({
    success: true,
    data: { files },
  });
});

export const getUserFiles = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw createError('Authentication required', 401);
  }

  const files = await FileService.getUserFiles(userId);

  res.json({
    success: true,
    data: { files },
  });
});

export const searchFiles = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { q, fileType, projectId, taskId } = req.query;

  if (!userId) {
    throw createError('Authentication required', 401);
  }

  if (!q || typeof q !== 'string') {
    throw createError('Search query is required', 400);
  }

  const files = await FileService.searchFiles(userId, q, {
    fileType: fileType as string,
    projectId: projectId as string,
    taskId: taskId as string,
  });

  res.json({
    success: true,
    data: { files, query: q },
  });
});

export const getStorageStats = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw createError('Authentication required', 401);
  }

  const stats = await FileService.getStorageStats(userId);

  res.json({
    success: true,
    data: { stats },
  });
});