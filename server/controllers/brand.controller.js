const Brand = require('../models/brand.model');
const Product = require('../models/product.model');
const slugify = require('slugify');
const { validationResult } = require('express-validator');

// Get all brands
exports.getAllBrands = async (req, res) => {
  try {
    const { limit = 10, page = 1, isActive, category } = req.query;
    
    const filter = {};
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (category) filter.category = category;
    
    const brands = await Brand.find(filter)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ name: 1 });
    
    const total = await Brand.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      count: brands.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: brands
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching brands',
      error: error.message
    });
  }
};

// Get specific brand
exports.getBrandBySlug = async (req, res) => {
  try {
    const brand = await Brand.findOne({ slug: req.params.slug });
    
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: brand
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the brand',
      error: error.message
    });
  }
};

// Create new brand
exports.createBrand = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const { name, description, logo, image, category, isActive } = req.body;
    
    // Create slug
    const slug = slugify(name, { lower: true });
    
    // Check if brand with same slug exists
    const existingBrand = await Brand.findOne({ slug });
    if (existingBrand) {
      return res.status(400).json({
        success: false,
        message: 'A brand with this name already exists'
      });
    }
    
    const brand = new Brand({
      name,
      slug,
      description,
      logo,
      image,
      category,
      isActive
    });
    
    await brand.save();
    
    res.status(201).json({
      success: true,
      message: 'Brand created successfully',
      data: brand
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while creating the brand',
      error: error.message
    });
  }
};

// Update brand
exports.updateBrand = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const { name, description, logo, image, category, isActive } = req.body;
    
    let slug = req.params.slug;
    const brand = await Brand.findOne({ slug });
    
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }
    
    // Create new slug if name changed
    if (name && name !== brand.name) {
      slug = slugify(name, { lower: true });
      
      // Check if new slug is already in use
      const existingBrand = await Brand.findOne({ slug });
      if (existingBrand && existingBrand._id.toString() !== brand._id.toString()) {
        return res.status(400).json({
          success: false,
          message: 'A brand with this name already exists'
        });
      }
    }
    
    // Update values
    brand.name = name || brand.name;
    brand.slug = slug;
    brand.description = description || brand.description;
    brand.logo = logo || brand.logo;
    brand.image = image || brand.image;
    brand.category = category || brand.category;
    brand.isActive = isActive !== undefined ? isActive : brand.isActive;
    
    await brand.save();
    
    res.status(200).json({
      success: true,
      message: 'Brand updated successfully',
      data: brand
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating the brand',
      error: error.message
    });
  }
};

// Delete brand
exports.deleteBrand = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const brand = await Brand.findOne({ slug });
    
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }
    
    // Check products associated with brand
    const productsCount = await Product.countDocuments({ brand: brand._id });
    
    if (productsCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete brand as it has ${productsCount} associated products`
      });
    }
    
    // Delete brand
    await Brand.findByIdAndDelete(brand._id);
    
    res.status(200).json({
      success: true,
      message: 'Brand deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the brand',
      error: error.message
    });
  }
};

// Get products by brand
exports.getBrandProducts = async (req, res) => {
  try {
    const { slug } = req.params;
    const { limit = 10, page = 1 } = req.query;
    
    const brand = await Brand.findOne({ slug });
    
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }
    
    const products = await Product.find({ brand: brand._id, isActive: true })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ createdAt: -1 })
      .populate('category', 'name')
      .populate('collections', 'title');
    
    const total = await Product.countDocuments({ brand: brand._id, isActive: true });
    
    res.status(200).json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      brand: {
        _id: brand._id,
        name: brand.name,
        logo: brand.logo,
        image: brand.image
      },
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching brand products',
      error: error.message
    });
  }
};

// Get brands by category
exports.getBrandsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    if (!['luxury', 'trend', 'sport', 'accessories'].includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category'
      });
    }
    
    const brands = await Brand.find({ category, isActive: true })
      .sort({ name: 1 });
    
    res.status(200).json({
      success: true,
      count: brands.length,
      data: brands
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching brands by category',
      error: error.message
    });
  }
}; 