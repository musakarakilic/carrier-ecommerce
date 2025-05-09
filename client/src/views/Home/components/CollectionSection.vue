<template>
  <div class="mb-16">
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-3xl font-bold text-gray-900">Collections</h2>
      <div 
        class="text-indigo-600 font-medium hover:text-indigo-800 transition-colors cursor-pointer" 
        @click="$emit('navigate', '/collections')"
      >
        All Collections →
      </div>
    </div>
    
    <div v-if="loading" class="flex justify-center py-8">
      <div class="spinner"></div>
    </div>
    
    <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div 
        v-for="(collection, index) in collections.slice(0, 4)" 
        :key="collection._id"
        @click="$emit('navigate', `/collections/${collection.slug}`)" 
        class="relative h-80 rounded-xl overflow-hidden cursor-pointer group"
      >
        <img :src="collection.image" 
             :alt="collection.title" 
             class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        <div class="absolute bottom-0 left-0 p-6">
          <h3 class="text-2xl font-bold text-white mb-2">{{ collection.title }}</h3>
          <div class="bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full inline-block">
            <span class="text-white text-sm font-medium">Explore</span>
          </div>
        </div>
        <div v-if="index === 0" class="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
          <span class="text-white text-sm font-medium">NEW</span>
        </div>
        <div v-else-if="index === 1" class="absolute top-4 right-4 bg-rose-500/90 px-3 py-1 rounded-full">
          <span class="text-white text-sm font-medium">25% OFF</span>
        </div>
        <div v-else-if="index === 2" class="absolute top-4 right-4 bg-emerald-500/90 px-3 py-1 rounded-full">
          <span class="text-white text-sm font-medium">TREND</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CollectionSection',
  
  props: {
    collections: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  
  emits: ['navigate']
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
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style> 