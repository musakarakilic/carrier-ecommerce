/**
 * Frontend utility functions for handling and optimizing images
 */

// Default image sizes for different content types
const DEFAULT_SIZES = {
  thumbnail: 100,
  small: 300,
  medium: 600,
  large: 1200,
  default: 300
};

// Fallback images for different types of content
const FALLBACK_IMAGES = {
  product: 'https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg?auto=compress&cs=tinysrgb&w=300',
  collection: 'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=300',
  category: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=300',
  brand: 'https://images.pexels.com/photos/1884581/pexels-photo-1884581.jpeg?auto=compress&cs=tinysrgb&w=300',
  user: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=300',
  default: 'https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg?auto=compress&cs=tinysrgb&w=300'
};

/**
 * Get a fallback image URL for a specific content type
 * @param {string} type - Type of content (product, collection, category, etc.)
 * @returns {string} Fallback image URL
 */
export const getFallbackImage = (type = 'default') => {
  return FALLBACK_IMAGES[type] || FALLBACK_IMAGES.default;
};

/**
 * Check if an image URL is valid
 * @param {string} url - The URL to check
 * @returns {Promise<boolean>} Whether the image URL is valid
 */
export const isImageUrlValid = async (url) => {
  if (!url) return false;
  
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('Error checking image URL:', error);
    return false;
  }
};

/**
 * Optimize an image URL to a specific size
 * @param {string} imageUrl - Original image URL
 * @param {string|number} size - Size preset or pixel width
 * @param {number} quality - Image quality (0-100)
 * @returns {string} Optimized image URL
 */
export const getOptimizedImageUrl = (imageUrl, size = 'default', quality = 80) => {
  if (!imageUrl) {
    return getFallbackImage();
  }
  
  // Handle already optimized URLs
  if (imageUrl.includes('auto=compress') || imageUrl.includes('?w=')) {
    return imageUrl;
  }
  
  // Convert size presets to pixel values
  let pixelSize = size;
  if (typeof size === 'string' && DEFAULT_SIZES[size]) {
    pixelSize = DEFAULT_SIZES[size];
  } else if (typeof size === 'string' && !isNaN(parseInt(size))) {
    pixelSize = parseInt(size);
  } else if (typeof size !== 'number') {
    pixelSize = DEFAULT_SIZES.default;
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

/**
 * Handle image loading errors by replacing with a fallback
 * @param {Event} event - The error event
 * @param {string} type - Type of content for fallback image
 */
export const handleImageError = (event, type = 'default') => {
  event.target.src = getFallbackImage(type);
  event.target.classList.add('fallback-image'); // Optional: Add a class for styling fallback images
};

export default {
  getFallbackImage,
  isImageUrlValid,
  getOptimizedImageUrl,
  handleImageError,
  DEFAULT_SIZES,
  FALLBACK_IMAGES
}; 