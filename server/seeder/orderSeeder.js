const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Order = require('../models/orderModel');
const User = require('../models/user.model');
const Product = require('../models/product.model');
const connectDB = require('../config/database');

dotenv.config();

// Sample status states to be used
const orderStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

// Sample payment methods to be used
const paymentMethods = ['credit_card', 'bank_transfer', 'cash_on_delivery'];

// Generate random date (within last 30 days)
const getRandomDate = () => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 30));
  return date;
};

// Generate random order status
const getRandomStatus = () => {
  return orderStatuses[Math.floor(Math.random() * orderStatuses.length)];
};

// Generate random shipping address
const getRandomShippingAddress = () => {
  const cities = ['Istanbul', 'Ankara', 'Izmir', 'Antalya', 'Bursa', 'Adana', 'Konya'];
  const districts = ['Kadikoy', 'Besiktas', 'Cankaya', 'Karsiyaka', 'Muratpasa', 'Nilufer', 'Seyhan', 'Selcuklu'];
  const streets = ['Ataturk Street', 'Republic Boulevard', 'Independence Street', 'Gazi Mustafa Kemal Boulevard', 'Mevlana Street'];
  
  const city = cities[Math.floor(Math.random() * cities.length)];
  const district = districts[Math.floor(Math.random() * districts.length)];
  const street = streets[Math.floor(Math.random() * streets.length)];
  const buildingNo = Math.floor(Math.random() * 100) + 1;
  const aptNo = Math.floor(Math.random() * 20) + 1;
  const postalCode = (Math.floor(Math.random() * 90000) + 10000).toString();
  
  return {
    address: `${street} No: ${buildingNo} Apt: ${aptNo}, ${district}`,
    city: city,
    postalCode: postalCode,
    country: 'Turkey'
  };
};

// Generate random order prices
const getRandomPrices = (items) => {
  const itemsPrice = items.reduce((total, item) => total + item.price * item.qty, 0);
  const taxPrice = itemsPrice * 0.18; // 18% VAT
  const shippingPrice = itemsPrice > 500 ? 0 : 30; // Free shipping over 500 TL
  const totalPrice = itemsPrice + taxPrice + shippingPrice;
  
  return {
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice
  };
};

// Create and add mock order data to database
const importOrders = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Clear previous order data
    await Order.deleteMany();
      
    
    // Get users
    const users = await User.find().select('_id');
    if (users.length === 0) {
        
      process.exit(1);
    }
    
    // Get products
    const products = await Product.find().select('_id name price images stock');
    if (products.length === 0) {
        
      process.exit(1);
    }
    
      
    
    // Create mock orders
    const orders = [];
    const orderCount = 50; // Number of orders to create
    
    for (let i = 0; i < orderCount; i++) {
      // Select a random user
      const user = users[Math.floor(Math.random() * users.length)];
      
      // Select 1-5 random products
      const orderItemCount = Math.floor(Math.random() * 5) + 1;
      const orderItems = [];
      
      // Track added product IDs (to avoid adding same product twice)
      const addedProductIds = new Set();
      
      for (let j = 0; j < orderItemCount; j++) {
        let randomProduct;
        let productId;
        
        // Select a product that hasn't been added yet
        do {
          randomProduct = products[Math.floor(Math.random() * products.length)];
          productId = randomProduct._id.toString();
        } while (addedProductIds.has(productId));
        
        addedProductIds.add(productId);
        
        // Random quantity (1-3)
        const qty = Math.floor(Math.random() * 3) + 1;
        
        orderItems.push({
          name: randomProduct.name,
          qty: qty,
          image: randomProduct.images && randomProduct.images.length > 0 ? randomProduct.images[0] : 'https://via.placeholder.com/150',
          price: randomProduct.price,
          product: randomProduct._id
        });
      }
      
      // Calculate order prices
      const prices = getRandomPrices(orderItems);
      
      // Order status
      const status = getRandomStatus();
      
      // Order date
      const createdAt = getRandomDate();
      
      // Payment and delivery status
      const isPaid = Math.random() > 0.3; // 70% chance of being paid
      const paidAt = isPaid ? createdAt : undefined;
      
      const isDelivered = status === 'Delivered';
      const deliveredAt = isDelivered ? new Date(createdAt.getTime() + 3 * 24 * 60 * 60 * 1000) : undefined; // 3 days later
      
      // Tracking number (for Shipped or Delivered status)
      const trackingNumber = (status === 'Shipped' || status === 'Delivered') 
        ? `TR${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}` 
        : '';
      
      // Payment method
      const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
      
      // Payment result
      const paymentResult = isPaid ? {
        id: `PAY-${Math.random().toString(36).substring(2, 10)}`,
        status: 'completed',
        update_time: paidAt.toISOString(),
        email_address: 'customer@example.com'
      } : undefined;
      
      // Create new order
      const order = {
        user: user._id,
        orderItems,
        shippingAddress: getRandomShippingAddress(),
        paymentMethod,
        paymentResult,
        itemsPrice: prices.itemsPrice,
        taxPrice: prices.taxPrice,
        shippingPrice: prices.shippingPrice,
        totalPrice: prices.totalPrice,
        isPaid,
        paidAt,
        status,
        isDelivered,
        deliveredAt,
        trackingNumber,
        createdAt,
        updatedAt: createdAt
      };
      
      orders.push(order);
    }
    
    // Add created orders to database
    await Order.insertMany(orders);
    
      
    process.exit();
  } catch (error) {
    console.error('Error adding orders:', error);
    process.exit(1);
  }
};

// Run the main function
importOrders(); 