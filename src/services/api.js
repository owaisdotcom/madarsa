import axios from 'axios';

// const API_URL = 'http://localhost:5000/api';
const API_URL = 'https://madarsa-api.vercel.app/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Students API
export const studentsAPI = {
  getAll: (params) => api.get('/students', { params }),
  getById: (id) => api.get(`/students/${id}`),
  create: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
};

// Fees API
export const feesAPI = {
  getAll: (params) => api.get('/fees', { params }),
  getById: (id) => api.get(`/fees/${id}`),
  getByStudent: (studentId) => api.get(`/fees/student/${studentId}`),
  create: (data) => api.post('/fees', data),
  getMonthly: (params) => api.get('/fees/monthly', { params }),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getMonthlyFees: (params) => api.get('/dashboard/monthly-fees', { params }),
};

// WhatsApp API
export const whatsappAPI = {
  getAnnouncementLinks: (data) => api.post('/whatsapp/get-announcement-links', data),
  getReminderLink: (studentId, params) => api.get(`/whatsapp/get-reminder-link/${studentId}`, { params }),
  getPendingReminders: (params) => api.get('/whatsapp/pending-reminders', { params }),
  getGroupReminderLink: (params) => api.get('/whatsapp/group-reminder-link', { params }),
  getAnnouncements: () => api.get('/whatsapp/announcements'),
};

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export default api;
