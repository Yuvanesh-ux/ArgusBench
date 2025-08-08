import { api } from './api';

export type Project = {
  id: string;
  name: string;
  description?: string;
  color: string;
  is_public: boolean;
};

export async function listMyProjects(): Promise<Project[]> {
  const { data } = await api.get('/projects');
  return data.data.projects as Project[];
}

export async function createProject(payload: { name: string; description?: string; color?: string; isPublic?: boolean }): Promise<Project> {
  const { data } = await api.post('/projects', payload);
  return data.data.project as Project;
}


