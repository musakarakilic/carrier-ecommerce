/**
 * Create Subcategories Script
 * 
 * This script adds subcategories to existing categories.
 * It automatically fetches main categories and adds
 * predefined subcategories for each one.
 */

const mongoose = require('mongoose');
const Category = require('../models/category.model');
const connectDB = require('../config/database');
require('dotenv').config();

// Subcategories list - subcategories for each main category
const subcategoriesMap = {
  'Electronics': [
    { name: 'Smartphones', description: 'Smartphones and accessories' },
    { name: 'Computers', description: 'Laptops and desktop computers' },
    { name: 'Tablets', description: 'All types of tablets and e-readers' },
    { name: 'TV & Video', description: 'Televisions, monitors and other video devices' },
    { name: 'Audio Systems', description: 'Headphones, speakers and audio devices' },
    { name: 'Photo & Camera', description: 'Cameras and video equipment' },
    { name: 'Smart Watches', description: 'Wearable technology products' },
    { name: 'Gaming Consoles', description: 'Gaming consoles and accessories' }
  ],
  'Clothing': [
    { name: 'Men\'s Clothing', description: 'All clothing products for men' },
    { name: 'Women\'s Clothing', description: 'All clothing products for women' },
    { name: 'Children\'s Clothing', description: 'All clothing products for children' },
    { name: 'Sports Wear', description: 'Clothing for sports activities' },
    { name: 'Shoes', description: 'All types of shoes and boots' },
    { name: 'Bags', description: 'Backpacks, handbags and wallets' },
    { name: 'Jewelry & Accessories', description: 'Bracelets, necklaces and other accessories' },
    { name: 'Underwear', description: 'Underwear, socks and pajamas' }
  ],
  'Home & Living': [
    { name: 'Furniture', description: 'Living room, bedroom and office furniture' },
    { name: 'Kitchenware', description: 'Kitchen tools and cooking equipment' },
    { name: 'Bathroom Products', description: 'Towels, bathrobes and bathroom accessories' },
    { name: 'Lighting', description: 'Lamps, chandeliers and other lighting products' },
    { name: 'Home Textile', description: 'Bedding, curtains and pillows' },
    { name: 'Decoration', description: 'Home decoration and ornaments' },
    { name: 'Garden', description: 'Garden furniture and garden tools' },
    { name: 'Cleaning Products', description: 'Cleaning supplies and equipment' }
  ],
  'Sports & Outdoor': [
    { name: 'Fitness Equipment', description: 'Fitness and exercise equipment' },
    { name: 'Camping Gear', description: 'Tents, sleeping bags and camping equipment' },
    { name: 'Water Sports', description: 'Swimming and diving equipment' },
    { name: 'Team Sports', description: 'Football, basketball and other team sports' },
    { name: 'Outdoor Clothing', description: 'Clothing for outdoor activities' },
    { name: 'Bicycles', description: 'Bicycles and bicycle accessories' },
    { name: 'Fishing', description: 'Fishing rods and fishing equipment' },
    { name: 'Climbing & Mountaineering', description: 'Climbing and mountaineering equipment' }
  ],
  'Cosmetics': [
    { name: 'Skin Care', description: 'Face and body care products' },
    { name: 'Makeup', description: 'Makeup materials and products' },
    { name: 'Perfumes', description: 'Men\'s and women\'s perfumes' },
    { name: 'Hair Care', description: 'Shampoos and hair care products' },
    { name: 'Personal Care', description: 'Personal care and hygiene products' },
    { name: 'Organic Cosmetics', description: 'Natural and organic cosmetic products' }
  ],
  'Books & Music': [
    { name: 'Literature', description: 'Novels, poetry and other literary works' },
    { name: 'Science Fiction', description: 'Science fiction and fantasy books' },
    { name: 'Children\'s Books', description: 'Books and activity sets for children' },
    { name: 'CD & Vinyl', description: 'Music CDs and vinyl records' },
    { name: 'E-Books', description: 'Books in digital format' },
    { name: 'Magazines', description: 'Popular magazines and periodicals' }
  ]
};

// Default admin user ID
const ADMIN_USER_ID = "68068e19fc6e48f6ff5c4248"; // Replace this ID with your admin user's ID

// Get top-level categories
async function getMainCategories() {
  try {
    const mainCategories = await Category.find({ parent: null });
    return mainCategories;
  } catch (err) {
    console.error('Error fetching categories:', err);
    return [];
  }
}

// Add subcategories
async function createSubcategories(categories) {
  let createdCount = 0;
  let skippedCount = 0;

  for (const category of categories) {
    const categoryName = category.name;
    
    // Check for predefined subcategories for this category
    if (subcategoriesMap[categoryName]) {
        
      
      for (const subcat of subcategoriesMap[categoryName]) {
        try {
          // Skip if subcategory already exists
          const existingSubcat = await Category.findOne({ 
            name: subcat.name,
            parent: category._id
          });
          
          if (existingSubcat) {
              
            skippedCount++;
            continue;
          }
          
          // Create new subcategory
          const newSubcategory = new Category({
            name: subcat.name,
            description: subcat.description,
            parent: category._id,
            isActive: true,
            createdBy: ADMIN_USER_ID
          });
          
          await newSubcategory.save();
            
          createdCount++;
        } catch (err) {
          console.error(`  ✗ Error adding "${subcat.name}" subcategory:`, err.message);
        }
      }
    } else {
        
    }
  }
  
  return { createdCount, skippedCount };
}

// Main function
async function main() {
  try {
    // Connect to database
    await connectDB();
    
      
    const mainCategories = await getMainCategories();
    
    if (mainCategories.length === 0) {
        
      process.exit(0);
    }
    
      
    
    const result = await createSubcategories(mainCategories);
    
      
      
      
      
    
  } catch (err) {
    console.error('Error during operation:', err);
  } finally {
    // Close database connection
    mongoose.connection.close();
      
  }
}

// Run the script
main(); 