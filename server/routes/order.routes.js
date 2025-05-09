const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/auth.middleware');
const {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder,
  getMyOrders
} = require('../controllers/order.controller');

// List orders (admin can see all, users can only see their own)
router.get('/', protect, getOrders);

// Special endpoint for user's own orders
router.get('/myorders', protect, getMyOrders);

// Single order details
router.get('/:id', protect, getOrder);

// Create new order
router.post('/', protect, createOrder);

// Update order status (admin only)
router.put('/:id/status', protect, admin, updateOrderStatus);

// Update payment status (should use webhook for security in normal conditions)
router.put('/:id/payment', protect, updatePaymentStatus);

// Cancel order
router.put('/:id/cancel', protect, cancelOrder);

module.exports = router; 