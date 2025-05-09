import api from './api';
import axios from 'axios';

// process.env doesn't work in browser, defining URL directly
const API_URL = 'http://localhost:5000/api';

export const productService = {
  // Get all products
  getAll: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  // Get product by ID
  getById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Create new product
  create: async (product) => {
    const response = await api.post('/products', product);
    return response.data;
  },

  // Update product
  update: async (id, product) => {
    const response = await api.put(`/products/${id}`, product);
    return response.data;
  },

  // Delete product
  delete: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // Upload product image
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      console.log('Sending image upload request...');
      
      // Specify upload URL exactly
      const uploadURL = `${API_URL}/uploads/products/single`;
      console.log('Upload URL:', uploadURL);
      
      // Upload directly to server
      const response = await axios.post(uploadURL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });
      
      console.log('Image upload response:', response.data);
      
      if (response.data && response.data.url) {
        return response.data;
      } else {
        console.error('Image URL not found, response:', response.data);
        throw new Error('Could not get image URL');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      console.error('Error details:', error.response?.data || error.message);
      console.error('Status code:', error.response?.status);
      console.error('Status text:', error.response?.statusText);
      
      if (error.response?.status === 404) {
        throw new Error('Image upload API not found (404). Please check server configuration.');
      }
      
      throw error;
    }
  },

  // Search products - with filtering and sorting support
  search: async (params = {}) => {
    try {
      console.log('ProductService - Incoming search parameters:', params);
      
      // Parameters converted to backend expected format
      const apiParams = {};
      
      // Basic parameters
      if (params.page) apiParams.page = params.page;
      if (params.limit) apiParams.limit = params.limit;
      if (params.category) apiParams.category = params.category;
      if (params.search) apiParams.search = params.search;
      
      // Price filters - SIMPLIFIED
      // Direct transfer and conversion
      if (params.minPrice !== undefined) {
        apiParams.minPrice = Number(params.minPrice);
      }
      
      if (params.maxPrice !== undefined) {
        apiParams.maxPrice = Number(params.maxPrice);
      }
      
      // Subcategories - using subcategory (singular) name
      if (params.subcategory) {
        if (Array.isArray(params.subcategory)) {
          apiParams.subcategory = params.subcategory.join(',');
        } else {
          apiParams.subcategory = params.subcategory;
        }
        console.log('ProductService - Subcategory filter added:', apiParams.subcategory);
      }
      
      // Brands
      if (params.brands) {
        if (Array.isArray(params.brands)) {
          apiParams.brands = params.brands.join(',');
        } else {
          apiParams.brands = params.brands;
        }
      }
      
      // Collections
      if (params.collections) {
        if (Array.isArray(params.collections)) {
          apiParams.collections = params.collections.join(',');
        } else {
          apiParams.collections = params.collections;
        }
      }
      
      // Rating
      if (params.minRating) {
        apiParams.rating = Number(params.minRating);
      }
      
      // Sorting
      if (params.sort) {
        switch (params.sort) {
          case 'newest':
            apiParams.sort = '-createdAt';
            break;
          case 'price_asc':
            apiParams.sort = 'price';
            break;
          case 'price_desc':
            apiParams.sort = '-price';
            break;
          case 'name_asc':
            apiParams.sort = 'name';
            break;
          case 'name_desc':
            apiParams.sort = '-name';
            break;
          case 'rating_desc':
            apiParams.sort = '-rating';
            break;
          default:
            apiParams.sort = params.sort;
        }
      }
      
      console.log('ProductService - Parameters to be sent to backend:', apiParams);
      
      // API request
      const response = await api.get('/products', { params: apiParams });
      console.log('API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Product search error:', error);
      console.error('Error details:', error.response?.data);
      throw error;
    }
  },

  // Get products by category
  getProductsByCategory: async (categoryId, page = 1, filters = {}) => {
    try {
      // Use search method
      return await productService.search({
        category: categoryId,
        page,
        limit: filters.limit || 9,
        sort: filters.sort,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        subcategory: filters.subcategory,
        brands: filters.brands,
        minRating: filters.minRating
      });
    } catch (error) {
      console.error('Error getting category products:', error);
      throw error;
    }
  },

  // Get featured products
  async getFeaturedProducts(limit = 8) {
    try {
      const response = await axios.get(`${API_URL}/products/featured`, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting featured products:', error);
      throw error;
    }
  },
  
  // Get new products
  async getNewProducts(params = {}) {
    try {
      console.log('ProductService: getNewProducts called. Parameters:', params);
      
      // Prepare API parameters
      const apiParams = { ...params };
      
      // Convert price filters to numbers
      if (apiParams.minPrice !== undefined && apiParams.minPrice !== '') {
        apiParams.minPrice = Number(apiParams.minPrice);
        if (isNaN(apiParams.minPrice)) {
          delete apiParams.minPrice;
        }
      }
      
      if (apiParams.maxPrice !== undefined && apiParams.maxPrice !== '') {
        apiParams.maxPrice = Number(apiParams.maxPrice);
        if (isNaN(apiParams.maxPrice)) {
          delete apiParams.maxPrice;
        }
      }
      
      // Send to API
      const response = await axios.get(`${API_URL}/products/new`, {
        params: apiParams
      });
      
      console.log('ProductService: getNewProducts API response:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Error getting new products:', error);
      console.error('Error details:', error.response?.data);
      console.error('Status code:', error.response?.status);
      throw error;
    }
  },
  
  // Get bestseller products
  async getBestsellerProducts(params = {}) {
    try {
      console.log('ProductService: getBestsellerProducts called. Parameters:', params);
      
      // Prepare API parameters
      const apiParams = { ...params };
      
      // Remove sorting parameter for bestsellers - let API use its own sorting
      delete apiParams.sort;
      
      // Convert price filters to numbers
      if (apiParams.minPrice !== undefined && apiParams.minPrice !== '') {
        apiParams.minPrice = Number(apiParams.minPrice);
        if (isNaN(apiParams.minPrice)) {
          delete apiParams.minPrice;
        }
      }
      
      if (apiParams.maxPrice !== undefined && apiParams.maxPrice !== '') {
        apiParams.maxPrice = Number(apiParams.maxPrice);
        if (isNaN(apiParams.maxPrice)) {
          delete apiParams.maxPrice;
        }
      }
   
      console.log('ProductService: Parameters being sent to API:', apiParams);
      
      // Send to API
      const response = await axios.get(`${API_URL}/products/bestsellers`, {
        params: apiParams
      });
      
      console.log('ProductService: getBestsellerProducts API response:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Error getting bestseller products:', error);
      console.error('Error details:', error.response?.data);
      throw error;
    }
  },

  // Get discounted products
  async getDiscountedProducts() {
    try {
      const response = await axios.get(`${API_URL}/products/discounted`);
      return response.data;
    } catch (error) {
      console.error('Error loading discounted products:', error);
      throw error;
    }
  },

  // Add product to collection
  async addProductToCollection(productId, collectionId, token) {
    try {
      const response = await axios.post(`${API_URL}/products/collection`, 
        { 
          productId, 
          collectionId,
          action: 'add'
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error adding product to collection:', error);
      throw error;
    }
  },

  // Remove product from collection
  async removeProductFromCollection(productId, collectionId, token) {
    try {
      const response = await axios.post(`${API_URL}/products/collection`, 
        { 
          productId, 
          collectionId,
          action: 'remove'
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error removing product from collection:', error);
      throw error;
    }
  }
};