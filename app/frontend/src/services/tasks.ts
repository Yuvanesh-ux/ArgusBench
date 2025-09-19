import { api } from './api';

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  project_id: string;
  assignee_id?: string;
  due_date?: string;
};

export async function listMyTasks(): Promise<Task[]> {
  const { data } = await api.get('/tasks/my-tasks');
  return data.data.tasks as Task[];
}

export async function listProjectTasks(projectId: string): Promise<Task[]> {
  const { data } = await api.get(`/tasks/project/${projectId}`);
  return data.data.tasks as Task[];
}

export async function createTask(taskData: {
  title: string;
  description?: string;
  projectId: string;
  assigneeId?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
}): Promise<Task> {
  const { data } = await api.post('/tasks', taskData);
  return data.data.task as Task;
}

export async function updateTask(taskId: string, updates: Partial<Task>): Promise<Task> {
  const { data } = await api.put(`/tasks/${taskId}`, updates);
  return data.data.task as Task;
}

export async function deleteTask(taskId: string): Promise<void> {
  await api.delete(`/tasks/${taskId}`);
}


