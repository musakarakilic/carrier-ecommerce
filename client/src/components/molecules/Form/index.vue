<template>
  <form @submit.prevent="handleSubmit" :class="formClass">
    <slot></slot>
    
    <!-- Form buttons -->
    <div v-if="showButtons" class="flex justify-end space-x-3 pt-4">
      <button
        v-if="showCancelButton"
        type="button"
        @click="$emit('cancel')"
        class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors duration-200"
      >
        {{ cancelButtonText }}
      </button>
      <button
        type="submit"
        :disabled="loading"
        :class="[
          'px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
          submitButtonClass
        ]"
      >
        <span v-if="loading" class="flex items-center">
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          {{ loadingText }}
        </span>
        <span v-else>{{ submitButtonText }}</span>
      </button>
    </div>
  </form>
</template>

<script setup>
import { useSlots } from 'vue';

// Import and export all form components
import FormField from './FormField.vue';
import FormSelect from './FormSelect.vue';
import FormTextarea from './FormTextarea.vue';
import FormCheckbox from './FormCheckbox.vue';
import FormImageUpload from './FormImageUpload.vue';

// Export components
defineExpose({
  FormField,
  FormSelect,
  FormTextarea,
  FormCheckbox,
  FormImageUpload
});

const slots = useSlots();

const props = defineProps({
  formClass: {
    type: String,
    default: 'space-y-6'
  },
  showButtons: {
    type: Boolean,
    default: true
  },
  showCancelButton: {
    type: Boolean,
    default: true
  },
  submitButtonText: {
    type: String,
    default: 'Save'
  },
  cancelButtonText: {
    type: String,
    default: 'Cancel'
  },
  loadingText: {
    type: String,
    default: 'Saving...'
  },
  loading: {
    type: Boolean,
    default: false
  },
  submitButtonClass: {
    type: String,
    default: 'bg-gray-800 hover:bg-gray-700 focus:ring-gray-500'
  }
});

const emit = defineEmits(['submit', 'cancel']);

const handleSubmit = () => {
  emit('submit');
};
</script> 