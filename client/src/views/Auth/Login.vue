<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-6 bg-white p-8 rounded-2xl shadow-lg transition-all duration-300 border border-gray-100">
      <div>
        <h2 class="text-center text-3xl font-bold text-gray-800">
          Sign in to your account
        </h2>
        <p class="mt-3 text-center text-sm text-gray-500">
          Sign in to continue from where you left off
        </p>
      </div>
      
      <div class="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      
      <form class="space-y-5" novalidate onsubmit="return false;">
        <div class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email address</label>
            <input
              id="email"
              v-model="email"
              name="email"
              type="email"
              required
              autocomplete="email"
              class="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-gray-100 focus:bg-white text-gray-900 placeholder-gray-400"
              placeholder="example@email.com"
              @keydown.enter.prevent
            />
            <p v-if="emailError" class="mt-1 text-sm text-red-600">{{ emailError }}</p>
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              id="password"
              v-model="password"
              name="password"
              type="password"
              required
              autocomplete="current-password"
              class="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-gray-100 focus:bg-white text-gray-900 placeholder-gray-400"
              placeholder="••••••••"
              @keydown.enter.prevent
            />
            <p v-if="passwordError" class="mt-1 text-sm text-red-600">{{ passwordError }}</p>
          </div>
        </div>

        <div>
          <button
            type="button"
            :disabled="loading"
            @click.prevent="handleLogin"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-sm hover:shadow"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg
                v-if="!loading"
                class="h-5 w-5 text-indigo-400 group-hover:text-indigo-300 transition-colors duration-200"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clip-rule="evenodd"
                />
              </svg>
              <svg
                v-else
                class="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </span>
            <span class="ml-2">{{ loading ? 'Signing in...' : 'Sign In' }}</span>
          </button>
        </div>

        <div v-if="error" class="p-3 bg-red-50 border border-red-100 text-center text-sm text-red-600 rounded-lg">
          {{ error }}
        </div>

        <div class="text-sm text-center">
          <router-link
            to="/register"
            class="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
          >
            Don't have an account? Sign up
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');
const emailError = ref('');
const passwordError = ref('');

// Email validation
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Form validation
const validateForm = () => {
  let isValid = true;
  
  // Reset errors
  emailError.value = '';
  passwordError.value = '';
  error.value = '';
  
  // Email validation
  if (!email.value) {
    emailError.value = 'Email is required';
    isValid = false;
  } else if (!isValidEmail(email.value)) {
    emailError.value = 'Please enter a valid email address';
    isValid = false;
  }
  
  // Password validation
  if (!password.value) {
    passwordError.value = 'Password is required';
    isValid = false;
  } else if (password.value.length < 6) {
    passwordError.value = 'Password must be at least 6 characters';
    isValid = false;
  }
  
  return isValid;
};

const handleLogin = async () => {
  // Always prevent default form submission
  event?.preventDefault?.();
  
  if (loading.value) return;
  
  // Validate the form first
  if (!validateForm()) {
    return; // Stop if validation fails
  }
  
  try {
    loading.value = true;
    error.value = '';
    
    await authStore.login(email.value, password.value);
    
    // Redirect based on user role
    if (authStore.isAdmin) {
      router.push('/admin');
    } else {
      router.push('/'); // Redirect regular users to homepage
    }
  } catch (err) {
    console.error('Login error:', err);
    error.value = err.response?.data?.message || 'An error occurred while signing in';
    
    // Ensure the error stays visible
    loading.value = false;
    
    // Prevent any default behavior
    return false;
  } finally {
    loading.value = false;
  }
  
  // Prevent default form submission
  return false;
};
</script> 