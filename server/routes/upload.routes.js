const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect, admin } = require('../middlewares/auth.middleware');
const { 
  uploadProductImages, 
  deleteProductImage 
} = require('../controllers/upload.controller');


// Create upload directory
const uploadDir = path.join(__dirname, '../uploads/products');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF and WEBP files can be uploaded.'));
    }
  }
});

// Upload product images (maximum 5 images)
router.post('/products', protect, upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files were uploaded' });
    }

    const urls = req.files.map(file => `http://localhost:5000/uploads/products/${file.filename}`);
    res.json({ 
      success: true,
      urls: urls,
      message: 'Images uploaded successfully'
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ 
      success: false,
      message: 'An error occurred while uploading images' 
    });
  }
});

// Upload single product image
router.post('/products/single', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file was uploaded' });
    }

    const url = `http://localhost:5000/uploads/products/${req.file.filename}`;
      
    res.json({
      success: true,
      url: url,
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while uploading image'
    });
  }
});

// Delete product image
router.delete('/products/:filename', protect, deleteProductImage);

// Image upload endpoint
router.post('/', protect, upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files were uploaded' });
    }

    const urls = req.files.map(file => `/uploads/${file.filename}`);
    res.json({ urls });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ message: 'An error occurred while uploading images' });
  }
});

module.exports = router; 