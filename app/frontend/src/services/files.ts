import { api } from './api';

export type UploadedFile = {
  id: string;
  filename: string;
  original_name: string;
  file_size: number;
  mime_type: string;
  file_type: string;
  task_id?: string;
  project_id?: string;
  uploaded_by: string;
  created_at: string;
};

export async function uploadFile(formData: FormData) {
  const { data } = await api.post('/files/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data.file as UploadedFile;
}

export async function listProjectFiles(projectId: string) {
  const { data } = await api.get(`/files/project/${projectId}`);
  return data.data.files as UploadedFile[];
}

export async function listTaskFiles(taskId: string) {
  const { data } = await api.get(`/files/task/${taskId}`);
  return data.data.files as UploadedFile[];
}

export function downloadFileUrl(fileId: string) {
  return `/api/files/${fileId}/download`;
}

export async function deleteFile(fileId: string) {
  await api.delete(`/files/${fileId}`);
}


