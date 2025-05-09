<template>
  <div class="flex items-center">
    <div class="flex text-yellow-400">
      <span v-for="star in maxRating" :key="star">
        <svg v-if="star <= rating" class="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
        </svg>
        <svg v-else class="w-4 h-4 fill-current text-gray-300" viewBox="0 0 24 24">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
        </svg>
      </span>
    </div>
    <span v-if="showCount" class="ml-1 text-xs text-gray-500">
      {{ count }} reviews
    </span>
  </div>
</template>

<script setup>
const props = defineProps({
  rating: {
    type: Number,
    default: 0
  },
  maxRating: {
    type: Number,
    default: 5
  },
  count: {
    type: Number,
    default: 0
  },
  showCount: {
    type: Boolean,
    default: true
  }
});
</script> 