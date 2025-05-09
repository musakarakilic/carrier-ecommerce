// useProductFetching.js - Composable for product fetching and API operations
import { ref, reactive, computed } from 'vue';
import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';
import { collectionService } from '@/services/collectionService';

export function useProductFetching() {
  // Reactive state
  const products = ref([]);
  const totalProducts = ref(0);
  const totalPages = ref(1);
  const currentPage = ref(1);
  const pageSize = ref(9); // Show 9 products per page
  
  const loading = reactive({
    main: true,
    products: true,
    more: false
  });
  
  const error = reactive({
    main: null,
    products: null
  });
  
  // Computed properties
  const hasMoreProducts = computed(() => currentPage.value < totalPages.value);

  // Fetch products
  async function fetchProducts(params = {}, loadMore = false) {
    if (loadMore) {
      loading.more = true;
    } else {
      loading.products = true;
      // Clear products if it's a new search
      if (!loadMore) products.value = [];
    }
    error.products = null;
    
    try {
      // Base parameters
      const apiParams = {
        page: currentPage.value,
        limit: pageSize.value,
        ...params
      };
      
      // Fetch products from API
      const result = await productService.search(apiParams);
      
      // Process and save results to state
      if (result && result.products) {
        const productList = result.products;
        if (loadMore) {
          // If "load more", append to existing products
          products.value = [...products.value, ...productList];
        } else {
          // Otherwise, replace products completely
          products.value = productList;
        }
        
        // Set total pages and product count
        totalPages.value = Math.ceil(result.total / pageSize.value) || 1;
        totalProducts.value = result.total || 0;
      } else {
        products.value = [];
        totalProducts.value = 0;
        totalPages.value = 1;
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      error.products = 'An error occurred while loading products.';
      products.value = [];
      totalProducts.value = 0;
    } finally {
      loading.products = false;
      loading.more = false;
    }
  }
  
  // Fetch collection products
  async function fetchCollectionProducts(collectionSlug, params = {}, loadMore = false) {
    if (loadMore) {
      loading.more = true;
    } else {
      loading.products = true;
      // Clear products if it's a new search
      if (!loadMore) products.value = [];
    }
    error.products = null;
    
    try {
      // Base parameters
      const apiParams = {
        page: currentPage.value,
        limit: pageSize.value,
        ...params
      };
      
      // Make custom API call through collectionService
      const result = await collectionService.getCollectionProducts(collectionSlug, apiParams);
      
      // Process results
      if (result && result.products) {
        const productList = result.products;
        if (loadMore) {
          // Append to existing products for "load more"
          products.value = [...products.value, ...productList];
        } else {
          // Replace products completely for new loading
          products.value = productList;
        }
        
        // Update total pages and product count
        totalPages.value = Math.ceil(result.total / pageSize.value) || 1;
        totalProducts.value = result.total || 0;
      } else {
        products.value = [];
        totalProducts.value = 0;
        totalPages.value = 1;
      }
    } catch (err) {
      console.error('Error fetching collection products:', err);
      error.products = 'An error occurred while loading collection products.';
      products.value = [];
      totalProducts.value = 0;
    } finally {
      loading.products = false;
      loading.more = false;
    }
  }
  
  // Fetch category data
  async function fetchCategory(categoryId) {
    try {
      // Cache results to prevent duplicate requests for the same ID/slug
      const cachedResult = categoryCache[categoryId];
      if (cachedResult) {
        console.log(`Using cached category: ${categoryId}`);
        return cachedResult;
      }
      
      // Is the category ID a hexadecimal value?
      const isHexString = categoryId && typeof categoryId === 'string' && 
                        /^[0-9a-fA-F]{24}$/.test(categoryId);
      
      let response = null;
      
      if (isHexString) {
        // If it's in MongoDB ObjectID format, fetch directly by ID
        try {
          response = await categoryService.getById(categoryId);
        } catch (err) {
          // Silently continue, try with slug
          console.error("Error fetching by ID:", err);
        }
      }
      
      // If couldn't fetch by ID or ID is not hexadecimal, try as slug
      if (!response) {
        try {
          response = await categoryService.getBySlug(categoryId);
        } catch (err) {
          // Don't show toast for 404 errors
          if (err.response?.status === 404) {
            console.error(`Category not found: ${categoryId}`);
            return null; // Return null without triggering toast message
          }
          throw err; // Re-throw other errors
        }
      }
      
      // Cache the result
      if (response) {
        categoryCache[categoryId] = response;
      }
      
      return response;
    } catch (err) {
      // Don't show toast for 404 errors
      if (err.response?.status === 404) {
        console.error('Category not found:', categoryId);
        return null; // Return null without triggering toast message
      }
      console.error('Error fetching category:', err);
      throw err; // Re-throw other errors
    }
  }
  
  // Fetch collection data
  async function fetchCollection(collectionSlug) {
    try {
      const response = await collectionService.getBySlug(collectionSlug);
      return response;
    } catch (err) {
      // Don't show toast for 404 errors
      if (err.response?.status === 404) {
        console.error('Collection not found:', collectionSlug);
        return null; // Return null without triggering toast message
      }
      console.error('Error fetching collection:', err);
      throw err; // Re-throw other errors
    }
  }
  
  // Fetch all categories
  async function fetchAllCategories() {
    try {
      const categoriesResponse = await categoryService.getAll();
      return categoriesResponse || [];
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      return [];
    }
  }
  
  // Load more products
  function loadMoreProducts(params = {}) {
    if (hasMoreProducts.value && !loading.more) {
      loading.more = true;
      currentPage.value += 1;
      
      // Call the relevant API function (defaults to fetchProducts)
      return fetchProducts(params, true);
    } else {
      return Promise.resolve(null);
    }
  }
  
  // Load more collection products
  function loadMoreCollectionProducts(collectionSlug, params = {}) {
    if (hasMoreProducts.value && !loading.more) {
      loading.more = true;
      currentPage.value += 1;
      
      // Call collection-specific product fetching function
      return fetchCollectionProducts(collectionSlug, params, true);
    } else {
      return Promise.resolve(null);
    }
  }
  
  return {
    products,
    totalProducts,
    totalPages,
    currentPage,
    pageSize,
    loading,
    error,
    hasMoreProducts,
    fetchProducts,
    fetchCollectionProducts,
    fetchCategory,
    fetchCollection,
    fetchAllCategories,
    loadMoreProducts,
    loadMoreCollectionProducts
  };
}

// Define category cache object
const categoryCache = {}; 