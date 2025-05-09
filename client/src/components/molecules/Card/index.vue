<template>
  <div class="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
    <!-- Product Image Section -->
    <CardImage 
      :image-url="getImageUrl(product.images?.[0])" 
      :alt-text="product.name"
      @click="navigateToProduct"
    >
      <template #top-left-badge v-if="isNew">
        <CardBadge text="New" position="top-left" type="danger" />
      </template>
      
      <template #top-right-badge v-if="product.stock === 0">
        <CardBadge text="Sold Out" position="top-right" type="dark" />
      </template>
    </CardImage>
    
    <!-- Product Information Section -->
    <div class="p-4">
      <h3 
        class="font-semibold text-gray-900 mb-2 cursor-pointer group-hover:text-indigo-600 transition-colors"
        @click="navigateToProduct"
      >
        {{ product.name }}
      </h3>
      <p class="text-gray-500 text-sm mb-3 line-clamp-2">{{ product.description }}</p>
      
      <!-- Rating Stars -->
      <div class="mb-3">
        <CardRating 
          :rating="product.rating || 0" 
          :count="product.reviewCount || 0" 
        />
      </div>
      
      <div class="flex justify-between items-center mt-4">
        <CardPrice 
          :price="product.price" 
          :old-price="product.oldPrice"
        />
        
        <button 
          @click="addToCart"
          :disabled="product.stock === 0"
          :class="[
            'py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-300',
            product.stock === 0 
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          ]"
        >
          <span v-if="product.stock === 0">Sold Out</span>
          <span v-else>Add to Cart</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import 'vue-toastification/dist/index.css';

import CardImage from './CardImage.vue';
import CardBadge from './CardBadge.vue';
import CardRating from './CardRating.vue';
import CardPrice from './CardPrice.vue';

// Get environment variables
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || 'http://localhost:5000';

const router = useRouter();
const toast = useToast();

const props = defineProps({
  product: {
    type: Object,
    required: true
  },
  isNew: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['add-to-cart', 'click']);

// Stock status based button state
const isOutOfStock = computed(() => {
  return props.product.stock === 0;
});

// Create image URL - this function returns a mock or real image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return 'https://placehold.co/400';
  
  if (imagePath.startsWith('/mock/')) {
    // Use placeholder for mock images
    return 'https://placehold.co/400';
  } else if (imagePath.startsWith('http')) {
    // Use directly if full URL
    return imagePath;
  } else {
    // For images from API
    return `${IMAGE_BASE_URL}${imagePath}`;
  }
};

// Helper function to slugify product name (multilingual support)
const slugifyProductName = (text) => {
  if (!text) return '';
  
  // Character map for transliteration of non-ASCII characters
  const charMap = {
    'ı': 'i', 'ğ': 'g', 'ü': 'u', 'ş': 's', 'ö': 'o', 'ç': 'c',
    'İ': 'I', 'Ğ': 'G', 'Ü': 'U', 'Ş': 'S', 'Ö': 'O', 'Ç': 'C',
    'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
    'à': 'a', 'è': 'e', 'ì': 'i', 'ò': 'o', 'ù': 'u',
    'ä': 'a', 'ë': 'e', 'ï': 'i', 'ö': 'o', 'ü': 'u',
    'â': 'a', 'ê': 'e', 'î': 'i', 'ô': 'o', 'û': 'u',
    'ñ': 'n', 'ß': 'ss'
  };
  
  let result = text.toLowerCase();
  
  // Transliterate non-ASCII characters
  for (const [from, to] of Object.entries(charMap)) {
    result = result.replace(new RegExp(from, 'g'), to);
  }
  
  // Create URL-friendly slug
  return result
    .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric characters except spaces and hyphens
    .replace(/\s+/g, '-')         // Replace spaces with hyphens
    .replace(/-+/g, '-')          // Replace multiple hyphens with a single one
    .replace(/^-+|-+$/g, '');     // Remove leading and trailing hyphens
};

// Add to cart function
const addToCart = () => {
  if (!isOutOfStock.value) {
    const product = { ...props.product };
    
    if (!product._id && product.id) {
      product._id = product.id;
    }
    
    emit('add-to-cart', product);
    
    // Show add to cart notification using centralized toast configuration
    import('@/utils/toast-config').then(({ successToast }) => {
      toast.success(`${product.name || 'Product'} added to cart!`, successToast);
    });
  }
};

// Navigate to product detail page
const navigateToProduct = () => {
  if (props.product && props.product.name) {
    const slug = slugifyProductName(props.product.name);
    router.push(`/product/${slug}-${props.product._id}`);
  } else {
    router.push(`/product/${props.product._id}`);
  }
  emit('click', props.product._id);
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 