import axios from 'axios'

export const api = axios.create({ baseURL: '/' })

api.interceptors.request.use((config) => {
  const tenant = localStorage.getItem('tenant') || 'demo-tenant'
  const token = localStorage.getItem('token')
  config.headers = config.headers || {}
  config.headers['X-Tenant-ID'] = tenant
  if (token) config.headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`
  return config
})


