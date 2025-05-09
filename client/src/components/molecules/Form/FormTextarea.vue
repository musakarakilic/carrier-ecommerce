<template>
  <div class="space-y-1">
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <textarea
      :id="id"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :rows="rows"
      :minlength="minlength"
      :maxlength="maxlength"
      :class="[
        'w-full bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-colors px-3 py-2',
        disabled ? 'bg-gray-100 cursor-not-allowed' : '',
        error ? 'border-red-300 focus:ring-red-400' : '',
      ]"
    ></textarea>
    
    <!-- Character counter -->
    <div v-if="maxlength && showCharCount" class="flex justify-end">
      <span class="text-xs text-gray-500">
        {{ modelValue ? modelValue.length : 0 }}/{{ maxlength }}
      </span>
    </div>
    
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
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  rows: {
    type: [String, Number],
    default: 4
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
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
  minlength: {
    type: [String, Number],
    default: undefined
  },
  maxlength: {
    type: [String, Number],
    default: undefined
  },
  showCharCount: {
    type: Boolean,
    default: true
  }
});

defineEmits(['update:modelValue']);
</script> 