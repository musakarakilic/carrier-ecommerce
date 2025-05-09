<template>
  <div class="bg-gray-100 shadow-inner">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Loading -->
      <div v-if="loading" class="py-2 flex items-center h-12">
        <div class="spinner-sm mr-2"></div>
        <span class="text-gray-500 text-sm">Loading categories...</span>
      </div>
      
      <!-- Loaded -->
      <nav v-else class="category-nav">
        <ul class="flex h-12 items-center">
          <!-- No categories found -->
          <li v-if="categories.length === 0" class="text-gray-500 text-sm py-3">
            
          </li>
          
          <!-- Categories -->
          <li 
            v-for="category in categories" 
            :key="category._id"
            class="category-item" 
            @mouseenter="openDropdown(category._id)" 
            @mouseleave="setMouseOverDropdown(false); closeDropdown(category._id)"
          >
            <RouterLink 
              :to="`/category/${category.slug || category._id}`"
              class="text-gray-700 hover:text-indigo-600 font-medium text-sm transition-colors px-4 py-3 flex items-center"
              :class="{ 'text-indigo-600': isDropdownOpen(category._id) }"
              @click="closeAllDropdowns()"
            >
              {{ category.name }}
              <svg 
                class="ml-1 h-4 w-4 transition-transform duration-200" 
                :class="{ 'rotate-180': isDropdownOpen(category._id) }"
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </RouterLink>
          </li>
        </ul>
        
        <!-- Dropdown Menu Container -->
        <div class="category-dropdown-wrapper">
          <div v-for="category in categories" :key="`dropdown-${category._id}`">
            <div 
              v-if="isDropdownOpen(category._id)" 
              class="category-dropdown"
              @mouseenter="setMouseOverDropdown(true)"
              @mouseleave="setMouseOverDropdown(false); closeDropdown(category._id)"
            >
              <div class="dropdown-inner">
                <div class="subcategories-container">
                  <!-- Left side - Subcategories -->
                  <div class="categories-list">
                    <div class="grid grid-cols-3 gap-5">
                      <div v-for="(subcat, index) in getSubcategories(category._id)" :key="index">
                        <RouterLink 
                          :to="`/category/${category.slug || category._id}/${subcat.slug || subcat._id}`" 
                          class="category-link"
                          @click="closeAllDropdowns()"
                        >
                          <span class="category-name">{{ subcat.name }}</span>
                        </RouterLink>
                      </div>
                    </div>
                    <!-- 
                    <div class="tags-container">
                      <RouterLink v-for="(tag, index) in getPopularTags(category.name)" :key="index" 
                        class="tag-item"
                        :to="`/tag/${tag.replace(/\s+/g, '-').toLowerCase()}`"
                        @click="closeAllDropdowns()"
                      >
                        {{ tag }}
                      </RouterLink>
                    </div>
                    -->
                  </div>
                  
                  <!-- Safe Hover Bridge -->
                  <div class="hover-bridge" @mouseenter="setMouseOverDropdown(true)"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { categoryService } from '../../../services/categoryService';
import { productService } from '../../../services/productService';

// Props
const props = defineProps({
  // Used if categories are provided during initial loading
  initialCategories: {
    type: Array,
    default: () => []
  }
});

// Categories
const categories = ref(props.initialCategories || []);
const loadingCategories = ref(true);
const openDropdowns = ref({});
const categoryProducts = ref({});
const subcategories = ref({}); // For storing subcategories

// Dropdown control and hover state
const mouseOverDropdown = ref(false);
const hoverTimeout = ref(null);
const openingTimeout = ref(null);
const hoveredCategoryId = ref(null);
const hoverDelay = 150; // Reduced from 200ms
const openDelay = 100; // Reduced from 300ms

// Preload flag
const categoriesPreloaded = ref(false);

// Preload all categories and subcategories
const preloadAllData = async () => {
  if (categoriesPreloaded.value) return;
  
  try {
    // Load main categories if not already loaded
    if (categories.value.length === 0) {
      const result = await categoryService.getMainCategories();
      categories.value = result.filter(cat => cat.parent === null);
    }
    
    // Preload subcategories for all main categories
    await Promise.all(categories.value.map(async (category) => {
      if (!subcategories.value[category._id]) {
        const result = await categoryService.getSubcategories(category._id);
        subcategories.value[category._id] = result.map(subcat => ({
          _id: subcat._id,
          name: subcat.name,
          id: subcat._id,
          slug: subcat.slug
        }));
      }
    }));
    
    categoriesPreloaded.value = true;
  } catch (error) {
    console.error('Error preloading categories:', error);
  } finally {
    loadingCategories.value = false;
  }
};

// Modified openDropdown function
const openDropdown = async (categoryId) => {
  if (openingTimeout.value) {
    clearTimeout(openingTimeout.value);
    openingTimeout.value = null;
  }
  
  if (hoverTimeout.value) {
    clearTimeout(hoverTimeout.value);
    hoverTimeout.value = null;
  }
  
  hoveredCategoryId.value = categoryId;
  
  // Since data is preloaded, we can open dropdown faster
  openingTimeout.value = setTimeout(() => {
    Object.keys(openDropdowns.value).forEach(key => {
      openDropdowns.value[key] = false;
    });
    
    openDropdowns.value[categoryId] = true;
    mouseOverDropdown.value = true;
    
    // Load products in background if needed
    if (!categoryProducts.value[categoryId]) {
      fetchCategoryProducts(categoryId);
    }
    
    openingTimeout.value = null;
  }, openDelay);
};

const setMouseOverDropdown = (status) => {
  mouseOverDropdown.value = status;
  
  // If user is not hovering over the dropdown and closing timeout is not active, start
  if (!status && !hoverTimeout.value && hoveredCategoryId.value) {
    startCloseTimeout(hoveredCategoryId.value);
  } else if (status && hoverTimeout.value) {
    // If hovered again and timeout is active, clear it
    clearTimeout(hoverTimeout.value);
    hoverTimeout.value = null;
  }
};

const startCloseTimeout = (categoryId) => {
  if (hoverTimeout.value) clearTimeout(hoverTimeout.value);
  
  hoverTimeout.value = setTimeout(() => {
    // If user is not hovering over the dropdown, close it
    if (!mouseOverDropdown.value) {
      openDropdowns.value[categoryId] = false;
      hoveredCategoryId.value = null;
    }
    hoverTimeout.value = null;
  }, hoverDelay);
};

// New function to close all dropdowns
const closeAllDropdowns = () => {
  Object.keys(openDropdowns.value).forEach(key => {
    openDropdowns.value[key] = false;
  });
  mouseOverDropdown.value = false;
  hoveredCategoryId.value = null;
  
  // Clear all timeouts
  if (hoverTimeout.value) {
    clearTimeout(hoverTimeout.value);
    hoverTimeout.value = null;
  }
  
  if (openingTimeout.value) {
    clearTimeout(openingTimeout.value);
    openingTimeout.value = null;
  }
};

const closeDropdown = (categoryId) => {
  
  // Cancel open request if it exists
  if (openingTimeout.value) {
    clearTimeout(openingTimeout.value);
    openingTimeout.value = null;
  }
  
  // Start closing timeout
  startCloseTimeout(categoryId);
};

const isDropdownOpen = (categoryId) => {
  return openDropdowns.value[categoryId] === true;
};

// Get category products
const fetchCategoryProducts = async (categoryId) => {
  try {
    // Get category products from actual API
    const result = await productService.getAll({ 
      category: categoryId,
      limit: 6
    });
    categoryProducts.value[categoryId] = result.products || [];
  } catch (error) {
    console.error(`Error loading products for category ${categoryId}:`, error);
    categoryProducts.value[categoryId] = [];
  }
};

// Get subcategories
const getSubcategories = (categoryId) => {
  if (!categoryId) {
    console.warn('getSubcategories function called with invalid categoryId:', categoryId);
    return [];
  }
  
  // Use data from API
  if (subcategories.value[categoryId] && subcategories.value[categoryId].length > 0) {
    return subcategories.value[categoryId];
  }
  
  return [];
};

// Modified onMounted
onMounted(() => {
  // Preload all data when component mounts
  preloadAllData();
});
</script>

<style scoped>
/* Scrollbar'ı gizle */
.overflow-x-auto::-webkit-scrollbar {
  display: none;
}

.spinner-sm {
  border: 2px solid rgba(99, 102, 241, 0.1);
  border-top-color: #6366f1;
  border-radius: 50%;
  width: 1rem;
  height: 1rem;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Kategori nav ve dropdown stilleri */
.category-nav {
  position: relative;
  z-index: 30;
}

.category-item {
  position: relative;
  cursor: pointer;
  z-index: 35;
}

.category-dropdown-wrapper {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  z-index: 25;
}

.category-dropdown {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 320px;
  background-color: #fff;
  z-index: 20;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border-top: 1px solid rgba(229, 231, 235, 0.5);
  border-bottom: 1px solid rgba(229, 231, 235, 0.5);
  overflow: hidden;
  padding-bottom: 1rem;
  backdrop-filter: blur(4px);
  opacity: 0;
  animation: fadeInStatic 0.25s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  margin-top: -1px;
}

@keyframes fadeInStatic {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.dropdown-inner {
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  padding: 1.75rem 2rem;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.subcategories-container {
  display: flex;
  gap: 1rem;
  height: 100%;
}

.categories-list {
  flex: 1;
  overflow-y: auto;
  padding-right: 1rem;
  width: 100%;
}

.highlighted-product {
  display: none; /* Ürün önizleme bölümünü gizle */
}

.category-link {
  display: flex;
  align-items: center;
  padding: 0.625rem 0.75rem;
  border-radius: 0.5rem;
  transition: all 0.2s;
  font-weight: 500;
  color: #4b5563;
  position: relative;
  overflow: hidden;
}

.category-link:hover {
  color: #4f46e5;
  background-color: rgba(238, 242, 255, 0.8);
  transform: translateX(3px);
}

.category-link:before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 3px;
  background-color: #4f46e5;
  transform: scaleY(0);
  transition: transform 0.2s;
  border-radius: 0 2px 2px 0;
}

.category-link:hover:before {
  transform: scaleY(1);
}

.category-name {
  flex-grow: 1;
  font-size: 0.9rem;
}

.category-count {
  font-size: 0.75rem;
  color: #9ca3af;
  font-weight: 400;
  background-color: rgba(243, 244, 246, 0.7);
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.category-link:hover .category-count {
  background-color: rgba(224, 231, 255, 0.7);
  color: #6366f1;
}
/*
.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid rgba(229, 231, 235, 0.5);
}

.tag-item {
  font-size: 0.75rem;
  font-weight: 500;
  color: #4b5563;
  background-color: #f3f4f6;
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  border: 1px solid transparent;
}

.tag-item:hover {
  background-color: #e0e7ff;
  color: #4f46e5;
  border-color: #c7d2fe;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(79, 70, 229, 0.1);
}
*/
.product-card {
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
  background-color: white;
  transition: all 0.3s;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(229, 231, 235, 0.6);
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.05);
  border-color: rgba(209, 213, 219, 0.8);
}

.product-image {
  position: relative;
  height: 150px;
  overflow: hidden;
  background-color: #f9fafb;
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.product-card:hover .product-img {
  transform: scale(1.08);
}

.product-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: rgba(79, 70, 229, 0.9);
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  z-index: 1;
}

.product-info {
  padding: 1rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-title {
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
  line-height: 1.3;
}

.product-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
}

.product-category {
  font-size: 0.75rem;
  color: #6366f1;
  font-weight: 500;
}

.product-price {
  font-weight: 700;
  color: #4f46e5;
  font-size: 0.95rem;
}

/* Hover köprüsü stil */
.hover-bridge {
  width: 30px; /* Köprünün genişliği */
  height: 100%;
  position: relative;
  z-index: 25;
}

/* Responsive stil ayarlamaları */
@media (max-width: 768px) {
  .subcategories-container {
    flex-direction: column;
    height: auto;
  }
  
  .category-dropdown {
    height: auto;
    max-height: 80vh;
    overflow-y: auto;
  }
}

@media (min-width: 1280px) {
  .category-dropdown {
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;
    border-radius: 0 0 12px 12px;
    left: 50%;
    transform: translateX(-50%);
  }
  
  .categories-list {
    width: 100%;
  }
}
</style> 