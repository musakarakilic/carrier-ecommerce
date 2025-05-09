const mongoose = require('mongoose');
const Product = require('../models/product.model');
const Category = require('../models/category.model');
const User = require('../models/user.model');
const { getOptimizedImageUrl } = require('../utils/imageHelpers');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
      
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

// Create slug from product name
const createSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    // Replace Turkish characters
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    // Remove other special characters
    .replace(/[^a-z0-9\s-]/g, '')
    // Replace spaces with hyphens
    .replace(/\s+/g, '-')
    // Replace multiple hyphens with single hyphen
    .replace(/-+/g, '-')
    // Remove hyphens from start and end
    .replace(/^-+|-+$/g, '');
};

// Create and add mock products for subcategories
const importSubcategoryProducts = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Check for admin user
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.error('Admin user not found!');
      process.exit(1);
    }
    
    // Find subcategories
    const subcategories = await Category.find({ parent: { $ne: null } });
    if (subcategories.length === 0) {
      console.error('No subcategories found!');
      process.exit(1);
    }
    
      
    
    // Create mock products for each subcategory
    const mockProducts = [];
    
    // Mock product descriptions
    const descriptions = [
      'Product made from high-quality materials, durable and aesthetic design.',
      'Product that stands out with its modern design and superior performance, user-friendly.',
      'Product developed with the latest technology, energy efficient and long-lasting.',
      'Premium product that adapts to any environment with its ergonomic structure and elegant appearance.',
      'Product that makes your daily life easier with its compact size and versatile use.',
      'Special design product that makes a difference with its innovative features and quality workmanship.',
      'Product made from eco-friendly materials, sustainable and durable.',
      'Product that adds value to your living spaces with its minimalist design and functional structure.'
    ];
    
    // Image base URLs
    const imageBaseURLs = [
      'https://images.pexels.com/photos/',
      'https://fastly.picsum.photos/id/'
    ];
    
    for (const subcategory of subcategories) {
      // Create 5 products for each subcategory
      for (let i = 1; i <= 5; i++) {
        const productName = `${subcategory.name} Product ${i}`;
        const slug = createSlug(productName);
        
        // Define reliable image IDs that are known to exist
        const pexelsIds = ['1598505', '1488463', '6567607', '7760344', '5693889', '4210866', '4464820', '6214472'];
        const picsumIds = ['237', '238', '239', '240', '241', '242', '243', '244', '245'];
        
        // Generate base image URLs
        const pexelsImageUrl = `${imageBaseURLs[0]}${pexelsIds[Math.floor(Math.random() * pexelsIds.length)]}/pexels-photo-${pexelsIds[Math.floor(Math.random() * pexelsIds.length)]}.jpeg`;
        const picsumImageUrl = `${imageBaseURLs[1]}${picsumIds[Math.floor(Math.random() * picsumIds.length)]}/400/400`;
        
        // Optimize images with appropriate sizes
        const optimizedImages = [
          getOptimizedImageUrl(pexelsImageUrl, 'small'), // Use small size for product thumbnail
          getOptimizedImageUrl(picsumImageUrl, 'small')  // Use small size for product thumbnail
        ];
        
        const product = {
          name: productName,
          slug: slug,
          description: descriptions[Math.floor(Math.random() * descriptions.length)],
          price: Math.floor(Math.random() * 2000) + 500,
          discountPrice: Math.random() > 0.7 ? Math.floor(Math.random() * 200) : 0,
          stock: Math.floor(Math.random() * 200) + 50,
          images: optimizedImages,
          category: subcategory._id,
          collections: [],
          isFeatured: Math.random() > 0.8,
          isNew: Math.random() > 0.7,
          isBestseller: Math.random() > 0.9,
          ratings: Math.floor(Math.random() * 5),
          numReviews: Math.floor(Math.random() * 100),
          isActive: true,
          createdBy: admin._id
        };
        
        mockProducts.push(product);
      }
    }
    
    // Insert products in bulk
    try {
      await Product.insertMany(mockProducts);
        
    } catch (error) {
      console.error('Product addition error:', error);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
      
  }
};

// Run the seeder
importSubcategoryProducts(); 