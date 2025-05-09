const mongoose = require('mongoose');
const Subscription = require('../models/subscription.model');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
      
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

// Sample subscriptions
const subscriptions = [
  { email: 'sample1@gmail.com' },
  { email: 'sample2@yahoo.com' },
  { email: 'sample3@hotmail.com' },
  { email: 'sample4@outlook.com' },
  { email: 'sample5@gmail.com' },
  { email: 'sample6@example.com' },
  { email: 'sample7@company.com' },
  { email: 'sample8@business.com' },
  { email: 'sample9@domain.com' },
  { email: 'sample10@test.com' }
];

// Add subscriptions to database
const importSubscriptions = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Clear existing subscriptions
    await Subscription.deleteMany();
    
      
    
    // Prepare subscriptions with random dates
    const subscriptionsWithDates = subscriptions.map(subscription => {
      // Create random date within last 6 months
      const now = new Date();
      const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
      const randomTimestamp = sixMonthsAgo.getTime() + Math.random() * (now.getTime() - sixMonthsAgo.getTime());
      
      return {
        ...subscription,
        isActive: true,
        subscribedAt: new Date(randomTimestamp)
      };
    });
    
    // Add subscriptions to database
    await Subscription.insertMany(subscriptionsWithDates);
    
      
    process.exit();
  } catch (error) {
    console.error('Subscription addition error:', error);
    process.exit(1);
  }
};

// Run seeder
importSubscriptions(); 