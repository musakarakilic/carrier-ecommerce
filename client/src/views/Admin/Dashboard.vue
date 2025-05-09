<template>
  <div>
    <h1 class="text-2xl font-semibold text-gray-900">Dashboard</h1>
    
    <!-- Statistics Cards -->
    <div class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <!-- Total Products Card -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Total Products
                </dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">
                    {{ totalProducts }}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Total Orders Card -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Total Orders
                </dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">
                    {{ totalOrders }}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Total Revenue Card -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Total Revenue
                </dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">
                    {{ formatPrice(totalRevenue) }}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="mt-8">
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            v-for="tab in tabs"
            :key="tab.name"
            @click="currentTab = tab.id"
            :class="[
              currentTab === tab.id
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
            ]"
          >
            {{ tab.name }}
          </button>
        </nav>
      </div>
    </div>

    <!-- Products Tab -->
    <div v-if="currentTab === 'products'" class="mt-6">
      <SearchFilter
        @search="handleSearch"
        @filter="handleFilter"
      />
      <div class="mt-4 flex flex-col">
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
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="product in filteredProducts" :key="product.id">
                    <td class="px-6 py-4 whitespace-nowrap">{{ product.name }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{{ product.category }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">${{ product.price }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{{ product.stock }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Orders Tab -->
    <div v-if="currentTab === 'orders'" class="mt-6">
      <div class="flex flex-col">
        <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <!-- Order summary cards -->
            <div class="grid grid-cols-1 gap-5 sm:grid-cols-3 lg:grid-cols-5 mb-6">
              <!-- Pending Orders -->
              <div class="bg-yellow-50 overflow-hidden shadow rounded-lg border border-yellow-200">
                <div class="p-5">
                  <div class="flex items-center">
                    <div class="ml-5 w-0 flex-1">
                      <dl>
                        <dt class="text-sm font-medium text-yellow-800 truncate">
                          Pending Orders
                        </dt>
                        <dd class="flex items-baseline">
                          <div class="text-2xl font-semibold text-yellow-900">
                            {{ orderStats.pending }}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Processing Orders -->
              <div class="bg-blue-50 overflow-hidden shadow rounded-lg border border-blue-200">
                <div class="p-5">
                  <div class="flex items-center">
                    <div class="ml-5 w-0 flex-1">
                      <dl>
                        <dt class="text-sm font-medium text-blue-800 truncate">
                          Processing Orders
                        </dt>
                        <dd class="flex items-baseline">
                          <div class="text-2xl font-semibold text-blue-900">
                            {{ orderStats.processing }}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Shipped Orders -->
              <div class="bg-purple-50 overflow-hidden shadow rounded-lg border border-purple-200">
                <div class="p-5">
                  <div class="flex items-center">
                    <div class="ml-5 w-0 flex-1">
                      <dl>
                        <dt class="text-sm font-medium text-purple-800 truncate">
                          Shipped Orders
                        </dt>
                        <dd class="flex items-baseline">
                          <div class="text-2xl font-semibold text-purple-900">
                            {{ orderStats.shipped }}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Delivered Orders -->
              <div class="bg-green-50 overflow-hidden shadow rounded-lg border border-green-200">
                <div class="p-5">
                  <div class="flex items-center">
                    <div class="ml-5 w-0 flex-1">
                      <dl>
                        <dt class="text-sm font-medium text-green-800 truncate">
                          Delivered Orders
                        </dt>
                        <dd class="flex items-baseline">
                          <div class="text-2xl font-semibold text-green-900">
                            {{ orderStats.delivered }}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Cancelled Orders -->
              <div class="bg-red-50 overflow-hidden shadow rounded-lg border border-red-200">
                <div class="p-5">
                  <div class="flex items-center">
                    <div class="ml-5 w-0 flex-1">
                      <dl>
                        <dt class="text-sm font-medium text-red-800 truncate">
                          Cancelled Orders
                        </dt>
                        <dd class="flex items-baseline">
                          <div class="text-2xl font-semibold text-red-900">
                            {{ orderStats.cancelled }}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Orders table -->
            <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order No</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="order in paginatedOrders" :key="order._id">
                    <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">#{{ order._id.slice(-6).toUpperCase() }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      {{ order.user && order.user.name ? order.user.name : 'Guest' }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      {{ formatDate(order.createdAt) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap font-medium">
                      {{ formatPrice(order.totalPrice) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="[
                        order.isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800',
                        'px-2 inline-flex text-xs leading-5 font-semibold rounded-full'
                      ]">
                        {{ order.isPaid ? 'Paid' : 'Pending' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="getStatusClass(order.status)">
                        {{ order.status }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Pagination -->
            <div class="mt-4 flex justify-center">
              <nav class="relative z-0 inline-flex rounded-md shadow-sm" aria-label="Pagination">
                <!-- Previous page button -->
                <button
                  @click="changeOrderPage(currentOrderPage - 1)"
                  :disabled="currentOrderPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  :class="{'opacity-50 cursor-not-allowed': currentOrderPage === 1}"
                >
                  <span class="sr-only">Previous</span>
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
                
                <!-- Page numbers -->
                <template v-for="page in displayedOrderPages" :key="page">
                  <button
                    @click="changeOrderPage(page)"
                    class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium"
                    :class="currentOrderPage === page ? 'bg-indigo-50 text-indigo-600 z-10' : 'text-gray-500 hover:bg-gray-50'"
                  >
                    {{ page }}
                  </button>
                </template>
                
                <!-- Next page button -->
                <button
                  @click="changeOrderPage(currentOrderPage + 1)"
                  :disabled="currentOrderPage === totalOrderPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  :class="{'opacity-50 cursor-not-allowed': currentOrderPage === totalOrderPages}"
                >
                  <span class="sr-only">Next</span>
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Categories Tab -->
    <div v-if="currentTab === 'categories'" class="mt-6">
      <div class="flex flex-col">
        <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category Name</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Count</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="category in categories" :key="category.id">
                    <td class="px-6 py-4 whitespace-nowrap">{{ category.name }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{{ category.productCount }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="[
                        category.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
                        'px-2 inline-flex text-xs leading-5 font-semibold rounded-full'
                      ]">
                        {{ category.active ? 'Active' : 'Inactive' }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Users Tab -->
    <div v-if="currentTab === 'users'" class="mt-6">
      <div class="flex flex-col">
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
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="user in users" :key="user.id">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                          <img class="h-10 w-10 rounded-full" :src="user.avatar" alt="" />
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">{{ user.email }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {{ user.role }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="[
                        user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
                        'px-2 inline-flex text-xs leading-5 font-semibold rounded-full'
                      ]">
                        {{ user.active ? 'Active' : 'Inactive' }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import SearchFilter from './components/SearchFilter.vue';

const currentTab = ref('orders'); // Start with orders tab active
const tabs = [
  { id: 'orders', name: 'Orders' }
];

const totalProducts = ref(0);
const totalUsers = ref(0);
const totalOrders = ref(0);
const totalRevenue = ref(0);
const products = ref([]);
const categories = ref([]);
const users = ref([]);
const orders = ref([]);
const searchQuery = ref('');
const selectedCategory = ref('');

// Order statistics and pagination variables
const orderStats = ref({
  pending: 0,    // Pending
  processing: 0, // Processing
  shipped: 0,    // Shipped
  delivered: 0,  // Delivered
  cancelled: 0   // Cancelled
});

// Order pagination variables
const currentOrderPage = ref(1);
const orderPerPage = ref(10);
const totalOrderPages = ref(1);

// Filtered products
const filteredProducts = computed(() => {
  return products.value.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesCategory = !selectedCategory.value || product.category === selectedCategory.value;
    return matchesSearch && matchesCategory;
  });
});

const handleSearch = (query) => {
  searchQuery.value = query;
};

const handleFilter = (category) => {
  selectedCategory.value = category;
};

// Date formatting
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

// Price formatting
const formatPrice = (price) => {
  if (!price) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
};

// Get status class based on order status
const getStatusClass = (status) => {
  const classes = {
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Processing': 'bg-blue-100 text-blue-800',
    'Shipped': 'bg-purple-100 text-purple-800',
    'Delivered': 'bg-green-100 text-green-800',
    'Cancelled': 'bg-red-100 text-red-800'
  };
  
  return `px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${classes[status] || 'bg-gray-100 text-gray-800'}`;
};

// Calculate order statistics - Updated according to API statuses
const calculateOrderStats = (orders) => {
  const stats = {
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0
  };
  
  orders.forEach(order => {
    // Check according to API status values
    if (order.status === 'Pending' || order.status === 'pending') {
      stats.pending++;
    } 
    else if (order.status === 'Processing' || order.status === 'processing') {
      stats.processing++;
    }
    else if (order.status === 'Shipped' || order.status === 'shipped') {
      stats.shipped++;
    }
    else if (order.status === 'Delivered' || order.status === 'delivered') {
      stats.delivered++;
    }
    else if (order.status === 'Cancelled' || order.status === 'cancelled') {
      stats.cancelled++;
    }
  });
  
  return stats;
};

// Future improved statistics calculation function
// Note: This is not currently used, will be activated after examining API response
const improvedCalculateOrderStats = (orders) => {
  const stats = {
    pending: 0,    // Pending
    processing: 0, // Processing
    shipped: 0,    // Shipped
    delivered: 0,  // Delivered
    cancelled: 0   // Cancelled
  };
  
  // Fill this after examining API response
  // Example:
  // orders.forEach(order => {
  //   const status = order.status.toLowerCase();
  //   if (status === 'pending') {
  //     stats.pending++;
  //   } 
  //   else if (status === 'processing') {
  //     stats.processing++;
  //   }
  //   // ...and other statuses
  // });
  
  return stats;
};

// Show paginated orders
const paginatedOrders = computed(() => {
  const start = (currentOrderPage.value - 1) * orderPerPage.value;
  const end = start + orderPerPage.value;
  return orders.value.slice(start, end);
});

// Calculate page numbers to display
const displayedOrderPages = computed(() => {
  const pages = [];
  const maxVisiblePages = 5; // Maximum number of page numbers to show
  
  if (totalOrderPages.value <= maxVisiblePages) {
    // If total pages are few, show all
    for (let i = 1; i <= totalOrderPages.value; i++) {
      pages.push(i);
    }
  } else {
    // If many pages, show around current page
    const halfVisible = Math.floor(maxVisiblePages / 2);
    let startPage = Math.max(currentOrderPage.value - halfVisible, 1);
    const endPage = Math.min(startPage + maxVisiblePages - 1, totalOrderPages.value);
    
    // Adjust start page if approaching last page
    if (endPage === totalOrderPages.value) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
  }
  
  return pages;
});

// Page change function
const changeOrderPage = (page) => {
  currentOrderPage.value = page;
};

// Get orders
const fetchOrders = async () => {
  try {
    const token = localStorage.getItem('token');
    // Add pagination parameters, but still fetch all orders for dashboard
    const response = await axios.get('/api/orders', {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        limit: 100 // Fetch more orders for dashboard
      }
    });
    
    // Log API response in detail
    console.log('API order response:', response.data);
    
    // See example status values
    if (Array.isArray(response.data)) {
      const statuses = [...new Set(response.data.map(order => order.status))];
      console.log('Current order statuses:', statuses);
    } else if (response.data.orders && Array.isArray(response.data.orders)) {
      const statuses = [...new Set(response.data.orders.map(order => order.status))];
      console.log('Current order statuses:', statuses);
    }
    
    // Check and process API response format
    let ordersData = [];
    if (Array.isArray(response.data)) {
      ordersData = response.data;
    } else if (response.data.orders && Array.isArray(response.data.orders)) {
      ordersData = response.data.orders;
      totalOrders.value = response.data.total || ordersData.length;
    } else {
      console.warn('Unexpected order data format:', response.data);
      return;
    }
    
    // Save orders
    orders.value = ordersData;
    totalOrders.value = ordersData.length;
    totalOrderPages.value = Math.ceil(ordersData.length / orderPerPage.value);
    
    // Log statuses before calculating statistics
    const orderStatusCounts = {};
    ordersData.forEach(order => {
      const status = order.status;
      orderStatusCounts[status] = (orderStatusCounts[status] || 0) + 1;
    });
    console.log('Order status counts:', orderStatusCounts);
    
    // Calculate total revenue from orders
    totalRevenue.value = ordersData.reduce((total, order) => {
      // Only include paid and non-cancelled orders in revenue
      if (order.isPaid && order.status !== 'Cancelled' && order.status !== 'cancelled') {
        return total + (order.totalPrice || 0);
      }
      return total;
    }, 0);
    
    // Calculate order statistics
    orderStats.value = calculateOrderStats(ordersData);
    console.log('Calculated order statistics:', orderStats.value);
    
  } catch (error) {
    console.error('Error loading orders:', error);
  }
};

// Get products
const fetchProducts = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('/api/products', {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        limit: 1,  // Minimum data to get total count
        count: true // Only count
      }
    });
    
    // Check and process API response format
    if (response.data && typeof response.data.total === 'number') {
      // If API returns total value, use it
      totalProducts.value = response.data.total;
    } else if (response.data && Array.isArray(response.data.products)) {
      // If products array exists, use its length
      totalProducts.value = response.data.products.length;
    } else if (Array.isArray(response.data)) {
      // If direct array is returned, use its length
      totalProducts.value = response.data.length;
    } else {
      console.warn('Unexpected product data format, could not get product count:', response.data);
      totalProducts.value = 0;
    }
  } catch (error) {
    console.error('Error getting product count:', error);
    totalProducts.value = 0;
  }
};

// Get categories
const fetchCategories = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('/api/categories', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    // Check and process API response format
    let categoriesData = [];
    if (Array.isArray(response.data)) {
      categoriesData = response.data;
    } else if (response.data.categories && Array.isArray(response.data.categories)) {
      categoriesData = response.data.categories;
    } else {
      console.warn('Unexpected category data format:', response.data);
      return;
    }
    
    // Save categories
    categories.value = categoriesData.map(category => ({
      id: category._id,
      name: category.name,
      productCount: category.productCount || 0,
      active: category.isActive !== false
    }));
    
    console.log('Categories loaded successfully:', categoriesData.length);
    
  } catch (error) {
    console.error('Error loading categories:', error);
    // Default data in case of error
    categories.value = [];
  }
};

// Get users
const fetchUsers = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('/api/users', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    // Check and process API response format
    let usersData = [];
    if (Array.isArray(response.data)) {
      usersData = response.data;
    } else if (response.data.users && Array.isArray(response.data.users)) {
      usersData = response.data.users;
      totalUsers.value = response.data.total || usersData.length;
    } else {
      console.warn('Unexpected user data format:', response.data);
      return;
    }
    
    // Save users
    users.value = usersData.map(user => {
      const fullName = user.firstName && user.lastName 
        ? `${user.firstName} ${user.lastName}` 
        : user.name || 'Unnamed User';
        
      return {
        id: user._id,
        name: fullName,
        email: user.email,
        role: user.role || 'User',
        active: user.isActive !== false,
        avatar: user.avatar || 'https://i.pravatar.cc/150?img=' + (Math.floor(Math.random() * 70) + 1)
      };
    });
    
    totalUsers.value = usersData.length;
    
  } catch (error) {
    console.error('Error loading users:', error);
    // Default data in case of error
    totalUsers.value = 0;
    users.value = [];
  }
};

onMounted(async () => {
  try {
    // Fetch order and product data
    await Promise.all([
      fetchOrders(),
      fetchProducts()
    ]);
  } catch (error) {
    console.error('Error loading dashboard data:', error);
  }
});

// Now only orders tab exists

// Update order status
const saveOrderStatus = async () => {
  try {
    const token = localStorage.getItem('token');
    
    // Convert to API status format
    const apiStatus = getApiStatusFormat(newStatus.value);
    
    await axios.put(
      `/api/orders/${selectedOrder.value.id}/status`,
      { status: apiStatus },
      { headers: { Authorization: `Bearer ${token}` }}
    );
    
    // Update UI after successful update
    selectedOrder.value.status = newStatus.value;
    
    // Close modal
    selectedOrder.value = null;
    
    // Reload orders
    fetchOrders();
    
  } catch (error) {
    console.error('Error updating order status:', error);
  }
};
</script> 