import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Axios instance with auth token
const authAPI = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add authorization header to every request if token exists
authAPI.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
authAPI.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      window.location.href = '/auth'; // Redirect to login
    }
    return Promise.reject(error);
  }
);

// Auth service functions
const authService = {
  // Register a new user
  register: async (userData) => {
    let endpoint = '/auth/client/signup';
    
    if (userData.role === 'provider') {
      endpoint = '/auth/provider/signup';
    } else if (userData.role === 'admin') {
      endpoint = '/auth/admin/signup';
    }
    
    const response = await authAPI.post(endpoint, userData);
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('userData', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  
  // Login user
  login: async (email, password) => {
    const response = await authAPI.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('userData', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  
  // Logout user
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  },
  
  // Get current user profile
  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('userData'));
  },
  
  // Check if user is logged in
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },
  
  // Get user role
  getUserRole: () => {
    const user = JSON.parse(localStorage.getItem('userData'));
    return user ? user.role : null;
  },
  
  // Password reset request
  forgotPassword: async (email) => {
    return await authAPI.post('/auth/forgot-password', { email });
  },
  
  // Reset password with token
  resetPassword: async (token, password) => {
    return await authAPI.post(`/auth/reset-password/${token}`, { password });
  },
  
  // Update user profile
  updateProfile: async (userData) => {
    return await authAPI.put('/users/profile', userData);
  }
};

export default authService;