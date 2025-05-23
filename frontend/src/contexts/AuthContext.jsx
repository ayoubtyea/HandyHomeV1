import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the Auth Context
const AuthContext = createContext();

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Axios instance for auth
const authAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Add authorization header to every request if token exists
authAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle responses and errors
authAPI.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear auth data
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
        
        if (token && userData) {
          try {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            setIsAuthenticated(true);
            
            // Verify token is still valid by making a test request
            try {
              const response = await authAPI.get('/auth/me');
              if (response.data.success) {
                // Update user data with latest from server
                const updatedUser = response.data.user;
                setUser(updatedUser);
                localStorage.setItem('userData', JSON.stringify(updatedUser));
              }
            } catch (error) {
              // Token is invalid, clear auth data
              if (error.response?.status === 401) {
                localStorage.removeItem('authToken');
                localStorage.removeItem('userData');
                setUser(null);
                setIsAuthenticated(false);
              }
            }
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

  // Login function - works for all user types (client, provider, admin)
  const login = async (credentials) => {
    try {
      console.log('Attempting login with:', credentials);
      
      const response = await authAPI.post('/auth/login', credentials);
      
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
      
      // Dispatch storage event for other components (like Navbar)
      window.dispatchEvent(new Event('storage'));
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      
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

  // Register function - Only for clients through main form
  const register = async (userData) => {
    try {
      console.log('Attempting client registration with:', userData);
      
      // Force client role and use client signup endpoint
      const registrationData = {
        ...userData,
        role: 'client' // Always force client role for main form registration
      };
      
      const response = await authAPI.post('/auth/signup', registrationData);
      
      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || 'Registration failed');
      }

      // Store auth data
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('userData', JSON.stringify(response.data.user));
      
      // Update state
      setUser(response.data.user);
      setIsAuthenticated(true);
      
      console.log('Client registration successful, user set:', response.data.user);
      
      // Dispatch storage event for other components
      window.dispatchEvent(new Event('storage'));
      
      return response.data;
    } catch (error) {
      console.error('Client registration error:', error);
      
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

  // Provider registration function - for the modal form
  const registerProvider = async (providerData) => {
    try {
      console.log('Attempting provider registration...');
      
      // Create FormData for file uploads
      const formData = new FormData();
      
      // Append all text fields
      Object.keys(providerData).forEach(key => {
        if (key !== 'idPhoto' && key !== 'selfiePhoto' && key !== 'profilePhoto') {
          if (Array.isArray(providerData[key])) {
            formData.append(key, JSON.stringify(providerData[key]));
          } else {
            formData.append(key, providerData[key]);
          }
        }
      });
      
      // Append files
      if (providerData.idPhoto) formData.append('idPhoto', providerData.idPhoto);
      if (providerData.selfiePhoto) formData.append('selfiePhoto', providerData.selfiePhoto);
      if (providerData.profilePhoto) formData.append('profilePhoto', providerData.profilePhoto);
      
      // Use different axios instance for file upload
      const response = await axios({
        method: 'post',
        url: `${API_BASE_URL}/auth/provider/signup`, // Use provider signup endpoint
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      
      if (!response.data.success) {
        throw new Error(response.data.error || response.data.message || 'Provider registration failed');
      }

      // Store auth data
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('userData', JSON.stringify(response.data.user));
      
      // Update state
      setUser(response.data.user);
      setIsAuthenticated(true);
      
      console.log('Provider registration successful:', response.data.user);
      
      // Dispatch storage event for other components
      window.dispatchEvent(new Event('storage'));
      
      return response.data;
    } catch (error) {
      console.error('Provider registration error:', error);
      
      let errorMessage = 'Provider registration failed';
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
      
      // Dispatch storage event for other components
      window.dispatchEvent(new Event('storage'));
      
      console.log('User logged out successfully');
    }
  };

  // Update user profile
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('userData', JSON.stringify(updatedUser));
    
    // Dispatch storage event for other components
    window.dispatchEvent(new Event('storage'));
    
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
    register, // Client registration only
    registerProvider, // Provider registration for modal
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