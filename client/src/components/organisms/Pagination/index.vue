<template>
  <div v-if="totalPages > 1" class="flex justify-center mt-4">
    <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
      <!-- Previous Page Button -->
      <button
        @click="$emit('page-change', currentPage - 1)"
        :disabled="currentPage === 1"
        :class="[
          currentPage === 1 ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-50',
          'relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500'
        ]"
      >
        <span class="sr-only">Previous</span>
        &laquo;
      </button>
      
      <!-- First Page -->
      <button
        @click="$emit('page-change', 1)"
        :class="[
          currentPage === 1
            ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
          'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
        ]"
      >
        1
      </button>

      <!-- Left Ellipsis -->
      <span
        v-if="showLeftEllipsis"
        class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-gray-700"
      >
        ...
      </span>

      <!-- Middle Pages -->
      <button
        v-for="page in paginationRange"
        :key="page"
        @click="$emit('page-change', page)"
        :class="[
          page === currentPage
            ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
          'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
        ]"
      >
        {{ page }}
      </button>

      <!-- Right Ellipsis -->
      <span
        v-if="showRightEllipsis"
        class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-gray-700"
      >
        ...
      </span>

      <!-- Last Page -->
      <button
        v-if="totalPages > 1"
        @click="$emit('page-change', totalPages)"
        :class="[
          currentPage === totalPages
            ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
          'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
        ]"
      >
        {{ totalPages }}
      </button>

      <!-- Next Page Button -->
      <button
        @click="$emit('page-change', currentPage + 1)"
        :disabled="currentPage === totalPages"
        :class="[
          currentPage === totalPages ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-50',
          'relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500'
        ]"
      >
        <span class="sr-only">Next</span>
        &raquo;
      </button>
    </nav>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  maxVisibleButtons: {
    type: Number,
    default: 3
  }
});

defineEmits(['page-change']);

const paginationRange = computed(() => {
  const { currentPage, totalPages, maxVisibleButtons } = props;
  
  // First, let's calculate which pages to show
  let startPage = Math.max(2, currentPage - Math.floor(maxVisibleButtons / 2));
  let endPage = Math.min(totalPages - 1, startPage + maxVisibleButtons - 1);
  
  // If there aren't enough pages, adjust the start
  if (endPage - startPage + 1 < maxVisibleButtons) {
    startPage = Math.max(2, endPage - maxVisibleButtons + 1);
  }
  
  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  
  return pages;
});

// Ellipsis display conditions
const showLeftEllipsis = computed(() => {
  return paginationRange.value.length > 0 && paginationRange.value[0] > 2;
});

const showRightEllipsis = computed(() => {
  return paginationRange.value.length > 0 && 
    paginationRange.value[paginationRange.value.length - 1] < props.totalPages - 1;
});
</script> 