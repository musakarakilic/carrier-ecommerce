<template>
  <div class="bg-gray-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
    <!-- Loading and error states -->
    <div v-if="loading" class="flex justify-center py-20">
      <div class="spinner-large"></div>
    </div>
    <div v-else-if="error" class="max-w-2xl mx-auto text-center py-16 bg-white rounded-xl shadow-md p-8">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h2 class="text-xl font-semibold text-gray-900 mb-2">An error occurred</h2>
      <p class="text-red-500">{{ error }}</p>
      <button @click="fetchProduct" class="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Try Again
      </button>
    </div>
    
    <!-- Product details -->
    <div v-else class="max-w-7xl mx-auto">
      <!-- Navigation -->
      <nav aria-label="Breadcrumb" class="mb-8 overflow-x-auto whitespace-nowrap py-2">
        <ProductBreadcrumb
          :currentCategory="getCategoryObject(product)"
          :currentSubcategory="getSubcategoryObject(product)"
          :productName="product.name"
        />
      </nav>

      <!-- Main content box -->
      <div class="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-0">
          <!-- Product images -->
          <ProductImages
            :images="product.images"
            :product-name="product.name"
            @image-selected="handleImageSelected"
          />
          
          <!-- Product information -->
          <ProductInfo
            :product="product"
            @add-to-cart="handleAddToCart"
            @quantity-changed="handleQuantityChanged"
          />
        </div>
      </div>
      
      <!-- Product features tabs -->
      <div class="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 mt-10 transform transition-all duration-300 hover:shadow-xl">
        <div class="flex border-b border-gray-100 bg-gray-50">
          <button 
            v-for="(tab, index) in tabs" 
            :key="index"
            @click="activeTab = index"
            class="py-4 px-6 font-medium focus:outline-none transition-all duration-300 relative"
            :class="[
              activeTab === index 
                ? 'text-indigo-600' 
                : 'text-gray-600 hover:text-indigo-600'
            ]"
          >
            {{ tab.name }}
            <div 
              class="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 transform origin-left transition-transform duration-300" 
              :class="activeTab === index ? 'scale-x-100' : 'scale-x-0'"
            ></div>
          </button>
        </div>
        
        <div class="p-8">
          <div v-if="activeTab === 0" class="animate-fade-in">
            <p class="text-gray-700 leading-relaxed">{{ product.description }}</p>
            <div v-if="product.features && product.features.length > 0" class="mt-6">
              <ul class="space-y-3">
                <li v-for="(feature, index) in product.features" :key="index" class="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span class="text-gray-700">{{ feature }}</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div v-else-if="activeTab === 1" class="animate-fade-in">
            <h3 class="text-lg font-semibold mb-4 text-gray-800">Delivery Information</h3>
            <div class="bg-indigo-50 rounded-lg p-4 border border-indigo-100 mb-4 transform transition-all duration-300 hover:shadow-md">
              <div class="flex">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
                <div>
                  <p class="text-gray-700 mb-1">Your order will be shipped within 1-3 business days after payment confirmation.</p>
                  <p class="text-gray-700">Orders placed before 2 PM on weekdays are shipped the same day.</p>
                </div>
              </div>
            </div>
            <div class="bg-indigo-50 rounded-lg p-4 border border-indigo-100 transform transition-all duration-300 hover:shadow-md">
              <div class="flex">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-gray-700"><span class="font-medium">500₺</span> and above purchases get <span class="text-indigo-600 font-medium">free shipping.</span></p>
              </div>
            </div>
          </div>
          
          <div v-else-if="activeTab === 2" class="animate-fade-in">
            <h3 class="text-lg font-semibold mb-4 text-gray-800">Return Conditions</h3>
            <div class="bg-indigo-50 rounded-lg p-4 border border-indigo-100 transform transition-all duration-300 hover:shadow-md">
              <div class="flex">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p class="text-gray-700 mb-2">You can return the product within <span class="font-medium">14 days</span> from the date you received it.</p>
                  <p class="text-gray-700">The product must be unused and in its original packaging.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Similar products -->
    <div v-if="relatedProducts.length > 0" class="max-w-7xl mx-auto mt-14">
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-2xl font-bold text-gray-900">Similar Products</h2>
        <RouterLink :to="`/category/${product.category}`" class="text-indigo-600 hover:text-indigo-800 font-medium flex items-center transition-colors text-sm group">
          View All
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1 transition-transform duration-300 transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </RouterLink>
      </div>
      
      <!-- Loading -->
      <div v-if="loadingRelated" class="flex justify-center py-12">
        <div class="spinner"></div>
      </div>
      
      <!-- Loaded -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <Card 
          v-for="relatedProduct in relatedProducts" 
          :key="relatedProduct._id"
          :product="relatedProduct"
          @add-to-cart="addToCartDirect"
          @click="onRelatedProductClick(relatedProduct._id)"
          class="transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ProductImages from './components/ProductImages.vue';
import ProductInfo from './components/ProductInfo.vue';
import Card from '../../../components/molecules/Card/index.vue';
import ProductBreadcrumb from '../components/ProductBreadcrumb.vue';
import { productService } from '../../../services/productService';
import { categoryService } from '../../../services/categoryService';
import { useToast } from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import { useCartStore } from '../../../stores/cart';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const cartStore = useCartStore();
const productId = computed(() => route.params.id);

// State
const product = ref({});
const categories = ref([]);
const loading = ref(false);
const loadingRelated = ref(false);
const error = ref(null);
const quantity = ref(1);
const activeTab = ref(0);
const relatedProducts = ref([]);

// Tab options
const tabs = [
  { name: 'Product Details' },
  { name: 'Delivery Information' },
  { name: 'Return Conditions' }
];

// Get categories
const fetchCategories = async () => {
  try {
    const result = await categoryService.getAll();
    categories.value = result;
  } catch (error) {
    console.error('Error loading categories:', error);
    categories.value = [];
  }
};

// Get product details and category hierarchy
const fetchProduct = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    // 1. Get product details
    const result = await productService.getById(productId.value);
    
    // 2. Get category details (if category exists)
    if (result.category && result.category !== null && result.category !== undefined) {
      let categoryId = typeof result.category === 'object' ? result.category._id : result.category;
      
      // If category ID is valid, proceed
      if (categoryId) {
        try {
          // Directly get category details from backend API
          const categoryDetail = await categoryService.getById(categoryId);
          
          // Add category details to product
          if (categoryDetail) {
            result.categoryData = categoryDetail;
            result.categoryName = categoryDetail.name;
            
            // Create category tree - if parent exists, get parent category
            const categoryTree = [{ _id: categoryDetail._id, name: categoryDetail.name }];
            
            // If parent exists, add parent category
            if (categoryDetail.parent) {
              try {
                // Get parent category details
                const parentDetail = await categoryService.getById(
                  typeof categoryDetail.parent === 'object' ? categoryDetail.parent._id : categoryDetail.parent
                );
                
                // Add parent category to tree (unshift)
                if (parentDetail) {
                  categoryTree.unshift({ _id: parentDetail._id, name: parentDetail.name });
                  
                  // If parent category has parent, add grandparent category
                  if (parentDetail.parent) {
                    try {
                      // Get main category
                      const mainCategoryDetail = await categoryService.getById(
                        typeof parentDetail.parent === 'object' ? parentDetail.parent._id : parentDetail.parent
                      );
                      
                      // Add main category to tree (unshift)
                      if (mainCategoryDetail) {
                        categoryTree.unshift({ _id: mainCategoryDetail._id, name: mainCategoryDetail.name });
                      }
                    } catch (error) {
                      console.error('Error loading main category:', error);
                    }
                  }
                }
              } catch (error) {
                console.error('Error loading parent category:', error);
              }
            }
            
            result.categoryTree = categoryTree;
          }
        } catch (error) {
          console.error('Error loading category details:', error);
        }
      }
    }
    
    // 3. Update product data
    product.value = result;
    
    // 4. Get related products - if category exists
    if (result.category) {
      fetchRelatedProducts(
        typeof result.category === 'object' && result.category._id 
          ? result.category._id 
          : result.category
      );
    } else {
      // Kategori yoksa ilgili ürünler boş olsun
      relatedProducts.value = [];
    }
    
    // Scroll to top on new product
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  } catch (err) {
    console.error('Ürün yüklenirken hata oluştu:', err);
    error.value = 'Ürün bilgileri yüklenirken bir hata oluştu.';
  } finally {
    loading.value = false;
  }
};

// Get related products
const fetchRelatedProducts = async (categoryId) => {
  if (!categoryId) {
    relatedProducts.value = [];
    loadingRelated.value = false;
    return;
  }
  
  loadingRelated.value = true;
  
  try {
    // Get category ID in correct format
    const actualCategoryId = typeof categoryId === 'object' && categoryId._id
      ? categoryId._id
      : categoryId;
    
    // Get other products in the same category (excluding current product)
    const result = await productService.getAll({ 
      category: actualCategoryId,
      limit: 4
    });
    
    if (result && result.products) {
      // Filter out current product
      relatedProducts.value = result.products.filter(p => p._id !== productId.value);
    } else {
      relatedProducts.value = [];
    }
  } catch (error) {
    console.error('Error loading related products:', error);
    relatedProducts.value = [];
  } finally {
    loadingRelated.value = false;
  }
};

// Event handlers
const handleImageSelected = ({ index, image }) => {
  // Optional operations when image changes
  console.log(`Selected image: ${index} - ${image}`);
};

const handleQuantityChanged = (newQuantity) => {
  quantity.value = newQuantity;
};

const handleAddToCart = ({ success, product: productToAdd, quantity: qty, message }) => {
  if (!success) {
    toast.error(message || 'This product is currently out of stock.');
    return;
  }
  
  try {
    // Add to cart using cartStore
    cartStore.addToCart({
      _id: productToAdd._id,
      name: productToAdd.name,
      price: productToAdd.price,
      image: productToAdd.images?.[0] || 'https://placehold.co/400',
      quantity: qty
    });
    
    // Show success message
    toast.success(`${productToAdd.name} added to cart!`);
  } catch (error) {
    console.error('Error adding to cart:', error);
    toast.error('An error occurred while adding the product to cart.');
  }
};

// Add similar products directly to cart
const addToCartDirect = (product) => {
  try {
    cartStore.addToCart({
      ...product,
      quantity: 1
    });
    toast.success(`${product.name} added to cart!`);
  } catch (error) {
    console.error('Error adding to cart:', error);
    toast.error('An error occurred while adding the product to cart.');
  }
};

// Product slugify function
function slugifyProductName(text) {
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

// Similar product click handler - update product detail page
const onRelatedProductClick = (productId) => {
  const relatedProduct = relatedProducts.value.find(p => p._id === productId);
  
  if (relatedProduct && relatedProduct.name) {
    const productSlug = slugifyProductName(relatedProduct.name);
    // Redirect with SEO-friendly URL structure
    router.push(`/product/${productSlug}-${productId}`);
  } else {
    // If no name, use only ID
    router.push(`/product/${productId}`);
  }
  
  // Scroll to top
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

// Watch route changes - after fetchProduct definition
watch(() => route.params, async (newParams, oldParams) => {
  // This function should watch both ID and slug changes
  if (newParams.id !== oldParams?.id) {
    // Refresh product data when URL changes
    await fetchProduct();
  }
}, { immediate: true, deep: true });

// Watch breadcrumb category and update when category changes
watch(() => product.value.category, async (newCategory) => {
  if (newCategory && categories.value.length === 0) {
    await fetchCategories();
  }
}, { immediate: true });

// Create category object
function getCategoryObject(product) {
  if (!product) return null;
  
  // If category tree exists
  if (product.categoryTree && product.categoryTree.length > 0) {
    return product.categoryTree[0];
  }
  
  // If category is directly provided (as object)
  if (product.category && typeof product.category === 'object' && product.category._id) {
    return product.category;
  }
  
  // If category has id and name
  if (product.category && product.categoryName) {
    return {
      _id: product.category,
      name: product.categoryName,
      slug: product.categorySlug || product.category
    };
  }
  
  return null;
}

// Create subcategory object
function getSubcategoryObject(product) {
  if (!product) return null;
  
  // If category tree exists and has subcategory
  if (product.categoryTree && product.categoryTree.length > 1) {
    return product.categoryTree[1];
  }
  
  // If subcategory is directly provided
  if (product.subcategory) {
    if (typeof product.subcategory === 'object' && product.subcategory._id) {
      return product.subcategory;
    }
    
    // If subcategory has id and name
    if (product.subcategoryName) {
      return {
        _id: product.subcategory,
        name: product.subcategoryName,
        slug: product.subcategorySlug || product.subcategory
      };
    }
  }
  
  return null;
}

onMounted(async () => {
  // First load categories
  await fetchCategories();
  
  // Then load product (id comes from route params)
  if (route.params.id) {
    await fetchProduct();
  }
});
</script>

<style scoped>
.spinner {
  border: 3px solid rgba(79, 70, 229, 0.1);
  border-top-color: #4f46e5;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  animation: spin 1s linear infinite;
}

.spinner-large {
  border: 4px solid rgba(79, 70, 229, 0.1);
  border-top-color: #4f46e5;
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style> 