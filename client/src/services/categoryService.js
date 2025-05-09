import { API_ENDPOINTS, apiRequest, getAll, getById, create, update, deleteItem, logError } from '../utils';

export const categoryService = {
  // Get all categories
  getAll: async () => {
    return getAll(API_ENDPOINTS.CATEGORIES);
  },

  // Get category by ID
  getById: async (id) => {
    return getById(API_ENDPOINTS.CATEGORIES, id);
  },

  // Get category by slug
  getBySlug: async (slug) => {
    try {
      return await apiRequest('get', `${API_ENDPOINTS.CATEGORIES}/slug/${slug}`);
    } catch (error) {
      // Silently handle 404 errors
      if (error.response?.status === 404) {
        logError(`Category not found with slug (${slug})`, null, 'categoryService');
        throw error; // Just rethrow, don't print additional error message
      }
      logError(`Error getting category with slug (${slug})`, error, 'categoryService');
      throw error;
    }
  },

  // Get main categories (those without parent category)
  getMainCategories: async () => {
    return apiRequest('get', `${API_ENDPOINTS.CATEGORIES}/main`);
  },

  // Get subcategories of a specific category
  getSubcategories: async (categoryId) => {
    return apiRequest('get', `${API_ENDPOINTS.CATEGORIES}/${categoryId}/subcategories`);
  },

  // Create new category
  create: async (category) => {
    return create(API_ENDPOINTS.CATEGORIES, category);
  },

  // Update category
  update: async (id, category) => {
    return update(API_ENDPOINTS.CATEGORIES, id, category);
  },

  // Delete category
  delete: async (id) => {
    return deleteItem(API_ENDPOINTS.CATEGORIES, id);
  }
}; 