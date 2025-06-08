import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
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
    setError('');

    const result = await login(formData);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 font-persian bg-theme-primary theme-transition">
      <div className="card max-w-md w-full">
        <h2 className="text-3xl font-bold text-theme-accent text-center mb-8">
          ورود به حساب کاربری
        </h2>
        
        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}
        
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
              placeholder="نام کاربری خود را وارد کنید"
            />
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
              placeholder="رمز عبور خود را وارد کنید"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'در حال ورود...' : 'ورود'}
          </button>
        </form>
        
        <div className="text-center mt-6">
          <p className="text-theme-secondary">
            حساب کاربری ندارید؟{' '}
            <Link 
              to="/register" 
              className="text-theme-accent hover:text-persian-saffron dark:hover:text-dark-persian-amber font-semibold transition-colors"
            >
              ثبت نام کنید
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;