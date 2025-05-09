<!-- ProductList.vue - Product list component -->
<template>
  <!-- Loading state -->
  <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <div v-for="i in 6" :key="`loading-${i}`" class="animate-pulse">
      <div class="bg-white rounded-lg shadow-sm border border-gray-100 h-full p-4">
        <div class="w-full h-48 bg-gray-200 rounded-lg mb-4 skeleton-shimmer"></div>
        <div class="h-6 bg-gray-200 rounded w-3/4 mb-2 skeleton-shimmer"></div>
        <div class="h-4 bg-gray-200 rounded w-1/2 mb-4 skeleton-shimmer"></div>
        <div class="flex justify-between items-center mt-auto">
          <div class="h-6 bg-gray-200 rounded w-1/4 skeleton-shimmer"></div>
          <div class="h-10 w-10 bg-gray-200 rounded-full skeleton-shimmer"></div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Error state -->
  <div v-else-if="error" class="text-center py-8 text-red-500 bg-white rounded-lg shadow">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-red-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <h3 class="text-lg font-medium text-gray-900 mb-1">An Error Occurred</h3>
    <p class="text-red-500">{{ error }}</p>
    <button @click="onRetry" class="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      Try Again
    </button>
  </div>
  
  <!-- Empty state -->
  <div v-else-if="products.length === 0" class="text-center py-12 bg-white rounded-lg shadow border border-gray-100">
    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <h3 class="mt-2 text-lg font-medium text-gray-900">No Products Found</h3>
    <p class="mt-1 text-gray-500">There are no products in this list or no products match your filters.</p>
    <div class="mt-6">
      <button @click="onClearFilters" class="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
        Clear Filters
        <span aria-hidden="true"> &rarr;</span>
      </button>
    </div>
  </div>
  
  <!-- Product list -->
  <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <!-- Normal products -->
    <div 
      v-for="(product, index) in products" 
      :key="product._id"
      class="product-card-container"
    >
      <Card 
        :product="product"
        :isNew="index < 2" 
        @add-to-cart="addToCart"
        class="bg-white rounded-lg shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 h-full"
      />
    </div>
    
    <!-- Skeleton product cards to show while loading more -->
    <div 
      v-if="loadingMore"
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
</template>

<script setup>
import Card from '@/components/molecules/Card/index.vue';

const props = defineProps({
  products: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  loadingMore: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['retry', 'clear-filters', 'add-to-cart']);

// Add product to cart
function addToCart(product, quantity = 1) {
  emit('add-to-cart', product, quantity);
}

// Retry
function onRetry() {
  emit('retry');
}

// Clear filters
function onClearFilters() {
  emit('clear-filters');
}
</script>

<style scoped>
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