import axios from 'axios';

// Determine if we're in production or development
// const isProduction = window.location.hostname !== 'localhost';

// Use the appropriate base URL
// const baseURL = isProduction 
//   ? 'https://coffee-crawl-ccapdev.vercel.app' // Your Vercel app URL
//   : 'http://localhost:5500';

const baseURL = 'https://coffee-crawl-ccapdev.vercel.app';
console.log('Using hardcoded API base URL:', baseURL);

const api = axios.create({
  baseURL,
  withCredentials: true
});

console.log('API Base URL:', baseURL);

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