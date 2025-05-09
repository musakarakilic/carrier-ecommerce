<template>
  <div class="space-y-1">
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <div class="relative">
      <select
        :id="id"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :required="required"
        :disabled="disabled"
        :multiple="multiple"
        :class="[
          'appearance-none w-full bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-colors px-3 py-2',
          disabled ? 'bg-gray-100 cursor-not-allowed' : '',
          error ? 'border-red-300 focus:ring-red-400' : '',
        ]"
      >
        <option v-if="placeholder" value="">{{ placeholder }}</option>
        <slot></slot>
      </select>
      
      <!-- Dropdown arrow icon -->
      <div v-if="!multiple" class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
        <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
    
    <!-- Help text for multiple select -->
    <p v-if="multiple && helpTextMultiple" class="text-xs text-gray-500 mt-1">{{ helpTextMultiple }}</p>
    
    <!-- Error message -->
    <p v-if="error" class="text-sm text-red-600 mt-1">{{ error }}</p>
    
    <!-- Help text -->
    <p v-if="helpText" class="text-xs text-gray-500 mt-1">{{ helpText }}</p>
  </div>
</template>

<script setup>
defineProps({
  id: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: ''
  },
  modelValue: {
    type: [String, Number, Array],
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  multiple: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  helpText: {
    type: String,
    default: ''
  },
  helpTextMultiple: {
    type: String,
    default: 'Hold down the Ctrl key to select multiple options'
  }
});

defineEmits(['update:modelValue']);
</script> 