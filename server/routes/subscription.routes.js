const express = require('express');
const router = express.Router();
const { 
  subscribe,
  unsubscribe,
  getAllSubscriptions,
  deleteSubscription,
  resubscribe
} = require('../controllers/subscription.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');

// Public routes - accessible to everyone
router.post('/subscribe', subscribe);
router.get('/unsubscribe/:email', unsubscribe);

// Protected routes - only admin can access
// Place specific routes first
router.get('/resubscribe/:email', protect, restrictTo('admin'), resubscribe);
router.delete('/:id', protect, restrictTo('admin'), deleteSubscription);
// Place general route last
router.get('/', protect, restrictTo('admin'), getAllSubscriptions);

module.exports = router; 