<template>
  <div class="bg-white shadow-lg overflow-hidden sm:rounded-lg transition-all duration-300 hover:shadow-xl">
    <div class="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-primary-500 to-primary-600">
      <div class="flex justify-between items-center">
        <div>
          <h3 class="text-lg leading-6 font-bold text-white">Personal Information</h3>
          <p class="mt-1 max-w-2xl text-sm text-primary-100">Account details and contact information</p>
        </div>
        <div class="hidden sm:block">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-white opacity-50" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
    
    <div class="divide-y divide-gray-200">
      <!-- Name and Surname -->
      <div class="px-6 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50 transition-colors duration-200">
        <dt class="text-sm font-medium text-gray-500 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
          </svg>
          Full Name
        </dt>
        <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-medium">
          {{ user.firstName }} {{ user.lastName }}
        </dd>
      </div>
      
      <!-- Email -->
      <div class="px-6 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50 transition-colors duration-200">
        <dt class="text-sm font-medium text-gray-500 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
          Email address
        </dt>
        <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-medium">
          {{ user.email }}
        </dd>
      </div>
      
      <!-- Phone -->
      <div class="px-6 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50 transition-colors duration-200">
        <dt class="text-sm font-medium text-gray-500 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
          Phone
        </dt>
        <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-medium">
          <span v-if="profile.phone">{{ profile.phone }}</span>
          <span v-else class="text-gray-500 italic">Not specified</span>
        </dd>
      </div>
      
      <!-- Birth Date -->
      <div class="px-6 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50 transition-colors duration-200">
        <dt class="text-sm font-medium text-gray-500 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M6 3a1 1 0 011-1h.01a1 1 0 010 2H7a1 1 0 01-1-1zm2 3a1 1 0 00-2 0v1a2 2 0 00-2 2v1a2 2 0 00-2 2v.683a3.7 3.7 0 011.055.485 1.704 1.704 0 001.89 0 3.704 3.704 0 014.11 0 1.704 1.704 0 001.89 0 3.704 3.704 0 014.11 0 1.704 1.704 0 001.89 0A3.7 3.7 0 0118 12.683V12a2 2 0 00-2-2V9a2 2 0 00-2-2V6a1 1 0 10-2 0v1h-1V6a1 1 0 10-2 0v1H8V6zm10 8.868a3.704 3.704 0 01-4.055-.036 1.704 1.704 0 00-1.89 0 3.704 3.704 0 01-4.11 0 1.704 1.704 0 00-1.89 0A3.704 3.704 0 012 14.868V17a1 1 0 001 1h14a1 1 0 001-1v-2.132zM9 3a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm3 0a1 1 0 011-1h.01a1 1 0 110 2H13a1 1 0 01-1-1z" clip-rule="evenodd" />
          </svg>
          Birth Date
        </dt>
        <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-medium">
          <span v-if="formatBirthDate !== 'Not specified'">{{ formatBirthDate }}</span>
          <span v-else class="text-gray-500 italic">Not specified</span>
        </dd>
      </div>
      
      <!-- Gender -->
      <div class="px-6 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50 transition-colors duration-200">
        <dt class="text-sm font-medium text-gray-500 flex items-center">
          <svg v-if="profile.gender === 'male'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
          </svg>
          <svg v-else-if="profile.gender === 'female'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-5a1 1 0 10-2 0v.5a.5.5 0 01-1 0V13a1 1 0 10-2 0v.5a2.5 2.5 0 005 0V13z" clip-rule="evenodd" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16z" clip-rule="evenodd" />
          </svg>
          Gender
        </dt>
        <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-medium">
          <span v-if="formatGender !== 'Not specified'">{{ formatGender }}</span>
          <span v-else class="text-gray-500 italic">Not specified</span>
        </dd>
      </div>
      
      <!-- Address -->
      <div class="px-6 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50 transition-colors duration-200">
        <dt class="text-sm font-medium text-gray-500 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
          </svg>
          Address
        </dt>
        <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-medium">
          <span v-if="profile.address">{{ profile.address }}</span>
          <span v-else class="text-gray-500 italic">Not specified</span>
        </dd>
      </div>
      
      <!-- Registration Date -->
      <div class="px-6 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50 transition-colors duration-200">
        <dt class="text-sm font-medium text-gray-500 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
          </svg>
          Registration Date
        </dt>
        <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-medium">
          {{ formatDate(user.createdAt) }}
        </dd>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  user: {
    type: Object,
    required: true
  },
  profile: {
    type: Object,
    required: true
  }
});

// Birth date format
const formatBirthDate = computed(() => {
  if (!props.profile.birthDate) return 'Not specified';
  
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
  
  return genderMap[props.profile.gender] || 'Not specified';
});

// Date format
const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  });
};
</script> 