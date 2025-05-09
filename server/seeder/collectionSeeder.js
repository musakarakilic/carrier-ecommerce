const mongoose = require('mongoose');
const Collection = require('../models/collection.model');
const slugify = require('../utils/slugify');
const { getOptimizedImageUrl } = require('../utils/imageHelpers');
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

// Sample collections
const collections = [
  {
    title: 'Summer Collection',
    description: 'A collection with modern and vibrant colors that will keep you cool during summer months.',
    image: 'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg',
    bgClass: 'bg-gradient-to-r from-blue-400 to-teal-500',
    accentClass: 'text-yellow-300',
    buttonClass: 'bg-white text-blue-700 hover:bg-yellow-300 hover:text-blue-800',
    hashtag: 'SummerFashion',
    isSpecial: true
  },
  {
    title: 'Winter Collection',
    description: 'A collection of stylish and comfortable pieces that will keep you warm during cold winter days.',
    image: 'https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg',
    bgClass: 'bg-gradient-to-r from-gray-800 to-gray-600',
    accentClass: 'text-red-400',
    buttonClass: 'bg-white text-gray-800 hover:bg-red-400 hover:text-white',
    hashtag: 'WinterStyle',
    isSpecial: true
  },
  {
    title: 'Sportswear',
    description: 'A collection made from breathable fabrics that will enhance your performance during sports activities.',
    image: 'https://images.pexels.com/photos/4427620/pexels-photo-4427620.jpeg',
    bgClass: 'bg-gradient-to-r from-red-500 to-orange-400',
    accentClass: 'text-white',
    buttonClass: 'bg-white text-red-600 hover:bg-gray-200 hover:text-red-700',
    hashtag: 'Sportswear',
    isSpecial: true
  },
  {
    title: 'Classic Style',
    description: 'Timeless pieces that will speak of your elegance in business and formal environments.',
    image: 'https://images.pexels.com/photos/1027130/pexels-photo-1027130.jpeg',
    bgClass: 'bg-gradient-to-r from-gray-900 to-black',
    accentClass: 'text-yellow-500',
    buttonClass: 'bg-white text-gray-900 hover:bg-yellow-500 hover:text-white',
    hashtag: 'ClassicFashion',
    isSpecial: false
  },
  {
    title: 'Evening Elegance',
    description: 'Eye-catching pieces designed for special invitations and evening events.',
    image: 'https://images.pexels.com/photos/6567256/pexels-photo-6567256.jpeg',
    bgClass: 'bg-gradient-to-r from-purple-800 to-indigo-900',
    accentClass: 'text-pink-300',
    buttonClass: 'bg-white text-purple-900 hover:bg-pink-300 hover:text-purple-900',
    hashtag: 'EveningElegance',
    isSpecial: false
  },
  {
    title: 'Casual Style',
    description: 'Modern pieces that will keep you comfortable and stylish in daily life.',
    image: 'https://images.pexels.com/photos/6626903/pexels-photo-6626903.jpeg',
    bgClass: 'bg-gradient-to-r from-green-500 to-teal-400',
    accentClass: 'text-white',
    buttonClass: 'bg-white text-green-600 hover:bg-gray-100 hover:text-green-700',
    hashtag: 'CasualStyle',
    isSpecial: false
  },
  {
    title: 'Street Fashion',
    description: 'Comfortable and cool pieces inspired by trending street styles.',
    image: 'https://images.pexels.com/photos/2681751/pexels-photo-2681751.jpeg',
    bgClass: 'bg-gradient-to-r from-gray-700 to-gray-900',
    accentClass: 'text-yellow-400',
    buttonClass: 'bg-white text-gray-800 hover:bg-yellow-400 hover:text-gray-900',
    hashtag: 'StreetFashion',
    isSpecial: false
  },
  {
    title: 'Beach Style',
    description: 'Trendy swimsuit and bikini models that will dazzle on the beaches during vacation season.',
    image: 'https://images.pexels.com/photos/3935702/pexels-photo-3935702.jpeg',
    bgClass: 'bg-gradient-to-r from-blue-500 to-cyan-400',
    accentClass: 'text-yellow-300',
    buttonClass: 'bg-white text-blue-600 hover:bg-yellow-300 hover:text-blue-700',
    hashtag: 'BeachFashion',
    isSpecial: false
  }
];

// Add collections to database
const importCollections = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Clear existing collections
    await Collection.deleteMany();
    
      
    
    // Prepare collections with slug and optimized images
    const collectionsWithSlug = collections.map(collection => ({
      ...collection,
      slug: slugify(collection.title),
      image: getOptimizedImageUrl(collection.image, 'medium'), // Use medium size for collection images
      isActive: true
    }));
    
    // Add collections to database
    await Collection.insertMany(collectionsWithSlug);
    
      
    process.exit();
  } catch (error) {
    console.error('Error adding collections:', error);
    process.exit(1);
  }
};

// Run the seeder
importCollections(); 