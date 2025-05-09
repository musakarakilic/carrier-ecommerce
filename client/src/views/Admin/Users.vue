<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">Users</h1>
      <button
        @click="openModal"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        :disabled="loading"
      >
        <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        New User
      </button>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
      {{ error }}
    </div>

    <!-- Loading -->
    <div v-if="loading && !users.length" class="text-center py-10">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
      <p class="mt-3 text-gray-600">Loading users...</p>
    </div>

    <!-- User List -->
    <div v-else class="flex flex-col">
      <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="user in users" :key="user._id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <img 
                          class="h-10 w-10 rounded-full object-cover border border-gray-200" 
                          :src="user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(getUserFullName(user))}&background=0D8ABC&color=fff`" 
                          :alt="getUserFullName(user)"
                        />
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">{{ getUserFullName(user) }}</div>
                        <div class="text-xs text-gray-500" v-if="user.phone">{{ user.phone }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ user.email }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {{ user.role === 'admin' ? 'Admin' : 'User' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="[
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
                      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full'
                    ]">
                      {{ user.isActive ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      @click="editUser(user)"
                      class="text-indigo-600 hover:text-indigo-900 mr-3"
                      :disabled="loading"
                    >
                      Edit
                    </button>
                    <button
                      @click="deleteUser(user._id)"
                      class="text-red-600 hover:text-red-900"
                      :disabled="loading"
                    >
                      Soft Delete
                    </button>
                  </td>
                </tr>
                <tr v-if="users.length === 0">
                  <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Pagination -->
          <div v-if="totalPages > 1" class="mt-4 flex justify-end">
            <Pagination 
              :current-page="currentPage" 
              :total-pages="totalPages" 
              :max-visible-buttons="5"
              @page-change="changePage"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- User Modal -->
    <Modal v-model="showModal" :maxWidth="'3xl'">
      <template #title>
        {{ editMode ? 'Edit User' : 'New User' }}
      </template>

      <!-- Error Message -->
      <div v-if="formError" class="mb-5 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
        {{ formError }}
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Left Section: Basic Information -->
        <div class="space-y-5">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                id="firstName"
                v-model="formData.firstName"
                class="w-full px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                placeholder="First Name"
              />
            </div>
            
            <div>
              <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                id="lastName"
                v-model="formData.lastName"
                class="w-full px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                placeholder="Last Name"
              />
            </div>
          </div>
          
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              id="email"
              v-model="formData.email"
              class="w-full px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              placeholder="example@email.com"
            />
          </div>

          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              id="phone"
              v-model="formData.phone"
              class="w-full px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              placeholder="(XXX) XXX-XXXX"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
              {{ editMode ? 'Password (Leave blank to keep unchanged)' : 'Password' }}
            </label>
            <input
              type="password"
              id="password"
              v-model="formData.password"
              class="w-full px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              :required="!editMode"
              placeholder="••••••••"
            />
          </div>
        </div>

        <!-- Right Section: Contact and Profile Photo -->
        <div class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">Profile Photo</label>
            <div class="flex items-center">
              <div class="flex-shrink-0 h-20 w-20 mb-2 relative">
                <img 
                  class="h-20 w-20 rounded-full object-cover border border-gray-200" 
                  :src="previewImage || (formData.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'User')}&background=0D8ABC&color=fff`)" 
                  alt="Profile"
                />
                <button 
                  v-if="previewImage || formData.profileImage" 
                  @click="clearImage"
                  class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  type="button"
                >
                  <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div class="ml-5">
                <label class="cursor-pointer inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md text-sm text-white hover:bg-gray-700">
                  <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Select Photo
                  <input 
                    type="file" 
                    class="hidden" 
                    accept="image/*" 
                    @change="handleImageUpload"
                  />
                </label>
                <p class="text-xs text-gray-500 mt-1">PNG, JPG, GIF (Max. 4MB)</p>
              </div>
            </div>
          </div>

          <div>
            <label for="address" class="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea
              id="address"
              v-model="formData.address"
              rows="3"
              class="w-full px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              placeholder="Address information..."
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="role" class="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <div class="relative">
                <select
                  id="role"
                  v-model="formData.role"
                  class="appearance-none w-full px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                >
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                  <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div class="flex items-end h-full">
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
        </div>
      </div>

      <template #footer>
        <button
          type="button"
          @click="showModal = false"
          class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors duration-200"
          :disabled="loading"
        >
          Cancel
        </button>
        <button
          type="button"
          @click="saveUser"
          class="ml-3 px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="loading"
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
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import Modal from '../../components/Modal.vue';
import { userService } from '../../services/userService';
import Pagination from '../../components/organisms/Pagination/index.vue';
import { useToast } from 'vue-toastification';

const toast = useToast();
const users = ref([]);
const showModal = ref(false);
const editMode = ref(false);
const loading = ref(false);
const error = ref('');
const formError = ref('');
const formData = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  role: 'user',
  isActive: true,
  password: '',
  profileImage: ''
});

// Profile photo
const imageFile = ref(null);
const previewImage = ref(null);

// Pagination parameters
const currentPage = ref(1);
const itemsPerPage = 10;
const totalUsers = ref(0);

// Total number of pages
const totalPages = computed(() => {
  return Math.ceil(totalUsers.value / itemsPerPage);
});

// Change page
const changePage = (page) => {
  currentPage.value = page;
  fetchUsers();
};

const fetchUsers = async () => {
  try {
    loading.value = true;
    const params = {
      page: currentPage.value,
      limit: itemsPerPage,
      search: ''
    };
    console.log('Fetching users:', params);
    
    const data = await userService.getAll(params);
    console.log('User data received:', data);
    
    users.value = data.users.map(user => {
      // Standardize data from API
      const processedUser = { ...user };
      
      // Set firstName and lastName as empty string if not present
      processedUser.firstName = processedUser.firstName || '';
      processedUser.lastName = processedUser.lastName || '';
      
      // Create username
      if (!processedUser.name) {
        processedUser.name = getUserFullName(processedUser);
      }
      
      return processedUser;
    });
    
    totalUsers.value = data.total;
    console.log(`Total users: ${totalUsers.value}, Total pages: ${totalPages.value}`);
  } catch (error) {
    console.error('Error fetching users:', error);
    error.value = 'An error occurred while loading users.';
  } finally {
    loading.value = false;
  }
};

const openModal = () => {
  editMode.value = false;
  formData.value = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    role: 'user',
    isActive: true,
    password: '',
    profileImage: ''
  };
  formError.value = '';
  previewImage.value = null;
  imageFile.value = null;
  showModal.value = true;
};

const editUser = (user) => {
  editMode.value = true;
  // Clean copy of all user data
  formData.value = { 
    ...JSON.parse(JSON.stringify(user)),
    password: '' // Don't show password
  };
  
  console.log('User data loaded for editing:', formData.value);
  
  // Show user's current photo in form
  if (user.profileImage) {
    console.log('User profile photo:', user.profileImage);
  }
  
  formError.value = '';
  previewImage.value = null;
  imageFile.value = null;
  showModal.value = true;
};

// Profile photo operations
const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  // File size check (2MB)
  if (file.size > 2 * 1024 * 1024) {
    toast.error('File size must be less than 2MB');
    return;
  }
  
  imageFile.value = file;
  
  // Read file for preview
  const reader = new FileReader();
  reader.onload = (e) => {
    previewImage.value = e.target.result;
  };
  reader.readAsDataURL(file);
};

const clearImage = () => {
  previewImage.value = null;
  imageFile.value = null;
  formData.value.profileImage = '';
};

const saveUser = async () => {
  loading.value = true;
  formError.value = '';
  
  try {
    // Transform form data
    const userData = { ...formData.value };
    
    // Don't send password to API if empty
    if (!userData.password) {
      delete userData.password;
    }
    
    // Check and configure username fields
    if (userData.firstName && userData.lastName) {
      // Create name by combining firstName and lastName
      userData.name = `${userData.firstName} ${userData.lastName}`.trim();
    }
    
    // Be careful to use id instead of _id
    const userId = userData._id;
    if (userId) {
      delete userData._id; // Remove MongoDB id from request body
    }

    // If a new profile photo is selected, add it as imageBase64
    if (previewImage.value && imageFile.value) {
      userData.profileImage = previewImage.value;
    }

    console.log("Data to be sent to API:", userData);

    let response;
    if (editMode.value && userId) {
      console.log(`Updating user. ID: ${userId}`);
      response = await userService.update(userId, userData);
      console.log("User update response:", response);
      toast.success('User successfully updated');
    } else {
      console.log('Creating new user');
      response = await userService.create(userData);
      console.log("User creation response:", response);
      toast.success('User successfully created');
    }
    
    // Close modal
    showModal.value = false;
    
    // Refresh list - add a small delay
    setTimeout(() => {
      fetchUsers();
    }, 500);
  } catch (error) {
    console.error('Error saving user:', error);
    formError.value = error.response?.data?.message || 'An error occurred while saving the user.';
  } finally {
    loading.value = false;
  }
};

const deleteUser = async (id) => {
  if (confirm('Are you sure you want to deactivate this user? The user will be marked as inactive but their data will remain in the system.')) {
    loading.value = true;
    error.value = '';
    
    try {
      await userService.delete(id);
      toast.success('User successfully deactivated');
      await fetchUsers();
    } catch (err) {
      error.value = err.response?.data?.message || 'An error occurred while deactivating the user';
      console.error('Error deactivating user:', err);
    } finally {
      loading.value = false;
    }
  }
};

// Helper function to create user's full name
const getUserFullName = (user) => {
  if (user.name) return user.name;
  if (user.firstName || user.lastName) {
    return `${user.firstName || ''} ${user.lastName || ''}`.trim();
  }
  return 'Unnamed User';
};

onMounted(() => {
  fetchUsers();
});
</script> 