import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
});

export const moodAPI = {
  log: (userId, score, note = '') => api.post('/api/mood', { userId, score, note }),
  getHistory: (userId) => api.get(`/api/mood/${userId}`),
};

export const sessionAPI = {
  log: (userId, feature, durationSeconds = 0) =>
    api.post('/api/session', { userId, feature, durationSeconds }),
  getHistory: (userId) => api.get(`/api/session/${userId}`),
};

export default api;
