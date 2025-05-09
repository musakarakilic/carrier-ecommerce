<template>
  <div class="p-8 flex flex-col">
    <!-- Brand and Rating -->
    <div class="flex items-center mb-4 space-x-2">
      <!-- Brand display -->
      <template v-if="product.brand">
        <!-- If brand is a string, display directly -->
        <span v-if="typeof product.brand === 'string'" class="text-sm font-medium px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full shadow-sm transition-all duration-300 hover:bg-indigo-100">
          {{ product.brand }}
        </span>
        
        <!-- If brand is an object and has name property -->
        <span v-else-if="product.brand.name" class="text-sm font-medium px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full shadow-sm transition-all duration-300 hover:bg-indigo-100">
          {{ product.brand.name }}
        </span>
        
        <!-- If brand is an object and has logo property with URL -->
        <span v-else-if="product.brand.logo && isValidUrl(product.brand.logo)" class="text-sm font-medium px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full shadow-sm transition-all duration-300 hover:bg-indigo-100">
          <img :src="product.brand.logo" alt="Brand Logo" class="h-5 w-auto inline-block" />
        </span>
        
        <!-- For other cases, display brand object as string -->
        <span v-else class="text-sm font-medium px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full shadow-sm transition-all duration-300 hover:bg-indigo-100">
          {{ getBrandText() }}
        </span>
      </template>
      
      <span v-if="product.rating" class="flex items-center text-sm font-medium px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-yellow-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        {{ product.rating }}
      </span>
    </div>

    <!-- Product name -->
    <h1 class="text-3xl font-bold text-gray-900 mb-4 leading-tight">{{ product.name }}</h1>
    
    <!-- Price information -->
    <div class="flex items-center mb-8 pb-8 border-b border-gray-100">
      <span class="text-3xl font-bold text-indigo-600 transition-colors">{{ formatPrice(product.price) }} ₺</span>
      <span v-if="product.oldPrice" class="ml-3 text-lg text-gray-500 line-through">{{ formatPrice(product.oldPrice) }} ₺</span>
      <span v-if="product.oldPrice" class="ml-3 px-3 py-1 text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 rounded-full shadow-sm">
        {{ Math.round((1 - product.price / product.oldPrice) * 100) }}% Discount
      </span>
    </div>
    
    <!-- Stock status -->
    <div class="mb-8">
      <div v-if="product.stock > 10" class="text-green-600 flex items-center text-sm font-medium">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        In Stock
      </div>
      <div v-else-if="product.stock > 0" class="text-yellow-600 flex items-center text-sm font-medium">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        Limited Stock: {{ product.stock }} units
      </div>
      <div v-else class="text-red-600 flex items-center text-sm font-medium">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        Out of Stock
      </div>
    </div>
    
    <!-- Product description -->
    <div class="mb-8 flex-grow">
      <h2 class="text-lg font-semibold mb-3 text-gray-800">Product Description</h2>
      <p class="text-gray-700 leading-relaxed">{{ product.description }}</p>
    </div>
    
    <!-- Quantity selection and add to cart -->
    <div class="mt-auto space-y-4">
      <div class="flex items-center mb-4">
        <span class="mr-4 text-gray-700 font-medium">Quantity:</span>
        <div class="flex border border-gray-300 rounded-full overflow-hidden shadow-sm">
          <button 
            @click="decreaseQuantity" 
            class="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors duration-300"
            :disabled="quantity <= 1"
            :class="{ 'opacity-50 cursor-not-allowed': quantity <= 1 }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
            </svg>
          </button>
          <span class="w-12 h-10 flex items-center justify-center font-medium">{{ quantity }}</span>
          <button 
            @click="increaseQuantity" 
            class="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors duration-300"
            :disabled="quantity >= product.stock"
            :class="{ 'opacity-50 cursor-not-allowed': quantity >= product.stock }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
      </div>
      
      <button 
        @click="addToCart" 
        :disabled="product.stock === 0"
        class="w-full py-4 px-6 rounded-full font-medium flex items-center justify-center transition-all duration-300 shadow-md"
        :class="[
          product.stock === 0 
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
            : 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white transform hover:translate-y-[-2px] hover:shadow-lg'
        ]"
      >
        <svg v-if="product.stock > 0" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        {{ product.stock === 0 ? 'Out of Stock' : 'Add to Cart' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['add-to-cart', 'quantity-changed']);

// Quantity
const quantity = ref(1);

// Increase quantity
const increaseQuantity = () => {
  if (quantity.value < props.product.stock) {
    quantity.value++;
    emit('quantity-changed', quantity.value);
  }
};

// Decrease quantity
const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
    emit('quantity-changed', quantity.value);
  }
};

// Price format
const formatPrice = (price) => {
  return parseFloat(price).toLocaleString('tr-TR', { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

// Brand text
const getBrandText = () => {
  if (props.product.brand && typeof props.product.brand === 'object') {
    return Object.values(props.product.brand).join(' ');
  }
  return props.product.brand;
};

// URL validation
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
};

// Add to cart
const addToCart = () => {
  if (props.product.stock <= 0) {
    emit('add-to-cart', { success: false, message: 'This product is currently out of stock.' });
    return;
  }
  
  emit('add-to-cart', { 
    success: true, 
    product: props.product,
    quantity: quantity.value 
  });
};
</script> 