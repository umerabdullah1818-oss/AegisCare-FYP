import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add JWT token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Guard to prevent multiple auth-expired dispatches
let isLoggingOut = false;

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Only handle logout ONCE — prevents refresh loops from background polls
      if (!isLoggingOut) {
        isLoggingOut = true;
        console.warn('Unauthorized: Token expired. Logging out once.');
        
        // Clear authentication data
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userFirstName');
        localStorage.removeItem('userId');
        localStorage.removeItem('isGoogleAuth');
        
        // Dispatch event once — App.jsx handles graceful navigation
        window.dispatchEvent(new Event('auth-expired'));
        
        // Reset flag after a short delay so future logins can trigger it again
        setTimeout(() => { isLoggingOut = false; }, 3000);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
