<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-2xl font-semibold text-gray-900">Brand Management</h1>
      <button 
        @click="openModal('add')" 
        class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md flex items-center transition-colors duration-300"
      >
        <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        New Brand
      </button>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center my-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 my-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-red-700">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Category Filtering -->
    <div v-else class="mb-6 flex space-x-2">
      <button 
        @click="filterCategory = ''" 
        :class="[
          'px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200',
          filterCategory === '' 
            ? 'bg-indigo-500 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        ]"
      >
        All
      </button>
      <button 
        v-for="category in categories" 
        :key="category"
        @click="filterCategory = category" 
        :class="[
          'px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200',
          filterCategory === category 
            ? 'bg-indigo-500 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        ]"
      >
        {{ categoryLabels[category] || capitalize(category) }}
      </button>
    </div>

    <!-- Table -->
    <div v-if="filteredBrands.length > 0" class="bg-white shadow overflow-hidden rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Logo</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="brand in filteredBrands" :key="brand._id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <img :src="brand.logo" :alt="brand.name" class="h-10 w-16 object-contain">
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ brand.name }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500">{{ brand.slug }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="{
                  'bg-purple-100 text-purple-800': brand.category === 'luxury',
                  'bg-pink-100 text-pink-800': brand.category === 'trend',
                  'bg-green-100 text-green-800': brand.category === 'sport',
                  'bg-blue-100 text-blue-800': brand.category === 'accessories'
                }">
                {{ categoryLabels[brand.category] || capitalize(brand.category) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span v-if="brand.isActive" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                Active
              </span>
              <span v-else class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                Inactive
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
              <button @click="openModal('edit', brand)" class="text-indigo-600 hover:text-indigo-900">Edit</button>
              <button @click="openDeleteConfirmation(brand)" class="text-red-600 hover:text-red-900">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- No data -->
    <div v-else-if="!filteredBrands.length && !loading" class="bg-white shadow rounded-md p-6 text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">{{ filterCategory ? 'No brands found in this category' : 'No brands found yet' }}</h3>
      <p class="mt-1 text-sm text-gray-500">{{ filterCategory ? 'Remove the filter to see all brands.' : 'Get started by creating your first brand.' }}</p>
      <div class="mt-6">
        <button 
          @click="openModal('add')" 
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
        >
          <svg class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Brand
        </button>
      </div>
    </div>

    <!-- Brand Add/Edit Modal -->
    <div v-if="showModal" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="closeModal"></div>

        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  {{ modalMode === 'add' ? 'Create New Brand' : 'Edit Brand' }}
                </h3>
                <div class="mt-4 space-y-4">
                  <div>
                    <label for="name" class="block text-sm font-medium text-gray-700">Brand Name</label>
                    <input
                      type="text"
                      id="name"
                      v-model="formData.name"
                      class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="Brand name"
                    />
                  </div>

                  <div>
                    <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      id="description"
                      v-model="formData.description"
                      rows="3"
                      class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="Brand description"
                    ></textarea>
                  </div>

                  <div>
                    <label for="logo" class="block text-sm font-medium text-gray-700">Logo URL</label>
                    <input
                      type="text"
                      id="logo"
                      v-model="formData.logo"
                      class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="https://example.com/logo.png"
                    />
                    <div v-if="formData.logo" class="mt-2">
                      <img :src="formData.logo" alt="Logo Preview" class="h-16 object-contain">
                    </div>
                  </div>

                  <div>
                    <label for="image" class="block text-sm font-medium text-gray-700">Cover Image URL</label>
                    <input
                      type="text"
                      id="image"
                      v-model="formData.image"
                      class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="https://example.com/image.jpg"
                    />
                    <div v-if="formData.image" class="mt-2">
                      <img :src="formData.image" alt="Image Preview" class="h-32 w-full object-cover rounded">
                    </div>
                  </div>

                  <div>
                    <label for="category" class="block text-sm font-medium text-gray-700">Category</label>
                    <select
                      id="category"
                      v-model="formData.category"
                      class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option v-for="category in categories" :key="category" :value="category">
                        {{ categoryLabels[category] || capitalize(category) }}
                      </option>
                    </select>
                  </div>

                  <div class="flex items-center">
                    <input
                      id="isActive"
                      type="checkbox"
                      v-model="formData.isActive"
                      class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label for="isActive" class="ml-2 block text-sm text-gray-900">
                      Active
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              @click="saveBrand" 
              :disabled="processing"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
            >
              <span v-if="processing" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
              <span v-else>
                {{ modalMode === 'add' ? 'Create' : 'Update' }}
              </span>
            </button>
            <button 
              @click="closeModal" 
              type="button" 
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="closeDeleteModal"></div>

        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Delete Brand
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Are you sure you want to delete the brand <strong>{{ selectedBrand?.name }}</strong>? This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              @click="deleteBrand" 
              :disabled="processing"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
            >
              <span v-if="processing" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
              <span v-else>Delete</span>
            </button>
            <button 
              @click="closeDeleteModal" 
              type="button" 
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useToast } from 'vue-toastification';
import { brandService } from '../../services/brandService';

const toast = useToast();

// State variables
const brands = ref([]);
const loading = ref(true);
const error = ref(null);
const processing = ref(false);
const showModal = ref(false);
const showDeleteModal = ref(false);
const modalMode = ref('add'); // 'add' or 'edit'
const selectedBrand = ref(null);
const filterCategory = ref('');

// Brand categories
const categories = ['luxury', 'trend', 'sport', 'accessories'];
const categoryLabels = {
  luxury: 'Luxury',
  trend: 'Trend',
  sport: 'Sport',
  accessories: 'Accessories'
};

// Form data
const formData = reactive({
  name: '',
  description: '',
  logo: '',
  image: '',
  category: 'trend',
  isActive: true
});

// Filtered brands
const filteredBrands = computed(() => {
  if (!filterCategory.value) {
    return brands.value;
  }
  return brands.value.filter(brand => brand.category === filterCategory.value);
});

// Get brands
const fetchBrands = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const result = await brandService.getAll();
    brands.value = result;
  } catch (err) {
    console.error('Error loading brands:', err);
    error.value = 'An error occurred while loading brands. Please try again later.';
  } finally {
    loading.value = false;
  }
};

// Capitalize first letter
const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Modal operations
const openModal = (mode, brand = null) => {
  modalMode.value = mode;
  
  if (mode === 'edit' && brand) {
    selectedBrand.value = brand;
    
    // Fill form data
    formData.name = brand.name;
    formData.description = brand.description || '';
    formData.logo = brand.logo;
    formData.image = brand.image || '';
    formData.category = brand.category || 'trend';
    formData.isActive = brand.isActive !== undefined ? brand.isActive : true;
  } else {
    // Reset form data for new brand
    formData.name = '';
    formData.description = '';
    formData.logo = '';
    formData.image = '';
    formData.category = 'trend';
    formData.isActive = true;
  }
  
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedBrand.value = null;
};

// Save brand
const saveBrand = async () => {
  if (!formData.name) {
    toast.error('Please enter brand name.');
    return;
  }
  
  if (!formData.logo) {
    toast.error('Please enter logo URL.');
    return;
  }
  
  processing.value = true;
  
  try {
    if (modalMode.value === 'add') {
      // Create new brand
      await brandService.create(formData);
      toast.success('Brand created successfully.');
    } else {
      // Update existing brand
      await brandService.update(selectedBrand.value.slug, formData);
      toast.success('Brand updated successfully.');
    }
    
    // Refresh brands
    await fetchBrands();
    
    // Close modal
    closeModal();
  } catch (err) {
    console.error('Error saving brand:', err);
    toast.error('An error occurred while saving the brand. Please try again.');
  } finally {
    processing.value = false;
  }
};

// Delete operations
const openDeleteConfirmation = (brand) => {
  selectedBrand.value = brand;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  selectedBrand.value = null;
};

const deleteBrand = async () => {
  if (!selectedBrand.value) return;
  
  processing.value = true;
  
  try {
    await brandService.delete(selectedBrand.value.slug);
    toast.success('Brand deleted successfully.');
    await fetchBrands();
    closeDeleteModal();
  } catch (err) {
    console.error('Error deleting brand:', err);
    toast.error('An error occurred while deleting the brand. Please try again.');
  } finally {
    processing.value = false;
  }
};

// Load brands when page is mounted
onMounted(fetchBrands);
</script> 