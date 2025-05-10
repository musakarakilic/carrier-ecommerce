<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">Products</h1>
      <button
        @click="openModal"
        :disabled="loading"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        <svg
          v-if="!loading"
          class="-ml-1 mr-2 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <svg
          v-else
          class="animate-spin -ml-1 mr-2 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        {{ loading ? 'Processing...' : 'New Product' }}
      </button>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
      {{ error }}
    </div>

    <!-- Filters -->
    <div class="mb-6 bg-white p-4 rounded-lg shadow">
      <form @submit.prevent="loadProducts">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Category</label>
            <select
              v-model="filters.category"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">All Categories</option>
              <option v-for="category in categories" :key="category._id" :value="category._id">
                {{ category.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Search</label>
            <input
              type="text"
              v-model="filters.search"
              placeholder="Search products..."
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div class="flex items-end">
            <button
              type="submit"
              class="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Filter
            </button>
          </div>
        </div>
      </form>
    </div>

    <!-- Loading Spinner -->
    <div v-if="loading && !products.length" class="flex justify-center items-center py-12">
      <svg
        class="animate-spin h-8 w-8 text-indigo-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>

    <!-- Product List -->
    <div v-else class="flex flex-col">
      <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="product in products" :key="product._id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="h-10 w-10 flex-shrink-0">
                        <img
                          :src="product.images && product.images.length > 0 ? product.images[0] : product.image || '/placeholder.png'"
                          class="h-10 w-10 rounded-full object-cover"
                          alt=""
                        />
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ product.category?.name || '-' }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ formatPrice(product.price) }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ product.stock || 0 }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="[
                      product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
                      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full'
                    ]">
                      {{ product.isActive ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      @click="editProduct(product)"
                      class="text-indigo-600 hover:text-indigo-900 mr-2"
                      :disabled="loading"
                    >
                      Edit
                    </button>
                    <button
                      @click="deleteProduct(product._id)"
                      class="text-red-600 hover:text-red-900"
                      :disabled="loading"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <Pagination 
      v-if="totalPages > 1" 
      :current-page="currentPage" 
      :total-pages="totalPages" 
      :max-visible-buttons="5"
      @page-change="changePage"
    />
  </div>

  <!-- Product Add/Edit Modal -->
  <div v-if="showModal" class="fixed z-10 inset-0 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="w-full">
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                {{ selectedProduct._id ? 'Edit Product' : 'Add New Product' }}
              </h3>
              <ProductForm
                ref="productForm"
                :product="selectedProduct"
                :categories="categories"
                :brands="brands"
                :collections="collections"
                @submit="handleFormSubmit"
                @cancel="closeModal"
                :loading="loading"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Product Deletion Confirmation Modal -->
  <ConfirmationModal
    :is-open="showDeleteModal"
    title="Delete Product"
    message="Are you sure you want to delete this product? This action cannot be undone."
    confirm-text="Yes, Delete Product"
    cancel-text="No, Keep Product"
    type="danger"
    @confirm="confirmDeleteProduct"
    @cancel="hideDeleteModal"
  />
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { brandService } from '../../services/brandService';
import { collectionService } from '../../services/collectionService';
import { useToast }  from 'vue-toastification';
import ProductForm from '../../components/ProductForm.vue';
import Pagination from '../../components/organisms/Pagination/index.vue';
import ConfirmationModal from '@/components/molecules/ConfirmationModal.vue';

const toast = useToast();
const products = ref([]);
const categories = ref([]);
const brands = ref([]);
const collections = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);
const filters = ref({
  category: '',
  search: ''
});

// Modal and form states
const showModal = ref(false);
const selectedProduct = ref({});
const productForm = ref(null);
const error = ref(null);

// Add modal state for delete confirmation
const showDeleteModal = ref(false);
const productToDelete = ref(null);

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
};

const loadProducts = async () => {
  try {
    loading.value = true;
    error.value = null;
    const response = await productService.getAll({
      page: currentPage.value,
      category: filters.value.category,
      search: filters.value.search
    });
    
    products.value = response.products || [];
    totalPages.value = response.totalPages || 1;
    currentPage.value = response.currentPage || 1;
  } catch (err) {
    error.value = 'An error occurred while loading products';
    console.error('Error loading products:', err);
    toast.error(error.value);
  } finally {
    loading.value = false;
  }
};

const loadCategories = async () => {
  try {
    const response = await categoryService.getAll();
    categories.value = response || [];
  } catch (err) {
    console.error('Error loading categories:', err);
    toast.error('An error occurred while loading categories');
  }
};

const loadBrands = async () => {
  try {
    const response = await brandService.getAll();
    brands.value = response || [];
  } catch (err) {
    console.error('Error loading brands:', err);
    toast.error('An error occurred while loading brands');
  }
};

const loadCollections = async () => {
  try {
    const response = await collectionService.getAll();
    collections.value = response || [];
  } catch (err) {
    console.error('Error loading collections:', err);
    toast.error('An error occurred while loading collections');
  }
};

const changePage = (page) => {
  currentPage.value = page;
  loadProducts();
};

const deleteProduct = async (productId) => {
  if (!productId) return;
  
  productToDelete.value = productId;
  showDeleteModal.value = true;
};

const confirmDeleteProduct = async () => {
  try {
    loading.value = true;
    error.value = null;
    await productService.delete(productToDelete.value);
    toast.success('Product successfully deleted');
    await loadProducts();
  } catch (err) {
    error.value = 'An error occurred while deleting the product';
    console.error('Error deleting product:', err);
    toast.error(error.value);
  } finally {
    loading.value = false;
    hideDeleteModal();
  }
};

const hideDeleteModal = () => {
  showDeleteModal.value = false;
  productToDelete.value = null;
};

const openModal = () => {
  selectedProduct.value = {};
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedProduct.value = {};
  if (productForm.value) {
    productForm.value.formData = {
      name: '',
      category: '',
      price: 0,
      stock: 0,
      description: '',
      images: [],
      brand: '',
      collections: [],
      isActive: true
    };
  }
};

const editProduct = (product) => {
  if (!product) return;
  
  // Copy existing product information
  const productCopy = { ...product };
  
  // Edit image fields
  if (productCopy.image && (!productCopy.images || !Array.isArray(productCopy.images) || productCopy.images.length === 0)) {
    productCopy.images = [productCopy.image];
  } else if (!productCopy.images) {
    productCopy.images = [];
  }
  
  // Set category ID correctly
  productCopy.category = productCopy.category?._id || productCopy.category || '';
  
  // Set brand ID correctly
  productCopy.brand = productCopy.brand?._id || productCopy.brand || '';
  
  // Set collection IDs
  if (productCopy.collections && Array.isArray(productCopy.collections)) {
    productCopy.collections = productCopy.collections.map(coll => coll._id || coll);
  } else if (!productCopy.collections) {
    productCopy.collections = [];
  }
  
  // Set selected product for editing
  selectedProduct.value = productCopy;
  showModal.value = true;
};

const handleFormSubmit = async (formData) => {
  if (!formData) {
    toast.error('Form data is missing');
    return;
  }

  try {
    loading.value = true;
    error.value = null;

    // Get product data from formData
    const productData = { ...formData };
    
    // Set empty brand field as null (for ObjectId error)
    if (productData.brand === '') {
      productData.brand = null;
    }
    
    // Check empty collections array
    if (Array.isArray(productData.collections) && productData.collections.length === 0) {
      // Set empty collections array as null or undefined
      // According to what the backend accepts
      productData.collections = null;
    }
    
    // Convert images/image fields to correct format
    if (productData.images && productData.images.length > 0) {
      // Update main image (for backward compatibility)
      productData.image = productData.images[0];
    } else if (productData.image) {
      // Add single image to images array
      productData.images = [productData.image];
    }

    if (selectedProduct.value && selectedProduct.value._id) {
      await productService.update(selectedProduct.value._id, productData);
      toast.success('Product successfully updated');
    } else {
      await productService.create(productData);
      toast.success('Product successfully added');
    }

    await loadProducts();
    closeModal();
  } catch (err) {
    error.value = selectedProduct.value && selectedProduct.value._id
      ? 'An error occurred while updating the product'
      : 'An error occurred while adding the product';
    console.error('Form submission error:', err);
    toast.error(error.value);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await Promise.all([
    loadProducts(),
    loadCategories(),
    loadBrands(),
    loadCollections()
  ]);
});
</script> 