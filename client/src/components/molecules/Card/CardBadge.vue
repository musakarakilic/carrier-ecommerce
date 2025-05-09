<template>
  <div 
    class="absolute text-xs font-semibold px-3 py-1 rounded-full shadow-md"
    :class="[
      position === 'top-left' ? 'top-3 left-3' : 
      position === 'top-right' ? 'top-3 right-3' : 
      position === 'bottom-left' ? 'bottom-3 left-3' : 
      position === 'bottom-right' ? 'bottom-3 right-3' : '',
      typeClasses
    ]"
  >
    <slot>{{ text }}</slot>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  position: {
    type: String,
    default: 'top-left',
    validator: (value) => ['top-left', 'top-right', 'bottom-left', 'bottom-right'].includes(value)
  },
  type: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'success', 'warning', 'danger', 'info', 'dark'].includes(value)
  }
});

const typeClasses = computed(() => {
  switch (props.type) {
    case 'primary':
      return 'bg-indigo-500 text-white';
    case 'success':
      return 'bg-green-500 text-white';
    case 'warning':
      return 'bg-yellow-500 text-white';
    case 'danger':
      return 'bg-red-500 text-white';
    case 'info':
      return 'bg-blue-500 text-white';
    case 'dark':
      return 'bg-gray-800 text-white';
    default:
      return 'bg-indigo-500 text-white';
  }
});
</script> 