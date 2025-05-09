<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-2xl font-semibold text-gray-900">Collection Management</h1>
      <button 
        @click="openModal('add')" 
        class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md flex items-center transition-colors duration-300"
      >
        <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        New Collection
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

    <!-- Table -->
    <div v-else-if="collections.length > 0" class="bg-white shadow overflow-hidden rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Special</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Count</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="collection in collections" :key="collection._id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <img :src="collection.image" :alt="collection.title" class="h-10 w-16 object-cover rounded">
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ collection.title }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500">{{ collection.slug }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span v-if="collection.isSpecial" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                Yes
              </span>
              <span v-else class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                No
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span v-if="collection.isActive" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                Active
              </span>
              <span v-else class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                Inactive
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ collection.productCount || 0 }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
              <button @click="openModal('edit', collection)" class="text-indigo-600 hover:text-indigo-900">Edit</button>
              <button @click="openDeleteConfirmation(collection)" class="text-red-600 hover:text-red-900">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- No data -->
    <div v-else class="bg-white shadow rounded-md p-6 text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No collections found yet</h3>
      <p class="mt-1 text-sm text-gray-500">Get started by creating your first collection.</p>
      <div class="mt-6">
        <button 
          @click="openModal('add')" 
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
        >
          <svg class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Collection
        </button>
      </div>
    </div>

    <!-- Collection Add/Edit Modal -->
    <div v-if="showModal" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="closeModal"></div>

        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  {{ modalMode === 'add' ? 'Create New Collection' : 'Edit Collection' }}
                </h3>
                <div class="mt-4 space-y-4">
                  <div>
                    <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      id="title"
                      v-model="formData.title"
                      class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="Collection title"
                    />
                  </div>

                  <div>
                    <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      id="description"
                      v-model="formData.description"
                      rows="3"
                      class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="Collection description"
                    ></textarea>
                  </div>

                  <div>
                    <label for="image" class="block text-sm font-medium text-gray-700">Image URL</label>
                    <input
                      type="text"
                      id="image"
                      v-model="formData.image"
                      class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="https://example.com/image.jpg"
                    />
                    <div v-if="formData.image" class="mt-2">
                      <img :src="formData.image" alt="Preview" class="h-32 w-auto object-cover rounded">
                    </div>
                  </div>

                  <div>
                    <label for="bgClass" class="block text-sm font-medium text-gray-700">Background Class (optional)</label>
                    <input
                      type="text"
                      id="bgClass"
                      v-model="formData.bgClass"
                      class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="bg-gradient-to-r from-blue-500 to-indigo-600"
                    />
                  </div>

                  <div>
                    <label for="hashtag" class="block text-sm font-medium text-gray-700">Hashtag (optional)</label>
                    <input
                      type="text"
                      id="hashtag"
                      v-model="formData.hashtag"
                      class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="NewCollection"
                    />
                  </div>

                  <div class="flex items-center">
                    <input
                      id="isSpecial"
                      type="checkbox"
                      v-model="formData.isSpecial"
                      class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label for="isSpecial" class="ml-2 block text-sm text-gray-900">
                      Mark as Special Collection
                    </label>
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
              @click="saveCollection" 
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
                  Delete Collection
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Are you sure you want to delete the collection <strong>{{ selectedCollection?.title }}</strong>? This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              @click="deleteCollection" 
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
import { ref, reactive, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { collectionService } from '../../services/collectionService';

const toast = useToast();

// State variables
const collections = ref([]);
const loading = ref(true);
const error = ref(null);
const processing = ref(false);
const showModal = ref(false);
const showDeleteModal = ref(false);
const modalMode = ref('add'); // 'add' or 'edit'
const selectedCollection = ref(null);

// Form data
const formData = reactive({
  title: '',
  description: '',
  image: '',
  bgClass: 'bg-gradient-to-r from-indigo-600 to-purple-700',
  hashtag: 'NewCollection',
  isSpecial: false,
  isActive: true
});

// Get collections
const fetchCollections = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const result = await collectionService.getAll();
    collections.value = result;
  } catch (err) {
    console.error('Error loading collections:', err);
    error.value = 'An error occurred while loading collections. Please try again later.';
  } finally {
    loading.value = false;
  }
};

// Modal operations
const openModal = (mode, collection = null) => {
  modalMode.value = mode;
  
  if (mode === 'edit' && collection) {
    selectedCollection.value = collection;
    
    // Fill form data
    formData.title = collection.title;
    formData.description = collection.description;
    formData.image = collection.image;
    formData.bgClass = collection.bgClass || 'bg-gradient-to-r from-indigo-600 to-purple-700';
    formData.hashtag = collection.hashtag || 'NewCollection';
    formData.isSpecial = collection.isSpecial || false;
    formData.isActive = collection.isActive !== undefined ? collection.isActive : true;
  } else {
    // Reset form data for new collection
    formData.title = '';
    formData.description = '';
    formData.image = '';
    formData.bgClass = 'bg-gradient-to-r from-indigo-600 to-purple-700';
    formData.hashtag = 'NewCollection';
    formData.isSpecial = false;
    formData.isActive = true;
  }
  
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedCollection.value = null;
};

// Save collection
const saveCollection = async () => {
  if (!formData.title) {
    toast.error('Please enter a title.');
    return;
  }
  
  if (!formData.description) {
    toast.error('Please enter a description.');
    return;
  }
  
  if (!formData.image) {
    toast.error('Please enter an image URL.');
    return;
  }
  
  processing.value = true;
  
  try {
    if (modalMode.value === 'add') {
      // Create new collection
      await collectionService.create(formData);
      toast.success('Collection created successfully.');
    } else {
      // Update existing collection
      await collectionService.update(selectedCollection.value.slug, formData);
      toast.success('Collection updated successfully.');
    }
    
    // Refresh collections
    await fetchCollections();
    
    // Close modal
    closeModal();
  } catch (err) {
    console.error('Error saving collection:', err);
    toast.error('An error occurred while saving the collection. Please try again.');
  } finally {
    processing.value = false;
  }
};

// Delete operations
const openDeleteConfirmation = (collection) => {
  selectedCollection.value = collection;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  selectedCollection.value = null;
};

const deleteCollection = async () => {
  if (!selectedCollection.value) return;
  
  processing.value = true;
  
  try {
    await collectionService.delete(selectedCollection.value.slug);
    toast.success('Collection deleted successfully.');
    await fetchCollections();
    closeDeleteModal();
  } catch (err) {
    console.error('Error deleting collection:', err);
    toast.error('An error occurred while deleting the collection. Please try again.');
  } finally {
    processing.value = false;
  }
};

// Load collections when page is mounted
onMounted(fetchCollections);
</script> 