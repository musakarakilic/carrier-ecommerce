const Product = require('../models/product.model');
const Category = require('../models/category.model');
const Brand = require('../models/brand.model');
const Collection = require('../models/collection.model');

// Get all products
const getProducts = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      subcategory,
      search,
      sort = '-createdAt',
      minPrice,
      maxPrice,
      brands,
      rating,
      collections
    } = req.query;
    
    const query = {};

    // Category filter
    if (category) {
      // If subcategory parameter exists, filter only by subcategories
      if (subcategory) {
        const subcatIds = subcategory.split(',');
        query.category = { $in: subcatIds };
      } else {
        // Find subcategories and include them
        const subCats = await Category.find({ parent: category });
        const subCatIds = subCats.map(cat => cat._id);
        
        // Filter by main category and all subcategories
        query.category = { $in: [category, ...subCatIds] };
      }
    } 
    // If only subcategories parameter exists, no category parameter
    else if (subcategory) {
      const subcatIds = subcategory.split(',');
      query.category = { $in: subcatIds };
    }

    // Search filter
    if (search) {
      query.$text = { $search: search };
    }
    
    // Price filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      
      if (minPrice !== undefined) {
        query.price.$gte = Number(minPrice);
      }
      
      if (maxPrice !== undefined) {
        query.price.$lte = Number(maxPrice);
      }
    }
    
    // Brand filter
    if (brands) {
      const brandIds = brands.split(',');
      query.brand = { $in: brandIds };
    }
    
    // Rating filter
    if (rating) {
      query.rating = { $gte: Number(rating) };
    }
    
    // Collection filter
    if (collections) {
      const collectionIds = collections.split(',');
      query.collections = { $in: collectionIds };
    }
    
    // Get active products
    query.isActive = true;

    const products = await Product.find(query)
      .populate('category', 'name')
      .populate('brand', 'name logo')
      .populate('collections', 'title')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sort);

    const count = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single product
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name')
      .populate('brand', 'name logo')
      .populate('collections', 'title');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create product
const createProduct = async (req, res) => {
  try {
    const product = new Product({
      ...req.body,
      createdBy: req.user._id
    });

    const savedProduct = await product.save();
    
    // Update collection product counts
    if (savedProduct.collections && savedProduct.collections.length > 0) {
      await updateCollectionProductCounts(savedProduct.collections);
    }
    
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Only the product creator or admin can update
    if (product.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You do not have permission for this operation' });
    }

    // Save old collections
    const oldCollections = [...product.collections];

    Object.assign(product, req.body);
    product.updatedAt = Date.now();
    
    const updatedProduct = await product.save();
    
    // Update collection product counts (for both old and new collections)
    const allCollections = Array.from(new Set([
      ...oldCollections.map(id => id.toString()),
      ...(updatedProduct.collections ? updatedProduct.collections.map(id => id.toString()) : [])
    ]));
    
    if (allCollections.length > 0) {
      await updateCollectionProductCounts(allCollections);
    }
    
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete product (soft delete)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Only the product creator or admin can delete
    if (product.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You do not have permission for this operation' });
    }

    product.isActive = false;
    await product.save();
    
    res.json({ message: 'Product successfully deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get featured products
const getFeaturedProducts = async (req, res) => {
  try {
    const { limit = 8 } = req.query;
    
    const products = await Product.find({ isFeatured: true, isActive: true })
      .populate('category', 'name')
      .populate('brand', 'name logo')
      .limit(parseInt(limit))
      .sort('-createdAt');
    
    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'An error occurred while retrieving featured products', 
      error: error.message 
    });
  }
};

// Get new products
const getNewProducts = async (req, res) => {
  try {
    const { limit = 8 } = req.query;
    
    const products = await Product.find({ isNew: true, isActive: true })
      .populate('category', 'name')
      .populate('brand', 'name logo')
      .limit(parseInt(limit))
      .sort('-createdAt');
    
    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'An error occurred while retrieving new products', 
      error: error.message 
    });
  }
};

// Get bestseller products
const getBestsellerProducts = async (req, res) => {
  try {
    const { limit = 8 } = req.query;
    
    const products = await Product.find({ isBestseller: true, isActive: true })
      .populate('category', 'name')
      .populate('brand', 'name logo')
      .limit(parseInt(limit))
      .sort('-ratings');
    
    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'An error occurred while retrieving bestseller products', 
      error: error.message 
    });
  }
};

// Toggle product in collection
const toggleProductCollection = async (req, res) => {
  try {
    const { productId, collectionId } = req.params;
    
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if collection exists
    const collection = await Collection.findById(collectionId);
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }
    
    // Check if product is already in collection
    const isInCollection = product.collections.includes(collectionId);
    
    if (isInCollection) {
      // Remove product from collection
      product.collections = product.collections.filter(id => id.toString() !== collectionId);
    } else {
      // Add product to collection
      product.collections.push(collectionId);
    }
    
    await product.save();
    
    // Update collection product count
    await updateCollectionProductCounts([collectionId]);
    
    res.json({
      success: true,
      message: isInCollection ? 'Product removed from collection' : 'Product added to collection',
      isInCollection: !isInCollection
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while toggling product in collection',
      error: error.message
    });
  }
};

// Helper function to update collection product counts
const updateCollectionProductCounts = async (collectionIds) => {
  try {
    // Ensure we have an array of strings
    const collectionIdStrings = collectionIds.map(id => id.toString());
    
    // Update each collection's product count
    for (const collectionId of collectionIdStrings) {
      const count = await Product.countDocuments({
        collections: collectionId,
        isActive: true
      });
      
      await Collection.findByIdAndUpdate(collectionId, {
        productCount: count
      });
    }
    
    return true;
  } catch (error) {
    // Log and ignore errors, this is a background task
    return false;
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getNewProducts,
  getBestsellerProducts,
  toggleProductCollection
}; 