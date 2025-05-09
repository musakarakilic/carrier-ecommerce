const express = require('express');
const router = express.Router();
const { 
  getAllCollections,
  getCollectionBySlug,
  createCollection,
  updateCollection,
  deleteCollection,
  getCollectionProducts,
  getSpecialCollections
} = require('../controllers/collection.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');

// Public routes - accessible to everyone
router.get('/', getAllCollections);
router.get('/special', getSpecialCollections);
router.get('/:slug', getCollectionBySlug);
router.get('/:slug/products', getCollectionProducts);

// Protected routes - only admin can access
router.post('/', protect, restrictTo('admin'), createCollection);
router.put('/:slug', protect, restrictTo('admin'), updateCollection);
router.delete('/:slug', protect, restrictTo('admin'), deleteCollection);

module.exports = router; 