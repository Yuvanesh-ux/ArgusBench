import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import path from 'path';
import fs from 'fs';
import { logger } from '../utils/logger';

export interface EmailOptions {
  to: string;
  subject: string;
  template?: string;
  context?: Record<string, any>;
  html?: string;
  text?: string;
}

export class EmailService {
  private transporter: nodemailer.Transporter;
  private fromEmail: string;

  constructor() {
    this.fromEmail = process.env.FROM_EMAIL || 'noreply@taskflow.com';
    
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  private async loadTemplate(templateName: string): Promise<string> {
    const templatePath = path.join(process.cwd(), 'src', 'templates', 'email', `${templateName}.html`);
    
    try {
      return fs.readFileSync(templatePath, 'utf-8');
    } catch (error) {
      logger.error(`Failed to load email template: ${templateName}`, error);
      return this.getDefaultTemplate();
    }
  }

  private getDefaultTemplate(): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <title>{{subject}}</title>
          <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #3B82F6; color: white; padding: 20px; text-align: center; }
              .content { padding: 20px; background: #f9f9f9; }
              .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
              .button { display: inline-block; padding: 10px 20px; background: #3B82F6; color: white; text-decoration: none; border-radius: 5px; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>TaskFlow</h1>
              </div>
              <div class="content">
                  {{{content}}}
              </div>
              <div class="footer">
                  <p>This email was sent from TaskFlow. If you have any questions, please contact our support team.</p>
              </div>
          </div>
      </body>
      </html>
    `;
  }

  public async sendEmail(options: EmailOptions): Promise<void> {
    try {
      let html = options.html;

      if (options.template && options.context) {
        const template = handlebars.compile(options.template);
        html = template(options.context);
      } else if (!html && options.text) {
        const defaultTemplate = handlebars.compile(this.getDefaultTemplate());
        html = defaultTemplate({
          subject: options.subject,
          content: options.text.replace(/\n/g, '<br>'),
        });
      }

      const mailOptions = {
        from: this.fromEmail,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html,
      };

      const result = await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent successfully to ${options.to}`, { messageId: result.messageId });
    } catch (error) {
      logger.error(`Failed to send email to ${options.to}`, error);
      throw error;
    }
  }

  public async sendWelcomeEmail(userEmail: string, userName: string): Promise<void> {
    await this.sendEmail({
      to: userEmail,
      subject: 'Welcome to TaskFlow!',
      template: 'welcome',
      context: {
        userName,
        loginUrl: `${process.env.FRONTEND_URL}/login`,
      },
    });
  }

  public async sendPasswordResetEmail(userEmail: string, resetToken: string): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    await this.sendEmail({
      to: userEmail,
      subject: 'Password Reset Request',
      template: 'password-reset',
      context: {
        resetUrl,
        expirationTime: '1 hour',
      },
    });
  }

  public async sendTaskAssignmentEmail(
    assigneeEmail: string, 
    assigneeName: string, 
    taskTitle: string, 
    projectName: string, 
    assignerName: string
  ): Promise<void> {
    const taskUrl = `${process.env.FRONTEND_URL}/tasks`;
    
    await this.sendEmail({
      to: assigneeEmail,
      subject: `New Task Assignment: ${taskTitle}`,
      template: 'task-assignment',
      context: {
        assigneeName,
        taskTitle,
        projectName,
        assignerName,
        taskUrl,
      },
    });
  }

  public async sendCommentNotificationEmail(
    userEmail: string,
    userName: string,
    taskTitle: string,
    commenterName: string,
    commentContent: string
  ): Promise<void> {
    const taskUrl = `${process.env.FRONTEND_URL}/tasks`;
    
    await this.sendEmail({
      to: userEmail,
      subject: `New Comment on ${taskTitle}`,
      template: 'comment-notification',
      context: {
        userName,
        taskTitle,
        commenterName,
        commentContent: commentContent.substring(0, 200) + (commentContent.length > 200 ? '...' : ''),
        taskUrl,
      },
    });
  }

  public async sendProjectInvitationEmail(
    userEmail: string,
    userName: string,
    projectName: string,
    inviterName: string,
    role: string
  ): Promise<void> {
    const projectUrl = `${process.env.FRONTEND_URL}/projects`;
    
    await this.sendEmail({
      to: userEmail,
      subject: `Project Invitation: ${projectName}`,
      template: 'project-invitation',
      context: {
        userName,
        projectName,
        inviterName,
        role,
        projectUrl,
      },
    });
  }

  public async sendTaskDueDateReminderEmail(
    userEmail: string,
    userName: string,
    taskTitle: string,
    projectName: string,
    dueDate: Date
  ): Promise<void> {
    const taskUrl = `${process.env.FRONTEND_URL}/tasks`;
    
    await this.sendEmail({
      to: userEmail,
      subject: `Task Due Date Reminder: ${taskTitle}`,
      template: 'due-date-reminder',
      context: {
        userName,
        taskTitle,
        projectName,
        dueDate: dueDate.toLocaleDateString(),
        taskUrl,
      },
    });
  }

  public async sendBulkEmail(recipients: string[], options: Omit<EmailOptions, 'to'>): Promise<void> {
    const promises = recipients.map(email => 
      this.sendEmail({ ...options, to: email })
    );
    
    await Promise.allSettled(promises);
    logger.info(`Bulk email sent to ${recipients.length} recipients`);
  }

  public async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      logger.info('Email service connection verified');
      return true;
    } catch (error) {
      logger.error('Email service connection failed', error);
      return false;
    }
  }
}

export const emailService = new EmailService();