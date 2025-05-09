/**
 * Utility functions for working with images
 */

// Fallback images for different types of content
const fallbackImages = {
  product: 'https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg?auto=compress&cs=tinysrgb&w=300',
  collection: 'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=300',
  category: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=300',
  brand: 'https://images.pexels.com/photos/1884581/pexels-photo-1884581.jpeg?auto=compress&cs=tinysrgb&w=300',
  user: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=300',
  default: 'https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg?auto=compress&cs=tinysrgb&w=300'
};

// Default image sizes for different content types
const defaultSizes = {
  thumbnail: 100,
  small: 300,
  medium: 600,
  large: 1200,
  default: 300
};

/**
 * Get a fallback image URL for a specific content type
 * @param {string} type - The type of content (product, collection, category, etc.)
 * @returns {string} - The fallback image URL
 */
const getFallbackImage = (type = 'default') => {
  return fallbackImages[type] || fallbackImages.default;
};

/**
 * Ensure an image URL is valid, providing a fallback if not
 * @param {string} imageUrl - The image URL to validate
 * @param {string} type - The type of content (product, collection, category, etc.)
 * @returns {string} - Either the original URL or a fallback
 */
const ensureValidImageUrl = (imageUrl, type = 'default') => {
  if (!imageUrl || imageUrl === '') {
    return getFallbackImage(type);
  }
  
  return imageUrl;
};

/**
 * Optimize image URL based on the service (Pexels, Picsum, etc.)
 * @param {string} imageUrl - The original image URL
 * @param {number|string} size - Size (width) in pixels or preset (thumbnail, small, medium, large)
 * @param {number} quality - Image quality (0-100)
 * @returns {string} - Optimized image URL
 */
const getOptimizedImageUrl = (imageUrl, size = 'default', quality = 80) => {
  if (!imageUrl) {
    return getFallbackImage();
  }
  
  // Convert size presets to pixel values
  let pixelSize = size;
  if (typeof size === 'string' && defaultSizes[size]) {
    pixelSize = defaultSizes[size];
  } else if (typeof size === 'string' && !isNaN(parseInt(size))) {
    pixelSize = parseInt(size);
  } else if (typeof size !== 'number') {
    pixelSize = defaultSizes.default;
  }
  
  // Handle Pexels images
  if (imageUrl.includes('pexels.com')) {
    // Check if URL already has parameters
    const hasParams = imageUrl.includes('?');
    const connector = hasParams ? '&' : '?';
    return `${imageUrl}${connector}auto=compress&cs=tinysrgb&w=${pixelSize}&q=${quality}`;
  }
  
  // Handle Picsum images
  if (imageUrl.includes('picsum.photos')) {
    // For picsum, we need to modify the URL structure
    if (imageUrl.includes('/id/')) {
      // Handle format: https://fastly.picsum.photos/id/237/400/400
      const parts = imageUrl.split('/');
      const idIndex = parts.indexOf('id') + 1;
      
      if (idIndex > 0 && idIndex < parts.length) {
        // Keep the ID but change dimensions
        const id = parts[idIndex];
        return `https://fastly.picsum.photos/id/${id}/${pixelSize}/${pixelSize}`;
      }
    }
    
    // Fallback for other Picsum formats
    return `https://picsum.photos/${pixelSize}/${pixelSize}`;
  }
  
  // For other image services, return the original URL
  return imageUrl;
};

module.exports = {
  getFallbackImage,
  ensureValidImageUrl,
  getOptimizedImageUrl,
  fallbackImages,
  defaultSizes
}; 