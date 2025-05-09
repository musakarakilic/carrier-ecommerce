const Order = require('../models/order.model');
const Product = require('../models/product.model');

// Get all orders (Different behavior for admin and user)
const getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, sortBy = 'createdAt', order = 'desc' } = req.query;
    const query = {};

    // Admin can see all orders, user can only see their own orders
    if (req.user.role !== 'admin') {
      query.user = req.user._id;
    }
    
    // Status filter
    if (status && status !== 'all') {
      query.status = status;
    }

    // For sorting
    const sortOptions = {};
    sortOptions[sortBy] = order === 'desc' ? -1 : 1;

    const orders = await Order.find(query)
      .populate('user', 'firstName lastName email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sortOptions);

    const count = await Order.countDocuments(query);

    res.json({
      orders,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single order
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'firstName lastName email phone');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // User can only view their own orders (admin can view all orders)
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You do not have permission to view this order' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create order
const createOrder = async (req, res) => {
  try {
    const { 
      orderItems, 
      shippingAddress, 
      paymentMethod,
      notes 
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items found' });
    }

    // Get product details from database and check stock
    const orderItemsWithDetails = await Promise.all(
      orderItems.map(async (item) => {
        const product = await Product.findById(item.product);
        
        if (!product) {
          throw new Error(`Product not found: ${item.product}`);
        }
        
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock: ${product.name}`);
        }
        
        // Deduct from stock
        product.stock -= item.quantity;
        await product.save();
        
        return {
          product: product._id,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
          image: product.images && product.images.length > 0 ? product.images[0] : null
        };
      })
    );

    // Create new order
    const order = new Order({
      user: req.user._id,
      orderItems: orderItemsWithDetails,
      shippingAddress,
      payment: {
        method: paymentMethod,
        status: 'pending'
      },
      notes
    });

    // Calculate total price
    order.calculateTotalPrice();

    // Save order
    const savedOrder = await order.save();
    
    res.status(201).json({
      message: 'Order created successfully',
      order: savedOrder
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update order status (for admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: 'Order status not specified' });
    }
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Only admin can update
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You do not have permission for this operation' });
    }
    
    // Update order status
    order.status = status;
    
    // Update tracking number (if provided)
    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }
    
    // If order is marked as delivered
    if (status === 'delivered' && !order.isDelivered) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }
    
    const updatedOrder = await order.save();
    
    res.json({
      message: 'Order status updated',
      order: updatedOrder
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update payment information (usually via payment system callback)
const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus, transactionId } = req.body;
    
    if (!paymentStatus) {
      return res.status(400).json({ message: 'Payment status not specified' });
    }
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Update payment information
    order.payment.status = paymentStatus;
    order.payment.transactionId = transactionId;
    order.payment.updatedAt = Date.now();
    
    // If payment is completed
    if (paymentStatus === 'completed' && !order.isPaid) {
      order.isPaid = true;
      order.paidAt = Date.now();
      
      // Update order status - if pending, change to processing
      if (order.status === 'pending') {
        order.status = 'processing';
      }
    }
    
    const updatedOrder = await order.save();
    
    res.json({
      message: 'Payment status updated',
      order: updatedOrder
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Cancel order
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // User can only cancel their own orders (admin can cancel all orders)
    if (req.user.role !== 'admin' && order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You do not have permission to cancel this order' });
    }
    
    // Only orders in certain statuses can be cancelled
    if (order.status === 'shipped' || order.status === 'delivered') {
      return res.status(400).json({
        message: 'Orders that have been shipped or delivered cannot be cancelled'
      });
    }
    
    // Cancel order
    order.status = 'cancelled';
    
    // Return products to stock
    await Promise.all(
      order.orderItems.map(async (item) => {
        const product = await Product.findById(item.product);
        
        if (product) {
          product.stock += item.quantity;
          await product.save();
        }
      })
    );
    
    const updatedOrder = await order.save();
    
    res.json({
      message: 'Order cancelled successfully',
      order: updatedOrder
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// My orders (for user)
const getMyOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = { user: req.user._id };
    
    // Status filter
    if (status && status !== 'all') {
      query.status = status;
    }
    
    const orders = await Order.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
      
    const count = await Order.countDocuments(query);
    
    res.json({
      orders,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder,
  getMyOrders
}; 