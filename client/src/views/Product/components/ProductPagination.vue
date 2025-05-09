<!-- ProductPagination.vue - Pagination component -->
<template>
  <div class="flex flex-col items-center mt-10 w-full">
    <button 
      v-if="hasMoreProducts && !loading" 
      @click="loadMore"
      class="bg-white border border-indigo-500 text-indigo-600 px-6 py-2.5 rounded-full font-medium hover:bg-indigo-50 transition-colors shadow-sm flex items-center space-x-2"
    >
      <span>Load More Products</span>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    </button>
    
    <!-- Loading indicator -->
    <div v-if="loading" class="flex items-center justify-center">
      <svg class="animate-spin -ml-1 mr-3 h-6 w-6 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span>Loading...</span>
    </div>
    
    <p v-if="!hasMoreProducts && products.length > 0" class="text-gray-500 mt-4 flex items-center space-x-1">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      <span>All products loaded</span>
    </p>
  </div>
</template>

<script setup>
const props = defineProps({
  hasMoreProducts: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  products: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['load-more']);

function loadMore() {
  emit('load-more');
}
</script> 