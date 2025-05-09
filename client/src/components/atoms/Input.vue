<template>
  <div class="input-wrapper">
    <!-- Label -->
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <div class="relative rounded-md shadow-sm">
      <!-- Left Icon -->
      <div 
        v-if="$slots['icon-left']" 
        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"
      >
        <slot name="icon-left"></slot>
      </div>
      
      <!-- Input Field -->
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :name="name"
        :max="max"
        :min="min"
        :maxlength="maxlength"
        :class="[
          'block w-full rounded-md transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-0',
          // Size classes
          sizeClasses,
          // Error state classes
          hasError 
            ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' 
            : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500',
          // Add padding if left icon exists
          $slots['icon-left'] ? 'pl-10' : '',
          // Add padding if right icon exists
          $slots['icon-right'] ? 'pr-10' : '',
          // If disabled
          disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : '',
          // Custom classes
          customClass
        ]"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur', $event)"
        @focus="$emit('focus', $event)"
      />
      
      <!-- Right Icon -->
      <div 
        v-if="$slots['icon-right']" 
        class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400"
      >
        <slot name="icon-right"></slot>
      </div>
    </div>
    
    <!-- Error Message -->
    <div v-if="hasError" class="mt-1 text-sm text-red-600">
      {{ errorMessage }}
    </div>
    
    <!-- Help Text -->
    <div v-if="helpText && !hasError" class="mt-1 text-sm text-gray-500">
      {{ helpText }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  // Model value (for v-model)
  modelValue: {
    type: [String, Number],
    default: ''
  },
  
  // Input type
  type: {
    type: String,
    default: 'text',
    validator: (value) => [
      'text', 'email', 'password', 'number', 'tel', 'url', 'search',
      'date', 'time', 'datetime-local', 'month', 'week', 'color'
    ].includes(value)
  },
  
  // Label text
  label: {
    type: String,
    default: ''
  },
  
  // Placeholder text
  placeholder: {
    type: String,
    default: ''
  },
  
  // Input ID
  id: {
    type: String,
    default: () => `input-${Math.random().toString(36).substr(2, 9)}`
  },
  
  // Input name
  name: {
    type: String,
    default: ''
  },
  
  // Disabled state
  disabled: {
    type: Boolean,
    default: false
  },
  
  // Readonly state
  readonly: {
    type: Boolean,
    default: false
  },
  
  // Required field
  required: {
    type: Boolean,
    default: false
  },
  
  // Size variant
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
  },
  
  // Error state
  error: {
    type: Boolean,
    default: false
  },
  
  // Error message
  errorMessage: {
    type: String,
    default: ''
  },
  
  // Help text
  helpText: {
    type: String,
    default: ''
  },
  
  // Min value (for numeric input)
  min: {
    type: [String, Number],
    default: null
  },
  
  // Max value (for numeric input)
  max: {
    type: [String, Number],
    default: null
  },
  
  // Maximum character count
  maxlength: {
    type: [String, Number],
    default: null
  },
  
  // Custom CSS classes
  customClass: {
    type: String,
    default: ''
  }
});

defineEmits(['update:modelValue', 'blur', 'focus']);

// Calculate error state
const hasError = computed(() => props.error || !!props.errorMessage);

// Classes based on size
const sizeClasses = computed(() => {
  switch (props.size) {
    case 'xs':
      return 'text-xs px-2 py-1';
    case 'sm':
      return 'text-sm px-3 py-1.5';
    case 'md':
      return 'text-sm px-4 py-2';
    case 'lg':
      return 'text-base px-4 py-2.5';
    case 'xl':
      return 'text-lg px-5 py-3';
    default:
      return 'text-sm px-4 py-2';
  }
});
</script> 