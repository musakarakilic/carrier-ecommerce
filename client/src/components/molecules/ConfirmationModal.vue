<template>
  <transition name="modal-fade">
    <div v-if="isOpen" class="fixed inset-0 z-[1010] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
      
      <!-- Modal container -->
      <div class="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <!-- Modal position helper -->
        <span class="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
        
        <!-- Modal panel -->
        <div 
          class="relative inline-block transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle"
          @click.stop
        >
          <!-- Modal content -->
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <!-- Icon -->
              <div :class="[
                'mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10',
                type === 'danger' ? 'bg-red-100' : 
                type === 'warning' ? 'bg-yellow-100' : 
                'bg-indigo-100'
              ]">
                <svg v-if="type === 'danger'" class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <svg v-else-if="type === 'warning'" class="h-6 w-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <svg v-else class="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              <!-- Text content -->
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 
                  class="text-lg font-medium leading-6 text-gray-900" 
                  id="modal-title"
                >
                  {{ title }}
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">{{ message }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Action buttons -->
          <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button 
              type="button" 
              @click="confirm"
              :class="[
                'w-full inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm transition-colors',
                type === 'danger' ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' : 
                type === 'warning' ? 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500' : 
                'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
              ]"
            >
              {{ confirmText }}
            </button>
            <button 
              type="button" 
              @click="cancel"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm transition-colors"
            >
              {{ cancelText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Confirmation'
  },
  message: {
    type: String,
    default: 'Are you sure you want to proceed with this action?'
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  type: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'danger', 'warning'].includes(value)
  }
});

const emit = defineEmits(['confirm', 'cancel']);

const confirm = () => {
  emit('confirm');
};

const cancel = () => {
  emit('cancel');
};
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style> 