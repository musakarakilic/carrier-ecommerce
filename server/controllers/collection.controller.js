const Collection = require('../models/collection.model');
const Product = require('../models/product.model');
const slugify = require('slugify');
const { validationResult } = require('express-validator');

// Get all collections
exports.getAllCollections = async (req, res) => {
  try {
    const { limit = 10, page = 1, isActive, isSpecial } = req.query;
    
    const filter = {};
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (isSpecial !== undefined) filter.isSpecial = isSpecial === 'true';
    
    const collections = await Collection.find(filter)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await Collection.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      count: collections.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: collections
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching collections',
      error: error.message
    });
  }
};

// Get specific collection
exports.getCollectionBySlug = async (req, res) => {
  try {
    const collection = await Collection.findOne({ slug: req.params.slug });
    
    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: collection
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the collection',
      error: error.message
    });
  }
};

// Create new collection
exports.createCollection = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const { title, description, image, bgClass, accentClass, buttonClass, hashtag, isActive, isSpecial } = req.body;
    
    // Create slug
    const slug = slugify(title, { lower: true });
    
    // Check if collection with same slug exists
    const existingCollection = await Collection.findOne({ slug });
    if (existingCollection) {
      return res.status(400).json({
        success: false,
        message: 'A collection with this name already exists'
      });
    }
    
    const collection = new Collection({
      title,
      slug,
      description,
      image,
      bgClass,
      accentClass,
      buttonClass,
      hashtag,
      isActive,
      isSpecial
    });
    
    await collection.save();
    
    res.status(201).json({
      success: true,
      message: 'Collection created successfully',
      data: collection
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while creating the collection',
      error: error.message
    });
  }
};

// Update collection
exports.updateCollection = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const { title, description, image, bgClass, accentClass, buttonClass, hashtag, isActive, isSpecial } = req.body;
    
    let slug = req.params.slug;
    const collection = await Collection.findOne({ slug });
    
    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }
    
    // Create new slug if title changed
    if (title && title !== collection.title) {
      slug = slugify(title, { lower: true });
      
      // Check if new slug is already in use
      const existingCollection = await Collection.findOne({ slug });
      if (existingCollection && existingCollection._id.toString() !== collection._id.toString()) {
        return res.status(400).json({
          success: false,
          message: 'A collection with this name already exists'
        });
      }
    }
    
    // Update values
    collection.title = title || collection.title;
    collection.slug = slug;
    collection.description = description || collection.description;
    collection.image = image || collection.image;
    collection.bgClass = bgClass || collection.bgClass;
    collection.accentClass = accentClass || collection.accentClass;
    collection.buttonClass = buttonClass || collection.buttonClass;
    collection.hashtag = hashtag || collection.hashtag;
    collection.isActive = isActive !== undefined ? isActive : collection.isActive;
    collection.isSpecial = isSpecial !== undefined ? isSpecial : collection.isSpecial;
    
    await collection.save();
    
    res.status(200).json({
      success: true,
      message: 'Collection updated successfully',
      data: collection
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating the collection',
      error: error.message
    });
  }
};

// Delete collection
exports.deleteCollection = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const collection = await Collection.findOne({ slug });
    
    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }
    
    // Find products associated with collection and remove the relationship
    await Product.updateMany(
      { collections: collection._id },
      { $pull: { collections: collection._id } }
    );
    
    // Delete collection
    await Collection.findByIdAndDelete(collection._id);
    
    res.status(200).json({
      success: true,
      message: 'Collection deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the collection',
      error: error.message
    });
  }
};

// Get products by collection
exports.getCollectionProducts = async (req, res) => {
  try {
    const { slug } = req.params;
    const { limit = 10, page = 1 } = req.query;
    
    const collection = await Collection.findOne({ slug });
    
    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }
    
    const products = await Product.find({ collections: collection._id, isActive: true })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ createdAt: -1 })
      .populate('category', 'name')
      .populate('brand', 'name logo');
    
    const total = await Product.countDocuments({ collections: collection._id, isActive: true });
    
    // Update collection's product count
    if (collection.productCount !== total) {
      collection.productCount = total;
      await collection.save();
    }
    
    res.status(200).json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      collection: {
        _id: collection._id,
        title: collection.title,
        description: collection.description,
        image: collection.image
      },
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching collection products',
      error: error.message
    });
  }
};

// Get special collections
exports.getSpecialCollections = async (req, res) => {
  try {
    const { limit = 3 } = req.query;
    
    const collections = await Collection.find({ isSpecial: true, isActive: true })
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: collections.length,
      data: collections
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching special collections',
      error: error.message
    });
  }
}; 