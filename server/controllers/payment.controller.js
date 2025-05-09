// Check if .env values are loaded
  

// Check if Stripe API key is empty before throwing error
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
    
    
}

const stripe = stripeSecretKey ? require('stripe')(stripeSecretKey) : null;
const Order = require('../models/order.model');

// Create Stripe payment intent
const createPaymentIntent = async (req, res) => {
  try {
    if (!stripe) {
      return res.status(500).json({
        success: false,
        message: 'Stripe payment service is not configured'
      });
    }

    const { amount, orderId, currency = 'usd', metadata = {} } = req.body;

    if (!amount) {
      return res.status(400).json({
        success: false,
        message: 'Amount is required'
      });
    }

    // Prepare metadata
    const paymentMetadata = { ...metadata };
    
    // If orderId is provided, add it to metadata
    if (orderId) {
      paymentMetadata.orderId = orderId;
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: paymentMetadata,
      payment_method_types: ['card'],
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating payment intent',
      error: error.message
    });
  }
};

// Update payment status via webhook
const handleWebhook = async (req, res) => {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    if (endpointSecret) {
      // Verify webhook signature
      const signature = req.headers['stripe-signature'];
      
      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          signature,
          endpointSecret
        );
      } catch (err) {
        return res.status(400).send(`Webhook signature verification failed.`);
      }
    } else {
      // Handle webhooks without verification for local development
      event = req.body;
    }

    // Handle specific events
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        
        // Update order if orderId exists in metadata
        if (paymentIntent.metadata && paymentIntent.metadata.orderId) {
          const orderId = paymentIntent.metadata.orderId;
          const order = await Order.findById(orderId);
          
          if (!order) {
            return res.status(404).json({
              success: false,
              message: `Order not found: ${orderId}`
            });
          }
          
          // Update order payment status
          try {
            order.paymentStatus = 'completed';
            order.paymentResult = {
              id: paymentIntent.id,
              status: paymentIntent.status,
              update_time: new Date(),
              email_address: paymentIntent.receipt_email
            };
            
            await order.save();
          } catch (error) {
            return res.status(500).json({
              success: false,
              message: 'Error updating order',
              error: error.message
            });
          }
        }
        break;
        
      case 'payment_intent.payment_failed':
        const failedPaymentIntent = event.data.object;
        // Log or handle failed payments
        break;
        
      // Add other event types as needed
    }

    res.status(200).json({ received: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error handling webhook',
      error: error.message
    });
  }
};

// Get all payment methods
const getPaymentMethods = (req, res) => {
  const paymentMethods = [
    { 
      id: 'stripe', 
      name: 'Credit/Bank Card', 
      description: 'Stripe infrastructure is used for secure payment',
      icon: '💳'
    },
    { 
      id: 'cash_on_delivery', 
      name: 'Cash on Delivery', 
      description: 'You can pay when you receive your order',
      extraFee: 10,
      icon: '💵'
    }
  ];
  
  res.json(paymentMethods);
};

module.exports = {
  createPaymentIntent,
  handleWebhook,
  getPaymentMethods
}; 