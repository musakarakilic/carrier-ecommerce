<script setup>
import { useAuthStore } from './stores/auth';
import { RouterView, useRouter } from 'vue-router';
import { onMounted, onUnmounted } from 'vue';
import { authEvents } from './services/api';

const authStore = useAuthStore();
const router = useRouter();

// Handle auth events
const handleAuthLogout = (event) => {
  console.log('Auth logout event received:', event.detail);
  // Use the auth store's logout method instead of page reload
  authStore.logout();
  
  // Use router.push instead of location.href
  if (router.currentRoute.value.path !== '/login') {
    router.push('/login');
  }
};

const handleAuthUnauthorized = (event) => {
  console.log('Auth unauthorized event received:', event.detail);
  // Handle unauthorized access without page reload
};

onMounted(async () => {
  await authStore.initialize();
  
  // Add global event listeners
  window.addEventListener('auth:logout', handleAuthLogout);
  window.addEventListener('auth:unauthorized', handleAuthUnauthorized);
});

onUnmounted(() => {
  // Remove event listeners to prevent memory leaks
  window.removeEventListener('auth:logout', handleAuthLogout);
  window.removeEventListener('auth:unauthorized', handleAuthUnauthorized);
});
</script>

<template>
  <RouterView />
</template>

<style>
/* Global styles */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

body {
  font-family: 'Inter', sans-serif;
}

.transition {
  transition: all 0.3s ease;
}
</style>
