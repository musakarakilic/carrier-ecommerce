// dotenv must be loaded first (before other modules)
const dotenv = require('dotenv');
// Load environment variables
dotenv.config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const uploadRoutes = require('./routes/upload.routes');
const categoryRoutes = require('./routes/category.routes');
const userRoutes = require('./routes/user.routes');
const orderRoutes = require('./routes/order.routes');
const paymentRoutes = require('./routes/paymentRoutes');
const collectionRoutes = require('./routes/collection.routes');
const brandRoutes = require('./routes/brand.routes');
const subscriptionRoutes = require('./routes/subscription.routes');

// Create Express application
const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// Raw body needed for Stripe webhook, so we set up a separate middleware for webhook
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

// JSON parsing middleware for other routes
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Set up uploads folder for static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/products', express.static(path.join(__dirname, 'uploads/products')));
app.use('/uploads/profile', express.static(path.join(__dirname, 'uploads/profile')));

// Create uploads directories
const fs = require('fs');
const uploadsProductsDir = path.join(__dirname, 'uploads/products');
const uploadsProfileDir = path.join(__dirname, 'uploads/profile');

if (!fs.existsSync(uploadsProductsDir)) {
  fs.mkdirSync(uploadsProductsDir, { recursive: true });
}

if (!fs.existsSync(uploadsProfileDir)) {
  fs.mkdirSync(uploadsProfileDir, { recursive: true });
  
  // Add default profile picture (if not exists)
  const defaultProfilePath = path.join(uploadsProfileDir, 'default.png');
  if (!fs.existsSync(defaultProfilePath)) {
    // Here we can add a default image or copy from another source
    // For now, we leave it empty, default avatar API will be used on client side
  }
}

// Database connection
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

// Main route
app.get('/', (req, res) => {
  res.json({ message: 'The API is working shhhh...' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    
  res.status(500).json({ message: 'Something went wrong my brotha!' });
});

// Define port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
