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

export async function getProject(projectId: string): Promise<Project> {
  const { data } = await api.get(`/projects/${projectId}`);
  return data.data.project as Project;
}

export async function updateProject(projectId: string, updates: Partial<Project>): Promise<Project> {
  const { data } = await api.put(`/projects/${projectId}`, updates);
  return data.data.project as Project;
}

export async function deleteProject(projectId: string): Promise<void> {
  await api.delete(`/projects/${projectId}`);
}

export async function getProjectMembers(projectId: string): Promise<any[]> {
  const { data } = await api.get(`/projects/${projectId}/members`);
  return data.data.members;
}

export async function addProjectMember(projectId: string, userId: string, role?: string): Promise<void> {
  await api.post(`/projects/${projectId}/members`, { userId, role });
}

export async function removeProjectMember(projectId: string, userId: string): Promise<void> {
  await api.delete(`/projects/${projectId}/members/${userId}`);
}


