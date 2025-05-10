<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">Categories</h1>
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
        {{ loading ? 'Processing...' : 'New Category' }}
      </button>
    </div>

    <!-- Loading Spinner -->
    <div v-if="loading && !categories.length" class="flex justify-center items-center py-12">
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

    <!-- Category List -->
    <div v-else class="flex flex-col">
      <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category Name</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parent Category</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="category in categories" :key="category._id">
                  <td class="px-6 py-4 whitespace-nowrap">{{ category.name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ category.parent ? findParentName(category.parent) : '-' }}
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm text-gray-900 line-clamp-2">
                      {{ category.description || '-' }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="[
                      category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
                      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full'
                    ]">
                      {{ category.isActive ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      @click="editCategory(category)"
                      class="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      @click="deleteCategory(category._id)"
                      class="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Pagination -->
          <div class="mt-4 flex items-center justify-between bg-white px-4 py-3 sm:px-6">
            <div class="flex flex-1 justify-between sm:hidden">
              <button
                @click="prevPage"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Showing
                  <span class="font-medium"> {{ (currentPage - 1) * pageSize + 1 }} </span>
                  to
                  <span class="font-medium"> {{ Math.min(currentPage * pageSize, allCategories.length) }} </span>
                  of
                  <span>{{ allCategories.length }} categories</span>
                </p>
              </div>
              <div>
                <Pagination 
                  :current-page="currentPage" 
                  :total-pages="totalPages" 
                  :max-visible-buttons="5"
                  @page-change="setPage"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Category Modal -->
    <Modal v-model="showModal">
      <template #title>
        {{ editMode ? 'Edit Category' : 'New Category' }}
      </template>

      <div class="space-y-5">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
          <input
            type="text"
            id="name"
            v-model="formData.name"
            class="w-full px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
            placeholder="Enter category name"
          />
        </div>

        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            id="description"
            v-model="formData.description"
            rows="3"
            class="w-full px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
            placeholder="Category description..."
          ></textarea>
        </div>

        <div>
          <label for="parent" class="block text-sm font-medium text-gray-700 mb-1">Parent Category</label>
          <div class="relative">
            <select
              id="parent"
              v-model="formData.parent"
              class="appearance-none w-full px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
            >
              <option value="">Main Category</option>
              <option 
                v-for="category in availableParentCategories" 
                :key="category._id" 
                :value="category._id"
              >
                {{ category.name }}
              </option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
              <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <p class="mt-1 text-xs text-gray-500">If no parent category is selected, it will be added as a main category.</p>
        </div>

        <div class="flex items-center">
          <label class="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              v-model="formData.isActive"
              class="rounded border-gray-300 text-gray-700 shadow-sm focus:border-gray-300 focus:ring focus:ring-offset-0 focus:ring-gray-200 focus:ring-opacity-50"
            />
            <span class="ml-2 text-sm text-gray-700">Active</span>
          </label>
        </div>
      </div>

      <template #footer>
        <button
          type="button"
          @click="showModal = false"
          :disabled="loading"
          class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          type="button"
          @click="saveCategory"
          :disabled="loading"
          class="ml-3 px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="loading" class="flex items-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Processing...
          </span>
          <span v-else>{{ editMode ? 'Update' : 'Save' }}</span>
        </button>
      </template>
    </Modal>

    <!-- Category Deletion Confirmation Modal -->
    <ConfirmationModal
      :is-open="showDeleteModal"
      title="Delete Category"
      message="Are you sure you want to delete this category? This action cannot be undone."
      confirm-text="Yes, Delete Category"
      cancel-text="No, Keep Category"
      type="danger"
      @confirm="confirmDeleteCategory"
      @cancel="hideDeleteModal"
    />
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import Modal from '../../components/Modal.vue';
import { categoryService } from '../../services/categoryService';
import { useToast } from 'vue-toastification';
import Pagination from '../../components/organisms/Pagination/index.vue';
import ConfirmationModal from '@/components/molecules/ConfirmationModal.vue';

export default {
  components: { Modal, Pagination, ConfirmationModal },
  setup() {
    const toast = useToast();
    const categories = ref([]);
    const showModal = ref(false);
    const editMode = ref(false);
    const loading = ref(false);
    const formData = ref({
      name: '',
      description: '',
      parent: '',
      isActive: true
    });

    // Pagination data
    const pageSize = 10; // Number of categories per page
    const allCategories = ref([]); // All categories
    const currentPage = ref(1); // Current page
    const totalPages = computed(() => Math.ceil(allCategories.value.length / pageSize));

    // Change page
    const setPage = (page) => {
      // Validate page number
      if (page < 1) page = 1;
      if (page > totalPages.value) page = totalPages.value;
      
      currentPage.value = page;
      
      // Calculate categories for current page
      const startIndex = (page - 1) * pageSize;
      const endIndex = Math.min(startIndex + pageSize, allCategories.value.length);
      categories.value = allCategories.value.slice(startIndex, endIndex);
    };

    // Go to next page
    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        setPage(currentPage.value + 1);
      }
    };

    // Go to previous page
    const prevPage = () => {
      if (currentPage.value > 1) {
        setPage(currentPage.value - 1);
      }
    };

    // Get all categories except subcategories of current category
    const availableParentCategories = computed(() => {
      if (!editMode.value) return allCategories.value;
      
      // In edit mode, show categories except itself and its subcategories
      const excludeIds = new Set();
      const findChildren = (categoryId) => {
        allCategories.value.forEach(cat => {
          if (cat.parent === categoryId) {
            excludeIds.add(cat._id);
            findChildren(cat._id);
          }
        });
      };
      
      excludeIds.add(formData.value._id);
      findChildren(formData.value._id);
      
      return allCategories.value.filter(cat => !excludeIds.has(cat._id));
    });

    const openModal = () => {
      editMode.value = false;
      formData.value = {
        name: '',
        description: '',
        parent: '',
        isActive: true
      };
      showModal.value = true;
    };

    const editCategory = (category) => {
      editMode.value = true;
      formData.value = {
        ...category,
        parent: category.parent || ''
      };
      showModal.value = true;
    };

    // Get categories
    const loadCategories = async () => {
      try {
        loading.value = true;
        const data = await categoryService.getAll();
        allCategories.value = data;
        setPage(1); // Show first page
      } catch (error) {
        toast.error('An error occurred while loading categories');
        console.error('Error loading categories:', error);
      } finally {
        loading.value = false;
      }
    };

    const saveCategory = async () => {
      try {
        loading.value = true;
        
        // Prepare form data
        const categoryData = {
          name: formData.value.name,
          description: formData.value.description,
          // Send parent value properly
          parent: formData.value.parent || null,
          isActive: formData.value.isActive
        };

        console.log('Category data to save:', categoryData);

        if (editMode.value) {
          await categoryService.update(formData.value._id, categoryData);
          toast.success('Category updated successfully');
        } else {
          await categoryService.create(categoryData);
          toast.success('Category created successfully');
        }
        showModal.value = false;
        await loadCategories();
      } catch (error) {
        toast.error('An error occurred while saving the category');
        console.error('Error saving category:', error);
      } finally {
        loading.value = false;
      }
    };

    // Add modal state for delete confirmation
    const showDeleteModal = ref(false);
    const categoryToDelete = ref(null);

    const deleteCategory = async (categoryId) => {
      categoryToDelete.value = categoryId;
      showDeleteModal.value = true;
    };

    const confirmDeleteCategory = async () => {
      try {
        loading.value = true;
        
        await categoryService.delete(categoryToDelete.value);
        toast.success('Category deleted successfully');
        await loadCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
        toast.error('Failed to delete category: ' + (error.response?.data?.message || error.message));
      } finally {
        loading.value = false;
        hideDeleteModal();
      }
    };

    const hideDeleteModal = () => {
      showDeleteModal.value = false;
      categoryToDelete.value = null;
    };

    // Find parent category name
    const findParentName = (parentId) => {
      // parentId can be an ObjectId string or an object
      const id = typeof parentId === 'object' && parentId._id ? parentId._id : parentId;
      const parent = allCategories.value.find(cat => cat._id === id);
      return parent ? parent.name : 'Unknown Category';
    };

    onMounted(() => {
      loadCategories();
    });

    // Export variables for use in template
    return {
      categories,
      allCategories,
      showModal,
      editMode,
      formData,
      loading,
      availableParentCategories,
      openModal,
      editCategory,
      findParentName,
      saveCategory,
      deleteCategory,
      // Pagination variables
      currentPage,
      totalPages,
      setPage,
      nextPage,
      prevPage,
      pageSize,
      showDeleteModal,
      hideDeleteModal,
      confirmDeleteCategory
    };
  }
}
</script> 