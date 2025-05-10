import axios from 'axios';
import { useToast } from 'vue-toastification';

const toast = useToast();

// Get environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://carrier-ecommerce.onrender.com';
const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT || '/api';

// Create a custom event for auth errors to handle them in a centralized way
export const authEvents = {
  logout: () => {
    const event = new CustomEvent('auth:logout', { detail: { reason: 'session_expired' } });
    window.dispatchEvent(event);
  },
  unauthorized: (error) => {
    const event = new CustomEvent('auth:unauthorized', { detail: { error } });
    window.dispatchEvent(event);
  }
};

const api = axios.create({
  baseURL: `${API_BASE_URL}${API_ENDPOINT}`,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: false // Set to false for CORS issues
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Only log in development
    if (import.meta.env.DEV) {
      console.error('API Request error:', error);
    }
    return Promise.reject(error);
  }
);

// Toast function - For using toast outside Vue composition API
// This can be used directly in the interceptor
const showToast = {
  error: (message, options = {}) => {
    try {
      toast.error(message, options);
    } catch (err) {
      // Only log in development
      if (import.meta.env.DEV) {
        console.error('Toast error:', err);
      }
      // Use alert as alternative
      alert(message);
    }
  },
  success: (message, options = {}) => {
    try {
      toast.success(message, options);
    } catch (err) {
      // Only log in development
      if (import.meta.env.DEV) {
        console.error('Toast error:', err);
      }
      alert(message);
    }
  }
};

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = error.response?.data?.message || 'An error occurred';
    
    // Only log in development
    if (import.meta.env.DEV) {
      console.error('API Response error:', error.response?.status, errorMessage);
    }
    
    // URL checks
    const url = error.config.url || '';
    const isAuthRequest = url.includes('/auth/');
    const isCategoryRequest = url.includes('/categories/');
    const isCollectionRequest = url.includes('/collections/');
    const is404Error = error.response?.status === 404;
    
    // Don't show toast for category or collection 404 errors
    // These errors are handled by the router with NotFound page
    const shouldSkipToast = is404Error && (isCategoryRequest || isCollectionRequest);
    
    // Special check for password change error
    const isPasswordChange = error.config.url.includes('/auth/change-password');
    
    // Special check for login/register errors - don't show toast for these
    const isLoginRequest = url.includes('/auth/login');
    const isRegisterRequest = url.includes('/auth/register');
    const shouldHandleInComponent = isLoginRequest || isRegisterRequest;
    
    if (isPasswordChange) {
      // Don't show notification for password change errors, throw error as is
      // This way we can handle it specially in the modal
      return Promise.reject(error);
    } else if (error.response?.status === 401) {
      // Don't redirect or show toast for login failures
      if (!isAuthRequest) {
        toast.error('Your session has expired. Please login again.');
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        
        // Use event instead of direct page reload
        authEvents.logout();
      }
    } else if (error.response?.status === 403) {
      toast.error('You do not have permission for this operation.');
    } else if (!navigator.onLine) {
      toast.error('Please check your internet connection.');
    } else if (!shouldSkipToast && !shouldHandleInComponent) {
      // Show toast for errors that should not be skipped
      // and are not being handled in the component
      toast.error(errorMessage);
    }
    
    return Promise.reject(error);
  }
);

export default api; 