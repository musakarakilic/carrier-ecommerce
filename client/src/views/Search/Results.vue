<template>
  <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-6">
      <h1 class="text-3xl font-bold text-gray-900">
        Search results for "{{ searchQuery }}"
      </h1>
      
      <div class="mt-4 md:mt-0">
        <span class="text-gray-500">
          {{ filteredProducts.length }} results found
        </span>
      </div>
    </div>
    
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="spinner"></div>
    </div>
    
    <!-- No results found -->
    <div v-else-if="filteredProducts.length === 0" class="text-center py-12 bg-white rounded-lg shadow-sm">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <h2 class="text-xl font-semibold text-gray-700 mb-2">No Results Found</h2>
      <p class="text-gray-500 mb-6">
        No results found for "{{ searchQuery }}". Please try again with different keywords.
      </p>
      <RouterLink to="/" class="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700">
        Return to Homepage
      </RouterLink>
    </div>
    
    <!-- Search results -->
    <div v-else>
      <!-- Filters -->
      <div class="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div class="flex flex-wrap items-center gap-4">
          <div class="flex-grow">
            <label for="sorting" class="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <select 
              v-model="sorting" 
              id="sorting"
              class="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="relevance">Relevance</option>
              <option value="price_asc">Price (Low to High)</option>
              <option value="price_desc">Price (High to Low)</option>
              <option value="newest">Newest</option>
              <option value="name_asc">Name (A-Z)</option>
              <option value="name_desc">Name (Z-A)</option>
            </select>
          </div>
          
          <div>
            <label for="priceRange" class="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
            <div class="flex items-center space-x-2">
              <input
                v-model="minPrice"
                type="number"
                min="0"
                placeholder="Min"
                class="w-24 border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <span>-</span>
              <input
                v-model="maxPrice"
                type="number"
                min="0"
                placeholder="Max"
                class="w-24 border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>
      
      <!-- Product list -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <ProductCard 
          v-for="product in displayedProducts" 
          :key="product._id"
          :product="product"
          @add-to-cart="addToCart"
        />
      </div>
      
      <!-- Pagination -->
      <div v-if="pageCount > 1" class="flex justify-center mt-8">
        <nav class="flex items-center">
          <button 
            @click="changePage(currentPage - 1)" 
            :disabled="currentPage === 1"
            :class="[
              'px-3 py-1 rounded-l-md border',
              currentPage === 1 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            ]"
          >
            Previous
          </button>
          <div 
            v-for="page in pageNumbers" 
            :key="page"
            :class="[
              'px-3 py-1 border-t border-b',
              currentPage === page 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            ]"
          >
            <button v-if="page !== '...'" @click="changePage(page)">
              {{ page }}
            </button>
            <span v-else>{{ page }}</span>
          </div>
          <button 
            @click="changePage(currentPage + 1)" 
            :disabled="currentPage === pageCount"
            :class="[
              'px-3 py-1 rounded-r-md border',
              currentPage === pageCount 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            ]"
          >
            Next
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ProductCard from '../../components/ProductCard.vue';
import { productService } from '../../services/productService';

const route = useRoute();
const router = useRouter();

// State variables
const loading = ref(true);
const products = ref([]);
const searchQuery = ref('');
const sorting = ref('relevance');
const minPrice = ref('');
const maxPrice = ref('');
const currentPage = ref(1);
const productsPerPage = 12;


// Filtered products
const filteredProducts = computed(() => {
  // First, filter by search query
  let filtered = [...products.value];
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    );
  }
  
  // Price filtering
  if (minPrice.value !== '') {
    filtered = filtered.filter(product => product.price >= parseFloat(minPrice.value));
  }
  
  if (maxPrice.value !== '') {
    filtered = filtered.filter(product => product.price <= parseFloat(maxPrice.value));
  }
  
  // Sorting
  switch (sorting.value) {
    case 'price_asc':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price_desc':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'newest':
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
    case 'name_asc':
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'name_desc':
      filtered.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case 'relevance':
    default:
      if (searchQuery.value) {
        // Sort by relevance based on search query
        const query = searchQuery.value.toLowerCase();
        filtered.sort((a, b) => {
          const aTitle = a.name.toLowerCase();
          const bTitle = b.name.toLowerCase();
          // Products with the query in the title come first
          if (aTitle.includes(query) && !bTitle.includes(query)) return -1;
          if (!aTitle.includes(query) && bTitle.includes(query)) return 1;
          return 0;
        });
      }
      break;
  }
  
  return filtered;
});

// Pagination
const pageCount = computed(() => {
  return Math.ceil(filteredProducts.value.length / productsPerPage);
});

const pageNumbers = computed(() => {
  if (pageCount.value <= 7) {
    return Array.from({ length: pageCount.value }, (_, i) => i + 1);
  }
  
  // If there are more pages, use ellipsis (...)
  const pages = [];
  if (currentPage.value <= 3) {
    // 1 2 3 4 5 ... n
    pages.push(1, 2, 3, 4, 5, '...', pageCount.value);
  } else if (currentPage.value >= pageCount.value - 2) {
    // 1 ... n-4 n-3 n-2 n-1 n
    pages.push(1, '...', pageCount.value - 4, pageCount.value - 3, pageCount.value - 2, pageCount.value - 1, pageCount.value);
  } else {
    // 1 ... c-1 c c+1 ... n
    pages.push(1, '...', currentPage.value - 1, currentPage.value, currentPage.value + 1, '...', pageCount.value);
  }
  return pages;
});

// Displayed products
const displayedProducts = computed(() => {
  const startIndex = (currentPage.value - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  return filteredProducts.value.slice(startIndex, endIndex);
});

// Add to cart
const addToCart = (product) => {
  // Add to cart logic
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const existingProductIndex = cart.findIndex(item => item._id === product._id);
  
  if (existingProductIndex >= 0) {
    cart[existingProductIndex].quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1
    });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  alert(`${product.name} added to cart!`);
};

// Change page
const changePage = (page) => {
  if (page >= 1 && page <= pageCount.value) {
    currentPage.value = page;
    window.scrollTo(0, 0);
  }
};

// Update search from URL
const updateSearchFromUrl = () => {
  searchQuery.value = route.query.q || '';
  
  // Filter and sorting parameters
  sorting.value = route.query.sort || 'relevance';
  minPrice.value = route.query.min || '';
  maxPrice.value = route.query.max || '';
  currentPage.value = parseInt(route.query.page || '1');
};

// Update URL parameters
const updateUrlParams = () => {
  const query = {
    q: searchQuery.value,
    page: currentPage.value.toString(),
  };
  
  if (sorting.value !== 'relevance') {
    query.sort = sorting.value;
  }
  
  if (minPrice.value) {
    query.min = minPrice.value;
  }
  
  if (maxPrice.value) {
    query.max = maxPrice.value;
  }
  
  router.replace({ query });
};

// Perform search
const performSearch = async () => {
  loading.value = true;
  
  try {
    // API parameters
    const params = {
      search: searchQuery.value,
      page: currentPage.value,
      limit: productsPerPage
    };
    
    // Price filtering
    if (minPrice.value) {
      params.minPrice = minPrice.value;
    }
    
    if (maxPrice.value) {
      params.maxPrice = maxPrice.value;
    }
    
    // Sorting
    if (sorting.value && sorting.value !== 'relevance') {
      params.sort = sorting.value;
    }
    
    // Fetch data from API
    const result = await productService.search(params);
    products.value = result.products || [];
    
    // Get total page count from API
    if (result.totalPages) {
      // We can't directly change the value of a computed property, so we update the source variable
      // of the computed that is being used in the filteredProducts property
      // This way, we can calculate the filteredProducts.length value
      products.value = result.products;
      
      // Check page information
      if (result.currentPage && result.currentPage !== currentPage.value) {
        currentPage.value = parseInt(result.currentPage);
      }
    }
  } catch (error) {
    console.error('Error occurred during search:', error);
    products.value = [...mockProducts]; // Use mock data in case of error
  } finally {
    loading.value = false;
  }
};

// Watch for URL changes
watch(() => route.query, () => {
  updateSearchFromUrl();
  performSearch();
}, { immediate: true });

// Watch for filter and sorting changes
watch([sorting, minPrice, maxPrice], () => {
  currentPage.value = 1; // Go to first page when filter changes
  updateUrlParams();
}, { deep: true });

// Watch for page changes
watch(currentPage, () => {
  updateUrlParams();
});

onMounted(() => {
  updateSearchFromUrl();
  performSearch();
});
</script>

<style scoped>
.spinner {
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-top-color: #4f46e5;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style> 