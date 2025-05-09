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
                <RouterLink :to="{ name: 'BrandProducts', params: { brandSlug: brand?.slug || brand?.name.toLowerCase().replace(/\s+/g, '-') }}" class="ml-1 text-sm font-medium text-gray-700 hover:text-indigo-600 md:ml-2">
                  {{ brand?.name }}
                </RouterLink>
              </div>
            </li>
            <li>
              <div class="flex items-center">
                <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                </svg>
                <span class="ml-1 text-sm font-medium text-indigo-600 md:ml-2">
                  {{ product?.name }}
                </span>
              </div>
            </li>
          </ol>
        </nav>

        <!-- Product Details -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            <!-- Product Images -->
            <div class="space-y-4">
              <div class="aspect-w-1 aspect-h-1 w-full">
                <img 
                  :src="selectedImage || product?.images[0] || 'https://placehold.co/600x400?text=No+Image'" 
                  :alt="product?.name"
                  class="w-full h-96 object-cover rounded-lg"
                >
              </div>
              <div class="grid grid-cols-4 gap-4">
                <button 
                  v-for="(image, index) in product?.images" 
                  :key="index"
                  @click="selectedImage = image"
                  class="aspect-w-1 aspect-h-1 w-full"
                >
                  <img 
                    :src="image" 
                    :alt="`${product?.name} - Image ${index + 1}`"
                    class="w-full h-24 object-cover rounded-lg hover:opacity-75 transition-opacity"
                  >
                </button>
              </div>
            </div>

            <!-- Product Info -->
            <div class="space-y-6">
              <div>
                <h1 class="text-3xl font-bold text-gray-900">{{ product?.name }}</h1>
                <p class="mt-2 text-gray-600">{{ product?.description }}</p>
              </div>

              <div class="flex items-center space-x-4">
                <span class="text-3xl font-bold text-indigo-600">${{ product?.price }}</span>
                <span v-if="product?.oldPrice" class="text-xl text-gray-500 line-through">${{ product.oldPrice }}</span>
              </div>

              <div class="flex space-x-4">
                <button 
                  class="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
                  @click="addToCart"
                >
                  Add to Cart
                </button>
                <button class="p-3 text-gray-400 hover:text-indigo-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>

              <!-- Additional Details -->
              <div class="border-t border-gray-200 pt-6">
                <h3 class="text-lg font-medium text-gray-900">Product Details</h3>
                <dl class="mt-4 space-y-4">
                  <div v-if="product?.brand" class="flex justify-between">
                    <dt class="text-gray-500">Brand</dt>
                    <dd class="text-gray-900">{{ product.brand.name }}</dd>
                  </div>
                  <div v-if="product?.category" class="flex justify-between">
                    <dt class="text-gray-500">Category</dt>
                    <dd class="text-gray-900">{{ product.category.name }}</dd>
                  </div>
                  <div v-if="product?.stock" class="flex justify-between">
                    <dt class="text-gray-500">Stock</dt>
                    <dd class="text-gray-900">{{ product.stock }} units</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { brandService } from '../../services/brandService';
import { productService } from '../../services/productService';
import { useToast } from 'vue-toastification';

const route = useRoute();
const toast = useToast();
const brand = ref(null);
const product = ref(null);
const loading = ref(true);
const error = ref(null);
const selectedImage = ref(null);

const loadProductDetails = async () => {
  try {
    loading.value = true;
    error.value = null;

    // Load brand details by slug
    const brandSlug = route.params.brandSlug;
    brand.value = await brandService.getBySlug(brandSlug);

    if (!brand.value) {
      throw new Error('Brand not found');
    }

    // Load product details by slug
    const productSlug = route.params.productSlug;
    product.value = await productService.getBySlug(productSlug);

    if (!product.value) {
      throw new Error('Product not found');
    }

    // Set initial selected image
    if (product.value.images && product.value.images.length > 0) {
      selectedImage.value = product.value.images[0];
    }
  } catch (err) {
    console.error('Error loading product details:', err);
    error.value = 'An error occurred while loading product details. Please try again later.';
  } finally {
    loading.value = false;
  }
};

const addToCart = () => {
  if (product.value) {
    // Add to cart logic would go here
    toast.success(`${product.value.name} added to cart`);
  }
};

onMounted(() => {
  loadProductDetails();
});
</script>

<style scoped>
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