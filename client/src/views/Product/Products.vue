<!-- ProductsView.vue - Main product listing page (restructured) -->
<template>
  <ProductLayout 
    :loading="loading.main" 
    :error="error.main" 
    :totalProducts="totalProducts"
  >
    <!-- Breadcrumb -->
    <template #breadcrumb>
      <ProductBreadcrumb 
        :currentCategory="currentCategory"
        :currentSubcategory="currentSubcategory"
        :currentCollection="currentCollection"
      />
    </template>

    <!-- Filters -->
    <template #sidebar>
      <ProductFilters 
        :categories="categories"
        :initialFilters="filters"
        :products="products"
        :showCategories="route.name !== 'collection'"
        @apply-filters="applyFilters"
        @clear-filters="clearFilters"
        @select-category="selectCategory"
      />
    </template>

    <!-- Sorting Section -->
    <template #sorting>
      <ProductSorting 
        :sorting="sorting"
        @apply-sorting="applySorting"
      />
    </template>

    <!-- Product List -->
    <template #content>
      <ProductList 
        :products="products"
        :loading="loading.products"
        :loadingMore="loading.more"
        :error="error.products"
        @retry="fetchProducts"
        @clear-filters="clearFilters"
        @add-to-cart="addToCart"
      />
    </template>

    <!-- Pagination -->
    <template #pagination>
      <ProductPagination 
        :hasMoreProducts="hasMoreProducts"
        :loading="loading.more"
        :products="products"
        @load-more="loadMoreProducts"
      />
    </template>
  </ProductLayout>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';

// Sub-components
import ProductLayout from '@/layouts/ProductLayout.vue';
import ProductBreadcrumb from './components/ProductBreadcrumb.vue';
import ProductFilters from './components/ProductFilters.vue';
import ProductSorting from './components/ProductSorting.vue';
import ProductList from './components/ProductList.vue';
import ProductPagination from './components/ProductPagination.vue';

// Composables
import { useProductFetching } from './composables/useProductFetching';
import { useProductFilters } from './composables/useProductFilters';
import { useRouteIntegration } from './composables/useRouteIntegration';

// State management
const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();

// Use composables
const { 
  products, totalProducts, totalPages, currentPage, pageSize, loading, error, hasMoreProducts,
  fetchProducts, fetchCollectionProducts, fetchCategory, fetchCollection, fetchAllCategories,
  loadMoreProducts: loadMoreProductsApi, loadMoreCollectionProducts 
} = useProductFetching();

const { 
  filters, sorting, hasActiveFilters, updateUrlWithFilters, updateFiltersFromUrl,
  resetAllFilters, clearFilters, getApiParams, updateCategoryFilters, selectCategory: selectCategoryFilter
} = useProductFilters();

const { 
  viewType, getCategoryUrl, getSubcategoryUrl, getCollectionUrl,
  checkRouteChange, updateLastViewedPage,
  navigateToCategory, navigateToSubcategory, navigateToCollection 
} = useRouteIntegration();

// Reactive state
const currentCategory = ref({});
const currentSubcategory = ref({});
const currentCollection = ref({});
const categories = ref([]);
const subcategories = ref([]);

// Page title and description
const pageTitle = computed(() => {
  if (viewType.value === 'category') return currentCategory.value.name || 'Category';
  if (viewType.value === 'subcategory') return currentSubcategory.value.name || 'Subcategory';
  if (viewType.value === 'collection') return currentCollection.value.name || 'Collection';
  return 'Products';
});

// Data loading functions
async function fetchData() {
  loading.main = true;
  error.main = null;
  
  // Clear existing data
  products.value = [];
  totalProducts.value = 0;
  currentPage.value = 1;
  
  try {
    console.log('FetchData started, route:', route.name, route.params);
    console.log('Current viewType:', viewType.value);
    
    // Load all categories
    await fetchCategoriesData();
    
    // Check if it's a subcategory page - for ID or slug based routes
    const isSubcategoryView = route.params.subcategoryId !== undefined || 
                             (route.name === 'subcategoryBySlug' && route.params.subcategorySlug !== undefined);
    
    // Load the correct data and clean up based on view type
    if (isSubcategoryView) {
      console.log('Fetching subcategory data');
      await fetchSubcategoryData();
      
      // Properly set filters for subcategory view and avoid reloading filters from URL
      const apiParams = getApiParams();
      console.log('API parameters for subcategory:', apiParams);
      await fetchProducts(apiParams);
      return; // Skip other steps in subcategory case and directly make API call
    } else if (route.name === 'category' || route.name === 'categoryBySlug') {
      console.log('Fetching category data');
      // Ensure subcategory is cleared when navigating from subcategory to main category page
      currentSubcategory.value = {};
      await fetchCategoryData();
    } else if (route.name === 'collection') {
      console.log('Fetching collection data');
      // Clear category and subcategory information
      currentCategory.value = {};
      currentSubcategory.value = {};
      await fetchCollectionData();
    } else {
      // Clear category information for home page or other pages
      currentCategory.value = {};
      currentSubcategory.value = {};
    }
    
    // Check route change
    if (checkRouteChange()) {
      resetAllFilters(false); // Reset without updating URL
    } else {
      updateFiltersFromUrl(); // Update filters from URL
    }
    
    // Update last viewed page
    updateLastViewedPage();
    
    // Load products based on page type
    const apiParams = getApiParams();
    console.log('API parameters for products:', apiParams);
    
    if (route.name === 'collection') {
      console.log('Fetching collection products');
      await fetchCollectionProducts(currentCollection.value.slug, apiParams);
    } else {
      console.log('Performing normal product search');
      await fetchProducts(apiParams);
    }
    
    // Check results after API request
    console.log(`Number of products fetched: ${products.value.length}`);
    
  } catch (err) {
    console.error('Data loading error:', err);
    error.main = `An error occurred while loading data: ${err.message}`;
  } finally {
    loading.main = false;
  }
}

// Fetch category data
async function fetchCategoryData() {
  try {
    console.log('fetchCategoryData called, route params:', route.params);
    
    // Get route parameters - for ID or slug based routes
    const categoryIdentifier = route.params.id || route.params.categoryId || route.params.categorySlug;
    
    if (!categoryIdentifier) {
      router.replace({ path: '/404', query: { from: route.fullPath } });
      return;
    }
    
    const response = await fetchCategory(categoryIdentifier);
    
    if (!response) {
      router.replace({ path: '/404', query: { from: route.fullPath } });
      return;
    }
    
    currentCategory.value = response;
    
    // Clear subcategory information on main category page
    // This prevents showing subcategory information in breadcrumb
    currentSubcategory.value = {};
    
    if (response.subcategories && response.subcategories.length > 0) {
      subcategories.value = response.subcategories;
    } else {
      subcategories.value = [];
    }
    
    // Reset category filter and add only the selected category
    filters.categories = [response._id];
    // Clear subcategory filters
    filters.subcategories = [];
    
  } catch (err) {
    console.error('Error fetching category:', err);
    router.replace({ path: '/404', query: { from: route.fullPath } });
  }
}

// Fetch subcategory data
async function fetchSubcategoryData() {
  try {
    console.log('fetchSubcategoryData called, route params:', route.params);
    
    // Get route parameters - for ID or slug based routes
    const categoryIdentifier = route.params.id || route.params.categoryId || route.params.categorySlug;
    const subcategoryIdentifier = route.params.subcategoryId || route.params.subcategorySlug;
    
    if (!categoryIdentifier || !subcategoryIdentifier) {
      router.replace({ path: '/404', query: { from: route.fullPath } });
      return;
    }
    
    // First get the parent category
    const parentResponse = await fetchCategory(categoryIdentifier);
    
    if (!parentResponse) {
      router.replace({ path: '/404', query: { from: route.fullPath } });
      return;
    }
    
    currentCategory.value = parentResponse;
    
    // get the subcategory
    const subcategoryResponse = await fetchCategory(subcategoryIdentifier);
    
    if (!subcategoryResponse) {
      router.replace({ path: '/404', query: { from: route.fullPath } });
      return;
    }
    
    currentSubcategory.value = subcategoryResponse;
    
    // Subcategory validation - check parent ID
    let parentId;
    if (typeof subcategoryResponse.parent === 'string') {
      parentId = subcategoryResponse.parent;
    } else if (subcategoryResponse.parent && subcategoryResponse.parent._id) {
      parentId = subcategoryResponse.parent._id;
    }
    
    // Redirect to 404 if parent ID doesn't exist or doesn't match
    if (!parentId || parentId !== parentResponse._id) {
      router.replace({ path: '/404', query: { from: route.fullPath } });
      return;
    }
    
    // Set subcategory ID for filters
    filters.categories = [];
    filters.subcategories = [subcategoryResponse._id];
    
    // Update page title
    document.title = `${subcategoryResponse.name} - Products`;
    
  } catch (err) {
    console.error('Error fetching subcategory:', err);
    router.replace({ path: '/404', query: { from: route.fullPath } });
  }
}

// Fetch collection data
async function fetchCollectionData() {
  try {
    const collectionSlug = route.params.slug;
    
    if (!collectionSlug) {
      router.replace({ path: '/404', query: { from: route.fullPath } });
      return;
    }
    
    const response = await fetchCollection(collectionSlug);
    
    if (!response) {
      router.replace({ path: '/404', query: { from: route.fullPath } });
      return;
    }
    
    currentCollection.value = response;
    
    // Clear category filters when collection is selected
    filters.categories = [];
    filters.subcategories = [];
    
  } catch (err) {
    console.error('Error fetching collection:', err);
    router.replace({ path: '/404', query: { from: route.fullPath } });
  }
}

// Fetch all categories
async function fetchCategoriesData() {
  try {
    categories.value = await fetchAllCategories();
  } catch (err) {
    console.error('Could not fetch categories:', err);
    categories.value = [];
  }
}

// API Wrapper Functions
// Filtering and sorting
function applyFilters(updatedFilters) {
  // Update filter values
  Object.assign(filters, updatedFilters);
  
  // Set page to 1 before filtering
  currentPage.value = 1;
  
  // Update URL
  updateUrlWithFilters();
  
  // Call the correct function based on page type
  if (viewType.value === 'collection') {
    fetchCollectionProducts(currentCollection.value.slug, getApiParams());
  } else {
    fetchProducts(getApiParams());
  }
}

// When sorting changes
function applySorting(newSorting) {
  sorting.value = newSorting;
  
  // Set page to 1
  currentPage.value = 1;
  
  // Update URL
  updateUrlWithFilters();
  
  // Refetch products based on page type
  if (viewType.value === 'collection') {
    fetchCollectionProducts(currentCollection.value.slug, getApiParams());
  } else {
    fetchProducts(getApiParams());
  }
}

// Load more products
function loadMoreProducts() {
  if (hasMoreProducts.value && !loading.more) {
    // Call the correct function based on page type
    if (viewType.value === 'collection') {
      loadMoreCollectionProducts(currentCollection.value.slug, getApiParams());
    } else {
      loadMoreProductsApi(getApiParams());
    }
  }
}

// When category is selected
function selectCategory(categoryData) {
  console.log('Category data received on product list page:', JSON.stringify(categoryData, null, 2));
  
  try {
    // If subcategory data is an object
    if (typeof categoryData === 'object' && categoryData.isSubcategory) {
      // Get parent category information for subcategory
      const parentId = categoryData.parentId;
      const categoryId = categoryData.categoryId;
      
      // Use slug information if available
      const parentSlug = categoryData.parentSlug;
      const childSlug = categoryData.childSlug;
      
      console.log('Subcategory details:', {
        parentId,
        categoryId,
        parentSlug,
        childSlug,
        parentSlugType: typeof parentSlug,
        childSlugType: typeof childSlug,
        parentSlugLength: parentSlug ? parentSlug.length : 0,
        childSlugLength: childSlug ? childSlug.length : 0
      });
      
      // Navigate to subcategory page (slug prioritized)
      navigateToSubcategory(
        parentId, 
        categoryId, 
        parentSlug, 
        childSlug
      );
      return;
    } else if (typeof categoryData === 'object' && !categoryData.isSubcategory) {
      // Main category object
      const categoryId = categoryData.categoryId;
      const categorySlug = categoryData.categorySlug; 
      
      console.log('Main category selected (object):', {
        categoryId, categorySlug
      });
      
      // Use slug information if available
      if (categorySlug) {
        navigateToCategory(categoryId, categorySlug);
      } else {
        navigateToCategory(categoryId, null);
      }
      return;
    } else if (typeof categoryData === 'string') {
      // String ID means normal category
      const categoryId = categoryData;
      console.log('Main category selected (ID):', categoryId);
      
      // Find category object
      const selectedCategory = categories.value.find(cat => cat._id === categoryId);
      
      if (!selectedCategory) {
        console.error('Category object not found:', categoryId);
        navigateToCategory(categoryId, null);
        return;
      }
      
      // Check if this is a subcategory
      if (selectedCategory.parent) {
        // Get parent category information for subcategory
        let parentCategory;
        
        if (typeof selectedCategory.parent === 'object' && selectedCategory.parent._id) {
          // If parent info is already an object
          parentCategory = selectedCategory.parent;
        } else {
          // If parent ID is a string, find it from the category list
          parentCategory = categories.value.find(cat => cat._id === selectedCategory.parent);
        }
        
        if (parentCategory) {
          console.log('Subcategory detected, parent-child relationship:', {
            parent: parentCategory,
            child: selectedCategory
          });
          
          // Check slug information
          const parentHasSlug = parentCategory.slug && 
                              typeof parentCategory.slug === 'string' && 
                              parentCategory.slug.trim() !== '';
                              
          const childHasSlug = selectedCategory.slug && 
                             typeof selectedCategory.slug === 'string' && 
                             selectedCategory.slug.trim() !== '';
          
          console.log('Parent has slug:', parentHasSlug, parentCategory.slug);
          console.log('Child has slug:', childHasSlug, selectedCategory.slug);
          
          // Navigate to subcategory page (use slug info if available)
          navigateToSubcategory(
            parentCategory._id, 
            selectedCategory._id, 
            parentHasSlug ? parentCategory.slug : null, 
            childHasSlug ? selectedCategory.slug : null
          );
          return;
        }
      }
      
      // Navigate to normal category page
      const hasSlug = selectedCategory.slug && 
                     typeof selectedCategory.slug === 'string' && 
                     selectedCategory.slug.trim() !== '';
                     
      console.log('Main category slug info:', hasSlug ? selectedCategory.slug : 'None');
      
      navigateToCategory(
        selectedCategory._id, 
        hasSlug ? selectedCategory.slug : null
      );
    } else {
      console.error('Unexpected category data:', categoryData);
    }
  } catch (error) {
    console.error('Error in category selection:', error);
  }
}

// Add product to cart
function addToCart(product, quantity = 1) {
  cartStore.addToCart({
    productId: product._id,
    name: product.name,
    price: product.price,
    image: product.images && product.images.length > 0 ? product.images[0] : '',
    quantity
  });
}

// Watch route change and update data
watch(() => route.fullPath, () => {
  // Full page refresh, reload all data
  fetchData();
}, { immediate: true });

// Fetch data when component is first mounted
onMounted(() => {
  fetchData();
});
</script> 