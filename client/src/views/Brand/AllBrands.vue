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
                  All Brands
                </span>
              </div>
            </li>
          </ol>
        </nav>

        <!-- Topbar - Brand Categories -->
        <div class="flex flex-col sm:flex-row justify-between items-center mb-6 bg-white p-4 rounded-lg shadow border border-gray-100">
          <div class="text-sm text-gray-600 mb-3 sm:mb-0 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span class="font-medium text-indigo-600">{{ brands.length }}</span> brands found
          </div>
          
          <!-- Mobile categories -->
          <div class="sm:hidden">
            <select 
              v-model="selectedCategory"
              @change="handleCategoryChange"
              class="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm bg-white"
            >
              <option value="all">All Brands</option>
              <option value="luxury">Luxury Brands</option>
              <option value="trend">Trend Brands</option>
              <option value="sport">Sports Brands</option>
              <option value="accessories">Accessory Brands</option>
            </select>
          </div>
        </div>
        
        <!-- Desktop categories -->
        <div class="hidden sm:block mb-6">
          <div class="border-b border-gray-200">
            <nav class="flex -mb-px space-x-8" aria-label="Tabs">
              <button
                @click="selectedCategory = 'all'; loadBrands()"
                :class="[
                  selectedCategory === 'all' 
                    ? 'border-indigo-500 text-indigo-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                  'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                ]"
              >
                All Brands
              </button>
              <button
                @click="selectedCategory = 'luxury'; loadBrands()"
                :class="[
                  selectedCategory === 'luxury' 
                    ? 'border-indigo-500 text-indigo-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                  'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                ]"
              >
                Luxury Brands
              </button>
              <button
                @click="selectedCategory = 'trend'; loadBrands()"
                :class="[
                  selectedCategory === 'trend' 
                    ? 'border-indigo-500 text-indigo-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                  'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                ]"
              >
                Trend Brands
              </button>
              <button
                @click="selectedCategory = 'sport'; loadBrands()"
                :class="[
                  selectedCategory === 'sport' 
                    ? 'border-indigo-500 text-indigo-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                  'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                ]"
              >
                Sports Brands
              </button>
              <button
                @click="selectedCategory = 'accessories'; loadBrands()"
                :class="[
                  selectedCategory === 'accessories' 
                    ? 'border-indigo-500 text-indigo-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                  'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                ]"
              >
                Accessory Brands
              </button>
            </nav>
          </div>
        </div>

        <!-- Content -->
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { brandService } from '../../services/brandService';
import { useToast } from 'vue-toastification';

const router = useRouter();
const route = useRoute();
const toast = useToast();

// State
const brands = ref([]);
const loading = ref(true);
const error = ref(null);
const selectedCategory = ref('all');

// Reload brands when category changes
watch(() => route.params.category, (newCategory) => {
  if (newCategory) {
    selectedCategory.value = newCategory;
  }
  loadBrands();
});

// Load brands
const loadBrands = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    if (selectedCategory.value === 'all') {
      const result = await brandService.getAll();
      brands.value = result;
    } else {
      const result = await brandService.getByCategory(selectedCategory.value);
      brands.value = result;
    }
  } catch (err) {
    console.error('Error loading brands:', err);
    error.value = 'An error occurred while loading brands. Please try again later.';
    brands.value = [];
  } finally {
    loading.value = false;
  }
};

// Category selection for mobile devices
const handleCategoryChange = () => {
  if (selectedCategory.value === 'all') {
    router.push('/brands');
  } else {
    router.push(`/brands/${selectedCategory.value}`);
  }
};

// Go to brand page
const goToBrand = (brand) => {
  router.push({
    name: 'BrandProducts',
    params: { brandSlug: brand.slug || brand.name.toLowerCase().replace(/\s+/g, '-') }
  });
};

// When page loads
onMounted(() => {
  // Get category parameter from URL
  if (route.params.category) {
    selectedCategory.value = route.params.category;
  }
  
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

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #4f46e5;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style> 