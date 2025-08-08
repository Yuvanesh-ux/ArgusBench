import crypto from 'crypto';
import { logger } from '../utils/logger';
import { NotificationService } from './notificationService';
import { getSocketService } from './socketService';

export interface WebhookEvent {
  id: string;
  type: string;
  data: Record<string, any>;
  timestamp: string;
  signature?: string;
}

export interface WebhookConfig {
  url: string;
  secret?: string;
  events: string[];
  active: boolean;
  projectId?: string;
}

export class WebhookService {
  private static webhooks: Map<string, WebhookConfig[]> = new Map();

  public static async processGitHubWebhook(
    payload: any,
    signature: string,
    projectId?: string
  ): Promise<void> {
    try {
      if (!this.verifyGitHubSignature(payload, signature)) {
        throw new Error('Invalid GitHub webhook signature');
      }

      const eventType = payload.action || 'unknown';
      
      if (payload.pull_request) {
        await this.handlePullRequestEvent(payload, projectId);
      } else if (payload.commits) {
        await this.handlePushEvent(payload, projectId);
      } else if (payload.issue) {
        await this.handleIssueEvent(payload, projectId);
      }

      logger.info(`GitHub webhook processed: ${eventType}`);
    } catch (error) {
      logger.error('GitHub webhook processing failed:', error);
      throw error;
    }
  }

  public static async processSlackWebhook(
    payload: any,
    projectId?: string
  ): Promise<any> {
    try {
      if (payload.type === 'url_verification') {
        return { challenge: payload.challenge };
      }

      if (payload.event) {
        await this.handleSlackEvent(payload.event, projectId);
      }

      logger.info(`Slack webhook processed: ${payload.type}`);
      return { success: true };
    } catch (error) {
      logger.error('Slack webhook processing failed:', error);
      throw error;
    }
  }

  public static async processGenericWebhook(
    payload: any,
    headers: Record<string, string>,
    projectId?: string
  ): Promise<void> {
    try {
      const eventType = headers['x-event-type'] || 'generic';
      const source = headers['x-source'] || 'unknown';

      const socketService = getSocketService();
      
      if (projectId) {
        socketService.notifyProjectUpdate(projectId, 'webhook-received', {
          source,
          eventType,
          data: payload,
        });
      }

      await this.logWebhookEvent({
        id: crypto.randomUUID(),
        type: eventType,
        data: { source, payload, headers: this.sanitizeHeaders(headers) },
        timestamp: new Date().toISOString(),
      });

      logger.info(`Generic webhook processed: ${source}/${eventType}`);
    } catch (error) {
      logger.error('Generic webhook processing failed:', error);
      throw error;
    }
  }

  public static async sendOutgoingWebhook(
    url: string,
    payload: any,
    secret?: string
  ): Promise<boolean> {
    try {
      const body = JSON.stringify(payload);
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'User-Agent': 'TaskFlow-Webhook/1.0',
        'X-Timestamp': Date.now().toString(),
      };

      if (secret) {
        const signature = crypto
          .createHmac('sha256', secret)
          .update(body)
          .digest('hex');
        headers['X-Signature'] = `sha256=${signature}`;
      }

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body,
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      logger.info(`Outgoing webhook sent successfully: ${url}`);
      return true;
    } catch (error) {
      logger.error(`Outgoing webhook failed: ${url}`, error);
      return false;
    }
  }

  private static verifyGitHubSignature(payload: any, signature: string): boolean {
    if (!signature || !process.env.GITHUB_WEBHOOK_SECRET) {
      return false;
    }

    const expectedSignature = crypto
      .createHmac('sha256', process.env.GITHUB_WEBHOOK_SECRET)
      .update(JSON.stringify(payload))
      .digest('hex');

    return signature === `sha256=${expectedSignature}`;
  }

  private static async handlePullRequestEvent(payload: any, projectId?: string): Promise<void> {
    const pr = payload.pull_request;
    const action = payload.action;

    const socketService = getSocketService();
    
    if (projectId) {
      socketService.notifyProjectUpdate(projectId, 'github-pr-update', {
        action,
        prTitle: pr.title,
        prNumber: pr.number,
        author: pr.user.login,
        url: pr.html_url,
      });
    }

    if (action === 'opened' || action === 'ready_for_review') {
      await NotificationService.sendBulkProjectNotification(
        projectId || 'unknown',
        `New Pull Request: ${pr.title}`,
        `${pr.user.login} opened a pull request: ${pr.html_url}`,
        'system'
      );
    }
  }

  private static async handlePushEvent(payload: any, projectId?: string): Promise<void> {
    const commits = payload.commits || [];
    const branch = payload.ref?.replace('refs/heads/', '');

    const socketService = getSocketService();
    
    if (projectId && commits.length > 0) {
      socketService.notifyProjectUpdate(projectId, 'github-push', {
        branch,
        commitCount: commits.length,
        author: payload.pusher?.name || 'Unknown',
        repository: payload.repository?.full_name,
      });
    }
  }

  private static async handleIssueEvent(payload: any, projectId?: string): Promise<void> {
    const issue = payload.issue;
    const action = payload.action;

    const socketService = getSocketService();
    
    if (projectId) {
      socketService.notifyProjectUpdate(projectId, 'github-issue-update', {
        action,
        issueTitle: issue.title,
        issueNumber: issue.number,
        author: issue.user.login,
        url: issue.html_url,
      });
    }
  }

  private static async handleSlackEvent(event: any, projectId?: string): Promise<void> {
    if (event.type === 'message' && !event.subtype) {
      const socketService = getSocketService();
      
      if (projectId) {
        socketService.notifyProjectUpdate(projectId, 'slack-message', {
          channel: event.channel,
          user: event.user,
          text: event.text?.substring(0, 200),
          timestamp: event.ts,
        });
      }
    }
  }

  private static async logWebhookEvent(event: WebhookEvent): Promise<void> {
    logger.info('Webhook event logged', {
      id: event.id,
      type: event.type,
      timestamp: event.timestamp,
    });
  }

  private static sanitizeHeaders(headers: Record<string, string>): Record<string, string> {
    const sanitized: Record<string, string> = {};
    const allowedHeaders = [
      'content-type',
      'user-agent',
      'x-event-type',
      'x-source',
      'x-timestamp',
    ];

    for (const [key, value] of Object.entries(headers)) {
      if (allowedHeaders.includes(key.toLowerCase())) {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  public static registerWebhook(projectId: string, config: WebhookConfig): void {
    const existing = this.webhooks.get(projectId) || [];
    existing.push(config);
    this.webhooks.set(projectId, existing);
    
    logger.info(`Webhook registered for project: ${projectId}`);
  }

  public static getWebhooks(projectId: string): WebhookConfig[] {
    return this.webhooks.get(projectId) || [];
  }

  public static removeWebhook(projectId: string, url: string): boolean {
    const existing = this.webhooks.get(projectId) || [];
    const filtered = existing.filter(hook => hook.url !== url);
    
    if (filtered.length < existing.length) {
      this.webhooks.set(projectId, filtered);
      logger.info(`Webhook removed for project: ${projectId}, URL: ${url}`);
      return true;
    }
    
    return false;
  }
}