// client/src/services/brandService.js
import { API_ENDPOINTS, apiRequest, create, update, deleteItem, logError } from '../utils';

export const brandService = {
  // Get all brands
  async getAll(params = {}) {
    try {
      const response = await apiRequest('get', API_ENDPOINTS.BRANDS, null, params);
      return response.data;
    } catch (error) {
      logError('Error getting brands', error, 'brandService');
      throw error;
    }
  },

  // Get a specific brand by slug
  async getBySlug(slug) {
    try {
      const response = await apiRequest('get', `${API_ENDPOINTS.BRANDS}/${slug}`);
      return response.data;
    } catch (error) {
      logError(`Error getting brand ${slug}`, error, 'brandService');
      throw error;
    }
  },

  // Get brands by category
  async getByCategory(category) {
    try {
      const response = await apiRequest('get', `${API_ENDPOINTS.BRANDS}/category/${category}`);
      return response.data;
    } catch (error) {
      logError(`Error getting brands in category ${category}`, error, 'brandService');
      throw error;
    }
  },

  // Get products by brand
  async getBrandProducts(slug, params = {}) {
    try {
      const response = await apiRequest('get', `${API_ENDPOINTS.BRANDS}/${slug}/products`, null, params);
      return response;
    } catch (error) {
      logError(`Error getting products for brand ${slug}`, error, 'brandService');
      throw error;
    }
  },

  // Admin functions

  // Create new brand
  async create(brandData) {
    try {
      const response = await create(API_ENDPOINTS.BRANDS, brandData);
      return response.data;
    } catch (error) {
      logError('Error creating brand', error, 'brandService');
      throw error;
    }
  },

  // Update brand
  async update(slug, brandData) {
    try {
      const response = await apiRequest('put', `${API_ENDPOINTS.BRANDS}/${slug}`, brandData);
      return response.data;
    } catch (error) {
      logError(`Error updating brand ${slug}`, error, 'brandService');
      throw error;
    }
  },

  // Delete brand
  async delete(slug) {
    try {
      const response = await apiRequest('delete', `${API_ENDPOINTS.BRANDS}/${slug}`);
      return response;
    } catch (error) {
      logError(`Error deleting brand ${slug}`, error, 'brandService');
      throw error;
    }
  }
};