<template>
  <div class="flex flex-col items-center justify-center py-12">
    <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
    <div class="mt-4 text-center text-gray-600">
      {{ message }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: 'Loading...'
  }
});
</script> 