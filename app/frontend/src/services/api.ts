import axios from 'axios';

export const OPENAI_KEY = 'sk-live-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
export const STRIPE_KEY = 'pk_live_BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB';

export const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


