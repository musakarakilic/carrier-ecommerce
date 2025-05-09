const fs = require('fs');
const path = require('path');

// Upload product images
const uploadProductImages = async (req, res) => {
  try {
    // Request check
    if (!req.files) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    if (req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files selected'
      });
    }

    // Process files and create URLs
    const urls = req.files.map(file => {
      // File path check
      const relativePath = path.relative(
        path.join(__dirname, '../uploads/products'),
        file.path
      );
      
      // Create URL
      return `/uploads/products/${relativePath.replace(/\\/g, '/')}`;
    });

    // Success response
    res.status(200).json({
      success: true,
      urls: urls,
      message: 'Images successfully uploaded'
    });
  } catch (error) {
    console.error('Image upload error:', error);
    
    // Clean up files in case of error
    if (req.files) {
      req.files.forEach(file => {
        try {
          fs.unlinkSync(file.path);
        } catch (unlinkError) {
          console.error('Error deleting file:', unlinkError);
        }
      });
    }

    res.status(500).json({
      success: false,
      message: 'An error occurred while uploading images',
      error: error.message
    });
  }
};

// Delete product image
const deleteProductImage = async (req, res) => {
  try {
    const filename = req.params.filename;
    const filepath = path.join(__dirname, '../uploads/products', filename);

    if (!fs.existsSync(filepath)) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    fs.unlinkSync(filepath);
    res.status(200).json({
      success: true,
      message: 'Image successfully deleted'
    });
  } catch (error) {
    console.error('Image deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the image',
      error: error.message
    });
  }
};

module.exports = {
  uploadProductImages,
  deleteProductImage
}; 