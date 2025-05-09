<template>
  <button
    :class="[
      'inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200',
      // Size classes
      sizeClasses,
      // Color variants
      variantClasses,
      // If disabled
      { 'opacity-50 cursor-not-allowed': disabled },
      // Custom classes
      customClass
    ]"
    :disabled="disabled"
    :type="type"
    @click="$emit('click', $event)"
  >
    <!-- Left icon slot -->
    <slot name="icon-left"></slot>
    
    <!-- Main content -->
    <slot></slot>
    
    <!-- Right icon slot -->
    <slot name="icon-right"></slot>
  </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  // Button type
  type: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'submit', 'reset'].includes(value)
  },
  
  // Size variants: 'xs', 'sm', 'md', 'lg', 'xl'
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
  },
  
  // Color variations: 'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark', 'link'
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark', 'link'].includes(value)
  },
  
  // Outlined style
  outline: {
    type: Boolean,
    default: false
  },
  
  // Disabled state
  disabled: {
    type: Boolean,
    default: false
  },
  
  // Full width
  block: {
    type: Boolean,
    default: false
  },
  
  // Custom CSS classes
  customClass: {
    type: String,
    default: ''
  },
});

defineEmits(['click']);

// Classes based on size
const sizeClasses = computed(() => {
  switch (props.size) {
    case 'xs':
      return 'text-xs px-2 py-1 gap-1';
    case 'sm':
      return 'text-sm px-3 py-1.5 gap-1.5';
    case 'md':
      return 'text-sm px-4 py-2 gap-2';
    case 'lg':
      return 'text-base px-5 py-2.5 gap-2';
    case 'xl':
      return 'text-lg px-6 py-3 gap-3';
    default:
      return 'text-sm px-4 py-2 gap-2';
  }
});

// Variant and style classes
const variantClasses = computed(() => {
  // Classes for base variations
  const variants = {
    primary: props.outline
      ? 'border border-indigo-600 text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500'
      : 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500 border border-transparent',
    
    secondary: props.outline
      ? 'border border-gray-500 text-gray-700 hover:bg-gray-50 focus:ring-gray-500'
      : 'bg-gray-500 hover:bg-gray-600 text-white focus:ring-gray-500 border border-transparent',
    
    success: props.outline
      ? 'border border-green-600 text-green-600 hover:bg-green-50 focus:ring-green-500'
      : 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 border border-transparent',
    
    danger: props.outline
      ? 'border border-red-600 text-red-600 hover:bg-red-50 focus:ring-red-500'
      : 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 border border-transparent',
    
    warning: props.outline
      ? 'border border-yellow-500 text-yellow-600 hover:bg-yellow-50 focus:ring-yellow-500'
      : 'bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-500 border border-transparent',
    
    info: props.outline
      ? 'border border-blue-500 text-blue-600 hover:bg-blue-50 focus:ring-blue-500'
      : 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500 border border-transparent',
    
    light: props.outline
      ? 'border border-gray-200 text-gray-600 hover:bg-gray-50 focus:ring-gray-200'
      : 'bg-gray-100 hover:bg-gray-200 text-gray-800 focus:ring-gray-200 border border-transparent',
    
    dark: props.outline
      ? 'border border-gray-800 text-gray-800 hover:bg-gray-100 focus:ring-gray-800'
      : 'bg-gray-800 hover:bg-gray-900 text-white focus:ring-gray-800 border border-transparent',
    
    link: 'bg-transparent text-indigo-600 hover:text-indigo-800 hover:underline focus:ring-0 p-0'
  };

  // Add block style
  if (props.block) {
    return `${variants[props.variant]} w-full`;
  }

  return variants[props.variant];
});
</script> 