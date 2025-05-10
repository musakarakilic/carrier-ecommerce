import { API_ENDPOINTS, apiRequest, getById, create, update, deleteItem, logInfo, logError } from '../utils';

export const userService = {
  // Get all users (with pagination and search support)
  getAll: async (params = {}) => {
    try {
      const { page = 1, limit = 10, search = '' } = params;
      logInfo(`userService.getAll called - Page: ${page}, Limit: ${limit}`, null, 'userService');
      
      const response = await apiRequest('get', API_ENDPOINTS.USERS, null, { page, limit, search });
      
      logInfo('userService.getAll successful result', {
        total: response.total,
        page: page,
        userCount: response.users?.length || 0
      }, 'userService');
      
      return response;
    } catch (error) {
      logError('userService.getAll error', error, 'userService');
      throw error;
    }
  },

  // Get user by ID
  getById: async (id) => {
    return getById(API_ENDPOINTS.USERS, id);
  },

  // Create new user
  create: async (user) => {
    return create(API_ENDPOINTS.USERS, user);
  },

  // Update user
  update: async (id, user) => {
    try {
      logInfo(`userService.update: Updating user with ID ${id}`, user, 'userService');
      const response = await update(API_ENDPOINTS.USERS, id, user);
      logInfo('userService.update: Successful response', response, 'userService');
      return response;
    } catch (error) {
      logError('userService.update: Error', error, 'userService');
      throw error;
    }
  },

  // Delete user
  delete: async (id) => {
    return deleteItem(API_ENDPOINTS.USERS, id);
  },

  // Update user role
  updateRole: async (id, role) => {
    return apiRequest('put', `${API_ENDPOINTS.USERS}/${id}/role`, { role });
  },

  // Update user status
  updateStatus: async (id, active) => {
    return update(API_ENDPOINTS.USERS, id, { isActive: active });
  },

  // Activate user (reactivate a deactivated user)
  activateUser: async (id) => {
    return update(API_ENDPOINTS.USERS, id, { isActive: true });
  },

  // Profile operations
  getProfile: async () => {
    return apiRequest('get', `${API_ENDPOINTS.AUTH}/profile`);
  },
  
  updateProfile: async (userData) => {
    return apiRequest('put', `${API_ENDPOINTS.AUTH}/profile`, userData);
  },
  
  changePassword: async (passwordData) => {
    try {
      logInfo('userService - changePassword called', null, 'userService');
      const response = await apiRequest('post', `${API_ENDPOINTS.AUTH}/change-password`, passwordData);
      logInfo('userService - changePassword successful', null, 'userService');
      return response;
    } catch (error) {
      logError('userService - changePassword error', error, 'userService');
      // API interceptor will handle the error, we're just re-throwing here
      throw error;
    }
  },
  
  uploadProfileImage: async (formData) => {
    try {
      return await apiRequest('post', `${API_ENDPOINTS.AUTH}/profile/image`, formData, {}, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    } catch (error) {
      logError('Profile image upload error', error, 'userService');
      throw error;
    }
  },
  
  // Upload profile image for a specific user by admin
  uploadUserProfileImage: async (userId, formData) => {
    try {
      // Assuming this is an admin endpoint
      // If this endpoint doesn't exist in the code, it will need to be created on the server side
      return await apiRequest('post', `/admin/users/${userId}/profile-image`, formData, {}, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    } catch (error) {
      logError(`User (${userId}) profile image upload error`, error, 'userService');
      throw error;
    }
  }
}; 