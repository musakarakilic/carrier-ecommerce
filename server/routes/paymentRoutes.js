const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');
const { createPaymentIntent, handleWebhook, getPaymentMethods } = require('../controllers/payment.controller');

// Get payment methods
router.get('/methods', getPaymentMethods);

// Create Stripe payment intent
router.post('/create-payment-intent', protect, createPaymentIntent);

// Stripe webhook
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

module.exports = router; 