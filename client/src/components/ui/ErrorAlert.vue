<template>
  <div class="rounded-md bg-red-50 p-4 my-4">
    <div class="flex">
      <div class="flex-shrink-0">
        <component is="i-ph-warning-circle" class="h-5 w-5 text-red-400" />
      </div>
      <div class="ml-3">
        <h3 class="text-sm font-medium text-red-800">Error</h3>
        <div class="mt-2 text-sm text-red-700">
          <p>{{ message }}</p>
        </div>
        <div v-if="retryable" class="mt-4">
          <button
            type="button"
            class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            @click="$emit('retry')"
          >
            <component is="i-ph-arrow-clockwise" class="-ml-0.5 mr-2 h-4 w-4" />
            Try Again
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    required: true
  },
  retryable: {
    type: Boolean,
    default: false
  }
});

defineEmits(['retry']);
</script> 