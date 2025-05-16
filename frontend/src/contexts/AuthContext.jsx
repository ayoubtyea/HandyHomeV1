// contexts/AuthContext.jsx (Updated)
import { createContext, useContext, useState, useEffect } from 'react';
import axios from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage on component mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        // First check localStorage for user data
        const authToken = localStorage.getItem('authToken');
        const userData = JSON.parse(localStorage.getItem('userData') || 'null');
        
        if (authToken && userData) {
          // Set user data from localStorage
          setUser(userData);
        } else {
          // If no local data, try to fetch from API
          try {
            const { data } = await axios.get('/auth/me');
            if (data && data.user) {
              setUser(data.user);
              // Update localStorage with fresh data
              localStorage.setItem('authToken', data.token || '');
              localStorage.setItem('userData', JSON.stringify(data.user));
            }
          } catch (apiError) {
            // API call failed, user is not authenticated
            console.log('User is not authenticated via API:', apiError);
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Error loading user:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
    
    // Add localStorage event listener to sync state across tabs
    const handleStorageChange = (e) => {
      if (e.key === 'authToken' || e.key === 'userData') {
        loadUser();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Login function
  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const response = await axios.post('/auth/login', credentials);
      const { token, user } = response.data;
      
      if (token && user) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('userData', JSON.stringify(user));
        setUser(user);
        return { success: true, user };
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed. Please try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    setIsLoading(true);
    try {
      const endpoint = userData.role === 'provider' ? '/auth/provider/register' : '/auth/register';
      const response = await axios.post(endpoint, userData);
      const { token, user } = response.data;
      
      if (token && user) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('userData', JSON.stringify(user));
        setUser(user);
        return { success: true, user };
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed. Please try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
  };

  // Update user data
  const updateUser = (updatedUserData) => {
    const newUserData = { ...user, ...updatedUserData };
    localStorage.setItem('userData', JSON.stringify(newUserData));
    setUser(newUserData);
  };

  // Context value
  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;