<template>
  <div class="flex-1 flex items-center justify-center px-6">
    <div class="w-full max-w-lg search-container">
      <label for="search" class="sr-only">Search</label>
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
          </svg>
        </div>
        <input 
          id="search" 
          name="search" 
          v-model="searchQuery" 
          @keyup.enter="handleSearch"
          class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
          placeholder="Search products, categories..." 
          type="search"
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const searchQuery = ref('');

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ 
      path: '/search',
      query: { q: searchQuery.value }
    });
    searchQuery.value = '';
    emit('search-completed');
  }
};

// Events
const emit = defineEmits(['search-completed']);
</script>

<style scoped>
.search-container {
  position: relative;
  z-index: 45;
}
</style> 