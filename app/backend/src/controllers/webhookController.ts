import { Request, Response } from 'express';
import { WebhookService } from '../services/webhookService';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

export const handleGitHubWebhook = asyncHandler(async (req: Request, res: Response) => {
  const signature = req.headers['x-hub-signature-256'] as string;
  const projectId = req.query.project_id as string;

  if (!signature) {
    throw createError('Missing GitHub signature', 400);
  }

  await WebhookService.processGitHubWebhook(req.body, signature, projectId);

  logger.info(`GitHub webhook processed for project: ${projectId || 'none'}`);

  res.status(200).json({
    success: true,
    message: 'GitHub webhook processed successfully',
  });
});

export const handleSlackWebhook = asyncHandler(async (req: Request, res: Response) => {
  const projectId = req.query.project_id as string;

  const result = await WebhookService.processSlackWebhook(req.body, projectId);

  logger.info(`Slack webhook processed for project: ${projectId || 'none'}`);

  if (result.challenge) {
    res.status(200).json(result);
  } else {
    res.status(200).json({
      success: true,
      message: 'Slack webhook processed successfully',
    });
  }
});

export const handleGenericWebhook = asyncHandler(async (req: Request, res: Response) => {
  const projectId = req.query.project_id as string;
  const headers = req.headers as Record<string, string>;

  await WebhookService.processGenericWebhook(req.body, headers, projectId);

  logger.info(`Generic webhook processed for project: ${projectId || 'none'}`);

  res.status(200).json({
    success: true,
    message: 'Webhook processed successfully',
  });
});

export const sendTestWebhook = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw createError('Authentication required', 401);
  }

  const { url, secret } = req.body;

  if (!url) {
    throw createError('Webhook URL is required', 400);
  }

  try {
    new URL(url);
  } catch {
    throw createError('Invalid webhook URL', 400);
  }

  const testPayload = {
    event: 'webhook.test',
    timestamp: new Date().toISOString(),
    data: {
      message: 'This is a test webhook from TaskFlow',
      user_id: userId,
    },
  };

  const success = await WebhookService.sendOutgoingWebhook(url, testPayload, secret);

  res.json({
    success,
    message: success ? 'Test webhook sent successfully' : 'Test webhook failed',
    data: { url, timestamp: testPayload.timestamp },
  });
});

export const registerWebhook = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw createError('Authentication required', 401);
  }

  const { projectId, url, secret, events } = req.body;

  if (!projectId || !url || !events) {
    throw createError('Project ID, URL, and events are required', 400);
  }

  if (!Array.isArray(events) || events.length === 0) {
    throw createError('Events must be a non-empty array', 400);
  }

  try {
    new URL(url);
  } catch {
    throw createError('Invalid webhook URL', 400);
  }

  const validEvents = [
    'task.created',
    'task.updated',
    'task.deleted',
    'project.updated',
    'comment.created',
    'file.uploaded',
    'member.added',
    'member.removed',
  ];

  const invalidEvents = events.filter((event: string) => !validEvents.includes(event));
  if (invalidEvents.length > 0) {
    throw createError(`Invalid events: ${invalidEvents.join(', ')}`, 400);
  }

  WebhookService.registerWebhook(projectId, {
    url,
    secret,
    events,
    active: true,
    projectId,
  });

  logger.info(`Webhook registered: ${url} for project: ${projectId}`);

  res.status(201).json({
    success: true,
    message: 'Webhook registered successfully',
    data: { projectId, url, events },
  });
});

export const getWebhooks = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw createError('Authentication required', 401);
  }

  const { projectId } = req.params;

  if (!projectId) {
    throw createError('Project ID is required', 400);
  }

  const webhooks = WebhookService.getWebhooks(projectId);

  const sanitizedWebhooks = webhooks.map(hook => ({
    url: hook.url,
    events: hook.events,
    active: hook.active,
    hasSecret: !!hook.secret,
  }));

  res.json({
    success: true,
    data: { webhooks: sanitizedWebhooks },
  });
});

export const removeWebhook = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw createError('Authentication required', 401);
  }

  const { projectId } = req.params;
  const { url } = req.body;

  if (!projectId || !url) {
    throw createError('Project ID and URL are required', 400);
  }

  const removed = WebhookService.removeWebhook(projectId, url);

  if (!removed) {
    throw createError('Webhook not found', 404);
  }

  logger.info(`Webhook removed: ${url} from project: ${projectId}`);

  res.json({
    success: true,
    message: 'Webhook removed successfully',
  });
});

export const getWebhookEvents = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw createError('Authentication required', 401);
  }

  const events = {
    'task.created': 'Triggered when a new task is created',
    'task.updated': 'Triggered when a task is modified',
    'task.deleted': 'Triggered when a task is deleted',
    'project.updated': 'Triggered when project details are changed',
    'comment.created': 'Triggered when a new comment is added',
    'file.uploaded': 'Triggered when a file is uploaded',
    'member.added': 'Triggered when a new member joins the project',
    'member.removed': 'Triggered when a member leaves the project',
  };

  res.json({
    success: true,
    data: { events },
  });
});