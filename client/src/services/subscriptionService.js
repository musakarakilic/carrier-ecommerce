// client/src/services/subscriptionService.js
import { API_ENDPOINTS, apiRequest, logError } from '../utils';

export const subscriptionService = {
  // Subscribe to newsletter
  async subscribe(email) {
    try {
      return await apiRequest('post', `${API_ENDPOINTS.COLLECTIONS}/subscribe`, { email });
    } catch (error) {
      logError('Error creating newsletter subscription', error, 'subscriptionService');
      throw error;
    }
  },

  // Unsubscribe from newsletter
  async unsubscribe(email) {
    try {
      return await apiRequest('get', `${API_ENDPOINTS.COLLECTIONS}/unsubscribe/${email}`);
    } catch (error) {
      logError('Error unsubscribing from newsletter', error, 'subscriptionService');
      throw error;
    }
  },

  // Admin functions

  // Get all subscriptions
  async getAll(params = {}) {
    try {
      return await apiRequest('get', '/subscriptions', null, params);
    } catch (error) {
      logError('Error getting subscriptions', error, 'subscriptionService');
      throw error;
    }
  },

  // Reactivate subscription
  async resubscribe(email) {
    try {
      return await apiRequest('get', `/subscriptions/resubscribe/${email}`);
    } catch (error) {
      logError('Error reactivating subscription', error, 'subscriptionService');
      throw error;
    }
  },

  // Delete subscription
  async delete(id) {
    try {
      return await apiRequest('delete', `/subscriptions/${id}`);
    } catch (error) {
      logError('Error deleting subscription', error, 'subscriptionService');
      throw error;
    }
  }
};