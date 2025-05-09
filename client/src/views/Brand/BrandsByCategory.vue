<template>
  <ProductLayout 
    :loading="loading" 
    :error="error" 
    :totalProducts="brands.length"
  >
    <!-- Breadcrumb -->
    <template #breadcrumb>
      <nav class="flex" aria-label="Breadcrumb">
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
              <RouterLink to="/brands" class="ml-1 text-sm font-medium text-gray-700 hover:text-indigo-600 md:ml-2">
                Brands
              </RouterLink>
            </div>
          </li>
          <li>
            <div class="flex items-center">
              <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span class="ml-1 text-sm font-medium text-indigo-600 md:ml-2">
                {{ categoryTitle }}
              </span>
            </div>
          </li>
        </ol>
      </nav>
    </template>

    <!-- Top Bar -->
    <template #topbar>
      <div class="flex flex-col sm:flex-row justify-between items-center mb-6 bg-white p-4 rounded-lg shadow border border-gray-100">
        <div class="text-sm text-gray-600 mb-3 sm:mb-0 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <span class="font-medium text-indigo-600">{{ brands.length }}</span> brands found
        </div>
        <router-link :to="{ name: 'AllBrands' }" class="text-indigo-600 font-medium hover:text-indigo-800 transition-colors flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
          </svg>
          View All Brands
        </router-link>
      </div>
    </template>

    <!-- Content -->
    <template #content>
      <div v-if="brands.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="brand in brands" 
          :key="brand._id"
          @click="goToBrand(brand)"
          class="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
        >
          <div class="h-40 bg-gray-100 flex items-center justify-center p-6">
            <img 
              :src="brand.logo || 'https://placehold.co/600x400?text=' + brand.name" 
              :alt="brand.name" 
              class="object-contain h-full w-full"
            >
          </div>
          <div class="p-6">
            <h3 class="text-xl font-bold text-gray-900 mb-2">{{ brand.name }}</h3>
            <p class="text-gray-600 mb-4 line-clamp-2">{{ brand.description || 'Discover products from this brand' }}</p>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500">{{ brand.productCount || 0 }} Products</span>
              <span class="text-indigo-600 font-medium flex items-center">
                Explore
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- If no brands found -->
      <div v-else class="text-center py-12 bg-gray-50 rounded-xl">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">No brands found</h3>
        <p class="mt-2 text-gray-500">There are no brands in this category yet.</p>
        <div class="mt-6">
          <router-link :to="{ name: 'AllBrands' }" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            View All Brands
          </router-link>
        </div>
      </div>
    </template>
  </ProductLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { brandService } from '../../services/brandService';
import { useToast } from 'vue-toastification';
import ProductLayout from '../../layouts/ProductLayout.vue';

const router = useRouter();
const route = useRoute();
const toast = useToast();

// State
const brands = ref([]);
const loading = ref(true);
const error = ref(null);
const category = computed(() => route.params.category);

// Category title and description
const categoryTitle = computed(() => {
  switch (category.value) {
    case 'luxury':
      return 'Luxury Brands';
    case 'trend':
      return 'Trend Brands';
    case 'sport':
      return 'Sports Brands';
    case 'accessories':
      return 'Accessory Brands';
    default:
      return 'Brands';
  }
});

const categoryDescription = computed(() => {
  switch (category.value) {
    case 'luxury':
      return 'The most exclusive luxury brands offering prestige and elegance';
    case 'trend':
      return 'The most trending brands that set fashion trends';
    case 'sport':
      return 'The best sports brands for an active lifestyle';
    case 'accessories':
      return 'Accessory brands to complete your style';
    default:
      return 'Discover all our brands';
  }
});

// Update brands when category changes
watch(() => route.params.category, () => {
  loadBrands();
});

// Load brands
const loadBrands = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    const result = await brandService.getByCategory(category.value);
    brands.value = result;
  } catch (err) {
    console.error('Error loading brands:', err);
    error.value = 'An error occurred while loading brands. Please try again later.';
    brands.value = [];
  } finally {
    loading.value = false;
  }
};

// Go to brand page
const goToBrand = (brand) => {
  // You can implement brand page redirection here
  // For now, we're showing products filtered by brand
  router.push({
    name: 'SearchResults',
    query: { brand: brand._id }
  });
};

// When page loads
onMounted(() => {
  loadBrands();
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 