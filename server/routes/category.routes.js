const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { protect, admin } = require('../middlewares/auth.middleware');

// General routes
router.get('/', categoryController.getCategories);
router.get('/main', categoryController.getMainCategories);
router.get('/slug/:slug', categoryController.getCategoryBySlug);
router.get('/:id', categoryController.getCategoryById);
router.get('/:id/subcategories', categoryController.getSubcategories);

// Admin routes
router.post('/', protect, admin, categoryController.createCategory);
router.put('/:id', protect, admin, categoryController.updateCategory);
router.delete('/:id', protect, admin, categoryController.deleteCategory);

module.exports = router; 
 
 