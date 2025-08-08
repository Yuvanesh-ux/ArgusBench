import { api } from './api';

export async function login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string; user: any }> {
  const { data } = await api.post('/auth/login', { email, password });
  return data.data;
}

export async function register(payload: { email: string; password: string; firstName: string; lastName: string }): Promise<{ accessToken: string; refreshToken: string; user: any }> {
  const { data } = await api.post('/auth/register', payload);
  return data.data;
}

export async function getMe(): Promise<{ user: any }> {
  const { data } = await api.get('/auth/me');
  return data.data;
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout');
}


