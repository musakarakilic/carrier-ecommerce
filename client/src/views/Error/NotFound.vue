<template>
  <div class="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4 text-center">
    <div class="mb-8">
      <h1 class="text-9xl font-bold text-indigo-600">404</h1>
      <h2 class="text-4xl font-bold text-gray-700 mt-6">Page Not Found</h2>
      <p class="text-lg text-gray-500 mt-4">The page you are looking for does not exist or has been moved.</p>
      <p v-if="originalUrl" class="text-md text-gray-400 mt-2 font-mono bg-gray-100 px-4 py-2 rounded-md inline-block">{{ originalUrl }}</p>
    </div>
    
    <div class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
      <router-link 
        to="/" 
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow-md transition-colors duration-300 flex items-center justify-center font-medium"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
        Return to Home
      </router-link>
      
      <button 
        @click="goBack" 
        class="border border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-3 rounded-lg shadow-sm transition-colors duration-300 flex items-center justify-center font-medium"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd" />
        </svg>
        Go Back
      </button>
    </div>
    
    <div class="mt-12">
      <h3 class="text-lg font-medium text-gray-700 mb-4">Looking for something else?</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <router-link 
          to="/products/new" 
          class="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg transition-colors duration-300 flex flex-col items-center text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-indigo-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>New Products</span>
        </router-link>
        
        <router-link 
          to="/products/bestsellers" 
          class="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg transition-colors duration-300 flex flex-col items-center text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-indigo-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <span>Best Sellers</span>
        </router-link>
        
        <router-link 
          to="/collections" 
          class="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg transition-colors duration-300 flex flex-col items-center text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-indigo-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span>Collections</span>
        </router-link>
        
        <router-link 
          to="/brands" 
          class="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg transition-colors duration-300 flex flex-col items-center text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-indigo-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Brands</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFoundPage',
  computed: {
    originalUrl() {
      return this.$route.query.from || null;
    }
  },
  methods: {
    goBack() {
      window.history.length > 1 
        ? this.$router.go(-1) 
        : this.$router.push('/');
    }
  }
}
</script> 