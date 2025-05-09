<!-- ProductFilters.vue - Product filtering component -->
<template>
  <div class="bg-white rounded-lg shadow p-5 sticky top-6 border border-gray-100">
    <h2 class="text-lg font-semibold text-gray-800 mb-5 pb-3 border-b flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
      </svg>
      Filters
    </h2>

    <!-- Price Range -->
    <div class="mb-6">
      <h3 class="font-medium text-gray-700 mb-3 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Price Range
      </h3>
      <div class="space-y-3">
        <div class="flex items-center space-x-3">
          <input
            v-model.number="filters.minPrice"
            type="number"
            min="0"
            placeholder="Min"
            class="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
            @keypress="validateNumberInput"
          />
          <span>-</span>
          <input
            v-model.number="filters.maxPrice"
            type="number"
            min="0"
            placeholder="Max"
            class="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
            @keypress="validateNumberInput"
          />
        </div>
      </div>
    </div>
    
    <!-- Categories -->
    <div class="mb-6" v-if="showCategories && categories.length > 0">
      <h3 class="font-medium text-gray-700 mb-3 flex items-center justify-between">
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          Categories <span class="text-xs text-gray-500 ml-1">({{ categories.length }})</span>
        </div>
      </h3>
      
      <!-- Category tree component -->
      <CategoryTree 
        :categories="categories" 
        :selectedCategories="filters.categories"
        @select-category="selectCategory"
      />
    </div>

    <!-- Apply filters button -->
    <button 
      type="button"
      @click="applyFilters"
      class="w-full bg-indigo-500 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-indigo-600 transition-all duration-200 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mt-2"
    >
      <span class="flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        Apply Filters
      </span>
    </button>
    
    <!-- Clear filters button -->
    <button 
      v-if="hasActiveFilters"
      type="button"
      @click="clearFilters"
      class="w-full mt-2 border border-gray-300 text-gray-600 bg-white py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    >
      <span class="flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        Clear Filters
      </span>
    </button>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import CategoryTree from './CategoryTree.vue';

const props = defineProps({
  categories: {
    type: Array,
    default: () => []
  },
  initialFilters: {
    type: Object,
    default: () => ({
      minPrice: '',
      maxPrice: '',
      categories: [],
      subcategories: [],
      brands: [],
      ratings: []
    })
  },
  products: {
    type: Array,
    default: () => []
  },
  showCategories: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['apply-filters', 'clear-filters', 'select-category']);

// Filters
const filters = reactive({
  minPrice: props.initialFilters.minPrice || '',
  maxPrice: props.initialFilters.maxPrice || '',
  categories: [...(props.initialFilters.categories || [])],
  subcategories: [...(props.initialFilters.subcategories || [])],
  brands: [...(props.initialFilters.brands || [])],
  ratings: [...(props.initialFilters.ratings || [])]
});

// Check if filters are active
const hasActiveFilters = computed(() => {
  return filters.minPrice || 
         filters.maxPrice || 
         filters.categories.length > 0 || 
         filters.subcategories.length > 0 || 
         filters.brands.length > 0 || 
         filters.ratings.length > 0;
});

// Methods
function validateNumberInput(event) {
  // Allow only numbers, backspace, delete, tab, and arrow keys
  const keyCode = event.keyCode ? event.keyCode : event.which;
  
  // Numbers (0-9): 48-57, numpad 0-9: 96-105
  // Backspace: 8, Tab: 9, Enter: 13, Delete: 46
  // Arrow keys: left: 37, up: 38, right: 39, down: 40
  // -: 45, .: 46 (decimal separator)
  const allowedKeys = [8, 9, 13, 37, 38, 39, 40, 46];
  
  // If not a number and not one of the allowed keys
  if ((keyCode < 48 || keyCode > 57) && (keyCode < 96 || keyCode > 105) && !allowedKeys.includes(keyCode)) {
    event.preventDefault();
  }
}

function applyFilters() {
  // Pass applied filters to parent component
  emit('apply-filters', { ...filters });
}

function clearFilters() {
  // Reset filters
  filters.minPrice = '';
  filters.maxPrice = '';
  filters.subcategories = [];
  filters.brands = [];
  filters.ratings = [];
  
  // Notify parent component about reset
  emit('clear-filters');
}

function selectCategory(categoryId) {
  // Check for parent/child category relationship
  const selectedCategory = props.categories.find(cat => cat._id === categoryId);
  
  if (!selectedCategory) {
    // If category not found, just send ID
    emit('select-category', categoryId);
    return;
  }
  
  // Check if it's a subcategory
  if (selectedCategory.parent) {
    // Find parent category object
    let parentCategory = null;
    
    if (typeof selectedCategory.parent === 'object' && selectedCategory.parent._id) {
      // If parent info is in an object, use directly
      parentCategory = selectedCategory.parent;
    } else if (typeof selectedCategory.parent === 'string') {
      // If parent ID is a string, find it in categories
      parentCategory = props.categories.find(cat => cat._id === selectedCategory.parent);
    }
    
    if (parentCategory) {
      // Send parent ID and parent info if found
      emit('select-category', {
        categoryId: selectedCategory._id,
        isSubcategory: true,
        parentId: parentCategory._id,
        parentSlug: parentCategory.slug,
        childSlug: selectedCategory.slug
      });
    } else {
      // If parent not found, act as normal category
      emit('select-category', categoryId);
    }
  } else {
    // If it's a main category, act normally
    emit('select-category', categoryId);
  }
}
</script> 