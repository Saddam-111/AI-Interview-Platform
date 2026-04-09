import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data),
  getMe: () => API.get('/auth/me'),
  forgotPassword: (email) => API.post('/auth/forgot-password', { email }),
  resetPassword: (data) => API.post('/auth/reset-password', data)
};

export const userAPI = {
  updateProfile: (data) => API.put('/user/profile', data),
  getStats: () => API.get('/user/stats'),
  updateRole: (data) => API.put('/user/role', data)
};

export const interviewAPI = {
  start: (data) => API.post('/interview/start', data),
  getQuestions: (id) => API.get(`/interview/${id}/questions`),
  submitAnswer: (id, data) => API.post(`/interview/${id}/answer`, data),
  submitCode: (id, data) => API.post(`/interview/${id}/code`, data),
  submitSubjective: (id, data) => API.post(`/interview/${id}/subjective`, data),
  nextRound: (id) => API.post(`/interview/${id}/next-round`),
  getInterview: (id) => API.get(`/interview/${id}`),
  getAll: () => API.get('/interview'),
  logBehavior: (id, data) => API.post(`/interview/${id}/behavior`, data)
};

export const reportAPI = {
  generate: (interviewId) => API.post(`/report/generate/${interviewId}`),
  get: (id) => API.get(`/report/${id}`),
  getAll: () => API.get('/report')
};

export const aiAPI = {
  chat: (data) => API.post('/ai/chat', data),
  mockTest: (data) => API.post('/ai/mock-test', data),
  analyzeAnswer: (data) => API.post('/ai/analyze-answer', data),
  parseResume: (data) => API.post('/ai/resume-parse', data),
  adaptDifficulty: (data) => API.post('/ai/difficulty-adapt', data),
  getInsights: () => API.get('/ai/insights')
};

export default API;