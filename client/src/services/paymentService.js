import { API_ENDPOINTS, apiRequest, logError } from '../utils';

export const paymentService = {
  // Get payment methods
  getPaymentMethods: async () => {
    try {
      return await apiRequest('get', `${API_ENDPOINTS.PAYMENTS}/methods`);
    } catch (error) {
      logError('Error getting payment methods', error, 'paymentService');
      throw error;
    }
  },

  // Create Stripe payment intent
  createPaymentIntent: async (orderId, amount) => {
    try {
      return await apiRequest('post', `${API_ENDPOINTS.PAYMENTS}/create-payment-intent`, { 
        orderId,
        amount 
      });
    } catch (error) {
      logError('Error creating payment intent', error, 'paymentService');
      throw error;
    }
  },

  // Stripe payment completed
  confirmPayment: async (paymentId) => {
    try {
      return await apiRequest('post', `${API_ENDPOINTS.PAYMENTS}/confirm`, { paymentId });
    } catch (error) {
      logError('Error confirming payment', error, 'paymentService');
      throw error;
    }
  }
}; 