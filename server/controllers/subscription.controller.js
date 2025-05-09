const Subscription = require('../models/subscription.model');
const { validationResult } = require('express-validator');

// Create new subscription (for users)
exports.subscribe = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const { email } = req.body;
    
    // Check if email is already registered
    const existingSubscription = await Subscription.findOne({ email });
    
    if (existingSubscription) {
      // If previously registered and not active, reactivate
      if (!existingSubscription.isActive) {
        existingSubscription.isActive = true;
        existingSubscription.subscribedAt = Date.now();
        await existingSubscription.save();
        
        return res.status(200).json({
          success: true,
          message: 'Your newsletter subscription has been reactivated'
        });
      }
      
      return res.status(400).json({
        success: false,
        message: 'This email address is already subscribed'
      });
    }
    
    // Create new subscription
    const subscription = new Subscription({
      email,
      isActive: true,
      subscribedAt: Date.now()
    });
    
    await subscription.save();
    
    res.status(201).json({
      success: true,
      message: 'Your newsletter subscription has been successfully created'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while creating the subscription',
      error: error.message
    });
  }
};

// Unsubscribe (for users)
exports.unsubscribe = async (req, res) => {
  try {
    const { email } = req.params;
    
    const subscription = await Subscription.findOne({ email });
    
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'No subscription found for this email address'
      });
    }
    
    if (!subscription.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This email address is already unsubscribed'
      });
    }
    
    // Deactivate subscription
    subscription.isActive = false;
    await subscription.save();
    
    res.status(200).json({
      success: true,
      message: 'You have successfully unsubscribed from the newsletter'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while unsubscribing',
      error: error.message
    });
  }
};

// Resubscribe (for admin)
exports.resubscribe = async (req, res) => {
  try {
    const { email } = req.params;
    
    const subscription = await Subscription.findOne({ email });
    
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'No subscription found for this email address'
      });
    }
    
    if (subscription.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This email address is already actively subscribed'
      });
    }
    
    // Reactivate subscription
    subscription.isActive = true;
    await subscription.save();
    
    res.status(200).json({
      success: true,
      message: 'The email has been successfully resubscribed to the newsletter'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while resubscribing',
      error: error.message
    });
  }
};

// Get all subscriptions (admin only)
exports.getAllSubscriptions = async (req, res) => {
  try {
    const { limit = 10, page = 1, isActive } = req.query;
    
    const filter = {};
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    
    const subscriptions = await Subscription.find(filter)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ subscribedAt: -1 });
    
    const total = await Subscription.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      count: subscriptions.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: subscriptions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving subscriptions',
      error: error.message
    });
  }
};

// Delete subscription (admin only)
exports.deleteSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    
    const subscription = await Subscription.findById(id);
    
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }
    
    await Subscription.findByIdAndDelete(id);
    
    res.status(200).json({
      success: true,
      message: 'Subscription successfully deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the subscription',
      error: error.message
    });
  }
}; 