const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/auth.middleware');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getNewProducts,
  getBestsellerProducts,
  toggleProductCollection
} = require('../controllers/product.controller');

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/new', getNewProducts);
router.get('/bestsellers', getBestsellerProducts);
router.get('/:id', getProduct);

// Protected routes
router.post('/', protect, createProduct);
router.post('/collection', protect, toggleProductCollection);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router; 