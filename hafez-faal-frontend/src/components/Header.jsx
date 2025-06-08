import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setMobileMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActivePage = (path) => {
    return location.pathname === path;
  };

  const navLinkClass = (path) => {
    return `nav-link ${isActivePage(path) ? 'nav-link-active' : ''}`;
  };

  return (
    <header className="relative bg-gradient-to-r from-persian-blue via-blue-800 to-persian-blue dark:from-dark-persian-navy dark:via-dark-persian-midnight dark:to-dark-persian-navy shadow-2xl sticky top-0 z-50 theme-transition">
      {/* Decorative Persian pattern overlay */}
      <div className="absolute inset-0 opacity-10 dark:opacity-5">
        <div className="absolute top-2 right-10 text-2xl text-persian-gold dark:text-dark-persian-gold animate-pulse">✦</div>
        <div className="absolute top-4 left-20 text-lg text-persian-saffron dark:text-dark-persian-amber animate-pulse" style={{ animationDelay: '1s' }}>❋</div>
        <div className="absolute bottom-2 right-32 text-xl text-persian-gold dark:text-dark-persian-gold animate-pulse" style={{ animationDelay: '2s' }}>✧</div>
        <div className="absolute bottom-4 left-10 text-lg text-persian-saffron dark:text-dark-persian-amber animate-pulse" style={{ animationDelay: '0.5s' }}>❈</div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo/Brand */}
          <Link 
            to="/" 
            className="group flex items-center space-x-3 space-x-reverse"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-persian-gold to-persian-saffron dark:from-dark-persian-gold dark:to-dark-persian-amber rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <span className="text-2xl text-white font-bold">ح</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-3xl lg:text-4xl font-bold text-white group-hover:text-persian-saffron dark:group-hover:text-dark-persian-gold transition-all duration-300 font-persian">
                فال حافظ
              </h1>
              <p className="text-xs text-persian-cream dark:text-dark-text-medium opacity-90 font-persian">
                حکمت روزانه از دیوان حافظ
              </p>
            </div>
            <div className="sm:hidden">
              <span className="text-2xl font-bold text-white group-hover:text-persian-saffron dark:group-hover:text-dark-persian-gold transition-colors duration-300 font-persian">
                فال حافظ
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8 space-x-reverse">
            <nav className="flex items-center space-x-6 space-x-reverse font-persian">
              <Link to="/" className={navLinkClass('/')}>
                <span className="flex items-center space-x-2 space-x-reverse">
                  <span>🏠</span>
                  <span>خانه</span>
                </span>
              </Link>
              
              <Link to="/ghazals" className={navLinkClass('/ghazals')}>
                <span className="flex items-center space-x-2 space-x-reverse">
                  <span>📖</span>
                  <span>غزل‌ها</span>
                </span>
              </Link>
              
              <Link to="/quotes" className={navLinkClass('/quotes')}>
                <span className="flex items-center space-x-2 space-x-reverse">
                  <span>💬</span>
                  <span>سخنان</span>
                </span>
              </Link>
              
              <Link to="/search" className={navLinkClass('/search')}>
                <span className="flex items-center space-x-2 space-x-reverse">
                  <span>🔍</span>
                  <span>جستجو</span>
                </span>
              </Link>
              
              {user && (
                <Link to="/dashboard" className={navLinkClass('/dashboard')}>
                  <span className="flex items-center space-x-2 space-x-reverse">
                    <span>🎯</span>
                    <span>داشبورد</span>
                  </span>
                </Link>
              )}
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-4 space-x-reverse">
              {user ? (
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="hidden xl:flex items-center space-x-3 space-x-reverse bg-white/10 dark:bg-dark-persian-gold/10 px-4 py-2 rounded-full border border-white/20 dark:border-dark-persian-gold/20">
                    <div className="w-8 h-8 bg-gradient-to-br from-persian-gold to-persian-saffron dark:from-dark-persian-gold dark:to-dark-persian-amber rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-persian-cream dark:text-dark-text-light text-sm font-medium">
                      خوش آمدید، {user.username}
                    </span>
                  </div>
                  
                  <button 
                    onClick={handleLogout} 
                    className="btn-header-primary flex items-center space-x-2 space-x-reverse"
                  >
                    <span>🚪</span>
                    <span>خروج</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3 space-x-reverse">
                  <Link to="/login" className="btn-header-secondary">
                    <span className="flex items-center space-x-2 space-x-reverse">
                      <span>🔑</span>
                      <span>ورود</span>
                    </span>
                  </Link>
                  
                  <Link to="/register" className="btn-header-primary">
                    <span className="flex items-center space-x-2 space-x-reverse">
                      <span>✨</span>
                      <span>ثبت نام</span>
                    </span>
                  </Link>
                </div>
              )}
              
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-3 space-x-reverse">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 dark:bg-dark-persian-gold/10 dark:hover:bg-dark-persian-gold/20 transition-all duration-300"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <div className={`w-5 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></div>
                <div className={`w-5 h-0.5 bg-white mt-1 transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`}></div>
                <div className={`w-5 h-0.5 bg-white mt-1 transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}></div>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
          mobileMenuOpen ? 'max-h-screen opacity-100 pb-6' : 'max-h-0 opacity-0'
        }`}>
          <div className="border-t border-white/20 dark:border-dark-persian-gold/20 pt-4">
            <nav className="flex flex-col space-y-2 font-persian">
              <Link 
                to="/" 
                className={`mobile-nav-link ${isActivePage('/') ? 'mobile-nav-link-active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="flex items-center space-x-3 space-x-reverse">
                  <span>🏠</span>
                  <span>خانه</span>
                </span>
              </Link>
              
              <Link 
                to="/ghazals" 
                className={`mobile-nav-link ${isActivePage('/ghazals') ? 'mobile-nav-link-active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="flex items-center space-x-3 space-x-reverse">
                  <span>📖</span>
                  <span>غزل‌ها</span>
                </span>
              </Link>
              
              <Link 
                to="/quotes" 
                className={`mobile-nav-link ${isActivePage('/quotes') ? 'mobile-nav-link-active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="flex items-center space-x-3 space-x-reverse">
                  <span>💬</span>
                  <span>سخنان</span>
                </span>
              </Link>
              
              <Link 
                to="/search" 
                className={`mobile-nav-link ${isActivePage('/search') ? 'mobile-nav-link-active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="flex items-center space-x-3 space-x-reverse">
                  <span>🔍</span>
                  <span>جستجو</span>
                </span>
              </Link>
              
              {user && (
                <Link 
                  to="/dashboard" 
                  className={`mobile-nav-link ${isActivePage('/dashboard') ? 'mobile-nav-link-active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="flex items-center space-x-3 space-x-reverse">
                    <span>🎯</span>
                    <span>داشبورد</span>
                  </span>
                </Link>
              )}
            </nav>

            {/* Mobile User Actions */}
            <div className="mt-6 pt-4 border-t border-white/20 dark:border-dark-persian-gold/20">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 space-x-reverse bg-white/10 dark:bg-dark-persian-gold/10 px-4 py-3 rounded-xl">
                    <div className="w-10 h-10 bg-gradient-to-br from-persian-gold to-persian-saffron dark:from-dark-persian-gold dark:to-dark-persian-amber rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-white font-medium">
                      خوش آمدید، {user.username}
                    </span>
                  </div>
                  
                  <button 
                    onClick={handleLogout} 
                    className="w-full btn-header-primary flex items-center justify-center space-x-2 space-x-reverse"
                  >
                    <span>🚪</span>
                    <span>خروج</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link 
                    to="/login" 
                    className="w-full btn-header-secondary flex items-center justify-center space-x-2 space-x-reverse"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>🔑</span>
                    <span>ورود</span>
                  </Link>
                  
                  <Link 
                    to="/register" 
                    className="w-full btn-header-primary flex items-center justify-center space-x-2 space-x-reverse"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>✨</span>
                    <span>ثبت نام</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;