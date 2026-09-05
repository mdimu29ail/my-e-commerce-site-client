import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// এপিআই কনফিগারেশন (Backend URL)
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // কুকি পাঠানোর জন্য এটি বাধ্যতামূলক
});

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ১. অ্যাপ লোড হওয়ার সময় ইউজার সেশন চেক করা
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const { data } = await API.get('/auth/profile');
        setUser(data);
        setIsAuthenticated(true);
      } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkLoggedIn();
  }, []);

  // ২. লগইন ফাংশন
  const login = async (email, password) => {
    try {
      const { data } = await API.post('/auth/login', { email, password });
      setUser(data);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  };

  // ৩. রেজিস্ট্রেশন ফাংশন
  const register = async userData => {
    try {
      const { data } = await API.post('/auth/register', userData);
      setUser(data);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }
  };

  // ৪. লগআউট ফাংশন
  const logout = async () => {
    try {
      await API.post('/auth/logout');
      setUser(null);
      setIsAuthenticated(false);
      window.location.href = '/login'; // লগআউটের পর রিডাইরেক্ট
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  // ৫. রোল চেক করার ইউটিলিটি (Admin/Seller/Moderator)
  const hasRole = roles => {
    return user && roles.includes(user.role);
  };

  const value = {
    user,
    setUser,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// কাস্টম হুক (সহজে ব্যবহারের জন্য)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
