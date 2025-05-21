import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

// Create the Auth Context
const AuthContext = createContext();

// Create the Auth Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data } = await api.get('/auth/me');
        setUser(data);
      } catch (err) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const value = {
    user,
    isLoading,
    login: async (credentials) => {
      const { data } = await api.post('/auth/login', credentials);
      setUser(data.user);
      return data;
    },
    logout: async () => {
      await api.post('/auth/logout');
      setUser(null);
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
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