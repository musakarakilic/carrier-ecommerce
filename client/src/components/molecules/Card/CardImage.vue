<template>
  <div class="relative overflow-hidden">
    <img 
      v-if="optimizedImageUrl" 
      :src="optimizedImageUrl"
      :alt="altText"
      class="w-full h-52 object-cover cursor-pointer transition-transform duration-500 group-hover:scale-105"
      @error="(e) => handleImageError(e, 'product')"
      @click="$emit('click')"
    >
    <div v-else class="w-full h-52 bg-gray-200 flex items-center justify-center">
      <span class="text-gray-400">No Image</span>
    </div>
    
    <!-- Quick view overlay -->
    <slot name="overlay">
      <div class="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <button 
          @click="$emit('click')"
          class="bg-white text-gray-800 font-medium py-2 px-4 rounded-lg shadow transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"
        >
          <slot name="button-text">Inspect the product</slot>
        </button>
      </div>
    </slot>
    
    <!-- Badge slots -->
    <slot name="top-left-badge"></slot>
    <slot name="top-right-badge"></slot>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { getOptimizedImageUrl, handleImageError, getFallbackImage } from '../../../utils/image-helpers';

const props = defineProps({
  imageUrl: {
    type: String,
    default: ''
  },
  altText: {
    type: String,
    default: 'Product Image'
  },
  size: {
    type: String,
    default: 'small' // Options: thumbnail, small, medium, large or a pixel value
  },
  imageType: {
    type: String,
    default: 'product' // Options: product, collection, category, etc.
  }
});

defineEmits(['click']);

// Get optimized version of the image URL
const optimizedImageUrl = computed(() => {
  if (!props.imageUrl) {
    return getFallbackImage(props.imageType);
  }
  return getOptimizedImageUrl(props.imageUrl, props.size);
});
</script> 