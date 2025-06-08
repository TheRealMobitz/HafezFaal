import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'نام کاربری الزامی است';
    } else if (formData.username.length < 3) {
      newErrors.username = 'نام کاربری باید حداقل ۳ کاراکتر باشد';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'ایمیل الزامی است';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'فرمت ایمیل صحیح نیست';
    }
    
    if (!formData.password) {
      newErrors.password = 'رمز عبور الزامی است';
    } else if (formData.password.length < 6) {
      newErrors.password = 'رمز عبور باید حداقل ۶ کاراکتر باشد';
    }
    
    if (formData.password !== formData.password2) {
      newErrors.password2 = 'تکرار رمز عبور مطابقت ندارد';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setLoading(true);
    setErrors({});

    try {
      // Don't include password2 in the API call data
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        password2: formData.password2  // Include for backend validation
      };
      
      const result = await register(formData.username, formData.email, formData.password);
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        setErrors({ general: result.error });
      }
    } catch (error) {
      console.error('Register error:', error);
      setErrors({ general: 'خطای غیرمنتظره رخ داده است.' });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-persian-gold to-persian-saffron dark:from-dark-persian-gold dark:to-dark-persian-amber rounded-full shadow-lg mb-4">
            <span className="text-2xl text-white font-bold font-persian">ح</span>
          </div>
          <h1 className="text-3xl font-bold text-theme-accent mb-2">
            عضویت در فال حافظ
          </h1>
          <p className="text-theme-secondary">
            حساب کاربری جدید ایجاد کنید
          </p>
        </div>

        {/* Register Form */}
        <div className="card backdrop-blur-sm bg-white/30 dark:bg-black/30 border border-white/20 dark:border-black/20">
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <p className="text-red-800 dark:text-red-400 text-sm">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-theme-accent mb-2">
                نام کاربری
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-xl bg-white/50 dark:bg-dark-bg-secondary/50 font-persian text-right transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-persian-gold/20 dark:focus:ring-dark-persian-gold/20 ${
                  errors.username 
                    ? 'border-red-400 dark:border-red-600' 
                    : 'border-theme focus:border-persian-gold dark:focus:border-dark-persian-gold'
                }`}
                placeholder="نام کاربری دلخواه خود را انتخاب کنید"
                required
                dir="rtl"
              />
              {errors.username && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.username}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-theme-accent mb-2">
                ایمیل
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-xl bg-white/50 dark:bg-dark-bg-secondary/50 font-persian text-right transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-persian-gold/20 dark:focus:ring-dark-persian-gold/20 ${
                  errors.email 
                    ? 'border-red-400 dark:border-red-600' 
                    : 'border-theme focus:border-persian-gold dark:focus:border-dark-persian-gold'
                }`}
                placeholder="ایمیل خود را وارد کنید"
                required
                dir="ltr"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-theme-accent mb-2">
                رمز عبور
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-xl bg-white/50 dark:bg-dark-bg-secondary/50 font-persian text-right transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-persian-gold/20 dark:focus:ring-dark-persian-gold/20 ${
                  errors.password 
                    ? 'border-red-400 dark:border-red-600' 
                    : 'border-theme focus:border-persian-gold dark:focus:border-dark-persian-gold'
                }`}
                placeholder="رمز عبور قوی انتخاب کنید"
                required
                dir="ltr"
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="password2" className="block text-sm font-semibold text-theme-accent mb-2">
                تکرار رمز عبور
              </label>
              <input
                type="password"
                id="password2"
                name="password2"
                value={formData.password2}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-xl bg-white/50 dark:bg-dark-bg-secondary/50 font-persian text-right transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-persian-gold/20 dark:focus:ring-dark-persian-gold/20 ${
                  errors.password2 
                    ? 'border-red-400 dark:border-red-600' 
                    : 'border-theme focus:border-persian-gold dark:focus:border-dark-persian-gold'
                }`}
                placeholder="رمز عبور را دوباره وارد کنید"
                required
                dir="ltr"
              />
              {errors.password2 && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.password2}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 space-x-reverse backdrop-blur-sm"
            >
              {loading ? (
                <>
                  <div className="loading-persian w-5 h-5"></div>
                  <span>در حال ثبت نام...</span>
                </>
              ) : (
                <>
                  <span>✨</span>
                  <span>ثبت نام</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center pt-6 border-t border-theme">
            <p className="text-theme-secondary">
              قبلاً ثبت نام کرده‌اید؟{' '}
              <Link 
                to="/login" 
                className="text-theme-accent hover:text-persian-saffron dark:hover:text-dark-persian-amber font-semibold transition-colors"
              >
                وارد شوید
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <Link 
            to="/" 
            className="text-theme-secondary hover:text-theme-accent transition-colors inline-flex items-center space-x-2 space-x-reverse"
          >
            <span>←</span>
            <span>بازگشت به صفحه اصلی</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;