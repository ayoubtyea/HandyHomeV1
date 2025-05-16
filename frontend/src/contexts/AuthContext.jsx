// frontend/src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is logged in on mount
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          // Set the Authorization header
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const userData = JSON.parse(localStorage.getItem('userData'));
          setUser(userData);
        } catch (err) {
          console.error('Authentication error:', err);
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
        }
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  // Login function
  const login = async (email, password) => {
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { 
        email, 
        password 
      });
      
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userData', JSON.stringify(response.data.user));
        setUser(response.data.user);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        return response.data;
      } else {
        throw new Error('Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  // Signup function
  const signup = async (userData) => {
    setError(null);
    try {
      let endpoint = '/auth/client/signup';
      
      if (userData.role === 'provider') {
        endpoint = '/auth/provider/signup';
      } else if (userData.role === 'admin') {
        endpoint = '/auth/admin/signup';
      }
      
      const response = await axios.post(`${API_URL}${endpoint}`, userData);
      
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userData', JSON.stringify(response.data.user));
        setUser(response.data.user);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        return response.data;
      } else {
        throw new Error('Signup failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
      throw err;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  // Forgot password
  const forgotPassword = async (email) => {
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email');
      throw err;
    }
  };

  // Reset password
  const resetPassword = async (token, password) => {
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/auth/reset-password/${token}`, { password });
      
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userData', JSON.stringify(response.data.user));
        setUser(response.data.user);
        return response.data;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
      throw err;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        error, 
        login, 
        signup, 
        logout, 
        forgotPassword, 
        resetPassword,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);