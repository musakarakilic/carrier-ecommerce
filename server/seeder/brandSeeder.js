const mongoose = require('mongoose');
const Brand = require('../models/brand.model');
const slugify = require('../utils/slugify');
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

// Sample brands
const brands = [
  {
    name: 'Nike',
    description: 'A global leader among sports products and clothing brands.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/1200px-Logo_NIKE.svg.png',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070',
    category: 'sport'
  },
  {
    name: 'Adidas',
    description: 'German sportswear brand. Produces quality sports shoes and clothing products.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/1200px-Adidas_Logo.svg.png',
    image: 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?q=80&w=2070',
    category: 'sport'
  },
  {
    name: 'Puma',
    description: 'German multinational company producing sports shoes, clothing and accessories.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Puma_logo.svg/2560px-Puma_logo.svg.png',
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1974',
    category: 'sport'
  },
  {
    name: 'Gucci',
    description: 'Italian luxury fashion and leather goods brand.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/1960s_Gucci_Logo.svg/2560px-1960s_Gucci_Logo.svg.png',
    image: 'https://images.unsplash.com/photo-1552248524-10d9a7e4841c?q=80&w=2070',
    category: 'luxury'
  },
  {
    name: 'Louis Vuitton',
    description: 'French luxury fashion house and company.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Louis_Vuitton_logo_and_wordmark.svg/1200px-Louis_Vuitton_logo_and_wordmark.svg.png',
    image: 'https://images.unsplash.com/photo-1526939173708-e145cd9c997f?q=80&w=2070',
    category: 'luxury'
  },
  {
    name: 'H&M',
    description: 'Swedish multinational clothing retailer.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/H%26M-Logo.svg/1200px-H%26M-Logo.svg.png',
    image: 'https://images.unsplash.com/photo-1589070127509-ea788341cc5b?q=80&w=2067',
    category: 'trend'
  },
  {
    name: 'Zara',
    description: 'Spanish fast fashion retailer.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Zara_Logo.svg/1200px-Zara_Logo.svg.png',
    image: 'https://images.unsplash.com/photo-1561777848-7b8214763372?q=80&w=2071',
    category: 'trend'
  },
  {
    name: 'Ray-Ban',
    description: 'American sunglasses and eyewear brand.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Ray-Ban_logo.svg/1200px-Ray-Ban_logo.svg.png',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=2080',
    category: 'accessories'
  },
  {
    name: 'Swarovski',
    description: 'Austrian producer of cut crystal, synthetic stones and luxury accessories.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Swarovski_Logo_2020.svg/1200px-Swarovski_Logo_2020.svg.png',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=2070',
    category: 'accessories'
  },
  {
    name: 'Rolex',
    description: 'Swiss luxury watch manufacturer.',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/95/Rolex_logo.svg/1200px-Rolex_logo.svg.png',
    image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=1974',
    category: 'luxury'
  }
];

// Add brands to database
const importBrands = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Clear existing brands
    await Brand.deleteMany();
    
      
    
    // Prepare brands with slug
    const brandsWithSlug = brands.map(brand => ({
      ...brand,
      slug: slugify(brand.name),
      isActive: true
    }));
    
    // Add brands to database
    await Brand.insertMany(brandsWithSlug);
    
      
    process.exit();
  } catch (error) {
    console.error('Error adding brands:', error);
    process.exit(1);
  }
};

// Run the seeder
importBrands(); 