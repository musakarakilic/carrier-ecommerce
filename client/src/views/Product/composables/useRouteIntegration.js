// useRouteIntegration.js - Composable for route and URL management
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export function useRouteIntegration() {
  const route = useRoute();
  const router = useRouter();
  
  // Variables to store last viewed page information
  const lastViewedPath = ref(null);
  const lastViewedType = ref(null);
  const lastViewedId = ref(null);
  
  // View type detection (category, subcategory or collection)
  const viewType = computed(() => {
    console.log('Route Name:', route.name);
    console.log('Route Params:', route.params);
    
    if (route.name === 'category' || route.name === 'categoryBySlug') return 'category';
    if (route.name === 'subcategory' || route.name === 'subcategoryBySlug') return 'subcategory';
    if (route.name === 'collection') return 'collection';
    return 'unknown';
  });
  
  // Category and collection URL creation helpers
  function getCategoryUrl(category) {
    if (!category || !category._id) return '/products';
    return `/category/${category.slug || category._id}`;
  }
  
  function getSubcategoryUrl(category, subcategory) {
    if (!category || !subcategory || !category._id || !subcategory._id) return '/products';
    
    const categoryPath = category.slug || category._id;
    const subcategoryPath = subcategory.slug || subcategory._id;
    
    return `/category/${categoryPath}/${subcategoryPath}`;
  }
  
  function getCollectionUrl(collection) {
    if (!collection || !collection.slug) return '/collections';
    return `/collections/${collection.slug}`;
  }
  
  // Route change check - works for all page types
  function checkRouteChange() {
    const currentPath = route.path;
    
    // Get ID or SLUG value to cover different route parameter names
    const currentId = route.params.id || 
                    route.params.categoryId || 
                    route.params.subcategoryId || 
                    route.params.categorySlug || 
                    route.params.subcategorySlug || 
                    route.params.slug;
    
    // Get current view type (category, collection, etc.)
    const currentType = viewType.value;
    
    console.log('Route Change Check:', { 
      lastViewedPath: lastViewedPath.value,
      lastViewedType: lastViewedType.value,
      lastViewedId: lastViewedId.value,
      currentPath,
      currentType,
      currentId
    });
    
    // If not first visit and there is a real change
    if (lastViewedPath.value !== null) {
      // ONLY reset filters in the following cases:
      // 1. When going to a different page type (category->collection)
      // 2. When going to a different ID within the same type (category1->category2)
      if ((lastViewedType.value !== currentType) || 
          (lastViewedId.value !== currentId && currentId)) {
        console.log('Route Changed: Resetting filters');
        return true; // Page changed, filters need to be reset
      } else {
        console.log('Same route or only query params changed: Keeping filters');
        return false; // Same page, only query parameters changed - keeping filters
      }
    }
    
    // First page load
    console.log('First page load');
    return false;
  }
  
  // Update last viewed page
  function updateLastViewedPage() {
    lastViewedPath.value = route.path; // no query parameters, only path
    lastViewedType.value = viewType.value;
    
    // Get correct identifier for different route names
    lastViewedId.value = route.params.id || 
                        route.params.categoryId || 
                        route.params.subcategoryId || 
                        route.params.categorySlug || 
                        route.params.subcategorySlug || 
                        route.params.slug;
    
    console.log('Last Viewed Page Updated:', {
      path: lastViewedPath.value,
      type: lastViewedType.value,
      id: lastViewedId.value
    });
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
  
  // Navigate to product detail page
  function navigateToProductDetail(product) {
    let productId, productName, slug;
    
    // Check if product is an object or just an ID
    if (typeof product === 'object' && product !== null) {
      productId = product._id;
      productName = product.name || '';
    } else {
      productId = product;
      productName = '';
    }
    
    // Create slug (if product name exists)
    if (productName) {
      slug = slugifyText(productName);
      router.push(`/product/${slug}-${productId}`);
    } else {
      // If no product name, navigate with ID only
      router.push(`/product/${productId}`);
    }
  }
  
  // Navigate to category page
  function navigateToCategory(categoryId, categorySlug) {
    console.log(`Navigating to category page: ID=${categoryId}, slug=${categorySlug}`);
    
    // Determine the value to use in URL
    let slugToUse = categorySlug;
    
    // If slug is missing or null or same as ID (meaning it's not actually a slug)
    if (!slugToUse || slugToUse === null || slugToUse === categoryId) {
      console.warn('No suitable slug found for category, using ID');
      
      // Use ID-based route
      console.log(`Using ID-based route: ${categoryId}`);
      router.push({
        name: 'category',
        params: { id: categoryId }
      });
      return;
    }
    
    // If slug exists, use slug-based route
    console.log(`Using slug-based route: ${slugToUse}`);
    router.push({
      name: 'categoryBySlug',
      params: { categorySlug: slugToUse }
    });
  }
  
  // Navigate to subcategory page
  function navigateToSubcategory(categoryId, subcategoryId, categorySlug, subcategorySlug) {
    console.log(`Navigating to subcategory page: 
      Category: ID=${categoryId}, slug=${categorySlug},
      Subcategory: ID=${subcategoryId}, slug=${subcategorySlug}
    `);
    
    try {
      // Ensure parameters exist
      if (!categoryId || !subcategoryId) {
        console.error('Category or subcategory ID is missing!');
        return;
      }
      
      // Log slug details
      console.log('Slug details:', {
        categorySlug,
        subcategorySlug,
        categorySlugType: typeof categorySlug,
        subcategorySlugType: typeof subcategorySlug,
        categorySlugLength: categorySlug ? categorySlug.length : 0,
        subcategorySlugLength: subcategorySlug ? subcategorySlug.length : 0
      });
      
      // Check if both slugs are valid
      const hasValidCategorySlug = categorySlug && 
                                 typeof categorySlug === 'string' && 
                                 categorySlug.trim() !== '';
                                 
      const hasValidSubcategorySlug = subcategorySlug && 
                                    typeof subcategorySlug === 'string' && 
                                    subcategorySlug.trim() !== '';
      
      console.log('Slug validity checks:', {
        hasValidCategorySlug,
        hasValidSubcategorySlug,
        categorySlugTrimmed: categorySlug ? categorySlug.trim() : '',
        subcategorySlugTrimmed: subcategorySlug ? subcategorySlug.trim() : ''
      });
      
      // If both slugs are valid, use slug-based route
      if (hasValidCategorySlug && hasValidSubcategorySlug) {
        console.log(`Using full slug-based route: ${categorySlug}/${subcategorySlug}`);
        router.push({
          name: 'subcategoryBySlug',
          params: { 
            categorySlug,
            subcategorySlug 
          }
        });
      } else {
        // If slugs are not valid, redirect to home page
        console.error('Cannot navigate due to missing valid slug information');
        console.error('Slug status:', {
          categorySlug,
          subcategorySlug,
          hasValidCategorySlug,
          hasValidSubcategorySlug
        });
        router.push('/');
      }
    } catch (error) {
      console.error('Navigation error:', error);
      // Show detailed error information
      console.error('Navigation parameters:', {
        categoryId, subcategoryId, categorySlug, subcategorySlug
      });
    }
  }
  
  // Navigate to collection page
  function navigateToCollection(collectionSlug) {
    console.log(`Navigating to collection: ${collectionSlug}`);
    router.push(`/collections/${collectionSlug}`);
  }
  
  return {
    route,
    router,
    viewType,
    getCategoryUrl,
    getSubcategoryUrl,
    getCollectionUrl,
    checkRouteChange,
    updateLastViewedPage,
    navigateToProductDetail,
    navigateToCategory,
    navigateToSubcategory,
    navigateToCollection
  };
} 