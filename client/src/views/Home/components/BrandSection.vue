<template>
  <div class="mb-16">
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-3xl font-bold text-gray-900">Brands</h2>
      <div 
        class="text-indigo-600 font-medium hover:text-indigo-800 transition-colors cursor-pointer" 
        @click="$emit('navigate', '/brands')"
      >
        All Brands →
      </div>
    </div>
    
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div v-if="loading" class="col-span-4 flex justify-center py-16">
        <div class="spinner"></div>
      </div>
      <template v-else>
        <!-- Luxury Brands -->
        <div 
          @click="$emit('navigate', '/brands/luxury')" 
          class="relative h-80 rounded-xl overflow-hidden cursor-pointer group"
          v-if="luxuryBrands && luxuryBrands.length > 0"
        >
          <img 
            :src="luxuryBrands[0]?.image || 'https://images.unsplash.com/photo-1508693926297-1d61ee3df82a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'" 
            alt="Luxury Brands" 
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
          <div class="absolute bottom-0 left-0 p-6">
            <h3 class="text-2xl font-bold text-white mb-2">Luxury Brands</h3>
            <div class="bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full inline-block">
              <span class="text-white text-sm font-medium">Explore</span>
            </div>
          </div>
          <div class="absolute top-4 right-4 bg-amber-500/90 px-3 py-1 rounded-full">
            <span class="text-white text-sm font-medium">EXCLUSIVE</span>
          </div>
        </div>

        <!-- Trending Brands -->
        <div 
          @click="$emit('navigate', '/brands/trend')" 
          class="relative h-80 rounded-xl overflow-hidden cursor-pointer group"
          v-if="trendingBrands && trendingBrands.length > 0"
        >
          <img 
            :src="trendingBrands[0]?.image || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'" 
            alt="Trending Brands" 
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
          <div class="absolute bottom-0 left-0 p-6">
            <h3 class="text-2xl font-bold text-white mb-2">Trending Brands</h3>
            <div class="bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full inline-block">
              <span class="text-white text-sm font-medium">Explore</span>
            </div>
          </div>
          <div class="absolute top-4 right-4 bg-rose-500/90 px-3 py-1 rounded-full">
            <span class="text-white text-sm font-medium">TREND</span>
          </div>
        </div>

        <!-- Sports Brands -->
        <div 
          @click="$emit('navigate', '/brands/sport')" 
          class="relative h-80 rounded-xl overflow-hidden cursor-pointer group"
          v-if="sportBrands && sportBrands.length > 0"
        >
          <img 
            :src="sportBrands[0]?.image || 'https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'" 
            alt="Sports Brands" 
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
          <div class="absolute bottom-0 left-0 p-6">
            <h3 class="text-2xl font-bold text-white mb-2">Sports Brands</h3>
            <div class="bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full inline-block">
              <span class="text-white text-sm font-medium">Explore</span>
            </div>
          </div>
          <div class="absolute top-4 right-4 bg-emerald-500/90 px-3 py-1 rounded-full">
            <span class="text-white text-sm font-medium">ACTIVE</span>
          </div>
        </div>

        <!-- Accessories Brands -->
        <div 
          @click="$emit('navigate', '/brands/accessories')" 
          class="relative h-80 rounded-xl overflow-hidden cursor-pointer group"
          v-if="accessoryBrands && accessoryBrands.length > 0"
        >
          <img 
            :src="accessoryBrands[0]?.image || 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'" 
            alt="Accessories Brands" 
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
          <div class="absolute bottom-0 left-0 p-6">
            <h3 class="text-2xl font-bold text-white mb-2">Accessories Brands</h3>
            <div class="bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full inline-block">
              <span class="text-white text-sm font-medium">Explore</span>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BrandSection',
  
  props: {
    brands: {
      type: Array,
      default: () => []
    },
    luxuryBrands: {
      type: Array,
      default: () => []
    },
    trendingBrands: {
      type: Array,
      default: () => []
    },
    sportBrands: {
      type: Array,
      default: () => []
    },
    accessoryBrands: {
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