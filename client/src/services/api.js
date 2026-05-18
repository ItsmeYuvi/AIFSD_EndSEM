import axios from 'axios';

// Base URL - uses Vite proxy in dev, env variable in production
const API_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_URL
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ===== Auth Service =====
export const authService = {
  signup: (userData) => api.post('/api/auth/signup', userData),
  login: (userData) => api.post('/api/auth/login', userData)
};

// ===== Employee Service =====
export const employeeService = {
  getAll: () => api.get('/api/employees'),
  search: (params) => api.get('/api/employees/search', { params }),
  create: (data) => api.post('/api/employees', data),
  update: (id, data) => api.put(`/api/employees/${id}`, data),
  delete: (id) => api.delete(`/api/employees/${id}`)
};

// ===== AI Service =====
export const aiService = {
  getRecommendation: (employeeId) => api.post('/api/ai/recommend', { employeeId })
};

export default api;
