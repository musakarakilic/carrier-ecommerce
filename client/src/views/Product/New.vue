<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div v-if="loading" class="flex justify-center py-12">
        <div class="spinner"></div>
      </div>
      <div v-else-if="error" class="text-center py-8 text-red-500">
        {{ error }}
      </div>
      <div v-else>
        <!-- Breadcrumb -->
        <nav class="flex mb-5" aria-label="Breadcrumb">
          <ol class="inline-flex items-center space-x-1 md:space-x-3">
            <li class="inline-flex items-center">
              <RouterLink to="/" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-indigo-600">
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                </svg>
                Home
              </RouterLink>
            </li>
            <li>
              <div class="flex items-center">
                <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                </svg>
                <span class="ml-1 text-sm font-medium text-indigo-600 md:ml-2">
                  Newly Added Products
                </span>
              </div>
            </li>
          </ol>
        </nav>

        <!-- Main content section -->
        <div class="flex flex-col lg:flex-row gap-8">
          <!-- Sidebar - Filters -->
          <div class="lg:w-1/4">
            <ProductFilters
              :initial-filters="filters"
              :products="products"
              :show-categories="false"
              @apply-filters="handleFilters"
              @clear-filters="clearFilters"
            />
          </div>
          
          <!-- Products Content -->
          <div class="lg:w-3/4">
            <!-- Top Bar - Sorting and Total Results -->
            <div class="flex flex-col sm:flex-row justify-between items-center mb-6 bg-white p-4 rounded-lg shadow border border-gray-100">
              <div class="text-sm text-gray-600 mb-3 sm:mb-0 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <span class="font-medium text-indigo-600">{{ totalCount }}</span> products found
              </div>
              <div class="text-sm text-gray-700">
                Newly added products
              </div>
            </div>

            <!-- Products List -->
            <div v-if="products && products.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card 
                v-for="product in products" 
                :key="product._id"
                :product="product"
                :is-new="true"
                @add-to-cart="addToCart"
              />
            </div>
            
            <!-- No products found -->
            <div v-else class="text-center py-12 bg-gray-50 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 class="mt-4 text-lg font-medium text-gray-900">No products found</h3>
              <p class="mt-2 text-gray-500">No products are available in this category at the moment.</p>
            </div>

            <!-- Skeleton product cards while loading more products -->
            <div v-if="loadingMore" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              <div 
                v-for="i in 3" 
                :key="`loading-more-${i}`"
                class="animate-pulse"
              >
                <div class="bg-white rounded-lg shadow-sm border border-gray-100 h-full p-4">
                  <!-- Product image skeleton -->
                  <div class="w-full h-48 bg-gray-200 rounded-lg mb-4 skeleton-shimmer"></div>
                  
                  <!-- Product title skeleton -->
                  <div class="h-6 bg-gray-200 rounded w-3/4 mb-2 skeleton-shimmer"></div>
                  
                  <!-- Product description skeleton -->
                  <div class="h-4 bg-gray-200 rounded w-1/2 mb-4 skeleton-shimmer"></div>
                  
                  <!-- Price and add to cart button skeleton -->
                  <div class="flex justify-between items-center mt-auto">
                    <div class="h-6 bg-gray-200 rounded w-1/4 skeleton-shimmer"></div>
                    <div class="h-10 w-10 bg-gray-200 rounded-full skeleton-shimmer"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pagination - Load more button -->
            <div class="mt-8 flex justify-center">
              <button 
                v-if="hasMoreProducts && !loadingMore" 
                @click="loadMoreProducts"
                class="bg-white border border-indigo-500 text-indigo-600 px-6 py-2.5 rounded-full font-medium hover:bg-indigo-50 transition-colors shadow-sm flex items-center space-x-2"
              >
                <span>Load More Products</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
              
              <p v-if="!hasMoreProducts && allProducts.length > 0" class="text-gray-500 mt-4 flex items-center space-x-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>All products loaded</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import Card from '../../components/molecules/Card/index.vue';
import { productService } from '../../services/productService';
import { useToast } from 'vue-toastification';
import ProductFilters from './components/ProductFilters.vue';

const toast = useToast();

// State
const products = ref([]);
const allProducts = ref([]); // To store all products
const loading = ref(true);
const loadingMore = ref(false); // While loading more products
const error = ref(null);
const currentPage = ref(1);
const totalPages = ref(0);
const totalCount = ref(0);
const limit = ref(24);
const filters = ref({});

// Define sortOption as a constant value
const sortOption = '-createdAt'; // Newest first

// Check if there are more products
const hasMoreProducts = computed(() => {
  return allProducts.value.length > products.value.length;
});

// Pagination operations
const paginationItems = computed(() => {
  const items = [];
  const maxVisiblePages = 5;
  
  if (totalPages.value <= maxVisiblePages) {
    // Show all pages
    for (let i = 1; i <= totalPages.value; i++) {
      items.push(i);
    }
  } else {
    // Always show first page
    items.push(1);
    
    // Show middle pages
    const startPage = Math.max(2, currentPage.value - 1);
    const endPage = Math.min(totalPages.value - 1, currentPage.value + 1);
    
    // Start ellipsis
    if (startPage > 2) {
      items.push('...');
    }
    
    // Middle pages
    for (let i = startPage; i <= endPage; i++) {
      items.push(i);
    }
    
    // End ellipsis
    if (endPage < totalPages.value - 1) {
      items.push('...');
    }
    
    // Always show last page
    items.push(totalPages.value);
  }
  
  return items;
});

// Get new products
const loadNewProducts = async () => {
  try {
    loading.value = true;
    
    // Log API call parameters before making the call
    console.log('API call parameters:', {
      sort: sortOption,
      limit: 100,
      minPrice: filters.value.minPrice || undefined,
      maxPrice: filters.value.maxPrice || undefined
    });
    
    const response = await productService.getNewProducts({
      sort: sortOption,
      limit: 100, // Request more products
      minPrice: filters.value.minPrice || undefined,
      maxPrice: filters.value.maxPrice || undefined
    });

    console.log('API response:', response);

    // Check API response and process safely
    if (response && response.products) {
      // Filter products on frontend
      let filteredProducts = response.products;
      
      // Price filtering (Also done on frontend because backend doesn't work properly)
      if (filters.value.minPrice) {
        const minPrice = Number(filters.value.minPrice);
        filteredProducts = filteredProducts.filter(product => product.price >= minPrice);
        console.log(`Frontend price filter (min: ${minPrice}) applied. ${filteredProducts.length} products remaining.`);
      }
      
      if (filters.value.maxPrice) {
        const maxPrice = Number(filters.value.maxPrice);
        filteredProducts = filteredProducts.filter(product => product.price <= maxPrice);
        console.log(`Frontend price filter (max: ${maxPrice}) applied. ${filteredProducts.length} products remaining.`);
      }
      
      // Save all products - already sorted by newest from API
      allProducts.value = filteredProducts;
      
      // Show more products on first page - 24 products
      products.value = allProducts.value.slice(0, limit.value);
      
      totalCount.value = allProducts.value.length;
      totalPages.value = Math.ceil(allProducts.value.length / limit.value);
      
      console.log(`Total ${allProducts.value.length} products loaded (after frontend filtering)`);
      console.log(`Showing first ${products.value.length} products.`);
      console.log(`Filters:`, filters.value);
    } else {
      console.error('API response not in expected format:', response);
      products.value = [];
      allProducts.value = [];
      totalCount.value = 0;
      totalPages.value = 0;
    }
    
    console.log(`${products.value.length} products loaded`);
  } catch (error) {
    console.error('Error loading new products:', error);
    toast.error('An error occurred while loading products');
    products.value = [];
    allProducts.value = [];
    totalCount.value = 0;
    totalPages.value = 0;
  } finally {
    loading.value = false;
  }
};

// Load more products
const loadMoreProducts = async () => {
  if (!hasMoreProducts.value) return;
  
  try {
    loadingMore.value = true;
    
    // Add new products
    const currentLength = products.value.length;
    const nextItems = allProducts.value.slice(currentLength, currentLength + limit.value);
    
    // Add a short delay (for better UI appearance)
    await new Promise(resolve => setTimeout(resolve, 600));
    
    products.value = [...products.value, ...nextItems];
    
    console.log(`${nextItems.length} more products loaded, total: ${products.value.length}`);
  } catch (error) {
    console.error('Error loading more products:', error);
  } finally {
    loadingMore.value = false;
  }
};

// Add product to cart
const addToCart = (product) => {
  try {
    // Get current cart state
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Product ID check
    const productToAdd = { ...product };
    if (!productToAdd._id && productToAdd.id) {
      productToAdd._id = productToAdd.id;
    }
    
    // Check if product is already in cart
    const existingProductIndex = cart.findIndex(item => 
      (item._id && item._id === productToAdd._id) || 
      (item.product && item.product === productToAdd._id)
    );
    
    if (existingProductIndex >= 0) {
      // If product already in cart, increase quantity
      cart[existingProductIndex].quantity += 1;
    } else {
      // Add product to cart
      cart.push({
        _id: productToAdd._id,
        name: productToAdd.name,
        price: productToAdd.price,
        image: productToAdd.images?.[0] || 'https://placehold.co/400',
        quantity: 1
      });
    }
    
    // Update cart
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Show notification to user
    toast.success(`${productToAdd.name} added to cart!`);
  } catch (error) {
    console.error('Error adding to cart:', error);
    toast.error('An error occurred while adding the product to cart.');
  }
};

// When page is loaded
onMounted(async () => {
  console.log('NewProductsView component loaded - AFTER ROUTER FIX');
  document.title = 'Newly Added Products';
  
  // Start loading process
  loading.value = true;
  
  try {
    await loadNewProducts();
    
    // Use nextTick for Vue to update DOM
    await nextTick();
    console.log('DOM updated, product count:', products.value.length);
  } catch (err) {
    console.error('Error during onMounted:', err);
    error.value = 'An error occurred while loading products. Please refresh the page.';
  } finally {
    loading.value = false;
  }
});

// Filter operations
const handleFilters = (newFilters) => {
  filters.value = newFilters;
  products.value = []; // Clear products
  allProducts.value = []; // Clear all products
  loadNewProducts(); // Reload
};

const clearFilters = () => {
  filters.value = {};
  products.value = []; // Clear products
  allProducts.value = []; // Clear all products
  loadNewProducts(); // Reload
};

// Refresh with current filters (for debug)
const refreshWithCurrentFilters = () => {
  console.log('Refreshing with current filters...');
  console.log('Filters:', filters.value);
  console.log('Sort:', sortOption);
  loadNewProducts();
};
</script>

<style scoped>
.spinner {
  border: 3px solid rgba(79, 70, 229, 0.1);
  border-top-color: #4f46e5;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Skeleton loader styles */
.skeleton-shimmer {
  position: relative;
  overflow: hidden;
  background-color: #E5E7EB;
}

.skeleton-shimmer::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transform: translateX(-100%);
  background-image: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0,
    rgba(255, 255, 255, 0.3) 20%,
    rgba(255, 255, 255, 0.6) 60%,
    rgba(255, 255, 255, 0)
  );
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
</style> 