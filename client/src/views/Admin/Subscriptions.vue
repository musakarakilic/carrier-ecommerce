<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-2xl font-semibold text-gray-900">Newsletter Subscription Management</h1>
      <div class="flex space-x-3">
        <button 
          @click="exportSubscriptions" 
          class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md flex items-center transition-colors duration-300"
          :disabled="loading || exportLoading"
        >
          <svg v-if="!exportLoading" class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <svg v-else class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ exportLoading ? 'Exporting...' : 'Export (CSV)' }}</span>
        </button>
        <button 
          @click="openModal('add')" 
          class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md flex items-center transition-colors duration-300"
        >
          <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Add Subscriber
        </button>
      </div>
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

    <!-- Search and Filtering -->
    <div v-else class="mb-6">
      <div class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
        <div class="flex-1">
          <label for="search" class="sr-only">Search</label>
          <div class="relative rounded-md shadow-sm">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="search"
              id="search"
              v-model="searchQuery"
              class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              placeholder="Search by email address..."
            />
          </div>
        </div>
        <div class="w-full sm:w-auto">
          <button 
            @click="refreshData" 
            class="flex justify-center items-center w-full sm:w-auto py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            <svg class="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div v-if="filteredSubscriptions.length > 0" class="bg-white shadow overflow-hidden rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscription Date</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="subscription in filteredSubscriptions" :key="subscription._id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ subscription.email }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500">{{ formatDate(subscription.createdAt) }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span v-if="subscription.isActive" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                Active
              </span>
              <span v-else class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                Cancelled
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
              <button 
                v-if="subscription.isActive" 
                @click="unsubscribe(subscription)" 
                class="text-red-600 hover:text-red-900">Unsubscribe</button>
              <button 
                v-else 
                @click="resubscribe(subscription)" 
                class="text-green-600 hover:text-green-900">Resubscribe</button>
              <button @click="openDeleteConfirmation(subscription)" class="text-red-600 hover:text-red-900">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- No data -->
    <div v-else-if="!filteredSubscriptions.length && !loading" class="bg-white shadow rounded-md p-6 text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No newsletter subscribers found</h3>
      <p class="mt-1 text-sm text-gray-500">Get started by adding your first subscriber.</p>
      <div class="mt-6">
        <button 
          @click="openModal('add')" 
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
        >
          <svg class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Subscriber
        </button>
      </div>
    </div>

    <!-- Add Subscriber Modal -->
    <div v-if="showModal" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="closeModal"></div>

        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Add New Subscriber
                </h3>
                <div class="mt-4">
                  <div>
                    <label for="email" class="block text-sm font-medium text-gray-700">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      v-model="formData.email"
                      class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="example@email.com"
                    />
                  </div>
                  
                  <div class="mt-4 flex items-center">
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
              @click="saveSubscription" 
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
              <span v-else>Add</span>
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
                  Delete Subscription
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Are you sure you want to delete the subscription for <strong>{{ selectedSubscription?.email }}</strong>? This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              @click="deleteSubscription" 
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
import { ref, reactive, computed, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { subscriptionService } from '../../services/subscriptionService';

const toast = useToast();

// State variables
const subscriptions = ref([]);
const loading = ref(true);
const error = ref(null);
const processing = ref(false);
const exportLoading = ref(false);
const showModal = ref(false);
const showDeleteModal = ref(false);
const searchQuery = ref('');
const selectedSubscription = ref(null);

// Form data
const formData = reactive({
  email: '',
  isActive: true
});

// Filtered subscriptions
const filteredSubscriptions = computed(() => {
  if (!searchQuery.value) {
    return subscriptions.value;
  }
  const query = searchQuery.value.toLowerCase();
  return subscriptions.value.filter(subscription => 
    subscription.email.toLowerCase().includes(query)
  );
});

// Get subscriptions
const fetchSubscriptions = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const result = await subscriptionService.getAll();
    subscriptions.value = result.data || result;
  } catch (err) {
    console.error('Error loading subscriptions:', err);
    error.value = 'An error occurred while loading subscriptions. Please try again later.';
  } finally {
    loading.value = false;
  }
};

// Format date
const formatDate = (dateString) => {
  if (!dateString) return 'Not specified';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Modal operations
const openModal = () => {
  formData.email = '';
  formData.isActive = true;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

// Add subscriber
const saveSubscription = async () => {
  if (!formData.email) {
    toast.error('Please enter an email address.');
    return;
  }
  
  if (!validateEmail(formData.email)) {
    toast.error('Please enter a valid email address.');
    return;
  }
  
  processing.value = true;
  
  try {
    await subscriptionService.subscribe(formData.email);
    toast.success('Subscriber successfully added.');
    await fetchSubscriptions();
    closeModal();
  } catch (err) {
    console.error('Error adding subscriber:', err);
    if (err.response?.status === 400 && err.response?.data?.message === 'This email is already subscribed') {
      toast.info('This email is already subscribed.');
    } else {
      toast.error('An error occurred while adding the subscriber. Please try again.');
    }
  } finally {
    processing.value = false;
  }
};

// Unsubscribe
const unsubscribe = async (subscription) => {
  processing.value = true;
  
  try {
    await subscriptionService.unsubscribe(subscription.email);
    toast.success(`Subscription for ${subscription.email} has been cancelled.`);
    await fetchSubscriptions();
  } catch (err) {
    console.error('Error cancelling subscription:', err);
    toast.error('An error occurred while cancelling the subscription. Please try again.');
  } finally {
    processing.value = false;
  }
};

// Resubscribe
const resubscribe = async (subscription) => {
  processing.value = true;
  
  try {
    await subscriptionService.resubscribe(subscription.email);
    toast.success(`${subscription.email} has been resubscribed.`);
    await fetchSubscriptions();
  } catch (err) {
    console.error('Error resubscribing:', err);
    toast.error('An error occurred while resubscribing. Please try again.');
  } finally {
    processing.value = false;
  }
};

// Delete operations
const openDeleteConfirmation = (subscription) => {
  selectedSubscription.value = subscription;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  selectedSubscription.value = null;
};

const deleteSubscription = async () => {
  if (!selectedSubscription.value) return;
  
  processing.value = true;
  
  try {
    await subscriptionService.delete(selectedSubscription.value._id);
    toast.success('Subscription successfully deleted.');
    await fetchSubscriptions();
    closeDeleteModal();
  } catch (err) {
    console.error('Error deleting subscription:', err);
    toast.error('An error occurred while deleting the subscription. Please try again.');
  } finally {
    processing.value = false;
  }
};

// Export as CSV
const exportSubscriptions = async () => {
  if (subscriptions.value.length === 0) {
    toast.info('No subscribers to export.');
    return;
  }
  
  exportLoading.value = true;
  
  try {
    // Create CSV header row
    let csv = 'Email,Subscription Date,Status\n';
    
    // Add a row for each subscriber
    subscriptions.value.forEach(subscription => {
      const status = subscription.isActive ? 'Active' : 'Cancelled';
      const date = subscription.createdAt ? new Date(subscription.createdAt).toLocaleDateString('en-US') : 'Not specified';
      csv += `${subscription.email},${date},${status}\n`;
    });
    
    // Create and download CSV file
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `subscriptions_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Subscriptions successfully exported.');
  } catch (err) {
    console.error('Error during export:', err);
    toast.error('An error occurred while exporting subscriptions.');
  } finally {
    exportLoading.value = false;
  }
};

// Refresh data
const refreshData = () => {
  fetchSubscriptions();
};

// Email validation
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Load subscriptions when page is mounted
onMounted(fetchSubscriptions);
</script> 