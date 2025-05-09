<template>
  <Transition name="modal">
    <div v-if="modelValue" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-center justify-center min-h-screen p-5">
        <!-- Background overlay -->
        <div class="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity" @click="$emit('update:modelValue', false)"></div>

        <!-- Modal panel -->
        <div class="inline-block w-full relative align-bottom bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:align-middle sm:max-w-lg sm:w-full">
          <!-- Close button -->
          <button 
            @click="$emit('update:modelValue', false)" 
            class="absolute top-3 right-3 z-10 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200 focus:outline-none"
          >
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <!-- Modal title -->
          <div class="px-6 py-5 border-b border-gray-100">
            <h3 class="text-lg font-medium text-gray-800" id="modal-title">
              <slot name="title"></slot>
            </h3>
          </div>
          
          <!-- Modal content -->
          <div class="px-6 py-5">
            <slot></slot>
          </div>
          
          <!-- Modal footer -->
          <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end space-x-3">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
});

defineEmits(['update:modelValue']);
</script>

<style scoped>
.modal-enter-active {
  transition: all 0.25s ease-out;
}

.modal-leave-active {
  transition: all 0.2s ease-in;
}

.modal-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style> 