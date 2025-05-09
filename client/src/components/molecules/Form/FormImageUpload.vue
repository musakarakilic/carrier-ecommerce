<template>
  <div class="space-y-4">
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <!-- Existing Images -->
    <div v-if="images && images.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      <div v-for="(image, index) in images" :key="index" class="relative group">
        <img :src="image" alt="Uploaded image" class="h-24 w-24 object-cover rounded-md border border-gray-200" />
        <button 
          type="button" 
          @click="removeImage(index)" 
          class="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
    
    <!-- Image Upload -->
    <div class="flex flex-col">
      <div class="flex items-center space-x-2 mb-2">
        <input
          type="file"
          :id="id"
          accept="image/*"
          :multiple="multiple"
          @change="handleFileUpload"
          class="hidden"
          ref="fileInput"
        />
        <button
          type="button"
          @click="$refs.fileInput.click()"
          class="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
          :disabled="uploading || disabled"
        >
          {{ buttonText }}
        </button>
        <button
          v-if="uploading"
          type="button"
          disabled
          class="px-3 py-2 bg-gray-100 text-gray-500 text-sm font-medium rounded-md flex items-center"
        >
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Uploading...
        </button>
      </div>
      <p v-if="helpText" class="text-xs text-gray-500">
        {{ helpText }}
      </p>
    </div>
    
    <!-- Upload Error -->
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: 'Images'
  },
  images: {
    type: Array,
    default: () => []
  },
  multiple: {
    type: Boolean,
    default: true
  },
  maxFiles: {
    type: Number,
    default: 5
  },
  maxFileSize: {
    type: Number,
    default: 5 * 1024 * 1024 // 5MB
  },
  acceptedTypes: {
    type: Array,
    default: () => ['image/jpeg', 'image/png', 'image/jpg', 'image/gif']
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  buttonText: {
    type: String,
    default: 'Upload Image'
  },
  uploading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  helpText: {
    type: String,
    default: 'JPG, PNG or JPEG formats are supported.'
  }
});

const emit = defineEmits(['file-selected', 'remove-image']);
const fileInput = ref(null);

const handleFileUpload = (event) => {
  const files = event.target.files;
  
  if (!files || files.length === 0) return;
  
  // Check file count
  const totalImages = props.images.length + files.length;
  if (totalImages > props.maxFiles) {
    emit('file-selected', { error: `You can upload a maximum of ${props.maxFiles} images.` });
    return;
  }
  
  // Check files
  const validFiles = [];
  const errors = [];
  
  Array.from(files).forEach(file => {
    // Check file type
    if (!props.acceptedTypes.includes(file.type)) {
      errors.push(`"${file.name}" has an invalid file type. Accepted types: ${props.acceptedTypes.join(', ')}`);
      return;
    }
    
    // Check file size
    if (file.size > props.maxFileSize) {
      errors.push(`"${file.name}" is too large (${(file.size / (1024 * 1024)).toFixed(2)}MB). Maximum size is ${props.maxFileSize / (1024 * 1024)}MB.`);
      return;
    }
    
    validFiles.push(file);
  });
  
  if (errors.length > 0) {
    emit('file-selected', { error: errors.join('\n') });
  }
  
  if (validFiles.length > 0) {
    emit('file-selected', { files: validFiles });
  }
  
  // Clear the input
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const removeImage = (index) => {
  emit('remove-image', index);
};
</script> 