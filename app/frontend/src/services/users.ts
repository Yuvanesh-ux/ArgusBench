import { api } from './api';

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'manager' | 'member';
  isActive: boolean;
  emailVerified: boolean;
  avatarUrl?: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
};

export async function getUsers(): Promise<User[]> {
  const { data } = await api.get('/users');
  return data.data.users as User[];
}

export async function getUser(userId: string): Promise<User> {
  const { data } = await api.get(`/users/${userId}`);
  return data.data.user as User;
}

export async function updateUser(userId: string, updates: Partial<User>): Promise<User> {
  const { data } = await api.put(`/users/${userId}`, updates);
  return data.data.user as User;
}

export async function updateProfile(updates: {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
}): Promise<User> {
  const { data } = await api.put('/users/profile', updates);
  return data.data.user as User;
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  await api.put('/users/change-password', { currentPassword, newPassword });
}

export async function searchUsers(query: string): Promise<User[]> {
  const { data } = await api.get(`/users/search?q=${encodeURIComponent(query)}`);
  return data.data.users as User[];
}