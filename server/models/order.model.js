const mongoose = require('mongoose');

// Order item schema
const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  image: {
    type: String,
    required: false
  }
});

// Shipping address schema
const shippingAddressSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  postalCode: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true,
    default: 'Turkey'
  },
  phone: {
    type: String,
    required: true
  }
});

// Payment information schema
const paymentSchema = new mongoose.Schema({
  method: {
    type: String,
    required: true,
    enum: ['credit_card', 'bank_transfer', 'cash_on_delivery', 'wallet', 'stripe']
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  transactionId: {
    type: String
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Order schema
const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderItems: [orderItemSchema],
  shippingAddress: shippingAddressSchema,
  payment: paymentSchema,
  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  trackingNumber: {
    type: String
  },
  notes: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  paidAt: {
    type: Date
  },
  isDelivered: {
    type: Boolean,
    default: false
  },
  deliveredAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Calculate total price method
orderSchema.methods.calculateTotalPrice = function() {
  this.itemsPrice = this.orderItems.reduce(
    (total, item) => total + item.price * item.quantity, 
    0
  );
  
  // Default tax rate 18% (VAT)
  this.taxPrice = this.itemsPrice * 0.18;
  
  // Shipping cost (free for orders over 50 TL)
  this.shippingPrice = this.itemsPrice > 500 ? 0 : 30;
  
  // Total price
  this.totalPrice = this.itemsPrice + this.taxPrice + this.shippingPrice;
  
  return this.totalPrice;
};

const Order = mongoose.model('Order', orderSchema);
module.exports = Order; 