<template>
  <div class="flex items-center">
    <input
      :id="id"
      type="checkbox"
      :checked="modelValue"
      @change="$emit('update:modelValue', $event.target.checked)"
      :disabled="disabled"
      class="rounded border-gray-300 text-gray-700 shadow-sm focus:border-gray-300 focus:ring focus:ring-offset-0 focus:ring-gray-200 focus:ring-opacity-50"
      :class="{ 'opacity-50 cursor-not-allowed': disabled }"
    />
    <label :for="id" class="ml-2 block text-sm text-gray-700" :class="{ 'cursor-pointer': !disabled }">
      <slot>{{ label }}</slot>
    </label>
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
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

defineEmits(['update:modelValue']);
</script> 