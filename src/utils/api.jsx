// api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://backend-board-fopn.vercel.app',
});

// Automatically attach token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token'); // or your token logic
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
