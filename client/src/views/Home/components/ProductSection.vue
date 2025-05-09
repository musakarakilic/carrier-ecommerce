<template>
  <div class="mb-16">
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-3xl font-bold text-gray-900">{{ title }}</h2>
      <div 
        class="text-indigo-600 font-medium hover:text-indigo-800 transition-colors cursor-pointer" 
        @click="$emit('navigate', route)"
      >
        View All →
      </div>
    </div>
    
    <!-- While products are loading -->
    <div v-if="loading" class="flex justify-center py-8">
      <div class="spinner"></div>
    </div>
    
    <!-- If products are loaded -->
    <div v-else-if="products.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card 
        v-for="product in products" 
        :key="product._id"
        :product="product"
        :is-new="isNew"
        @add-to-cart="addToCart"
      />
    </div>
    
    <!-- If no products found -->
    <p v-else class="text-center text-gray-500 py-12 bg-gray-50 rounded-xl">{{ emptyMessage }}</p>
  </div>
</template>

<script setup>
import Card from '@/components/molecules/Card/index.vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  route: {
    type: String,
    required: true
  },
  products: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  isNew: {
    type: Boolean,
    default: false
  },
  emptyMessage: {
    type: String,
    default: 'No products found.'
  }
});

const emit = defineEmits(['navigate', 'add-to-cart']);

const addToCart = (product) => {
  emit('add-to-cart', product);
};
</script>

<style scoped>
.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-left-color: #3B82F6;
  animation: spin 1s ease infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style> 