// useProductFilters.js - Composable for product filtering, sorting and URL management
import { ref, reactive, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export function useProductFilters() {
  const route = useRoute();
  const router = useRouter();
  
  // Filtering and sorting
  const sorting = ref('newest');
  const filters = reactive({
    minPrice: '',
    maxPrice: '',
    categories: [],
    subcategories: [],
    brands: [],
    ratings: [],
    sort: '',
    term: '',
    onlyDiscount: false,
    attributes: {} // Empty object for custom filters
  });
  
  // Check if there are active filters
  const hasActiveFilters = computed(() => {
    return filters.minPrice || 
           filters.maxPrice || 
           filters.categories.length > 0 || 
           filters.subcategories.length > 0 || 
           filters.brands.length > 0 || 
           filters.ratings.length > 0;
  });
  
  // Update URL with filters
  function updateUrlWithFilters() {
    // Get query parameters from current URL
    const query = { ...route.query };
    
    // Price filters - Add directly
    if (filters.minPrice !== '' && filters.minPrice !== null && filters.minPrice !== undefined) {
      query.minPrice = filters.minPrice.toString();
    } else {
      delete query.minPrice;
    }
    
    if (filters.maxPrice !== '' && filters.maxPrice !== null && filters.maxPrice !== undefined) {
      query.maxPrice = filters.maxPrice.toString();
    } else {
      delete query.maxPrice;
    }
    
    // Brands
    if (filters.brands && filters.brands.length > 0) {
      query.brands = filters.brands.join(',');
    } else {
      delete query.brands;
    }
    
    // Ratings
    if (filters.ratings && filters.ratings.length > 0) {
      query.ratings = filters.ratings.join(',');
    } else {
      delete query.ratings;
    }
    
    // Sorting - use sorting.value or default value
    // This value should remain as frontend value (price_desc, newest etc.)
    // Conversion will be done in collectionService
    query.sort = sorting.value || 'newest';
    
    console.log("Filters to be added to URL:", query);
    
    // Update URL - update even on same URL with replaceSame: false
    router.replace({ 
      path: route.path,
      query
    }, () => {
      console.log("URL updated:", window.location.href);
    });
    
    return query;
  }
  
  // Update filters from URL
  function updateFiltersFromUrl() {
    // Get filter parameters from URL
    const query = route.query;
    console.log("Filters received from URL:", query);
    
    // Price - Convert to number and validate
    if (query.minPrice) {
      filters.minPrice = query.minPrice;
    } else {
      filters.minPrice = '';
    }
    
    if (query.maxPrice) {
      filters.maxPrice = query.maxPrice;
    } else {
      filters.maxPrice = '';
    }
    
    // Brands
    if (query.brands) {
      filters.brands = query.brands.split(',');
    } else {
      filters.brands = [];
    }
    
    // Rating - Use ratings instead of old minRating parameter
    if (query.ratings) {
      filters.ratings = query.ratings.split(',').map(Number);
    } else if (query.minRating) {
      // For backward compatibility
      filters.ratings = [Number(query.minRating)];
    } else {
      filters.ratings = [];
    }
    
    // Sorting - use frontend value
    if (query.sort) {
      sorting.value = query.sort;
      console.log("Sorting value received from URL:", sorting.value);
    } else {
      sorting.value = 'newest'; // Default sorting
    }
    
    // Custom attribute filters
    const attributeKeys = Object.keys(query).filter(key => key.startsWith('attr_'));
    if (attributeKeys.length > 0) {
      filters.attributes = {};
      attributeKeys.forEach(key => {
        const attributeName = key.replace('attr_', '');
        filters.attributes[attributeName] = query[key].split(',');
      });
    } else {
      filters.attributes = {};
    }
  }
  
  // Reset all filters
  function resetAllFilters(updateUrl = true) {
    // Reset all filters to default values
    filters.minPrice = '';
    filters.maxPrice = '';
    filters.subcategories = [];
    filters.brands = [];
    filters.ratings = [];
    filters.term = '';
    filters.onlyDiscount = false;
    filters.attributes = {};
    
    // Reset sorting to default
    sorting.value = 'newest';
    
    // Update URL (if requested)
    if (updateUrl) {
      // Keep only sorting, remove all other query parameters
      router.replace({
        path: route.path,
        query: { sort: 'newest' } // Keep only default sorting
      });
    }
  }
  
  // Clear filters
  function clearFilters(updateUrl = true) {
    // Reset filters
    filters.minPrice = '';
    filters.maxPrice = '';
    filters.subcategories = [];
    filters.brands = [];
    filters.ratings = [];
    
    // Update URL (if requested)
    if (updateUrl) {
      // Keep only sorting, remove all other query parameters
      router.replace({
        path: route.path,
        query: { sort: sorting.value } // Keep only current sorting
      });
    }
  }
  
  // Convert selected filters to API request parameters
  function getApiParams() {
    const params = {};
    
    console.log('getApiParams called, current filters:', filters);
    
    // Price filters
    if (filters.minPrice) {
      const minPrice = parseFloat(filters.minPrice);
      if (!isNaN(minPrice)) {
        params.minPrice = minPrice;
      }
    }
    
    if (filters.maxPrice) {
      const maxPrice = parseFloat(filters.maxPrice);
      if (!isNaN(maxPrice)) {
        params.maxPrice = maxPrice;
      }
    }
    
    // Category filters - Only add if categories array is not empty
    if (filters.categories && filters.categories.length > 0) {
      params.category = filters.categories.join(',');
      console.log('Category filter added:', params.category);
    }
    
    // Subcategory filters - Changed to subcategory (singular)
    if (filters.subcategories && filters.subcategories.length > 0) {
      // Using singular instead of plural - backend expects this
      params.subcategory = filters.subcategories.join(',');
      console.log('Subcategory filter added:', params.subcategory);
    }
    
    // Brand filters
    if (filters.brands && filters.brands.length > 0) {
      params.brands = filters.brands.join(',');
    }
    
    // Rating filters
    if (filters.ratings && filters.ratings.length > 0) {
      params.minRating = Math.min(...filters.ratings);
    }
    
    // Sorting parameter
    if (sorting.value) {
      // Send sorting parameter directly to API
      // Backend conversion will be done in collectionService.js
      params.sort = sorting.value;
      console.log("Sorting parameter sent to API:", params.sort);
    }
    
    // Search term
    if (filters.term) {
      params.search = filters.term;
    }
    
    // Only discounted items
    if (filters.onlyDiscount) {
      params.discount = true;
    }
    
    // Custom filters
    if (filters.attributes && Object.keys(filters.attributes).length > 0) {
      for (const [key, values] of Object.entries(filters.attributes)) {
        if (values && values.length > 0) {
          params[`attr_${key}`] = values.join(',');
        }
      }
    }
    
    console.log('Parameters to be sent to API:', params);
    
    return params;
  }
  
  // Manage category filters
  function updateCategoryFilters(categories, subcategories = []) {
    // This function is used to update category filters when needed
    if (categories && Array.isArray(categories)) {
      filters.categories = [...categories];
    }
    
    if (subcategories && Array.isArray(subcategories)) {
      filters.subcategories = [...subcategories];
    }
  }
  
  // Category selection
  function selectCategory(categoryId) {
    // Set category filter
    filters.categories = [categoryId];
    filters.subcategories = []; // Clear subcategory filters
    
    // Update URL
    updateUrlWithFilters();
    
    return categoryId;
  }
  
  // Numeric value validation
  function validateNumberInput(event) {
    // Only allow numbers, backspace, delete, tab and arrow keys
    const keyCode = event.keyCode ? event.keyCode : event.which;
    
    // Numbers (0-9): 48-57, numpad 0-9: 96-105
    // Backspace: 8, Tab: 9, Enter: 13, Delete: 46
    // Arrow keys: left: 37, up: 38, right: 39, down: 40
    // -: 45, .: 46 (Decimal separator)
    const allowedKeys = [8, 9, 13, 37, 38, 39, 40, 46];
    
    // If not a number and not an allowed key
    if ((keyCode < 48 || keyCode > 57) && (keyCode < 96 || keyCode > 105) && !allowedKeys.includes(keyCode)) {
      event.preventDefault();
    }
  }
  
  // Load filters from URL when component is first mounted
  function initFilters() {
    updateFiltersFromUrl();
  }
  
  return {
    filters,
    sorting,
    hasActiveFilters,
    updateUrlWithFilters,
    updateFiltersFromUrl,
    resetAllFilters,
    clearFilters,
    getApiParams,
    updateCategoryFilters,
    selectCategory,
    validateNumberInput,
    initFilters
  };
} 