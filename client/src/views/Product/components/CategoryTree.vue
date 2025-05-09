<!-- CategoryTree.vue - Category tree component -->
<template>
  <div>
    <!-- Category search -->
    <div class="mb-2">
      <input
        v-model="categorySearchQuery"
        type="text"
        placeholder="Search category..."
        class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
      />
    </div>
    
    <!-- Hierarchical category list -->
    <div class="max-h-64 overflow-y-auto custom-scrollbar">
      <ul class="category-tree">
        <template v-for="category in filteredCategories" :key="category._id">
          <!-- Main category -->
          <li class="category-item" v-if="!category.parent">
            <div 
              class="category-row"
              :class="{'category-active': isCategorySelected(category._id)}"
              @click="toggleCategoryExpand(category._id)"
            >
              <div 
                class="category-toggle"
                v-if="hasSubcategories(category._id)"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  class="h-4 w-4 transition-transform duration-200"
                  :class="{'rotate-90': expandedCategories[category._id]}"
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="category-label" @click.stop="onCategorySelect(category._id, $event)">
                {{ category.name }}
              </div>
            </div>
              
            <!-- Subcategories (1st level) -->
            <div v-if="expandedCategories[category._id] && hasSubcategories(category._id)">
              <ul class="subcategory-list">
                <li 
                  v-for="subcat in getDirectSubcategories(category._id)" 
                  :key="subcat._id"
                  class="subcategory-item"
                >
                  <div 
                    class="category-row pl-6"
                    :class="{'category-active': isCategorySelected(subcat._id)}"
                  >
                    <div 
                      class="category-toggle"
                      v-if="hasSubcategories(subcat._id)"
                      @click="toggleCategoryExpand(subcat._id)"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        class="h-4 w-4 transition-transform duration-200"
                        :class="{'rotate-90': expandedCategories[subcat._id]}"
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div class="category-label" @click.stop="onCategorySelect(subcat._id, $event)">
                      {{ subcat.name }}
                    </div>
                  </div>
                  
                  <!-- Subcategories (2nd level) -->
                  <div v-if="expandedCategories[subcat._id] && hasSubcategories(subcat._id)">
                    <ul class="subcategory-list">
                      <li 
                        v-for="subsubcat in getDirectSubcategories(subcat._id)" 
                        :key="subsubcat._id"
                        class="subcategory-item"
                      >
                        <div 
                          class="category-row pl-12"
                          :class="{'category-active': isCategorySelected(subsubcat._id)}"
                          @click.stop="onCategorySelect(subsubcat._id, $event)"
                        >
                          <div class="category-label">
                            {{ subsubcat.name }}
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';

const props = defineProps({
  categories: {
    type: Array,
    default: () => []
  },
  selectedCategories: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['select-category']);

// Category search
const categorySearchQuery = ref('');

// Category tree for reactive state
const expandedCategories = reactive({});

// Calculate filtered categories
const filteredCategories = computed(() => {
  if (!props.categories || props.categories.length === 0) return [];
  
  if (!categorySearchQuery.value) return props.categories;
  
  const query = categorySearchQuery.value.toLowerCase().trim();
  return props.categories.filter(cat => 
    cat.name.toLowerCase().includes(query)
  );
});

// Does a category have subcategories?
function hasSubcategories(categoryId) {
  if (!categoryId) {
    console.warn('hasSubcategories: Invalid category ID');
    return false;
  }
  
  // Find categories that have a parent with the given ID
  const subcats = props.categories.filter(cat => {
    if (!cat.parent) return false;
    
    // Parent can be a string (ID)
    if (typeof cat.parent === 'string') {
      return cat.parent === categoryId;
    }
    
    // Parent can be an object
    if (typeof cat.parent === 'object' && cat.parent !== null) {
      return cat.parent._id === categoryId;
    }
    
    return false;
  });
  
  const hasSubcats = subcats.length > 0;
  console.log(`Subcategories for ${categoryId}:`, hasSubcats ? subcats.map(c => c.name) : 'None');
  return hasSubcats;
}

// Get direct subcategories of a category
function getDirectSubcategories(parentId) {
  if (!parentId) {
    console.warn('getDirectSubcategories: Invalid parent ID');
    return [];
  }
  
  const subcats = props.categories.filter(cat => {
    if (!cat.parent) return false;
    
    // Parent can be a string (ID)
    if (typeof cat.parent === 'string') {
      return cat.parent === parentId;
    }
    
    // Parent can be an object
    if (typeof cat.parent === 'object' && cat.parent !== null) {
      return cat.parent._id === parentId;
    }
    
    return false;
  });
  
  console.log(`Direct subcategories found for ${parentId}:`, subcats.map(c => c.name));
  return subcats;
}

// Category expand/collapse toggle
function toggleCategoryExpand(categoryId) {
  console.log('Category expand/collapse:', categoryId);
  
  // Check if it has children
  const hasChildren = hasSubcategories(categoryId);
  if (!hasChildren) {
    console.log(`${categoryId} does not have children, cannot expand`);
    return;
  }
  
  // If not previously set, set to false
  if (expandedCategories[categoryId] === undefined) {
    expandedCategories[categoryId] = false;
  }
  
  // Toggle
  expandedCategories[categoryId] = !expandedCategories[categoryId];
  console.log(`${categoryId} category status:`, expandedCategories[categoryId] ? 'Expanded' : 'Collapsed');
}

// Is a category selected?
function isCategorySelected(categoryId) {
  return props.selectedCategories.includes(categoryId);
}

// Category selected
function onCategorySelect(categoryId, event) {
  if (event) {
    event.stopPropagation();
  }
  
  console.log('onCategorySelect called:', categoryId);
  
  // Find category object
  const category = props.categories.find(cat => cat._id === categoryId);
  
  if (!category) {
    console.error('Category not found:', categoryId);
    emit('select-category', categoryId);
    return;
  }
  
  console.log('Selected category:', category);
  
  // If it's a subcategory, send parent information
  if (category.parent) {
    // Get parent category
    let parentCategory = null;
    
    if (typeof category.parent === 'object' && category.parent._id) {
      parentCategory = category.parent;
    } else if (typeof category.parent === 'string') {
      parentCategory = props.categories.find(cat => cat._id === category.parent);
    }
    
    if (parentCategory) {
      console.log('Parent category:', parentCategory);
      
      // Auto-generate slug for main category
      const parentSlug = parentCategory.slug || slugifyText(parentCategory.name);
      const childSlug = category.slug || slugifyText(category.name);
      
      console.log('Parent slug details:', {
        originalSlug: parentCategory.slug,
        generatedSlug: parentSlug,
        type: typeof parentSlug,
        isEmpty: parentSlug.trim() === '',
        hasValidSlug: true
      });
      
      console.log('Child slug details:', {
        originalSlug: category.slug,
        generatedSlug: childSlug,
        type: typeof childSlug,
        isEmpty: childSlug.trim() === '',
        hasValidSlug: true
      });
      
      emit('select-category', {
        categoryId: category._id,
        isSubcategory: true,
        parentId: parentCategory._id,
        parentSlug: parentSlug,
        childSlug: childSlug
      });
    } else {
      console.warn('Parent category not found, sending as normal category');
      emit('select-category', categoryId);
    }
  } else {
    // If it's a main category, send directly with ID and slug information
    const hasSlug = category.slug && 
                   typeof category.slug === 'string' && 
                   category.slug.trim() !== '' && 
                   category.slug !== category._id;
    
    if (hasSlug) {
      console.log('Sending main category with slug:', category.slug);
      emit('select-category', {
        categoryId: category._id,
        categorySlug: category.slug,
        isSubcategory: false
      });
    } else {
      console.log('Sending main category with ID:', category._id);
      emit('select-category', categoryId);
    }
  }
}

// Helper function to make Turkish characters URL-friendly
function slugifyText(text) {
  if (!text) return '';
  
  // Replace Turkish characters
  const turkishChars = {
    'ı': 'i', 'ğ': 'g', 'ü': 'u', 'ş': 's', 'ö': 'o', 'ç': 'c',
    'İ': 'I', 'Ğ': 'G', 'Ü': 'U', 'Ş': 'S', 'Ö': 'O', 'Ç': 'C'
  };
  
  let result = text.toLowerCase();
  
  // Replace Turkish characters
  for (const [from, to] of Object.entries(turkishChars)) {
    result = result.replace(new RegExp(from, 'g'), to);
  }
  
  // Remove other special characters, replace spaces with hyphens
  return result
    .replace(/[^a-z0-9\s-]/g, '') // Only letters, numbers, spaces and hyphens
    .replace(/\s+/g, '-')         // Replace spaces with hyphens
    .replace(/-+/g, '-')          // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '');     // Remove leading and trailing hyphens
}
</script>

<style scoped>
/* Category tree styles */
.category-tree {
  width: 100%;
}

.category-item {
  margin-bottom: 0;
}

.subcategory-item {
  margin-bottom: 0;
}

.category-row {
  display: flex;
  align-items: center;
  padding: 8px 8px;
  border-radius: 0;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 1px solid #f3f4f6;
}

.category-row:hover {
  background-color: #f9fafb;
}

.category-active {
  font-weight: 500;
}

.category-active .category-label {
  color: #4F46E5;
}

.category-toggle {
  margin-right: 8px;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9CA3AF;
}

.category-row:hover .category-toggle {
  color: #4F46E5;
}

.category-label {
  flex-grow: 1;
  font-size: 0.875rem;
  color: #374151;
  cursor: pointer;
  padding: 2px 0;
}

.category-label:hover {
  color: #4F46E5;
}

.subcategory-list {
  width: 100%;
  margin-top: 0;
}

/* Nested category styles */
.pl-6 {
  padding-left: 1.5rem;
}

.pl-12 {
  padding-left: 3rem;
}

/* Custom scroll bar */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #94a3b8;
}
</style> 