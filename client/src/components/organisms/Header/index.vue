<template>
  <header @click="checkOutsideClick">
    <!-- Fixed Header (Logo, Search, Icons) -->
    <div class="fixed-header bg-white shadow-sm">
      <!-- Top navbar -->
      <div class="bg-indigo-600"></div>

      <!-- Main navbar -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <!-- Logo -->
            <RouterLink to="/" class="text-2xl font-bold text-indigo-600">
              Carrier
            </RouterLink>
          </div>

          <!-- Search bar -->
          <SearchBar @search-completed="handleSearchCompleted" />

          <!-- Right menu -->
          <div class="flex items-center">
            <!-- User menu -->
            <UserMenu 
              :is-authenticated="authStore.isAuthenticated"
              :is-admin="authStore.isAdmin"
              @logout="logout"
            />
            
            <!-- Cart icon -->
            <CartIcon :count="cartItemCount" />
          </div>
        </div>
      </div>
    </div>

    <!-- Spacer to prevent content from hiding under fixed header -->
    <div class="header-spacer"></div>

    <!-- Categories menu (not fixed) -->
    <div class="categories-wrapper">
      <CategoryMenu :initial-categories="categories" />
    </div>

    <!-- Cart Modal -->
    <CartModal />
  </header>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '../../../stores/auth';
import { useCartStore } from '../../../stores/cart';
import { useToast } from 'vue-toastification';
import 'vue-toastification/dist/index.css';

// Subcomponents
import SearchBar from './SearchBar.vue';
import UserMenu from './UserMenu.vue';
import CartIcon from './CartIcon.vue';
import CategoryMenu from './CategoryMenu.vue';
import CartModal from '../Cart/CartModal.vue';
import { categoryService } from '../../../services/categoryService';

// Stores and helper functions
const router = useRouter();
const authStore = useAuthStore();
const cartStore = useCartStore();
const toast = useToast();

// Categories
const categories = ref([]);

// Cart counter - get from cartStore
const cartItemCount = computed(() => cartStore.totalItems);

// Listen for cart changes
watch(() => cartStore.items, () => {
  // Update counter when cart changes
  cartStore.saveCart();
}, { deep: true });

// Fetch categories
const fetchCategories = async () => {
  try {
    // Get main categories (categories with parent=null)
    const result = await categoryService.getMainCategories();
    // Only add main categories (parent = null)
    const mainCategories = result.filter(cat => cat.parent === null);
    categories.value = mainCategories;
  } catch (error) {
    console.error('Error loading categories:', error);
    categories.value = [];
  }
};

// When search is completed
const handleSearchCompleted = () => {
  console.log('Search completed');
};

// User logout process
const logout = () => {
  authStore.logout();
  router.push('/login');
  toast.success('Successfully logged out');
};

// Click check
const checkOutsideClick = (event) => {
  // For propagation to subcomponents
  console.log('Header click check');
};

// When page loads, fetch categories
onMounted(() => {
  fetchCategories();
  
  // Listen for cart changes
  window.addEventListener('storage', (event) => {
    if (event.key === 'cart') {
      // No need for this notification, cart store already shows notification
    }
  });
});
</script>

<style scoped>
.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 1000;
}

.header-spacer {
  height: 64px; /* Equal to the height of the fixed header */
}

.categories-wrapper {
  position: relative;
  z-index: 40;
}
</style> 