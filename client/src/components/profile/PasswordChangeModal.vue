<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-sm transition-opacity z-20 flex items-center justify-center">
      <div @click.stop class="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full mx-4 sm:mx-auto">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 sm:mx-0 sm:h-10 sm:w-10">
              <component is="i-ph-lock-key" class="h-6 w-6 text-primary-600" />
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                Change Password
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  For your account security, please enter your current password and new password.
                </p>
              </div>
            </div>
          </div>
          
          <!-- Main Error Message -->
          <div v-if="backendError" class="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-red-800">{{ backendError }}</p>
              </div>
            </div>
          </div>
          
          <form @submit.prevent="handleSubmit" class="mt-6 space-y-4">
            <!-- Current Password -->
            <div>
              <label for="currentPassword" class="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <div class="mt-1 relative">
                <input 
                  :type="showCurrentPassword ? 'text' : 'password'" 
                  id="currentPassword" 
                  v-model="formData.currentPassword"
                  :class="[
                    'shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm rounded-md transition-all',
                    formErrors.currentPassword ? 'border-red-300 pr-10' : 'border-gray-300'
                  ]"
                  placeholder="Enter your current password"
                  required
                  @blur="validateInput('currentPassword')"
                />
                <div v-if="formErrors.currentPassword" class="absolute inset-y-0 right-0 pr-9 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                </div>
                <button 
                  type="button" 
                  @click="showCurrentPassword = !showCurrentPassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                >
                  <component 
                    :is="showCurrentPassword ? 'i-ph-eye-slash' : 'i-ph-eye'" 
                    class="h-5 w-5" 
                  />
                </button>
              </div>
              <p v-if="formErrors.currentPassword" class="mt-1 text-sm text-red-600">
                {{ formErrors.currentPassword }}
              </p>
            </div>
          
            <!-- New Password -->
            <div>
              <label for="newPassword" class="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div class="mt-1 relative">
                <input 
                  :type="showNewPassword ? 'text' : 'password'" 
                  id="newPassword" 
                  v-model="formData.newPassword"
                  :class="[
                    'shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm rounded-md transition-all',
                    formErrors.newPassword ? 'border-red-300 pr-10' : 'border-gray-300'
                  ]"
                  placeholder="Enter your new password"
                  required
                  minlength="6"
                  @blur="validateInput('newPassword')"
                />
                <div v-if="formErrors.newPassword" class="absolute inset-y-0 right-0 pr-9 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                </div>
                <button 
                  type="button" 
                  @click="showNewPassword = !showNewPassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                >
                  <component 
                    :is="showNewPassword ? 'i-ph-eye-slash' : 'i-ph-eye'" 
                    class="h-5 w-5" 
                  />
                </button>
              </div>
              <p v-if="formErrors.newPassword" class="mt-1 text-sm text-red-600">
                {{ formErrors.newPassword }}
              </p>
              <p v-else class="mt-1 text-xs text-gray-500">Your password must be at least 6 characters long.</p>
            </div>
          
            <!-- Confirm New Password -->
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <div class="mt-1 relative">
                <input 
                  :type="showConfirmPassword ? 'text' : 'password'" 
                  id="confirmPassword" 
                  v-model="formData.confirmPassword"
                  :class="[
                    'shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm rounded-md transition-all',
                    formErrors.confirmPassword ? 'border-red-300 pr-10' : 'border-gray-300'
                  ]"
                  placeholder="Re-enter your new password"
                  required
                  @blur="validateInput('confirmPassword')"
                />
                <div v-if="formErrors.confirmPassword" class="absolute inset-y-0 right-0 pr-9 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                </div>
                <button 
                  type="button" 
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                >
                  <component 
                    :is="showConfirmPassword ? 'i-ph-eye-slash' : 'i-ph-eye'" 
                    class="h-5 w-5" 
                  />
                </button>
              </div>
              <p v-if="formErrors.confirmPassword" class="mt-1 text-sm text-red-600">
                {{ formErrors.confirmPassword }}
              </p>
            </div>
            
            <!-- General Error Message -->
            <div v-if="formErrors.general" class="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-start">
              <span class="flex-shrink-0 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              </span>
              <div>
                <h3 class="text-sm font-medium text-red-800">Error</h3>
                <p class="mt-1 text-sm">{{ formErrors.general }}</p>
              </div>
            </div>
            
            <!-- Success Message -->
            <div v-if="isSuccess" class="mt-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-md flex items-start">
              <span class="flex-shrink-0 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </span>
              <div>
                <h3 class="text-sm font-medium text-green-800">Success</h3>
                <p class="mt-1 text-sm">{{ isSuccessMessage }}</p>
              </div>
            </div>
            
            <!-- Processing Message -->
            <div v-if="isSubmitting" class="mt-4 p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-md flex items-start">
              <span class="flex-shrink-0 mr-3">
                <svg class="animate-spin h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              <div>
                <h3 class="text-sm font-medium text-blue-800">Processing</h3>
                <p class="mt-1 text-sm">Changing your password, please wait...</p>
              </div>
            </div>
          </form>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button 
            type="button"
            @click="handleSubmit"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm transition-all"
            :disabled="isSubmitting"
            :class="{'opacity-60 cursor-not-allowed': isSubmitting}"
          >
            <span v-if="isSubmitting" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
            <span v-else>Change Password</span>
          </button>
          <button 
            type="button"
            @click="handleClose"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-all"
            :disabled="isSubmitting"
            :class="{'opacity-60 cursor-not-allowed': isSubmitting}"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, reactive, watch, onMounted, nextTick } from 'vue';

const props = defineProps({
  changingPassword: {
    type: Boolean,
    default: false
  },
  error: {
    type: [String, Object],
    default: ''
  },
  isOpen: {
    type: Boolean,
    default: true
  },
  success: {
    type: Boolean,
    default: false
  },
  successMessage: {
    type: String,
    default: 'Your password has been successfully changed.'
  }
});

// In Vue 3 composition API, use emit() instead of $emit
const emit = defineEmits(['close', 'submit', 'success', 'error']);

// Form data
const formData = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

// Password visibility controls
const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

// Form states
const isSubmitting = ref(false);
const isSuccess = ref(false);
const backendError = ref('');

// Form error controls
const formErrors = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  general: ''
});

// Update form errors when props.error changes
watch(() => props.error, (newError) => {
  if (newError) {
    resetErrors();
    backendError.value = newError;
    
    if (typeof newError === 'string') {
      if (newError.toLowerCase().includes('current') || 
          newError.toLowerCase().includes('wrong')) {
        formErrors.currentPassword = newError;
      } else {
        formErrors.general = newError;
      }
    } else if (typeof newError === 'object') {
      Object.keys(newError).forEach(key => {
        if (formErrors.hasOwnProperty(key)) {
          formErrors[key] = newError[key];
        }
      });
    }
  }
}, { immediate: true });

// Update isSubmitting state when changingPassword changes
watch(() => props.changingPassword, (newValue) => {
  isSubmitting.value = newValue;
}, { immediate: true });

// Watch success state
watch(() => props.success, (newValue) => {
  if (newValue) {
    isSuccess.value = true;
    isSuccessMessage.value = props.successMessage || 'Your password has been successfully changed.';
    
    // Close modal after 2 seconds
    setTimeout(() => {
      emit('success', {
        message: isSuccessMessage.value
      });
      handleClose();
    }, 2000);
  }
}, { immediate: true });

// Form validation
const validateForm = () => {
  // Clear all errors
  resetErrors();
  
  let isValid = true;
  
  // Empty field check
  if (!formData.currentPassword) {
    formErrors.currentPassword = 'Please enter your current password';
    isValid = false;
  }
  
  if (!formData.newPassword) {
    formErrors.newPassword = 'Please enter your new password';
    isValid = false;
  }
  
  if (!formData.confirmPassword) {
    formErrors.confirmPassword = 'Please re-enter your new password';
    isValid = false;
  }
  
  // If basic checks pass, perform other validations
  if (isValid) {
    // Current password and new password should not be the same
    if (formData.currentPassword === formData.newPassword) {
      formErrors.newPassword = 'New password cannot be the same as your current password';
      isValid = false;
    }
    
    // New password minimum length check
    if (formData.newPassword.length < 6) {
      formErrors.newPassword = 'New password must be at least 6 characters long';
      isValid = false;
    }
    
    // Password confirmation match check
    if (formData.newPassword !== formData.confirmPassword) {
      formErrors.confirmPassword = 'New passwords do not match';
      isValid = false;
    }
  }
  
  return isValid;
};

// Form submission function
const handleSubmit = async () => {
  if (isSubmitting.value) return;
  
  resetErrors();
  backendError.value = '';
  isSuccess.value = false;
  
  if (!validateForm()) {
    return;
  }
  
  isSubmitting.value = true;
  
  try {
    const passwordData = {
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword
    };
    
    const result = await emit('submit', passwordData);
    
    if (result) {
      backendError.value = result;
      if (result.toLowerCase().includes('current') || result.toLowerCase().includes('wrong')) {
        formErrors.currentPassword = result;
      } else {
        formErrors.general = result;
      }
    }
  } catch (error) {
    console.error('Form submission error:', error);
    formErrors.general = 'An unexpected error occurred. Please try again.';
  } finally {
    isSubmitting.value = false;
  }
};

// Close modal and reset form
const handleClose = () => {
  // Reset form
  formData.currentPassword = '';
  formData.newPassword = '';
  formData.confirmPassword = '';
  
  // Reset errors and states
  resetErrors();
  isSuccess.value = false;
  
  // Close modal
  emit('close');
};

// Form submission function - For instant validation
const validateInput = (field) => {
  // Clear only the specific field's error
  formErrors[field] = '';
  
  // Field-specific quick validation
  if (field === 'currentPassword' && !formData.currentPassword) {
    formErrors.currentPassword = 'Please enter your current password';
  }
  
  if (field === 'newPassword') {
    if (!formData.newPassword) {
      formErrors.newPassword = 'Please enter your new password';
    } else if (formData.newPassword.length < 6) {
      formErrors.newPassword = 'New password must be at least 6 characters long';
    } else if (formData.currentPassword && formData.currentPassword === formData.newPassword) {
      formErrors.newPassword = 'New password cannot be the same as your current password';
    }
  }
  
  if (field === 'confirmPassword') {
    if (!formData.confirmPassword) {
      formErrors.confirmPassword = 'Please re-enter your new password';
    } else if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      formErrors.confirmPassword = 'New passwords do not match';
    }
  }
};

// Reset errors
const resetErrors = () => {
  backendError.value = '';
  Object.keys(formErrors).forEach(key => {
    formErrors[key] = '';
  });
};

// Load Esc key handler for modal closing
onMounted(() => {
  const handleEsc = (e) => {
    if (e.key === 'Escape' && !isSubmitting.value) {
      handleClose();
    }
  };
  
  window.addEventListener('keydown', handleEsc);
  
  // Cleanup
  return () => {
    window.removeEventListener('keydown', handleEsc);
  };
});
</script>

<style scoped>
.animate-modal-in {
  animation: modalIn 0.3s ease-out forwards;
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in {
  animation: fadeIn 0.2s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style> 