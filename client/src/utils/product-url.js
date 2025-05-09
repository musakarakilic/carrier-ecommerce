/**
 * Creates category URL
 * @param {Object} category - Category object (should contain slug or _id)
 * @returns {string} - Category URL
 */
export function getCategoryUrl(category) {
  if (!category) return '/products';
  return `/category/${category.slug || category._id}`;
}

/**
 * Creates subcategory URL
 * @param {Object} category - Parent category object
 * @param {Object} subcategory - Subcategory object
 * @returns {string} - Subcategory URL
 */
export function getSubcategoryUrl(category, subcategory) {
  if (!category || !subcategory) return '/products';
  return `/category/${category.slug || category._id}/${subcategory.slug || subcategory._id}`;
}

/**
 * Creates product URL
 * @param {Object} product - Product object (should contain slug or _id)
 * @returns {string} - Product URL
 */
export function getProductUrl(product) {
  if (!product) return '';
  return `/product/${product.slug || product._id}`;
}

/**
 * Creates collection URL
 * @param {Object} collection - Collection object (should contain slug or _id)
 * @returns {string} - Collection URL
 */
export function getCollectionUrl(collection) {
  if (!collection) return '/products';
  return `/collection/${collection.slug || collection._id}`;
}

/**
 * Creates URL parameters
 * @param {Object} filters - Filter object
 * @returns {Object} - URL query parameters
 */
export function createUrlParams(filters) {
  const params = {};
  
  // Price filters
  if (filters.minPrice) params.minPrice = String(filters.minPrice);
  if (filters.maxPrice) params.maxPrice = String(filters.maxPrice);
  
  // Brand filters
  if (filters.brands && filters.brands.length > 0) {
    params.brands = filters.brands.join(',');
  }
  
  // Rating filters
  if (filters.ratings && filters.ratings.length > 0) {
    params.ratings = filters.ratings.join(',');
  }
  
  // Sorting
  if (filters.sort) params.sort = filters.sort;
  
  // Custom attributes
  if (filters.attributes) {
    Object.entries(filters.attributes).forEach(([key, values]) => {
      if (values && values.length > 0) {
        params[`attr_${key}`] = values.join(',');
      }
    });
  }
  
  return params;
} 