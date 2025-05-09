const express = require('express');
const router = express.Router();
const { 
  getAllBrands,
  getBrandBySlug,
  createBrand,
  updateBrand,
  deleteBrand,
  getBrandProducts,
  getBrandsByCategory
} = require('../controllers/brand.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');

// Public routes - accessible to everyone
router.get('/', getAllBrands);
router.get('/category/:category', getBrandsByCategory);
router.get('/:slug', getBrandBySlug);
router.get('/:slug/products', getBrandProducts);

// Protected routes - only admin can access
router.post('/', protect, restrictTo('admin'), createBrand);
router.put('/:slug', protect, restrictTo('admin'), updateBrand);
router.delete('/:slug', protect, restrictTo('admin'), deleteBrand);

module.exports = router; 