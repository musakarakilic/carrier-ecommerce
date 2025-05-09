<template>
  <div class="mb-6 space-y-4 sm:flex sm:space-y-0 sm:space-x-4">
    <!-- Search Box -->
    <div class="flex-1">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search products..."
        class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        @input="handleSearch"
      />
    </div>

    <!-- Category Filter -->
    <div class="w-full sm:w-48">
      <select
        v-model="selectedCategory"
        class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        @change="handleFilter"
      >
        <option value="">All Categories</option>
        <option value="Electronics">Electronics</option>
        <option value="Clothing">Clothing</option>
        <option value="Books">Books</option>
        <option value="Home & Living">Home & Living</option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const searchQuery = ref('');
const selectedCategory = ref('');

const emit = defineEmits(['search', 'filter']);

const handleSearch = () => {
  emit('search', searchQuery.value);
};

const handleFilter = () => {
  emit('filter', selectedCategory.value);
};
</script> 