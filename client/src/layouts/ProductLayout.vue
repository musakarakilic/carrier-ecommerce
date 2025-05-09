<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div v-if="loading" class="flex justify-center py-12">
        <div class="spinner"></div>
      </div>
      <div v-else-if="error" class="text-center py-8 text-red-500">
        {{ error }}
      </div>
      <div v-else>
        <!-- Breadcrumb component -->
        <div class="mb-5">
          <slot name="breadcrumb"></slot>
        </div>
        
        <!-- Main content section -->
        <div class="flex flex-col lg:flex-row gap-8">
          <!-- Sidebar - Filters (only shown if sidebar slot has content) -->
          <div v-if="$slots.sidebar && $slots.sidebar()" class="lg:w-1/4">
            <slot name="sidebar">
              <!-- Default sidebar content -->
              <div class="bg-white rounded-lg shadow p-5 sticky top-6 border border-gray-100">
                <h2 class="text-lg font-semibold text-gray-800 mb-5 pb-3 border-b flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filters
                </h2>
                <slot name="filters"></slot>
              </div>
            </slot>
          </div>
          
          <!-- Products Content -->
          <div :class="[$slots.sidebar && $slots.sidebar() ? 'lg:w-3/4' : 'w-full']">
            <!-- Top Bar - Sorting and Total Results -->
            <slot name="topbar">
              <div class="flex flex-col sm:flex-row justify-between items-center mb-6 bg-white p-4 rounded-lg shadow border border-gray-100">
                <div class="text-sm text-gray-600 mb-3 sm:mb-0 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <span class="font-medium text-indigo-600">{{ totalProducts }}</span> products found
                </div>
                <slot name="sorting"></slot>
              </div>
            </slot>

            <!-- Main content / Product list -->
            <slot name="content"></slot>

            <!-- Load More button -->
            <slot name="pagination"></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  totalProducts: {
    type: Number,
    default: 0
  }
});
</script>

<style scoped>
.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #4f46e5;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Skeleton loader styles */
.skeleton-shimmer {
  position: relative;
  overflow: hidden;
  background-color: #E5E7EB;
}

.skeleton-shimmer::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transform: translateX(-100%);
  background-image: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0,
    rgba(255, 255, 255, 0.3) 20%,
    rgba(255, 255, 255, 0.6) 60%,
    rgba(255, 255, 255, 0)
  );
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
</style> 