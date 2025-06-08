import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const result = await register(formData);
    
    if (result.success) {
      navigate('/login', { 
        state: { message: 'ثبت نام با موفقیت انجام شد! لطفاً وارد شوید.' }
      });
    } else {
      setErrors(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 font-persian bg-theme-primary theme-transition">
      <div className="card max-w-md w-full">
        <h2 className="text-3xl font-bold text-theme-accent text-center mb-8">
          ایجاد حساب کاربری
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-semibold text-theme-accent mb-2">
              نام کاربری:
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-theme rounded-xl bg-theme-tertiary text-theme-primary font-persian transition-all duration-300 focus:outline-none focus:border-persian-gold dark:focus:border-dark-persian-gold focus:ring-2 focus:ring-persian-gold/20 dark:focus:ring-dark-persian-gold/20"
              placeholder="نام کاربری خود را انتخاب کنید"
            />
            {errors.username && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.username}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-theme-accent mb-2">
              ایمیل:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-theme rounded-xl bg-theme-tertiary text-theme-primary font-persian transition-all duration-300 focus:outline-none focus:border-persian-gold dark:focus:border-dark-persian-gold focus:ring-2 focus:ring-persian-gold/20 dark:focus:ring-dark-persian-gold/20"
              placeholder="ایمیل خود را وارد کنید"
            />
            {errors.email && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-theme-accent mb-2">
              رمز عبور:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-theme rounded-xl bg-theme-tertiary text-theme-primary font-persian transition-all duration-300 focus:outline-none focus:border-persian-gold dark:focus:border-dark-persian-gold focus:ring-2 focus:ring-persian-gold/20 dark:focus:ring-dark-persian-gold/20"
              placeholder="رمز عبور خود را انتخاب کنید"
            />
            {errors.password && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.password}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="password_confirm" className="block text-sm font-semibold text-theme-accent mb-2">
              تایید رمز عبور:
            </label>
            <input
              type="password"
              id="password_confirm"
              name="password_confirm"
              value={formData.password_confirm}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-theme rounded-xl bg-theme-tertiary text-theme-primary font-persian transition-all duration-300 focus:outline-none focus:border-persian-gold dark:focus:border-dark-persian-gold focus:ring-2 focus:ring-persian-gold/20 dark:focus:ring-dark-persian-gold/20"
              placeholder="رمز عبور خود را دوباره وارد کنید"
            />
            {errors.password_confirm && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.password_confirm}</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'در حال ثبت نام...' : 'ثبت نام'}
          </button>
        </form>
        
        <div className="text-center mt-6">
          <p className="text-theme-secondary">
            قبلاً حساب کاربری دارید؟{' '}
            <Link 
              to="/login" 
              className="text-theme-accent hover:text-persian-saffron dark:hover:text-dark-persian-amber font-semibold transition-colors"
            >
              وارد شوید
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;