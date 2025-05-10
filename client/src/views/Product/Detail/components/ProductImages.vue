<template>
  <div class="p-8 md:border-r border-gray-100">
    <!-- Main image -->
    <div class="mb-6 rounded-xl overflow-hidden bg-gray-50 h-96 flex items-center justify-center group relative">
      <img 
        :src="selectedImage" 
        :alt="productName"
        class="w-full h-full object-contain transform transition-all duration-500 group-hover:scale-[1.03]"
        @error="handleImageError"
      >
      <div class="absolute inset-0 bg-indigo-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
    </div>
    
    <!-- Thumbnail gallery -->
    <div class="grid grid-cols-5 gap-4">
      <div 
        v-for="(image, index) in productImages" 
        :key="index"
        :class="[
          'cursor-pointer relative rounded-lg overflow-hidden h-20 bg-gray-50 transform transition-all duration-300',
          selectedImageIndex === index 
            ? 'ring-2 ring-indigo-500 shadow-md scale-105' 
            : 'border border-gray-200 hover:ring-1 hover:ring-indigo-300 hover:shadow-sm'
        ]"
        @click="selectImage(index)"
      >
        <img 
          :src="image" 
          :alt="`${productName} - ${index + 1}`"
          class="w-full h-full object-cover"
        >
        <div 
          class="absolute inset-0 bg-black opacity-0 hover:opacity-10 transition-opacity duration-300"
          :class="{ 'bg-indigo-600 opacity-20': selectedImageIndex === index }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  images: {
    type: Array,
    default: () => []
  },
  productName: {
    type: String,
    default: 'Product'
  }
});

const emits = defineEmits(['imageSelected']);

// State
const selectedImageIndex = ref(0);

// Product images
const productImages = computed(() => {
  if (!props.images || props.images.length === 0) {
    return ['https://placehold.co/400'];
  }
  
  const BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || 'https://carrier-ecommerce.onrender.com';
  
  return props.images.map(image => {
    if (image.startsWith('/mock/')) {
      return 'https://placehold.co/400';
    } else if (image.startsWith('http')) {
      return image;
    } else {
      return `${BASE_URL}${image}`;
    }
  });
});

// Selected image
const selectedImage = computed(() => {
  if (productImages.value.length > 0) {
    return productImages.value[selectedImageIndex.value];
  }
  return 'https://placehold.co/400';
});

// Image selection
const selectImage = (index) => {
  selectedImageIndex.value = index;
  emits('imageSelected', {
    index,
    image: productImages.value[index]
  });
};

// Image loading error
const handleImageError = (event) => {
  event.target.src = 'https://placehold.co/400';
};
</script> 