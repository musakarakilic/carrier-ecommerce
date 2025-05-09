<template>
  <ProductLayout 
    :loading="loading" 
    :error="error" 
    :totalProducts="collections.length"
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
              <span class="ml-1 text-sm font-medium text-indigo-600 md:ml-2">
                Collections
              </span>
            </div>
          </li>
        </ol>
      </nav>
    </template>

    <!-- Top Bar / Sorting -->
    <template #topbar>
      <div class="flex flex-col sm:flex-row justify-between items-center mb-6 bg-white p-4 rounded-lg shadow border border-gray-100">
        <div class="text-sm text-gray-600 mb-3 sm:mb-0 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <span class="font-medium text-indigo-600">{{ collections.length }}</span> collections found
        </div>
        <div class="flex items-center space-x-4">
          <div>
            <select 
              v-model="sortOption"
              @change="loadCollections"
              class="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm bg-white"
            >
              <option value="-createdAt">Newest</option>
              <option value="title">Name: A-Z</option>
              <option value="-title">Name: Z-A</option>
              <option value="-productCount">Product Count</option>
            </select>
          </div>
        </div>
      </div>
    </template>

    <!-- Filters -->
    <template #filters>
      <div class="mb-6">
        <h3 class="font-medium text-gray-700 mb-3">Collection Type</h3>
        <select 
          v-model="showSpecialOnly"
          @change="loadCollections"
          class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-md"
        >
          <option :value="false">All Collections</option>
          <option :value="true">Special Collections</option>
        </select>
      </div>
    </template>

    <!-- Content -->
    <template #content>
      <!-- Koleksiyonlar yüklendiyse -->
      <div v-if="collections.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="collection in collections" 
          :key="collection._id"
          @click="goToCollection(collection)"
          class="relative overflow-hidden rounded-xl shadow-lg group cursor-pointer"
        >
          <img 
            :src="collection.image" 
            :alt="collection.title" 
            class="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div class="absolute inset-0" :class="collection.bgClass || 'bg-gradient-to-t from-black/80 to-transparent'"></div>
          <div class="absolute bottom-0 left-0 w-full p-6">
            <span v-if="collection.isSpecial" class="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-md uppercase">Limited Edition</span>
            <h3 class="text-2xl font-bold text-white mt-2">{{ collection.title }}</h3>
            <p class="text-gray-300 mb-3 line-clamp-2">{{ collection.description }}</p>
            <div class="bg-white/20 h-px w-full mb-3"></div>
            <div class="flex justify-between items-center">
              <span class="text-white text-sm">{{ collection.productCount || 0 }} Product</span>
              <span class="text-white text-sm flex items-center">
                Explore
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Koleksiyon bulunamadıysa -->
      <div v-else class="text-center py-12 bg-gray-50 rounded-xl">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">No collection found</h3>
        <p class="mt-2 text-gray-500">No collection to display at the moment.</p>
      </div>
    </template>
  </ProductLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { collectionService } from '../../services/collectionService';
import { useToast } from 'vue-toastification';
import ProductLayout from '../../layouts/ProductLayout.vue';

const router = useRouter();

// State
const collections = ref([]);
const loading = ref(true);
const error = ref(null);
const sortOption = ref('-createdAt');
const showSpecialOnly = ref(false);

// Load collections
const loadCollections = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    // Filters
    const filter = {
      isActive: true
    };
    
    if (showSpecialOnly.value) {
      filter.isSpecial = true;
    }
    
    if (showSpecialOnly.value) {
      const result = await collectionService.getSpecialCollections(100);
      collections.value = result;
    } else {
      const result = await collectionService.getAll(filter);
      collections.value = result;
    }
    
    // Sorting
    if (sortOption.value) {
      const direction = sortOption.value.startsWith('-') ? -1 : 1;
      const field = sortOption.value.replace('-', '');
      
      collections.value.sort((a, b) => {
        if (a[field] < b[field]) return -1 * direction;
        if (a[field] > b[field]) return 1 * direction;
        return 0;
      });
    }
  } catch (err) {
    console.error('Error loading collections:', err);
    error.value = 'An error occurred while loading collections. Please try again later.';
    collections.value = [];
  } finally {
    loading.value = false;
  }
};

// Go to collection page
const goToCollection = (collection) => {
  router.push(`/collections/${collection.slug}`);
};

// When page is loaded
onMounted(() => {
  loadCollections();
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