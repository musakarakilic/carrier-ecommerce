const express = require('express');
const router = express.Router();
const { register, login, getProfile, createAdmin, updateProfile, changePassword, uploadProfileImage } = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');
const multer = require('multer');
const path = require('path');

// Disk storage configuration for profile image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profile');
  },
  filename: (req, file, cb) => {
    cb(null, `user-${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Only image files will be accepted
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files can be uploaded!'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

router.post('/register', register);
router.post('/register-admin', protect, createAdmin); //Warning
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/change-password', protect, changePassword);
router.post('/profile/image', protect, upload.single('profileImage'), uploadProfileImage);

module.exports = router; 