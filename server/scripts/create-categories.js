/**
 * Create Main Categories Script
 * 
 * This script creates main categories.
 */

const mongoose = require('mongoose');
const Category = require('../models/category.model');
const connectDB = require('../config/database');
require('dotenv').config();

// Main categories list
const mainCategories = [
  {
    name: 'Electronics',
    description: 'Electronic products and accessories'
  },
  {
    name: 'Clothing',
    description: 'Clothing and fashion products'
  },
  {
    name: 'Home & Living',
    description: 'Home and living products'
  },
  {
    name: 'Sports & Outdoor',
    description: 'Sports and outdoor products'
  },
  {
    name: 'Cosmetics',
    description: 'Cosmetics and personal care products'
  },
  {
    name: 'Books & Music',
    description: 'Books and music products'
  }
];

// Default admin user ID
const ADMIN_USER_ID = "68068e19fc6e48f6ff5c4248"; // Replace with your admin user ID

// Create main categories
async function createMainCategories() {
  let createdCount = 0;
  let skippedCount = 0;

  for (const category of mainCategories) {
    try {
      // Check if category already exists
      const existingCategory = await Category.findOne({ name: category.name });
      
      if (existingCategory) {
          
        skippedCount++;
        continue;
      }
      
      // Create new category
      const newCategory = new Category({
        name: category.name,
        description: category.description,
        isActive: true,
        createdBy: ADMIN_USER_ID
      });
      
      await newCategory.save();
        
      createdCount++;
    } catch (err) {
      console.error(`  ✗ Error creating "${category.name}" category:`, err.message);
    }
  }
  
  return { createdCount, skippedCount };
}

// Main function
async function main() {
  try {
    // Connect to database
    await connectDB();
    
      
    
    const result = await createMainCategories();
    
      
      
      
      
    
  } catch (err) {
    console.error('Error during operation:', err);
  } finally {
    // Close database connection
    mongoose.connection.close();
      
  }
}

// Run the script
main(); 