<!-- ProductBreadcrumb.vue - Top navigation component -->
<template>
  <nav class="flex" aria-label="Breadcrumb">
    <ol class="inline-flex items-center space-x-1 md:space-x-3">
      <li class="inline-flex items-center">
        <RouterLink to="/" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-indigo-600">
          <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
          </svg>
          Home
        </RouterLink>
      </li>
      
      <!-- Category breadcrumb -->
      <li v-if="currentCategory && (currentCategory.name || (typeof currentCategory === 'object' && currentCategory._id))">
        <div class="flex items-center">
          <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
          </svg>
          <RouterLink 
            :to="getCategoryUrl(currentCategory)" 
            class="ml-1 text-sm font-medium text-gray-700 hover:text-indigo-600 md:ml-2"
          >
            {{ currentCategory.name || 'Category' }}
          </RouterLink>
        </div>
      </li>
      
      <!-- Subcategory breadcrumb -->
      <li v-if="currentSubcategory && (currentSubcategory.name || (typeof currentSubcategory === 'object' && currentSubcategory._id))">
        <div class="flex items-center">
          <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
          </svg>
          <RouterLink
            :to="getSubcategoryUrl(currentCategory, currentSubcategory)"
            class="ml-1 text-sm font-medium text-indigo-600 md:ml-2"
          >
            {{ currentSubcategory.name || 'Subcategory' }}
          </RouterLink>
        </div>
      </li>
      
      <!-- Collection breadcrumb -->
      <li v-if="currentCollection && (currentCollection.name || (typeof currentCollection === 'object' && currentCollection._id))">
        <div class="flex items-center">
          <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
          </svg>
          <RouterLink
            :to="getCollectionUrl(currentCollection)"
            class="ml-1 text-sm font-medium text-indigo-600 md:ml-2"
          >
            {{ currentCollection.name || 'Collection' }}
          </RouterLink>
        </div>
      </li>
      
      <!-- Product name (if exists) -->
      <li v-if="productName">
        <div class="flex items-center">
          <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
          </svg>
          <span class="ml-1 text-sm font-medium text-gray-700 md:ml-2">
            {{ productName }}
          </span>
        </div>
      </li>
    </ol>
  </nav>
</template>

<script setup>
defineProps({
  currentCategory: {
    type: Object,
    default: () => ({})
  },
  currentSubcategory: {
    type: Object,
    default: () => ({})
  },
  currentCollection: {
    type: Object,
    default: () => ({})
  },
  productName: {
    type: String,
    default: ''
  }
});

// Helper functions
// Helper function to make Turkish characters URL-friendly
function slugify(text) {
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

function getCategoryUrl(category) {
  if (!category) return '/products';
  
  // Category can be a string (if only ID is sent)
  if (typeof category === 'string') {
    return `/category/${category}`;
  }
  
  // When category is an object
  if (typeof category === 'object') {
    // Use slug if available
    if (category.slug) {
      return `/category/${category.slug}`;
    }
    
    // Convert name to slug
    if (category.name) {
      return `/category/${slugify(category.name)}`;
    }
    
    // Use _id if available
    if (category._id) {
      return `/category/${category._id}`;
    }
  }
  
  // If no valid value is found, redirect to product list
  return '/products';
}

function getSubcategoryUrl(category, subcategory) {
  if (!category || !subcategory) return '/products';
  
  let categoryPath = '';
  let subcategoryPath = '';
  
  // Determine main category path
  if (typeof category === 'string') {
    categoryPath = category;
  } else if (category.slug) {
    categoryPath = category.slug;
  } else if (category.name) {
    categoryPath = slugify(category.name);
  } else if (category._id) {
    categoryPath = category._id;
  } else {
    return '/products';
  }
  
  // Determine subcategory path
  if (typeof subcategory === 'string') {
    subcategoryPath = subcategory;
  } else if (subcategory.slug) {
    subcategoryPath = subcategory.slug;
  } else if (subcategory.name) {
    subcategoryPath = slugify(subcategory.name);
  } else if (subcategory._id) {
    subcategoryPath = subcategory._id;
  } else {
    return '/products';
  }
  
  return `/category/${categoryPath}/${subcategoryPath}`;
}

function getCollectionUrl(collection) {
  if (!collection) return '/collections';
  
  // Collection can be a string (if only ID or slug is sent)
  if (typeof collection === 'string') {
    return `/collections/${collection}`;
  }
  
  // When collection is an object
  if (typeof collection === 'object') {
    // Use slug if available
    if (collection.slug) {
      return `/collections/${collection.slug}`;
    }
    
    // Convert name to slug
    if (collection.name) {
      return `/collections/${slugify(collection.name)}`;
    }
    
    // Use _id if available
    if (collection._id) {
      return `/collections/${collection._id}`;
    }
  }
  
  // If no valid value is found, redirect to collections page
  return '/collections';
}
</script> 