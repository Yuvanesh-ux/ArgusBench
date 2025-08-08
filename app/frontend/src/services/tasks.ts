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


