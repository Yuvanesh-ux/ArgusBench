import { emailService } from './emailService';
import { getSocketService } from './socketService';
import { UserModel } from '../models/User';
import { TaskModel } from '../models/Task';
import { ProjectModel } from '../models/Project';
import { logger } from '../utils/logger';

export interface NotificationContext {
  userId?: string;
  taskId?: string;
  projectId?: string;
  commentId?: string;
  fileId?: string;
}

export class NotificationService {
  public static async notifyTaskAssignment(
    taskId: string,
    assigneeId: string,
    assignerId: string
  ): Promise<void> {
    try {
      const [task, assignee, assigner] = await Promise.all([
        TaskModel.findWithDetails(taskId),
        UserModel.findById(assigneeId),
        UserModel.findById(assignerId),
      ]);

      if (!task || !assignee || !assigner) {
        logger.error('Missing data for task assignment notification');
        return;
      }

      await emailService.sendTaskAssignmentEmail(
        assignee.email,
        `${assignee.first_name} ${assignee.last_name}`,
        task.title,
        task.project_name,
        `${assigner.first_name} ${assigner.last_name}`
      );

      const socketService = getSocketService();
      socketService.notifyUserUpdate(assigneeId, 'task-assigned', {
        taskId,
        taskTitle: task.title,
        projectName: task.project_name,
        assignerName: `${assigner.first_name} ${assigner.last_name}`,
      });

      logger.info(`Task assignment notification sent: ${taskId} -> ${assigneeId}`);
    } catch (error) {
      logger.error('Failed to send task assignment notification:', error);
    }
  }

  public static async notifyCommentMention(
    commentId: string,
    taskId: string,
    authorId: string,
    mentionedUserIds: string[]
  ): Promise<void> {
    try {
      const [task, author] = await Promise.all([
        TaskModel.findWithDetails(taskId),
        UserModel.findById(authorId),
      ]);

      if (!task || !author) {
        logger.error('Missing data for comment mention notification');
        return;
      }

      const mentionedUsers = await Promise.all(
        mentionedUserIds.map(id => UserModel.findById(id))
      );

      const validUsers = mentionedUsers.filter(user => user !== null);

      for (const user of validUsers) {
        if (!user || user.id === authorId) continue;

        await emailService.sendCommentNotificationEmail(
          user.email,
          `${user.first_name} ${user.last_name}`,
          task.title,
          `${author.first_name} ${author.last_name}`,
          'You were mentioned in a comment'
        );

        const socketService = getSocketService();
        socketService.notifyUserUpdate(user.id, 'comment-mention', {
          commentId,
          taskId,
          taskTitle: task.title,
          authorName: `${author.first_name} ${author.last_name}`,
        });
      }

      logger.info(`Comment mention notifications sent: ${commentId}`);
    } catch (error) {
      logger.error('Failed to send comment mention notifications:', error);
    }
  }

  public static async notifyProjectInvitation(
    projectId: string,
    inviteeId: string,
    inviterId: string,
    role: string
  ): Promise<void> {
    try {
      const [project, invitee, inviter] = await Promise.all([
        ProjectModel.findById(projectId),
        UserModel.findById(inviteeId),
        UserModel.findById(inviterId),
      ]);

      if (!project || !invitee || !inviter) {
        logger.error('Missing data for project invitation notification');
        return;
      }

      await emailService.sendProjectInvitationEmail(
        invitee.email,
        `${invitee.first_name} ${invitee.last_name}`,
        project.name,
        `${inviter.first_name} ${inviter.last_name}`,
        role
      );

      const socketService = getSocketService();
      socketService.notifyUserUpdate(inviteeId, 'project-invitation', {
        projectId,
        projectName: project.name,
        inviterName: `${inviter.first_name} ${inviter.last_name}`,
        role,
      });

      logger.info(`Project invitation notification sent: ${projectId} -> ${inviteeId}`);
    } catch (error) {
      logger.error('Failed to send project invitation notification:', error);
    }
  }

  public static async notifyTaskDueDate(
    taskId: string,
    assigneeId: string
  ): Promise<void> {
    try {
      const [task, assignee] = await Promise.all([
        TaskModel.findWithDetails(taskId),
        UserModel.findById(assigneeId),
      ]);

      if (!task || !assignee || !task.due_date) {
        return;
      }

      const dueDate = new Date(task.due_date);
      const now = new Date();
      const timeDiff = dueDate.getTime() - now.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

      if (daysDiff <= 1 && daysDiff >= 0) {
        await emailService.sendTaskDueDateReminderEmail(
          assignee.email,
          `${assignee.first_name} ${assignee.last_name}`,
          task.title,
          task.project_name,
          dueDate
        );

        const socketService = getSocketService();
        socketService.notifyUserUpdate(assigneeId, 'task-due-reminder', {
          taskId,
          taskTitle: task.title,
          projectName: task.project_name,
          dueDate,
          daysDiff,
        });

        logger.info(`Task due date reminder sent: ${taskId} -> ${assigneeId}`);
      }
    } catch (error) {
      logger.error('Failed to send task due date notification:', error);
    }
  }

  public static async notifyTaskStatusChange(
    taskId: string,
    oldStatus: string,
    newStatus: string,
    changedByUserId: string
  ): Promise<void> {
    try {
      const task = await TaskModel.findWithDetails(taskId);
      if (!task) return;

      const socketService = getSocketService();
      socketService.notifyTaskUpdate(taskId, task.project_id, 'status-changed', {
        oldStatus,
        newStatus,
        changedBy: changedByUserId,
      });

      if (task.assignee_id && task.assignee_id !== changedByUserId) {
        const [assignee, changer] = await Promise.all([
          UserModel.findById(task.assignee_id),
          UserModel.findById(changedByUserId),
        ]);

        if (assignee && changer) {
          socketService.notifyUserUpdate(task.assignee_id, 'task-status-changed', {
            taskId,
            taskTitle: task.title,
            oldStatus,
            newStatus,
            changerName: `${changer.first_name} ${changer.last_name}`,
          });
        }
      }

      logger.info(`Task status change notification sent: ${taskId} ${oldStatus} -> ${newStatus}`);
    } catch (error) {
      logger.error('Failed to send task status change notification:', error);
    }
  }

  public static async sendBulkProjectNotification(
    projectId: string,
    subject: string,
    message: string,
    senderId: string
  ): Promise<void> {
    try {
      const members = await ProjectModel.getMembers(projectId);
      const sender = await UserModel.findById(senderId);

      if (!sender) {
        logger.error('Sender not found for bulk notification');
        return;
      }

      const recipients = members
        .filter(member => member.id !== senderId)
        .map(member => member.email);

      if (recipients.length === 0) return;

      await emailService.sendBulkEmail(recipients, {
        subject,
        text: `${message}\n\nSent by: ${sender.first_name} ${sender.last_name}`,
      });

      const socketService = getSocketService();
      socketService.notifyProjectUpdate(projectId, 'bulk-notification', {
        subject,
        message,
        senderName: `${sender.first_name} ${sender.last_name}`,
      });

      logger.info(`Bulk project notification sent to ${recipients.length} members`);
    } catch (error) {
      logger.error('Failed to send bulk project notification:', error);
    }
  }

  public static async scheduleTaskDueDateReminders(): Promise<void> {
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const nextDay = new Date(tomorrow);
      nextDay.setDate(nextDay.getDate() + 1);

      const result = await TaskModel.findTasksDueBetween(tomorrow, nextDay);
      
      for (const task of result.rows) {
        if (task.assignee_id) {
          await this.notifyTaskDueDate(task.id, task.assignee_id);
        }
      }

      logger.info(`Processed ${result.rows.length} due date reminders`);
    } catch (error) {
      logger.error('Failed to process due date reminders:', error);
    }
  }
}