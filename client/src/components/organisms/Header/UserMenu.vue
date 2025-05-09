<template>
  <div class="flex items-center">
    <!-- Authentication links -->
    <template v-if="!isAuthenticated">
      <RouterLink
        to="/login"
        class="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
      >
        Login
      </RouterLink>
      <RouterLink
        to="/register"
        class="bg-indigo-600 text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium ml-3"
      >
        Register
      </RouterLink>
    </template>

    <template v-else>
      <!-- Admin panel link -->
      <RouterLink
        v-if="isAdmin"
        to="/admin"
        class="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
      >
        Admin Panel
      </RouterLink>
      
      <!-- My Account Dropdown -->
      <div class="relative ml-3 user-menu-container">
        <button 
          @click="isUserMenuOpen = !isUserMenuOpen" 
          @blur="closeUserMenuTimeout()"
          class="flex items-center text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          My Account
          <svg 
            class="ml-1 h-4 w-4 transition-transform duration-200" 
            :class="{ 'rotate-180': isUserMenuOpen }"
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
        
        <div 
          v-show="isUserMenuOpen" 
          class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
          @mouseover="clearCloseTimeout()"
          @mouseleave="closeUserMenuTimeout()"
        >
          <RouterLink to="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 inline-block text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            My Profile
          </RouterLink>
          <RouterLink to="/orders" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 inline-block text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            My Orders
          </RouterLink>
          <div class="border-t border-gray-100"></div>
          <button 
            @click="logout" 
            class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 inline-block text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';

const props = defineProps({
  isAuthenticated: {
    type: Boolean,
    default: false
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['logout']);

// User menu open/closed state
const isUserMenuOpen = ref(false);
const userMenuTimeout = ref(null);
const userMenuHoverDelay = 300; // ms

// Timer to close user menu
const closeUserMenuTimeout = () => {
  userMenuTimeout.value = setTimeout(() => {
    isUserMenuOpen.value = false;
  }, userMenuHoverDelay);
};

// Clear user menu timer
const clearCloseTimeout = () => {
  if (userMenuTimeout.value) {
    clearTimeout(userMenuTimeout.value);
    userMenuTimeout.value = null;
  }
};

// Logout function
const logout = () => {
  emit('logout');
  isUserMenuOpen.value = false;
};
</script>

<style scoped>
.user-menu-container {
  position: relative;
  z-index: 55;
}
</style> 