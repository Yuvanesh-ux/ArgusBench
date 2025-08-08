import { Request, Response } from 'express';
import { aiService, ChatMessage } from '../services/aiService';
import { TaskModel } from '../models/Task';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

export const chatCompletion = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw createError('Authentication required', 401);
  }

  const { messages, projectId, taskId } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    throw createError('Messages array is required', 400);
  }

  if (messages.some((msg: any) => !msg.role || !msg.content)) {
    throw createError('Each message must have role and content', 400);
  }

  const validRoles = ['user', 'assistant', 'system'];
  if (messages.some((msg: any) => !validRoles.includes(msg.role))) {
    throw createError('Invalid message role', 400);
  }

  const response = await aiService.chatCompletion(messages as ChatMessage[], userId, {
    projectId,
    taskId,
  });

  logger.info(`AI chat completion for user: ${userId}`);

  res.json({
    success: true,
    data: response,
  });
});

export const generateTaskSuggestions = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw createError('Authentication required', 401);
  }

  const { projectId, description } = req.body;

  if (!projectId) {
    throw createError('Project ID is required', 400);
  }

  const suggestions = await aiService.generateTaskSuggestions(projectId, userId, description);

  logger.info(`AI task suggestions generated for project: ${projectId}`);

  res.json({
    success: true,
    data: { suggestions },
  });
});

export const generateProjectDescription = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw createError('Authentication required', 401);
  }

  const { projectName, keywords } = req.body;

  if (!projectName || typeof projectName !== 'string') {
    throw createError('Project name is required', 400);
  }

  if (keywords && (!Array.isArray(keywords) || keywords.some((k: any) => typeof k !== 'string'))) {
    throw createError('Keywords must be an array of strings', 400);
  }

  const description = await aiService.generateProjectDescription(projectName, userId, keywords);

  logger.info(`AI project description generated for: ${projectName}`);

  res.json({
    success: true,
    data: { description },
  });
});

export const summarizeTask = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { id } = req.params;

  if (!userId) {
    throw createError('Authentication required', 401);
  }
  if (!id) {
    throw createError('Task ID is required', 400);
  }

  const summary = await aiService.summarizeTask(id, userId);
  const task = await TaskModel.findWithDetails(id);

  logger.info(`AI task summary generated for task: ${id}`);

  res.json({ success: true, data: { summary, raw: task?.description } });
});

export const generateMeetingNotes = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw createError('Authentication required', 401);
  }

  const { content, projectId } = req.body;

  if (!content || typeof content !== 'string') {
    throw createError('Meeting content is required', 400);
  }

  if (content.length < 50) {
    throw createError('Meeting content too short for analysis', 400);
  }

  if (content.length > 10000) {
    throw createError('Meeting content too long (max 10,000 characters)', 400);
  }

  const notes = await aiService.generateMeetingNotes(content, userId, projectId);

  logger.info(`AI meeting notes generated for user: ${userId}`);

  res.json({
    success: true,
    data: notes,
  });
});

export const getAICapabilities = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw createError('Authentication required', 401);
  }

  const capabilities = {
    chatCompletion: {
      description: 'Interactive chat with AI assistant for project management guidance',
      maxMessages: 10,
      maxTokensPerMessage: 500,
    },
    taskSuggestions: {
      description: 'Generate relevant task suggestions for projects',
      maxSuggestions: 5,
    },
    projectDescription: {
      description: 'Generate professional project descriptions',
      maxKeywords: 10,
    },
    taskSummarization: {
      description: 'Summarize task details and progress',
    },
    meetingNotes: {
      description: 'Extract action items and decisions from meeting content',
      maxContentLength: 10000,
    },
  };

  res.json({
    success: true,
    data: { capabilities },
  });
});