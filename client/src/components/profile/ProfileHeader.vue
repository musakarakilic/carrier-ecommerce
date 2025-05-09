<template>
  <div class="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between border-b border-gray-200 pb-5 mb-6">
    <div class="mb-4 sm:mb-0">
      <h2 class="text-2xl font-bold text-gray-900">
        {{ userName }} <span class="text-sm font-normal text-gray-500">Profile</span>
      </h2>
      <p class="mt-1 text-sm text-gray-500">View and edit your personal information</p>
    </div>
    
    <div class="relative">
      <button 
        type="button" 
        @click="emit('toggle-edit')"
        class="group relative inline-flex items-center gap-2 overflow-hidden rounded-md border border-transparent shadow-sm text-sm font-medium px-4 py-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        :class="[
          editMode 
            ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50' 
            : 'text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
        ]"
      >
        <!-- Icon -->
        <span class="relative z-10">
          <svg v-if="editMode" 
            xmlns="http://www.w3.org/2000/svg" 
            class="h-5 w-5 text-gray-500 transition-transform duration-300 group-hover:rotate-90" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
          <svg v-else 
            xmlns="http://www.w3.org/2000/svg" 
            class="h-5 w-5 transition-transform duration-300 group-hover:scale-110" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </span>

        <!-- Text -->
        <span class="relative z-10">
          {{ editMode ? 'Cancel' : 'Edit' }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  userName: {
    type: String,
    required: true
  },
  editMode: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['toggle-edit']);
</script>

<style scoped>
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 1.5s infinite;
}
</style> 
