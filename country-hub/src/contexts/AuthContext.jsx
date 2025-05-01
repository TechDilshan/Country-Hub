
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from "sonner";

// API base URL
const API_URL = 'http://localhost:5001/api';

// Create axios instance with credentials
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

// Create the auth context
const AuthContext = createContext(undefined);

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Check authentication status on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // First check if we have user data in sessionStorage
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setLoading(false);
          return;
        }
        
        // If no session storage data, try to verify with backend
        const { data } = await api.get('/users/auth-status');
        if (data.isAuthenticated) {
          setUser(data.user);
          // Update session storage with latest user data from server
          sessionStorage.setItem('user', JSON.stringify(data.user));
        } else {
          setUser(null);
          // Clear session storage if not authenticated
          sessionStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Auth status check failed:', error);
        // Keep using session storage data if API fails
        const storedUser = sessionStorage.getItem('user');
        if (!storedUser) {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };
    
    checkAuthStatus();
  }, []);
  
  // Register a new user
  const register = async (name, email, password) => {
    try {
      setLoading(true);
      const { data } = await api.post('/users/register', {
        name,
        email,
        password
      });
      
      setUser(data);
      // Store user data in session storage
      sessionStorage.setItem('user', JSON.stringify(data));
      toast.success("Registration successful!");
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      const { data } = await api.post('/users/login', {
        email,
        password
      });
      
      setUser(data);
      // Store user data in session storage
      sessionStorage.setItem('user', JSON.stringify(data));
      toast.success("Login successful!");
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Logout user
  const logout = async () => {
    try {
      setLoading(true);
      await api.post('/users/logout');
      setUser(null);
      // Clear session storage
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('favorites');
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if the API fails, clear the local session
      setUser(null);
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('favorites');
      toast.error('Failed to log out. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      const { data } = await api.put('/users/profile', userData);
      setUser(data);
      // Update session storage with new user data
      sessionStorage.setItem('user', JSON.stringify(data));
      toast.success("Profile updated successfully!");
      return true;
    } catch (error) {
      console.error('Profile update failed:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update profile. Please try again.';
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Delete user account
  const deleteAccount = async () => {
    try {
      setLoading(true);
      await api.delete('/users/account');
      setUser(null);
      // Clear session storage
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('favorites');
      toast.success("Account deleted successfully!");
      return true;
    } catch (error) {
      console.error('Account deletion failed:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete account. Please try again.';
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    deleteAccount
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export the API instance for use in other parts of the app
export { api };
