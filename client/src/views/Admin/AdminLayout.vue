<template>
  <div class="h-screen flex overflow-hidden bg-gray-50">
    <!-- Mobile sidebar toggle button -->
    <div class="lg:hidden fixed top-6 left-6 z-20">
      <button @click="isSidebarOpen = !isSidebarOpen" class="p-3 rounded-md bg-white text-gray-600 shadow-md hover:shadow-lg transition-all duration-300">
        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>

    <!-- Sidebar - With collapse feature -->
    <div :class="[
      'fixed inset-y-0 left-0 z-10 transition-all duration-300 ease-in-out',
      isSidebarOpen ? 'w-64' : 'w-16'
    ]">
      <div class="flex flex-col h-full bg-white shadow-lg border-r border-gray-100">
        <!-- Sidebar header -->
        <div class="h-16 flex items-center justify-between px-4 border-b border-gray-100">
          <div class="flex items-center space-x-3" :class="{'justify-center w-full': !isSidebarOpen}">
            <div v-if="isSidebarOpen" class="flex items-center justify-center h-9 w-9 rounded-full bg-gray-800 text-white">
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <button 
              v-if="!isSidebarOpen" 
              @click="isSidebarOpen = true" 
              class="flex items-center justify-center h-9 w-9 rounded-full bg-gray-800 text-white hover:bg-gray-700"
            >
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 v-if="isSidebarOpen" class="text-xl font-semibold text-gray-800">Admin</h1>
          </div>
          <button v-if="isSidebarOpen" @click="isSidebarOpen = false" class="text-gray-400 hover:text-gray-600">
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
        
        <div class="flex-1 flex flex-col overflow-y-auto">
          <div :class="{'px-4 pt-6 pb-2': isSidebarOpen, 'px-2 pt-6 pb-2 text-center': !isSidebarOpen}">
            <h2 v-if="isSidebarOpen" class="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Management</h2>
          </div>
          
          <nav :class="{'px-3': isSidebarOpen, 'px-1': !isSidebarOpen}" class="space-y-1">
            <router-link
              to="/admin"
              exact-active-class="bg-gray-100 text-gray-900 before:bg-gray-800 before:absolute before:top-0 before:left-0 before:bottom-0 before:w-1"
              class="group flex items-center py-2.5 text-sm font-medium rounded-md transition-colors duration-200 relative text-gray-700 hover:bg-gray-50"
              :class="{'px-3': isSidebarOpen, 'px-1 justify-center': !isSidebarOpen}"
            >
              <svg class="text-gray-500 group-hover:text-gray-700 mr-3 h-5 w-5 transition-colors duration-200" 
                   :class="{'mr-0': !isSidebarOpen}"
                   xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span v-if="isSidebarOpen">Dashboard</span>
            </router-link>

            <router-link
              to="/admin/orders"
              active-class="bg-gray-100 text-gray-900 before:bg-gray-800 before:absolute before:top-0 before:left-0 before:bottom-0 before:w-1"
              class="group flex items-center py-2.5 text-sm font-medium rounded-md transition-colors duration-200 relative text-gray-700 hover:bg-gray-50"
              :class="{'px-3': isSidebarOpen, 'px-1 justify-center': !isSidebarOpen}"
            >
              <svg class="text-gray-500 group-hover:text-gray-700 mr-3 h-5 w-5 transition-colors duration-200"
                   :class="{'mr-0': !isSidebarOpen}"
                   xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span v-if="isSidebarOpen">Orders</span>
            </router-link>

            <router-link
              to="/admin/products"
              active-class="bg-gray-100 text-gray-900 before:bg-gray-800 before:absolute before:top-0 before:left-0 before:bottom-0 before:w-1"
              class="group flex items-center py-2.5 text-sm font-medium rounded-md transition-colors duration-200 relative text-gray-700 hover:bg-gray-50"
              :class="{'px-3': isSidebarOpen, 'px-1 justify-center': !isSidebarOpen}"
            >
              <svg class="text-gray-500 group-hover:text-gray-700 mr-3 h-5 w-5 transition-colors duration-200"
                   :class="{'mr-0': !isSidebarOpen}"
                   xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span v-if="isSidebarOpen">Products</span>
            </router-link>

            <router-link
              to="/admin/categories"
              active-class="bg-gray-100 text-gray-900 before:bg-gray-800 before:absolute before:top-0 before:left-0 before:bottom-0 before:w-1"
              class="group flex items-center py-2.5 text-sm font-medium rounded-md transition-colors duration-200 relative text-gray-700 hover:bg-gray-50"
              :class="{'px-3': isSidebarOpen, 'px-1 justify-center': !isSidebarOpen}"
            >
              <svg class="text-gray-500 group-hover:text-gray-700 mr-3 h-5 w-5 transition-colors duration-200"
                   :class="{'mr-0': !isSidebarOpen}"
                   xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span v-if="isSidebarOpen">Categories</span>
            </router-link>

            <router-link
              to="/admin/users"
              active-class="bg-gray-100 text-gray-900 before:bg-gray-800 before:absolute before:top-0 before:left-0 before:bottom-0 before:w-1"
              class="group flex items-center py-2.5 text-sm font-medium rounded-md transition-colors duration-200 relative text-gray-700 hover:bg-gray-50"
              :class="{'px-3': isSidebarOpen, 'px-1 justify-center': !isSidebarOpen}"
            >
              <svg class="text-gray-500 group-hover:text-gray-700 mr-3 h-5 w-5 transition-colors duration-200"
                   :class="{'mr-0': !isSidebarOpen}"
                   xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span v-if="isSidebarOpen">Users</span>
            </router-link>

            <router-link
              to="/admin/collections"
              active-class="bg-gray-100 text-gray-900 before:bg-gray-800 before:absolute before:top-0 before:left-0 before:bottom-0 before:w-1"
              class="group flex items-center py-2.5 text-sm font-medium rounded-md transition-colors duration-200 relative text-gray-700 hover:bg-gray-50"
              :class="{'px-3': isSidebarOpen, 'px-1 justify-center': !isSidebarOpen}"
            >
              <svg class="text-gray-500 group-hover:text-gray-700 mr-3 h-5 w-5 transition-colors duration-200"
                   :class="{'mr-0': !isSidebarOpen}"
                   xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span v-if="isSidebarOpen">Collections</span>
            </router-link>

            <router-link
              to="/admin/brands"
              active-class="bg-gray-100 text-gray-900 before:bg-gray-800 before:absolute before:top-0 before:left-0 before:bottom-0 before:w-1"
              class="group flex items-center py-2.5 text-sm font-medium rounded-md transition-colors duration-200 relative text-gray-700 hover:bg-gray-50"
              :class="{'px-3': isSidebarOpen, 'px-1 justify-center': !isSidebarOpen}"
            >
              <svg class="text-gray-500 group-hover:text-gray-700 mr-3 h-5 w-5 transition-colors duration-200"
                   :class="{'mr-0': !isSidebarOpen}"
                   xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span v-if="isSidebarOpen">Brands</span>
            </router-link>

            <router-link
              to="/admin/subscriptions"
              active-class="bg-gray-100 text-gray-900 before:bg-gray-800 before:absolute before:top-0 before:left-0 before:bottom-0 before:w-1"
              class="group flex items-center py-2.5 text-sm font-medium rounded-md transition-colors duration-200 relative text-gray-700 hover:bg-gray-50"
              :class="{'px-3': isSidebarOpen, 'px-1 justify-center': !isSidebarOpen}"
            >
              <svg class="text-gray-500 group-hover:text-gray-700 mr-3 h-5 w-5 transition-colors duration-200"
                   :class="{'mr-0': !isSidebarOpen}"
                   xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span v-if="isSidebarOpen">Subscriptions</span>
            </router-link>
          </nav>

          <div class="px-3 my-5">
            <div class="border-t border-gray-200"></div>
          </div>

          <div :class="{'px-4 pb-2': isSidebarOpen, 'px-2 pb-2 text-center': !isSidebarOpen}">
            <h2 v-if="isSidebarOpen" class="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Site</h2>
          </div>

          <nav :class="{'px-3': isSidebarOpen, 'px-1': !isSidebarOpen}" class="space-y-1 mb-6">
            <router-link
              to="/"
              class="group flex items-center py-2.5 text-sm font-medium rounded-md transition-colors duration-200 relative text-gray-700 hover:bg-gray-50"
              :class="{'px-3': isSidebarOpen, 'px-1 justify-center': !isSidebarOpen}"
            >
              <svg class="text-gray-500 group-hover:text-gray-700 mr-3 h-5 w-5 transition-colors duration-200"
                   :class="{'mr-0': !isSidebarOpen}"
                   xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span v-if="isSidebarOpen">Back to Main Site</span>
            </router-link>
          </nav>

          <!-- Admin profile -->
          <div class="mt-auto px-3 pb-5 pt-2">

          </div>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div :class="['flex flex-col flex-1 overflow-hidden transition-all duration-300', isSidebarOpen ? 'ml-64' : 'ml-16']">
      <!-- Header -->
      <header class="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200">
        <div class="px-4 sm:px-6 lg:px-8 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <!-- Desktop sidebar toggle button -->

              <h1 class="text-xl font-medium text-gray-800">Admin Panel</h1>
            </div>
            <div class="flex items-center space-x-4">
              <div class="border-l pl-4 border-gray-200 relative">
                <button 
                  @click="isProfileMenuOpen = !isProfileMenuOpen"
                  class="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none transition-colors duration-200"
                >
                  <img 
                    class="h-8 w-8 rounded-full object-cover border border-gray-200" 
                    :src="user?.profileImage || 'https://ui-avatars.com/api/?name=' + (user?.name || 'Admin') + '&background=0D8ABC&color=fff'" 
                    :alt="user?.name || 'Admin'" 
                  />
                  <span>{{ user?.name || 'Admin' }}</span>
                  <svg 
                    class="h-5 w-5 text-gray-400" 
                    :class="{ 'transform rotate-180': isProfileMenuOpen }"
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <!-- Profile Dropdown Menu -->
                <div 
                  v-if="isProfileMenuOpen" 
                  class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-10"
                >
                  <router-link 
                    to="/admin/profile" 
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <div class="flex items-center">
                      <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile
                    </div>
                  </router-link>
                  <router-link 
                    to="/admin/settings" 
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <div class="flex items-center">
                      <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Settings
                    </div>
                  </router-link>
                  <div class="border-t border-gray-100 my-1"></div>
                  <button 
                    @click="logout"
                    class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <div class="flex items-center">
                      <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main class="flex-1 relative overflow-y-auto focus:outline-none bg-gray-50">
        <div class="py-6">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <router-view></router-view>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount, watch } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const isSidebarOpen = ref(window.innerWidth > 1024); // Set initial state based on window size
const isProfileMenuOpen = ref(false);

// Update sidebar state when window size changes
const updateSidebarState = () => {
  // Close sidebar on mobile screens
  if (window.innerWidth < 640) {
    isSidebarOpen.value = false;
  } 
  // Collapsed on medium screens
  else if (window.innerWidth < 1024) {
    isSidebarOpen.value = false;
  }
  // Open on large screens
  else {
    isSidebarOpen.value = true;
  }
};

// Get user information
const user = computed(() => authStore.user);

// Close dropdown on outside clicks
const closeProfileMenu = (e) => {
  if (isProfileMenuOpen.value && !e.target.closest('.relative')) {
    isProfileMenuOpen.value = false;
  }
};

// Logout function
const logout = () => {
  authStore.logout();
};

onMounted(() => {
  // Load user information
  if (authStore.token && !authStore.user) {
    authStore.getProfile();
  }
  
  // Listen for clicks outside dropdown
  document.addEventListener('click', closeProfileMenu);
  
  // Update sidebar state when window size changes
  window.addEventListener('resize', updateSidebarState);
});

onBeforeUnmount(() => {
  // Clean up event listeners
  document.removeEventListener('click', closeProfileMenu);
  window.removeEventListener('resize', updateSidebarState);
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

body {
  font-family: 'Inter', sans-serif;
}
</style> 