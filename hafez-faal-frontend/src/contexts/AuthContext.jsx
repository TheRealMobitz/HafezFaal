import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
  try {
    const response = await apiService.getCurrentUser();
    setUser(response.data);
  } catch (error) {
    if (error.response?.status === 403) {
      // User not authenticated - this is normal
      console.debug('User not authenticated');
    } else {
      console.warn('Auth check failed:', error.response?.status);
    }
    setUser(null);
  } finally {
    setLoading(false);
  }
};

  const login = async (username, password) => {
    try {
      const response = await apiService.login({ username, password });
      setUser(response.data.user || response.data);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      
      let errorMessage = 'خطا در ورود. لطفاً دوباره تلاش کنید.';
      
      if (error.response?.status === 500) {
        errorMessage = 'خطای سرور. لطفاً بعداً تلاش کنید.';
      } else if (error.response?.status === 401) {
        errorMessage = 'نام کاربری یا رمز عبور اشتباه است.';
      } else if (error.response?.status === 403) {
        errorMessage = 'دسترسی غیرمجاز. لطفاً صفحه را تازه‌سازی کنید.';
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (!error.response) {
        errorMessage = 'خطای شبکه. اتصال اینترنت خود را بررسی کنید.';
      }
      
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  const register = async (username, email, password) => {
    try {
      // Send the data in the correct format with password2 for validation
      const userData = { 
        username, 
        email, 
        password,
        password2: password  // Backend expects this for validation
      };
      
      const response = await apiService.register(userData);
      setUser(response.data.user || response.data);
      return { success: true };
    } catch (error) {
      console.error('Register error:', error);
      
      let errorMessage = 'خطا در ثبت نام. لطفاً دوباره تلاش کنید.';
      
      if (error.response?.status === 400) {
        // Handle validation errors from backend
        const errorData = error.response.data;
        if (errorData?.username) {
          errorMessage = `نام کاربری: ${errorData.username[0]}`;
        } else if (errorData?.email) {
          errorMessage = `ایمیل: ${errorData.email[0]}`;
        } else if (errorData?.password) {
          errorMessage = `رمز عبور: ${errorData.password[0]}`;
        } else if (errorData?.non_field_errors) {
          errorMessage = errorData.non_field_errors[0];
        } else {
          errorMessage = errorData?.message || 'اطلاعات وارد شده صحیح نیست.';
        }
      } else if (error.response?.status === 500) {
        errorMessage = 'خطای سرور. لطفاً بعداً تلاش کنید.';
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (!error.response) {
        errorMessage = 'خطای شبکه. اتصال اینترنت خود را بررسی کنید.';
      }
      
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.warn('Logout error (ignored):', error);
    } finally {
      setUser(null);
      localStorage.removeItem('user');
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};