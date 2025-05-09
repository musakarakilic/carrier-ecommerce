/**
 * HTTP Helper functions for API calls and error handling
 * Centralizes common API operations to reduce code duplication
 */

import api from '../services/api';

/**
 * Generic API request function with error handling
 * @param {string} method - HTTP method (get, post, put, delete)
 * @param {string} url - API endpoint
 * @param {Object} data - Request payload (for POST/PUT)
 * @param {Object} params - URL query parameters
 * @param {Object} options - Additional axios options
 * @returns {Promise} - API response
 */
export const apiRequest = async (method, url, data = null, params = {}, options = {}) => {
  try {
    let response;
    
    // Choose method based on input
    switch (method.toLowerCase()) {
      case 'get':
        response = await api.get(url, { params, ...options });
        break;
      case 'post':
        response = await api.post(url, data, { params, ...options });
        break;
      case 'put':
        response = await api.put(url, data, { params, ...options });
        break;
      case 'delete':
        response = await api.delete(url, { data, params, ...options });
        break;
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
    
    // Return data directly
    return response.data;
  } catch (error) {
    // Log error in development mode
    if (import.meta.env.DEV) {
      console.error(`API ${method.toUpperCase()} error for ${url}:`, error);
      console.error('Error details:', error.response?.data || error.message);
    }
    throw error;
  }
};

/**
 * Generic CRUD operation helpers
 */

// Get all items
export const getAll = async (endpoint, params = {}) => {
  return apiRequest('get', endpoint, null, params);
};

// Get item by ID
export const getById = async (endpoint, id) => {
  return apiRequest('get', `${endpoint}/${id}`);
};

// Get item by slug
export const getBySlug = async (endpoint, slug) => {
  return apiRequest('get', `${endpoint}/slug/${slug}`);
};

// Create new item
export const create = async (endpoint, data) => {
  return apiRequest('post', endpoint, data);
};

// Update item
export const update = async (endpoint, id, data) => {
  return apiRequest('put', `${endpoint}/${id}`, data);
};

// Delete item
export const deleteItem = async (endpoint, id) => {
  return apiRequest('delete', `${endpoint}/${id}`);
};

/**
 * API endpoint constants
 */
export const API_ENDPOINTS = {
  PRODUCTS: '/products',
  CATEGORIES: '/categories',
  BRANDS: '/brands',
  COLLECTIONS: '/collections',
  USERS: '/users',
  AUTH: '/auth',
  ORDERS: '/orders',
  PAYMENTS: '/payments',
  UPLOADS: '/uploads'
};

export default {
  apiRequest,
  getAll,
  getById,
  getBySlug,
  create,
  update,
  deleteItem,
  API_ENDPOINTS
}; 