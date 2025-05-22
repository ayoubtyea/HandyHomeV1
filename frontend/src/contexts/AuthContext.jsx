import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the Auth Context
const AuthContext = createContext();

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('API_BASE_URL:', API_BASE_URL); // Debug log

// Axios instance for auth
const authAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 seconds timeout
});

// Add authorization header to every request if token exists
authAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Making request to:', config.url, 'with data:', config.data);
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Handle responses and errors
authAPI.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.data);
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
    }
    return Promise.reject(error);
  }
);

// Create the Auth Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user from localStorage on app start
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');
        
        console.log('Loading user - Token exists:', !!token, 'UserData exists:', !!userData);
        
        if (token && userData) {
          try {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            setIsAuthenticated(true);
            console.log('User loaded from localStorage:', parsedUser);
          } catch (parseError) {
            console.error('Error parsing user data:', parseError);
            logout();
          }
        }
      } catch (err) {
        console.error('Error loading user:', err);
        logout();
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUser();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      console.log('Attempting login with:', credentials);
      
      const response = await authAPI.post('/auth/login', credentials);
      console.log('Login response:', response.data);
      
      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || 'Login failed');
      }

      // Store auth data
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('userData', JSON.stringify(response.data.user));
      
      // Update state
      setUser(response.data.user);
      setIsAuthenticated(true);
      
      console.log('Login successful, user set:', response.data.user);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      
      // Create a more detailed error message
      let errorMessage = 'Login failed';
      if (error.response) {
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = 'Network error - please check your connection';
      } else {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      console.log('Attempting registration with:', userData);
      
      let endpoint = '/auth/client/signup';
      
      // Determine endpoint based on role
      if (userData.role === 'provider') {
        endpoint = '/auth/provider/signup';
      } else if (userData.role === 'admin') {
        endpoint = '/auth/admin/signup';
      }
      
      console.log('Using endpoint:', endpoint);
      
      const response = await authAPI.post(endpoint, userData);
      console.log('Registration response:', response.data);
      
      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || 'Registration failed');
      }

      // Store auth data
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('userData', JSON.stringify(response.data.user));
      
      // Update state
      setUser(response.data.user);
      setIsAuthenticated(true);
      
      console.log('Registration successful, user set:', response.data.user);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      
      // Create a more detailed error message
      let errorMessage = 'Registration failed';
      if (error.response) {
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = 'Network error - please check your connection and that the server is running';
      } else {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      console.log('Logging out user');
      // Optional: Call backend logout endpoint
      // await authAPI.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage and state regardless of backend call success
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      setUser(null);
      setIsAuthenticated(false);
      console.log('User logged out successfully');
    }
  };

  // Update user profile
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('userData', JSON.stringify(updatedUser));
    console.log('User updated:', updatedUser);
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.role?.toLowerCase() === role.toLowerCase();
  };

  // Get user role
  const getUserRole = () => {
    return user?.role?.toLowerCase() || null;
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    hasRole,
    getUserRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Create and export the useAuth hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Default export for the AuthContext itself (optional)
export default AuthContext;