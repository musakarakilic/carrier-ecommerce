import { API_ENDPOINTS, apiRequest, logInfo, logWarn, logError } from '../utils';

export const orderService = {
  // Get user's orders
  getUserOrders: async (page = 1, limit = 10, status = '', includeNonActive = false) => {
    const params = { page, limit };
    
    // If status is provided, use it for filtering
    if (status) {
      params.status = status;
    } else if (!includeNonActive) {
      // By default, exclude cancelled orders
      params.excludeStatus = 'cancelled';
    }
    
    const response = await apiRequest('get', `${API_ENDPOINTS.ORDERS}/myorders`, null, params);
    return response.orders || [];
  },
  
  // Get order details
  getOrderById: async (orderId) => {
    try {
      logInfo('Getting order details', { orderId }, 'orderService');
      const response = await apiRequest('get', `${API_ENDPOINTS.ORDERS}/${orderId}`);
      
      // Check payment information
      logInfo('Order details successfully retrieved', response, 'orderService');
      
      // Payment method check
      if (response.payment && response.payment.method) {
        logInfo('Payment information', {
          method: response.payment.method,
          status: response.payment.status
        }, 'orderService');
        
        // For compatibility with old API
        if (!response.paymentMethod) {
          response.paymentMethod = response.payment.method;
        }
        
        // Set isPaid to true if payment is completed
        if (response.payment.status === 'completed' && !response.isPaid) {
          logInfo('Payment completed but isPaid is false, fixing', null, 'orderService');
          response.isPaid = true;
          response.paidAt = response.paidAt || new Date().toISOString();
        }
      } else if (response.paymentMethod) {
        logInfo('Payment method', { paymentMethod: response.paymentMethod }, 'orderService');
      } else {
        logWarn('Payment information not found!', null, 'orderService');
      }
      
      logInfo('Payment status', { isPaid: response.isPaid ? 'Paid' : 'Unpaid' }, 'orderService');
      
      // Don't automatically set payment to paid for cancelled orders or for cash on delivery
      if (response.status !== 'cancelled' && response.paymentMethod === 'credit_card' && !response.isPaid) {
        logInfo('Manually setting payment status to paid for testing', null, 'orderService');
        response.isPaid = true;
        response.paidAt = new Date().toISOString();
        if (response.payment) {
          response.payment.status = 'completed';
        }
      }
      
      return response;
    } catch (error) {
      logError('Error getting order details', { 
        status: error.response?.status, 
        data: error.response?.data 
      }, 'orderService');
      throw error;
    }
  },
  
  // Create order
  createOrder: async (orderData) => {
    return apiRequest('post', API_ENDPOINTS.ORDERS, orderData);
  },
  
  // Cancel order
  cancelOrder: async (orderId) => {
    return apiRequest('put', `${API_ENDPOINTS.ORDERS}/${orderId}/cancel`, {});
  },
  
  // Update payment status
  updatePaymentStatus: async (orderId, paymentData) => {
    try {
      logInfo('Updating payment status', { orderId }, 'orderService');
      
      const response = await apiRequest('put', `${API_ENDPOINTS.ORDERS}/${orderId}/payment`, {
        paymentStatus: 'completed',
        transactionId: paymentData.id
      });
      
      logInfo('Payment status update successful', response, 'orderService');
      return response;
    } catch (error) {
      logError('Error updating payment status', error, 'orderService');
      throw error;
    }
  }
}; 