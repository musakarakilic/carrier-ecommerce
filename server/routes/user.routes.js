const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/auth.middleware');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  uploadProfileImage
} = require('../controllers/user.controller');

// General routes
router.get('/', protect, admin, getUsers);
router.get('/:id', protect, admin, getUser);

// Profile routes
router.get('/profile/me', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/change-password', protect, changePassword);
router.post('/profile/image', protect, uploadProfileImage);

// Admin routes
router.post('/', protect, admin, createUser);
router.put('/:id', protect, admin, updateUser);
router.delete('/:id', protect, admin, deleteUser);

module.exports = router; 
 
 
 
 