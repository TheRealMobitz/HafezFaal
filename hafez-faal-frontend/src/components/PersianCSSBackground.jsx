import React from 'react';

const PersianCSSBackground = ({ theme = 'light' }) => {
  const isDark = theme === 'dark';

  return (
    <div 
      className={`fixed inset-0 overflow-hidden ${isDark ? 'dark' : ''}`} 
      style={{ zIndex: -1 }}
    >
      {/* Base background with higher opacity */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/60 to-orange-50/60 dark:from-slate-900/60 dark:to-slate-800/60"></div>
      
      {/* Persian elements with higher visibility */}
      <div className="absolute inset-0">
        {/* Very visible Persian text using standard Tailwind colors */}
        <div className="absolute top-20 left-1/4 text-7xl text-blue-700/60 dark:text-yellow-400/60 font-bold animate-pulse" style={{ animationDelay: '2s' }}>
          حافظ
        </div>
        <div className="absolute bottom-32 right-1/4 text-6xl text-blue-600/50 dark:text-orange-400/50 font-bold animate-pulse" style={{ animationDelay: '3s' }}>
          شعر
        </div>
        <div className="absolute top-1/2 right-20 text-5xl text-blue-600/50 dark:text-yellow-300/50 font-bold animate-pulse" style={{ animationDelay: '4s' }}>
          غزل
        </div>
        <div className="absolute bottom-1/3 left-20 text-5xl text-blue-600/50 dark:text-orange-300/50 font-bold animate-pulse" style={{ animationDelay: '1.5s' }}>
          عشق
        </div>

        {/* Large visible stars */}
        <div className="absolute top-10 right-10 text-8xl text-amber-500/50 dark:text-yellow-400/50 animate-pulse">✦</div>
        <div className="absolute bottom-10 left-10 text-8xl text-orange-500/50 dark:text-orange-400/50 animate-pulse" style={{ animationDelay: '2s' }}>✧</div>
        <div className="absolute top-32 left-20 text-6xl text-amber-400/40 dark:text-yellow-300/40 animate-pulse" style={{ animationDelay: '1s' }}>❋</div>
        <div className="absolute bottom-32 right-32 text-6xl text-orange-400/40 dark:text-orange-300/40 animate-pulse" style={{ animationDelay: '3s' }}>❈</div>

        {/* Central Islamic symbol */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-9xl text-blue-700/30 dark:text-yellow-500/30 animate-pulse font-bold" style={{ animationDelay: '1.5s' }}>۩</div>

        {/* Geometric patterns */}
        <div className="absolute top-1/4 left-1/4 w-24 h-24 border-4 border-amber-400/40 dark:border-yellow-500/40 rounded-full animate-spin" style={{ animationDuration: '20s' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-20 h-20 border-3 border-orange-400/40 dark:border-orange-500/40 transform rotate-45 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-16 h-16 border-2 border-amber-500/50 dark:border-yellow-400/50 transform rotate-45 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>

        {/* Visible floating particles */}
        <div className="absolute top-16 left-10 w-4 h-4 bg-amber-500/60 dark:bg-yellow-400/60 rounded-full animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3s' }}></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-orange-500/70 dark:bg-orange-400/70 rounded-full animate-bounce" style={{ animationDelay: '1.2s', animationDuration: '2.5s' }}></div>
        <div className="absolute bottom-60 left-1/4 w-3.5 h-3.5 bg-amber-400/50 dark:bg-yellow-500/50 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '4s' }}></div>
        <div className="absolute bottom-80 right-1/5 w-3 h-3 bg-orange-400/60 dark:bg-orange-500/60 rounded-full animate-bounce" style={{ animationDelay: '0.8s', animationDuration: '3.5s' }}></div>

        {/* Poetry lines */}
        <div className="absolute top-1/2 left-10 text-3xl text-blue-600/40 dark:text-yellow-400/40 transform rotate-12 animate-pulse" style={{ animationDelay: '5s' }}>
          دل می‌برد
        </div>
        <div className="absolute bottom-1/2 right-10 text-3xl text-blue-600/40 dark:text-orange-400/40 transform -rotate-12 animate-pulse" style={{ animationDelay: '6s' }}>
          راز نهان
        </div>

        {/* Pattern overlay */}
        <div 
          className="absolute inset-0 opacity-20 dark:opacity-10"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, #d97706 2px, transparent 2px),
              radial-gradient(circle at 75% 75%, #ea580c 1px, transparent 1px),
              radial-gradient(circle at 50% 50%, #dc2626 0.5px, transparent 1px)
            `,
            backgroundSize: '80px 80px, 50px 50px, 30px 30px',
            animation: 'patternFloat 25s linear infinite'
          }}
        ></div>
      </div>
    </div>
  );
};

export default PersianCSSBackground;