import { defineStore } from 'pinia';
import router from '../router';
import api from '../services/api';

// Get environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT || '/api';
const API_URL = `${API_BASE_URL}${API_ENDPOINT}`;

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin'
  },

  actions: {
    // Method to run when application starts
    async initialize() {
      if (this.token) {
        try {
          await this.getProfile();
        } catch (error) {
          // Only log in development
          if (import.meta.env.DEV) {
            console.error('Could not load user profile:', error);
          }
          this.logout(); // Logout if token is invalid
        }
      }
    },

    async login(email, password) {
      // Don't proceed if already loading
      if (this.loading) return Promise.reject(new Error('Login already in progress'));
      
      try {
        this.loading = true;
        this.error = null;
        
        // Client-side validation
        if (!email) {
          this.error = 'Email is required';
          return Promise.reject(new Error(this.error));
        }
        
        if (!password) {
          this.error = 'Password is required';
          return Promise.reject(new Error(this.error));
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          this.error = 'Please enter a valid email address';
          return Promise.reject(new Error(this.error));
        }
        
        if (password.length < 6) {
          this.error = 'Password must be at least 6 characters';
          return Promise.reject(new Error(this.error));
        }
        
        // Make API request with extra error handling
        let response;
        try {
          response = await api.post(`/auth/login`, { email, password });
        } catch (apiError) {
          // Explicitly handle API errors
          if (apiError.response?.status === 401) {
            this.error = 'Invalid email or password';
          } else if (apiError.response?.status === 429) {
            this.error = 'Too many login attempts. Please try again later.';
          } else if (!apiError.response) {
            this.error = 'Network error. Please check your connection.';
          } else {
            this.error = apiError.response?.data?.message || 'Login failed';
          }
          
          // Log in development mode
          if (import.meta.env.DEV) {
            console.error('API Login error:', apiError);
          }
          
          return Promise.reject(new Error(this.error));
        }

        // Validate response
        if (!response.data || !response.data.token) {
          this.error = 'Invalid response from server';
          return Promise.reject(new Error(this.error));
        }

        // Update state and localStorage on success
        this.token = response.data.token;
        this.user = response.data;
        
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userRole', response.data.role);
        
        return response.data;
      } catch (error) {
        // This catch block handles any errors not caught above
        if (!this.error) {
          this.error = error.message || 'An unexpected error occurred';
        }
        
        // Log in development mode
        if (import.meta.env.DEV && !error.logged) {
          console.error('Login error:', error);
          error.logged = true;
        }
        
        return Promise.reject(error);
      } finally {
        this.loading = false;
      }
    },

    async register(userData) {
      // Don't proceed if already loading
      if (this.loading) return Promise.reject(new Error('Registration already in progress'));
      
      try {
        this.loading = true;
        this.error = null;
        
        // Client-side validation
        if (!userData.email) {
          this.error = 'Email is required';
          return Promise.reject(new Error(this.error));
        }
        
        if (!userData.password) {
          this.error = 'Password is required';
          return Promise.reject(new Error(this.error));
        }
        
        if (!userData.name) {
          this.error = 'Name is required';
          return Promise.reject(new Error(this.error));
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email)) {
          this.error = 'Please enter a valid email address';
          return Promise.reject(new Error(this.error));
        }
        
        // Password validation
        if (userData.password.length < 6) {
          this.error = 'Password must be at least 6 characters';
          return Promise.reject(new Error(this.error));
        }
        
        // Make API request with extra error handling
        let response;
        try {
          response = await api.post(`/auth/register`, userData);
        } catch (apiError) {
          // Explicitly handle API errors
          if (apiError.response?.status === 409) {
            this.error = 'Email is already registered';
          } else if (apiError.response?.status === 400) {
            this.error = apiError.response?.data?.message || 'Invalid registration data';
          } else if (!apiError.response) {
            this.error = 'Network error. Please check your connection.';
          } else {
            this.error = apiError.response?.data?.message || 'Registration failed';
          }
          
          // Log in development mode
          if (import.meta.env.DEV) {
            console.error('API Register error:', apiError);
          }
          
          return Promise.reject(new Error(this.error));
        }
        
        // Validate response
        if (!response.data || !response.data.token) {
          this.error = 'Invalid response from server';
          return Promise.reject(new Error(this.error));
        }
        
        this.token = response.data.token;
        this.user = response.data;
        
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userRole', response.data.role);
        
        return response.data;
      } catch (error) {
        // This catch block handles any errors not caught above
        if (!this.error) {
          this.error = error.message || 'An unexpected error occurred during registration';
        }
        
        // Log in development mode
        if (import.meta.env.DEV && !error.logged) {
          console.error('Register error:', error);
          error.logged = true;
        }
        
        return Promise.reject(error);
      } finally {
        this.loading = false;
      }
    },

    async getProfile() {
      try {
        const response = await api.get(`/auth/profile`, {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        
        this.user = response.data;
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'An error occurred';
        throw error;
      }
    },

    async updateProfile(profileData) {
      try {
        this.loading = true;
        this.error = null;
        
        const response = await api.put(`/auth/profile`, profileData, {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        
        // Only update changed user fields
        this.user = { ...this.user, ...response.data };
        
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'An error occurred while updating profile';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async changePassword(passwordData) {
      try {
        this.loading = true;
        this.error = null;
        
        const response = await api.post(`/auth/change-password`, passwordData, {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'An error occurred while changing password';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async uploadProfileImage(imageFile) {
      try {
        this.loading = true;
        this.error = null;
        
        const formData = new FormData();
        formData.append('profileImage', imageFile);
        
        const response = await api.post(`/auth/profile/image`, formData, {
          headers: { 
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        
        // Update profile image
        if (this.user) {
          this.user.profileImage = response.data.profileImage;
        }
        
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'An error occurred while uploading profile image';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      
      // Don't use router directly as it can cause issues
      // The redirection will be handled by the App.vue component
      // This makes the store more modular and less coupled to the router
    }
  }
}); 