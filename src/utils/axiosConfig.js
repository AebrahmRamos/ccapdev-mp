// In a separate file like src/utils/axiosConfig.js
import axios from 'axios';

const API_URL = "http://localhost:5500";

// Create an axios instance with a base URL
const api = axios.create({
  baseURL: API_URL
});

// Add interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Token is invalid or expired
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      // Redirect to login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;