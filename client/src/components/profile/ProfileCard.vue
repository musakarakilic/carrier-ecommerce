<template>
  <div class="bg-white overflow-hidden shadow-lg rounded-lg divide-y divide-gray-200 transition-all duration-300 hover:shadow-xl">
    <!-- Profile Image and Personal Information -->
    <div class="p-6 relative overflow-hidden">
      <!-- Background pattern -->
      <div class="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-primary-500 to-primary-600 opacity-90"></div>
      
      <div class="flex flex-col items-center relative">
        <!-- Profile Image -->
        <div class="relative group mb-4 mt-6">
          <div class="w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden bg-white">
            <img 
              :src="profileImageUrl" 
              alt="Profile Image" 
              class="h-full w-full object-cover"
            />
          </div>
          
          <div 
            v-if="editMode" 
            @click="triggerFileInput"
            class="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
          >
            <span class="text-white text-sm font-medium flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Change
            </span>
          </div>
          
          <input 
            ref="fileInput" 
            type="file" 
            accept="image/*" 
            class="hidden" 
            @change="handleFileChange"
          />
        </div>
        
        <!-- Username and Email -->
        <h3 class="text-xl font-bold text-gray-900">
          {{ user.firstName }} {{ user.lastName }}
        </h3>
        <p class="text-sm text-gray-500 mt-1">{{ user.email }}</p>
        
        <!-- User Role -->
        <span 
          class="mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
          :class="user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'"
        >
          <span class="mr-1">
            <svg v-if="user.role === 'admin'" xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
            </svg>
          </span>
          {{ user.role === 'admin' ? 'Administrator' : 'User' }}
        </span>
      </div>
    </div>

    <!-- Quick Contact Information -->
    <div class="p-6 space-y-4">
      <div v-if="profile.phone" class="flex items-center text-sm">
        <span class="text-gray-500 mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
        </span>
        <span class="text-gray-700">{{ profile.phone }}</span>
      </div>
      
      <div v-if="profile.birthDate" class="flex items-center text-sm">
        <span class="text-gray-500 mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M6 3a1 1 0 011-1h.01a1 1 0 010 2H7a1 1 0 01-1-1zm2 3a1 1 0 00-2 0v1a2 2 0 00-2 2v1a2 2 0 00-2 2v.683a3.7 3.7 0 011.055.485 1.704 1.704 0 001.89 0 3.704 3.704 0 014.11 0 1.704 1.704 0 001.89 0 3.704 3.704 0 014.11 0 1.704 1.704 0 001.89 0A3.7 3.7 0 0118 12.683V12a2 2 0 00-2-2V9a2 2 0 00-2-2V6a1 1 0 10-2 0v1h-1V6a1 1 0 10-2 0v1H8V6zm10 8.868a3.704 3.704 0 01-4.055-.036 1.704 1.704 0 00-1.89 0 3.704 3.704 0 01-4.11 0 1.704 1.704 0 00-1.89 0A3.704 3.704 0 012 14.868V17a1 1 0 001 1h14a1 1 0 001-1v-2.132zM9 3a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm3 0a1 1 0 011-1h.01a1 1 0 110 2H13a1 1 0 01-1-1z" clip-rule="evenodd" />
          </svg>
        </span>
        <span class="text-gray-700">{{ formatBirthDate }}</span>
      </div>
      
      <div v-if="profile.gender" class="flex items-center text-sm">
        <span class="text-gray-500 mr-3">
          <svg v-if="profile.gender === 'male'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
          </svg>
          <svg v-else-if="profile.gender === 'female'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-5a1 1 0 10-2 0v.5a.5.5 0 01-1 0V13a1 1 0 10-2 0v.5a2.5 2.5 0 005 0V13z" clip-rule="evenodd" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
          </svg>
        </span>
        <span class="text-gray-700">{{ formatGender }}</span>
      </div>
    </div>

    <!-- Security Settings -->
    <div class="p-6">
      <button 
        type="button" 
        @click="emit('show-password-modal')"
        class="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
      >
        <span class="mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
          </svg>
        </span>
        Change Password
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  user: {
    type: Object,
    required: true
  },
  profile: {
    type: Object,
    required: true
  },
  editMode: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['image-upload', 'show-password-modal']);

const fileInput = ref(null);

// Profile image URL
const profileImageUrl = computed(() => {
  if (!props.user.profileImage) return '/img/profile-placeholder.png';
  
  if (props.user.profileImage.startsWith('http')) {
    return props.user.profileImage;
  }
  
  const BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || 'https://carrier-ecommerce.onrender.com';
  return `${BASE_URL}${props.user.profileImage}`;
});

// Birth date format
const formatBirthDate = computed(() => {
  if (!props.profile.birthDate) return '';
  
  const date = new Date(props.profile.birthDate);
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
});

// Gender format
const formatGender = computed(() => {
  const genderMap = {
    'male': 'Male',
    'female': 'Female',
    'other': 'Other'
  };
  
  return genderMap[props.profile.gender] || '';
});

// Open file selection dialog
const triggerFileInput = () => {
  fileInput.value.click();
};

// Forward file change event to parent component
const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    emit('image-upload', file);
  }
};
</script> 