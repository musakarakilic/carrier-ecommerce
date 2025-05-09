<template>
  <div class="my-16 bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 rounded-2xl shadow-sm">
    <div class="text-center mb-12">
      <h2 class="text-3xl font-bold text-gray-900 mb-4">Special Collections</h2>
      <p class="text-gray-600 max-w-2xl mx-auto">Discover our carefully selected special design collections, produced in limited quantities only.</p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div v-if="loading" class="col-span-3 flex justify-center py-16">
        <div class="spinner"></div>
      </div>
      <template v-else>
        <div 
          v-for="collection in specialCollections" 
          :key="collection._id"
          class="relative overflow-hidden rounded-xl shadow-lg group cursor-pointer" 
          @click="$emit('navigate', `/collections/${collection.slug}`)"
        >
          <img :src="collection.image" :alt="collection.title" class="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110" />
          <div class="absolute inset-0" :class="collection.bgClass || 'bg-gradient-to-t from-black/80 to-transparent'"></div>
          <div class="absolute bottom-0 left-0 w-full p-6">
            <span class="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-md uppercase">Limited Edition</span>
            <h3 class="text-2xl font-bold text-white mt-2">{{ collection.title }}</h3>
            <p class="text-gray-300 mb-3 line-clamp-2">{{ collection.description }}</p>
            <div class="bg-white/20 h-px w-full mb-3"></div>
            <div class="flex justify-between items-center">
              <span class="text-white text-sm">{{ collection.productCount || 0 }} Products</span>
              <span class="text-white text-sm flex items-center">
                Explore
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SpecialCollections',
  
  props: {
    specialCollections: {
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