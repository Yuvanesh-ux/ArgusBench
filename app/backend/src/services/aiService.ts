import OpenAI from 'openai';
import { TaskModel } from '../models/Task';
import { ProjectModel } from '../models/Project';
import { UserModel } from '../models/User';
import { createError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  message: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  } | undefined;
  model: string;
}

export class AIService {
  private openai: OpenAI;
  private maxTokens: number = 1000;
  private model: string = 'gpt-3.5-turbo';

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      if (process.env.NODE_ENV === 'test') {
        this.openai = new OpenAI({ apiKey: 'test' });
      } else {
        throw new Error('OpenAI API key not configured');
      }
    } else {
      this.openai = new OpenAI({
        apiKey: apiKey,
      });
    }
  }

  public async chatCompletion(
    messages: ChatMessage[],
    userId: string,
    context?: {
      projectId?: string;
      taskId?: string;
    }
  ): Promise<AIResponse> {
    try {
      const systemPrompt = await this.buildSystemPrompt(userId, context);
      
      const fullMessages: ChatMessage[] = [
        { role: 'system', content: systemPrompt },
        ...messages,
      ];

      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: fullMessages,
        max_tokens: this.maxTokens,
        temperature: 0.7,
      });

      const choice = response.choices[0];
      if (!choice?.message?.content) {
        throw new Error('No response from OpenAI');
      }

      logger.info(`AI chat completion for user: ${userId}, tokens: ${response.usage?.total_tokens}`);

      return {
        message: choice.message.content,
        usage: response.usage ? {
          prompt_tokens: response.usage.prompt_tokens,
          completion_tokens: response.usage.completion_tokens,
          total_tokens: response.usage.total_tokens,
        } : undefined,
        model: response.model,
      };
    } catch (error) {
      logger.error('AI chat completion failed:', error);
      throw createError('AI service unavailable', 503);
    }
  }

  public async generateTaskSuggestions(
    projectId: string,
    userId: string,
    description?: string
  ): Promise<string[]> {
    try {
      const isMember = await ProjectModel.isMember(projectId, userId);
      if (!isMember) {
        throw createError('Access denied to this project', 403);
      }

      const project = await ProjectModel.findById(projectId);
      const existingTasks = await TaskModel.findByProjectId(projectId);

      const prompt = `
        Based on the project "${project?.name}" with description "${project?.description || 'No description'}", 
        and these existing tasks: ${existingTasks.map(t => t.title).join(', ')},
        ${description ? `and this additional context: "${description}",` : ''}
        suggest 5 relevant new tasks. Return only the task titles, one per line.
      `;

      const messages: ChatMessage[] = [
        { role: 'user', content: prompt },
      ];

      const response = await this.chatCompletion(messages, userId, { projectId: projectId ?? undefined });
      
      return response.message
        .split('\n')
        .map(line => line.trim().replace(/^\d+\.\s*/, ''))
        .filter(line => line.length > 0)
        .slice(0, 5);
    } catch (error) {
      logger.error('Task suggestion generation failed:', error);
      throw createError('Failed to generate task suggestions', 500);
    }
  }

  public async generateProjectDescription(
    projectName: string,
    userId: string,
    keywords?: string[]
  ): Promise<string> {
    try {
      const keywordsText = keywords?.length ? ` Keywords: ${keywords.join(', ')}.` : '';
      
      const prompt = `
        Generate a professional project description for a project named "${projectName}".${keywordsText}
        The description should be 2-3 sentences long and suitable for a team project management tool.
        Focus on clear objectives and deliverables.
      `;

      const messages: ChatMessage[] = [
        { role: 'user', content: prompt },
      ];

      const response = await this.chatCompletion(messages, userId);
      return response.message.trim();
    } catch (error) {
      logger.error('Project description generation failed:', error);
      throw createError('Failed to generate project description', 500);
    }
  }

  public async summarizeTask(
    taskId: string,
    userId: string
  ): Promise<string> {
    try {
      const task = await TaskModel.findWithDetails(taskId);
      if (!task) {
        throw createError('Task not found', 404);
      }

      const isMember = await ProjectModel.isMember(task.project_id, userId);
      if (!isMember) {
        throw createError('Access denied to this project', 403);
      }

      const prompt = `
        Summarize this task in 2-3 sentences:
        Title: ${task.title}
        Description: ${task.description || 'No description'}
        Status: ${task.status}
        Priority: ${task.priority}
        Assignee: ${task.assignee_first_name ? `${task.assignee_first_name} ${task.assignee_last_name}` : 'Unassigned'}
        Due Date: ${task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
      `;

      const messages: ChatMessage[] = [
        { role: 'user', content: prompt },
      ];

      const response = await this.chatCompletion(messages, userId, { 
        taskId, 
        projectId: task.project_id 
      });
      
      return response.message.trim();
    } catch (error) {
      logger.error('Task summarization failed:', error);
      throw createError('Failed to summarize task', 500);
    }
  }

  public async generateMeetingNotes(
    content: string,
    userId: string,
    projectId?: string
  ): Promise<{
    summary: string;
    actionItems: string[];
    decisions: string[];
  }> {
    try {
      if (projectId) {
        const isMember = await ProjectModel.isMember(projectId, userId);
        if (!isMember) {
          throw createError('Access denied to this project', 403);
        }
      }

      const prompt = `
        Analyze these meeting notes and extract:
        1. A brief summary (2-3 sentences)
        2. Action items (bullet points)
        3. Key decisions made (bullet points)

        Meeting content:
        ${content}

        Format the response as:
        SUMMARY:
        [summary text]

        ACTION ITEMS:
        - [item 1]
        - [item 2]

        DECISIONS:
        - [decision 1]
        - [decision 2]
      `;

      const messages: ChatMessage[] = [
        { role: 'user', content: prompt },
      ];

      const response = await this.chatCompletion(messages, userId, projectId ? { projectId } : undefined);
      
      const sections = this.parseMeetingNotesResponse(response.message);
      return sections;
    } catch (error) {
      logger.error('Meeting notes generation failed:', error);
      throw createError('Failed to process meeting notes', 500);
    }
  }

  private async buildSystemPrompt(
    userId: string, 
    context?: { projectId?: string; taskId?: string }
  ): Promise<string> {
    try {
      const user = await UserModel.findById(userId);
      let contextInfo = '';

      if (context?.projectId) {
        const project = await ProjectModel.findById(context.projectId);
        if (project) {
          contextInfo += `\nCurrent project: ${project.name}`;
          if (project.description) {
            contextInfo += ` - ${project.description}`;
          }
        }
      }

      if (context?.taskId) {
        const task = await TaskModel.findById(context.taskId);
        if (task) {
          contextInfo += `\nCurrent task: ${task.title} (${task.status})`;
        }
      }

      return `
        You are an AI assistant for TaskFlow, a team task management platform. 
        You're helping ${user?.first_name || 'a user'} with their project management needs.
        ${contextInfo}
        
        Provide helpful, concise responses related to:
        - Task and project management
        - Team collaboration
        - Productivity tips
        - Project planning

        Keep responses professional and actionable. If asked about topics unrelated to 
        project management, politely redirect the conversation back to TaskFlow features.
      `.trim();
    } catch (error) {
      return `You are an AI assistant for TaskFlow, a team task management platform. 
              Provide helpful responses related to project management and team collaboration.`;
    }
  }

  private parseMeetingNotesResponse(response: string): {
    summary: string;
    actionItems: string[];
    decisions: string[];
  } {
    const sections = {
      summary: '',
      actionItems: [] as string[],
      decisions: [] as string[],
    };

    const lines = response.split('\n');
    let currentSection = '';

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (trimmedLine.toUpperCase().startsWith('SUMMARY:')) {
        currentSection = 'summary';
        const summaryText = trimmedLine.replace(/^SUMMARY:\s*/i, '');
        if (summaryText) sections.summary = summaryText;
        continue;
      }
      
      if (trimmedLine.toUpperCase().startsWith('ACTION ITEMS:')) {
        currentSection = 'actionItems';
        continue;
      }
      
      if (trimmedLine.toUpperCase().startsWith('DECISIONS:')) {
        currentSection = 'decisions';
        continue;
      }

      if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('• ')) {
        const item = trimmedLine.replace(/^[-•]\s*/, '');
        if (currentSection === 'actionItems') {
          sections.actionItems.push(item);
        } else if (currentSection === 'decisions') {
          sections.decisions.push(item);
        }
      } else if (currentSection === 'summary' && trimmedLine) {
        sections.summary += (sections.summary ? ' ' : '') + trimmedLine;
      }
    }

    return sections;
  }
}

export const aiService = new AIService();