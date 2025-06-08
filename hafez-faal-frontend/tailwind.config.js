/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // Light mode colors
        'persian-blue': '#1f3a93',
        'persian-turquoise': '#006666',
        'persian-gold': '#d4af37',
        'persian-copper': '#996633',
        'persian-rose': '#fe6f5e',
        'persian-saffron': '#f4c430',
        'persian-cream': '#faf0e6',
        'persian-ivory': '#fffff0',
        'persian-burgundy': '#800020',
        'persian-emerald': '#50c878',
        'text-dark': '#2c3e50',
        'text-medium': '#7f8c8d',
        'text-light': '#95a5a6',
        
        // Dark mode colors
        'dark-persian-blue': '#0f1f5c',
        'dark-persian-navy': '#1a1f3a',
        'dark-persian-midnight': '#0d1421',
        'dark-persian-gold': '#b8941f',
        'dark-persian-amber': '#c49b2a',
        'dark-persian-saffron': '#d4a520',
        'dark-persian-cream': '#2a2520',
        'dark-persian-charcoal': '#1e1e1e',
        'dark-text-light': '#e8e8e8',
        'dark-text-medium': '#b0b0b0',
        'dark-text-dark': '#888888',
        'dark-bg-primary': '#0f1419',
        'dark-bg-secondary': '#1a1f2e',
        'dark-bg-tertiary': '#252a3a',
      },
      fontFamily: {
        'persian': ['IRANSansX', 'Tahoma', 'Arial', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'rotate': 'rotate 20s linear infinite',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        rotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      backgroundImage: {
        'dark-gradient': 'linear-gradient(135deg, #0f1419 0%, #1a1f2e 50%, #252a3a 100%)',
        'dark-card': 'linear-gradient(145deg, #1a1f2e 0%, #252a3a 100%)',
      },
    },
  },
  plugins: [],
}