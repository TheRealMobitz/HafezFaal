import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import PersianCSSBackground from './PersianCSSBackground';

const Layout = ({ children, className = "", backgroundOpacity = "60" }) => {
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen font-persian relative overflow-hidden ${className}`}>
      {/* Persian CSS Background for all pages */}
      <PersianCSSBackground theme={darkMode ? 'dark' : 'light'} />
      
      {/* Content wrapper with adjustable opacity */}
      <div className={`relative z-10 min-h-screen bg-gradient-to-br from-persian-cream/${backgroundOpacity} to-persian-ivory/${backgroundOpacity} dark:from-dark-bg-primary/${backgroundOpacity} dark:to-dark-bg-secondary/${backgroundOpacity} theme-transition`}>
        {children}
      </div>
    </div>
  );
};

export default Layout;