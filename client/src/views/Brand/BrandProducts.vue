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
                  {{ brand?.name || 'Brand Products' }}
                </span>
              </div>
            </li>
          </ol>
        </nav>

        <!-- Brand Info -->
        <div v-if="brand && !loading" class="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div class="flex items-center space-x-4">
            <img 
              :src="brand.logo || 'https://placehold.co/600x400?text=' + brand.name" 
              :alt="brand.name"
              class="w-24 h-24 object-contain"
            >
            <div>
              <h1 class="text-2xl font-bold text-gray-900">{{ brand.name }}</h1>
              <p class="text-gray-600 mt-2">{{ brand.description }}</p>
            </div>
          </div>
        </div>

        <!-- Product List -->
        <ProductList 
          :products="products" 
          :loading="loading" 
          :error="error"
          @retry="loadBrandAndProducts"
          @clear-filters="loadBrandAndProducts"
          @add-to-cart="addToCart"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { brandService } from '../../services/brandService';
import ProductList from '../../views/Product/components/ProductList.vue';
import { useToast } from 'vue-toastification';

const route = useRoute();
const brand = ref(null);
const products = ref([]);
const loading = ref(true);
const error = ref(null);
const toast = useToast();

const loadBrandAndProducts = async () => {
  try {
    loading.value = true;
    error.value = null;

    // Load brand details by slug
    const brandSlug = route.params.brandSlug;
    brand.value = await brandService.getBySlug(brandSlug);

    if (!brand.value) {
      throw new Error('Brand not found');
    }

    // Load brand products
    const result = await brandService.getBrandProducts(brandSlug);
    products.value = result.data;
  } catch (err) {
    console.error('Error loading brand products:', err);
    error.value = 'An error occurred while loading products. Please try again later.';
  } finally {
    loading.value = false;
  }
};

const addToCart = (product, quantity = 1) => {
  // Implement cart functionality
  toast.success(`${product.name} added to cart`);
};

onMounted(() => {
  loadBrandAndProducts();
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