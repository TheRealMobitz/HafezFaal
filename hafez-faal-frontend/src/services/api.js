import axios from 'axios';

// Use environment variable for API URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  timeout: 10000, // 10 second timeout
});

// Add request interceptor to handle CSRF
api.interceptors.request.use(
  async (config) => {
    // Try to get CSRF token from cookie
    let csrfToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='))
      ?.split('=')[1];
    
    // If no CSRF token and this is a non-GET request, fetch it
    if (!csrfToken && config.method !== 'get') {
      try {
        console.log('Fetching CSRF token...');
        const csrfResponse = await axios.get(`${API_BASE_URL}/csrf/`, { 
          withCredentials: true,
          timeout: 5000 
        });
        
        // Try to get token from cookie after fetching
        csrfToken = document.cookie
          .split('; ')
          .find(row => row.startsWith('csrftoken='))
          ?.split('=')[1];
        
        // If still no token, try to get from response
        if (!csrfToken && csrfResponse.data?.csrf_token) {
          csrfToken = csrfResponse.data.csrf_token;
        }
      } catch (error) {
        console.warn('Could not fetch CSRF token:', error);
      }
    }
    
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;
      console.log('Added CSRF token to request');
    } else {
      console.warn('No CSRF token available');
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    if (response?.status === 403) {
      console.warn('CSRF or authentication error.');
    } else if (response?.status === 401) {
      console.warn('Authentication required.');
      localStorage.removeItem('user');
      if (!window.location.pathname.includes('/login')) {
        // Don't redirect automatically in production, just log
        console.log('User needs to login');
      }
    } else if (response?.status === 500) {
      console.error('Server error:', response.data);
    } else if (!response) {
      console.error('Network error. Check your connection.');
    }
    
    return Promise.reject(error);
  }
);

export const apiService = {
  // Health check
  healthCheck: () => api.get('/health/'),
  
  // CSRF
  getCSRFToken: () => api.get('/csrf/'),
  
  // Auth endpoints
  login: (credentials) => api.post('/auth/login/', credentials),
  register: (userData) => api.post('/auth/register/', userData),
  logout: () => api.post('/auth/logout/'),
  getCurrentUser: () => api.get('/auth/user/'),

  // Data endpoints
  getDailyQuote: () => api.get('/quote/'),
  getDashboard: () => api.get('/dashboard/'),
  getQuotes: () => api.get('/quotes/'),
  getGhazals: () => api.get('/ghazals/'),
  
  // Helper method to get current API URL (for debugging)
  getApiUrl: () => API_BASE_URL,
};

// Export both named and default
export default api;