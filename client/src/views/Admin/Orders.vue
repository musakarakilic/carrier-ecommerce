<template>
  <div class="bg-white p-6 rounded-lg shadow">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Order Management</h1>
      <p class="text-gray-500">View, filter and manage orders</p>
    </div>

    <!-- Filtering and Search -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="col-span-1 md:col-span-2">
        <label for="search" class="block text-sm font-medium text-gray-700 mb-1">Search</label>
        <div class="flex">
          <input
            type="text"
            id="search"
            v-model="search"
            placeholder="Order No or Customer Name"
            class="w-full px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            @keyup.enter="searchOrders"
          />
          <button 
            @click.prevent="searchOrders"
            type="button"
            class="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 focus:outline-none"
          >
            Search
          </button>
        </div>
      </div>
      <div>
        <label for="status-filter" class="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
        <select
          id="status-filter"
          v-model="statusFilter"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <div>
        <label for="sort" class="block text-sm font-medium text-gray-700 mb-1">Sort</label>
        <select
          id="sort"
          v-model="sort"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="date_desc">Date: Newest to Oldest</option>
          <option value="date_asc">Date: Oldest to Newest</option>
          <option value="total_desc">Amount: High to Low</option>
          <option value="total_asc">Amount: Low to High</option>
          <option value="status">By Status</option>
        </select>
      </div>
    </div>

    <!-- Orders Table -->
    <div class="overflow-x-auto shadow border-b border-gray-200 sm:rounded-lg mb-6">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order No</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="orders.length === 0">
            <td colspan="7" class="px-6 py-4 text-center text-gray-500">
              No orders found to display.
            </td>
          </tr>
          <tr v-for="order in filteredOrders" :key="order.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              #{{ order.id.slice(-6).toUpperCase() }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ order.customer.name }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(order.date) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatPrice(order.total) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="{
                  'px-2 py-1 text-xs font-medium rounded-full': true,
                  'bg-green-100 text-green-800': order.paymentStatus === 'paid',
                  'bg-yellow-100 text-yellow-800': order.paymentStatus === 'pending',
                  'bg-red-100 text-red-800': order.paymentStatus === 'cancelled'
                }"
              >
                {{ getPaymentStatusLabel(order.paymentStatus) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="{
                  'px-2 py-1 text-xs font-medium rounded-full': true,
                  'bg-purple-100 text-purple-800': order.status === 'pending',
                  'bg-blue-100 text-blue-800': order.status === 'processing',
                  'bg-yellow-100 text-yellow-800': order.status === 'shipped',
                  'bg-green-100 text-green-800': order.status === 'delivered',
                  'bg-red-100 text-red-800 border border-red-400 font-bold': order.status === 'cancelled'
                }"
              >
                {{ getOrderStatusLabel(order.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <button
                @click="openOrderDetails(order)"
                class="text-indigo-600 hover:text-indigo-900 font-medium"
              >
                Edit
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Showing <span class="font-medium">{{ (currentPage - 1) * perPage + 1 }}</span>
            to
            <span class="font-medium">{{ Math.min(currentPage * perPage, totalOrderCount) }}</span>
            of
            <span class="font-medium">{{ totalOrderCount }}</span> orders
          </p>
        </div>
        <div>
          <Pagination 
            :current-page="currentPage" 
            :total-pages="totalPages" 
            :max-visible-buttons="5"
            @page-change="changePage"
          />
        </div>
      </div>
    </div>

    <!-- Order Details Modal -->
    <div v-if="selectedOrder" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold">Order #{{ selectedOrder.id }} - {{ getOrderStatusLabel(selectedOrder.status) }}</h2>
            <button @click="selectedOrder = null" class="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 class="text-lg font-medium mb-2">Customer Information</h3>
              <p><span class="font-medium">Name:</span> {{ selectedOrder.customer.name }}</p>
              <p><span class="font-medium">Email:</span> {{ selectedOrder.customer.email }}</p>
              <p><span class="font-medium">Phone:</span> {{ selectedOrder.customer.phone }}</p>
              <p class="mt-2"><span class="font-medium">Payment Method:</span> 
                <span 
                  :class="{
                    'px-2 py-1 ml-1 text-xs font-medium rounded-full': true,
                    'bg-blue-100 text-blue-800': selectedOrder.paymentMethod === 'creditCard',
                    'bg-green-100 text-green-800': selectedOrder.paymentMethod === 'cashOnDelivery'
                  }"
                >
                  {{ getPaymentMethodLabel(selectedOrder.paymentMethod) }}
                </span>
              </p>
            </div>
            <div>
              <h3 class="text-lg font-medium mb-2">Shipping Information</h3>
              <p><span class="font-medium">Address:</span> {{ selectedOrder.shippingAddress.address }}</p>
              <p><span class="font-medium">City:</span> {{ selectedOrder.shippingAddress.city }}, {{ selectedOrder.shippingAddress.postalCode }}</p>
              <p><span class="font-medium">Tracking Number:</span> {{ selectedOrder.trackingNumber || 'Not created yet' }}</p>
            </div>
          </div>

          <div class="mb-6">
            <h3 class="text-lg font-medium mb-2">Order Items</h3>
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(item, index) in selectedOrder.items" :key="index">
                  <td class="px-4 py-3">
                    <div class="flex items-center">
                      <img :src="item.product.image" alt="Product" class="w-12 h-12 object-cover rounded-md mr-3" />
                      <div>
                        <div class="font-medium text-gray-900">{{ item.product.name }}</div>
                        <div class="text-gray-500 text-sm">{{ item.product.sku }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-500">{{ formatPrice(item.unitPrice) }}</td>
                  <td class="px-4 py-3 text-sm text-gray-500">{{ item.quantity }}</td>
                  <td class="px-4 py-3 text-sm text-gray-500">{{ formatPrice(item.unitPrice * item.quantity) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="border-t border-gray-200 pt-4">
            <div class="flex justify-between text-sm mb-2">
              <span>Subtotal:</span>
              <span>{{ formatPrice(selectedOrder.subtotal) }}</span>
            </div>
            <div class="flex justify-between text-sm mb-2">
              <span>Shipping Fee:</span>
              <span>{{ formatPrice(selectedOrder.shippingFee) }}</span>
            </div>
            <div class="flex justify-between text-sm mb-2" v-if="selectedOrder.discount">
              <span>Discount:</span>
              <span>-{{ formatPrice(selectedOrder.discount) }}</span>
            </div>
            <div class="flex justify-between text-lg font-bold mt-2 pt-2 border-t border-gray-200">
              <span>Total:</span>
              <span>{{ formatPrice(selectedOrder.total) }}</span>
            </div>
          </div>

          <div class="mt-6 flex justify-between">
            <div>
              <h3 class="text-lg font-medium mb-2">Order Status</h3>
              <select
                v-model="newStatus"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div class="flex items-end">
              <button
                @click="saveOrderStatus"
                class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import axios from 'axios';
import Pagination from '../../components/organisms/Pagination/index.vue';

// State Data
const orders = ref([]);
const search = ref('');
const statusFilter = ref('');
const sort = ref('date_desc');
const currentPage = ref(1);
const perPage = ref(25);
const totalOrderCount = ref(0);
const selectedOrder = ref(null);
const newStatus = ref('');

// Load data
onMounted(() => {
  fetchOrders();
});

const fetchOrders = async () => {
  try {
    const token = localStorage.getItem('token');
    
    // Add pagination and filtering parameters
    const queryParams = new URLSearchParams({
      page: currentPage.value,
      limit: perPage.value
    });
    
    // Add search filter
    if (search.value.trim()) {
      queryParams.append('search', search.value.trim());
      // Alternative search parameters
      queryParams.append('keyword', search.value.trim());
      queryParams.append('query', search.value.trim());
    }
    
    // Add status filter
    if (statusFilter.value) {
      queryParams.append('status', getApiStatusFormat(statusFilter.value));
    }
    
    // Add sorting parameters
    let sortField = 'createdAt';
    let sortOrder = 'desc';
    
    switch (sort.value) {
      case 'date_asc':
        sortField = 'createdAt';
        sortOrder = 'asc';
        break;
      case 'total_desc':
        sortField = 'totalPrice';
        sortOrder = 'desc';
        break;
      case 'total_asc':
        sortField = 'totalPrice';
        sortOrder = 'asc';
        break;
      case 'status':
        sortField = 'status';
        sortOrder = 'asc';
        break;
    }
    
    queryParams.append('sortBy', sortField);
    queryParams.append('order', sortOrder);
    
    // Make API request
    const response = await axios.get(`/api/orders?${queryParams.toString()}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    // Log raw order data to debug payment methods
    if (response.data && Array.isArray(response.data.orders) && response.data.orders.length > 0) {

    }
    
    // Convert to orders.controller.js format
    const ordersData = Array.isArray(response.data) ? response.data : 
                       (response.data.orders && Array.isArray(response.data.orders)) ? response.data.orders : [];
    
    // Save total order count
    if (response.data.total) {
      totalOrderCount.value = response.data.total;
    } else {
      totalOrderCount.value = ordersData.length;
    }
    
    orders.value = ordersData.map(order => {
      // Create customer information for each order
      const customerName = order.user?.firstName && order.user?.lastName 
        ? `${order.user.firstName} ${order.user.lastName}`
        : order.user?.name || 'Unknown Customer';
      
      return {
        id: order._id,
        customer: {
          name: customerName,
          email: order.user?.email || 'Not specified',
          phone: order.shippingAddress?.phone || 'Not specified'
        },
        date: new Date(order.createdAt || Date.now()),
        subtotal: order.itemsPrice || 0,
        shippingFee: order.shippingPrice || 0,
        discount: 0, // Add discount information if available
        total: order.totalPrice || 0,
        paymentStatus: order.isPaid ? 'paid' : 'pending',
        paymentMethod: order.paymentMethod === 'stripe' || order.paymentMethod === 'Stripe' || 
                      (order.isPaid && !order.paymentMethod?.includes('cash')) ? 'creditCard' : 'cashOnDelivery',
        status: getOrderStatusKey(order.status),
        trackingNumber: order.trackingNumber || '',
        shippingAddress: {
          address: order.shippingAddress?.address || '',
          city: order.shippingAddress?.city || '',
          postalCode: order.shippingAddress?.postalCode || ''
        },
        items: Array.isArray(order.orderItems) ? order.orderItems.map(item => ({
          product: {
            id: item.product,
            name: item.name,
            sku: item.product, // Use product ID if SKU is not available
            image: item.image || 'https://via.placeholder.com/150'
          },
          unitPrice: item.price || 0,
          quantity: item.qty || item.quantity || 1
        })) : []
      };
    });
  } catch (error) {
    console.error('Error loading orders:', error);
    orders.value = []; // Empty list in case of error
  }
};

// Status key conversion helper function
const getOrderStatusKey = (status) => {
  const statusMap = {
    'pending': 'pending',
    'processing': 'processing',
    'shipped': 'shipped',
    'delivered': 'delivered',
    'cancelled': 'cancelled'
  };
  
  return statusMap[status] || 'pending';
};

// Filtered orders
const filteredOrders = computed(() => {
  let result = [...orders.value];
  
  // Search filter
  if (search.value) {
    const searchTerm = search.value.toLowerCase();
    result = result.filter(order => 
      order.id.toLowerCase().includes(searchTerm) || 
      order.customer.name.toLowerCase().includes(searchTerm)
    );
  }
  
  // Status filter
  if (statusFilter.value) {
    result = result.filter(order => order.status === statusFilter.value);
  }
  
  // Sorting
  switch (sort.value) {
    case 'date_desc':
      result.sort((a, b) => new Date(b.date) - new Date(a.date));
      break;
    case 'date_asc':
      result.sort((a, b) => new Date(a.date) - new Date(b.date));
      break;
    case 'total_desc':
      result.sort((a, b) => b.total - a.total);
      break;
    case 'total_asc':
      result.sort((a, b) => a.total - b.total);
      break;
    case 'status':
      result.sort((a, b) => {
        const statusOrder = {
          'pending': 1,
          'processing': 2,
          'shipped': 3,
          'delivered': 4,
          'cancelled': 5
        };
        return statusOrder[a.status] - statusOrder[b.status];
      });
      break;
  }
  
  return result;
});

// Pagination
const totalPages = computed(() => {
  // Use total number from backend
  return Math.ceil(totalOrderCount.value / perPage.value);
});

// Reload data when page changes
const changePage = (newPage) => {
  currentPage.value = newPage;
  fetchOrders(); // Reload data when page changes
};

const displayedPages = computed(() => {
  const pages = [];
  const maxPagesToShow = 5;
  
  if (totalPages.value <= maxPagesToShow) {
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i);
    }
    return pages;
  }
  
  const halfMax = Math.floor(maxPagesToShow / 2);
  let startPage = Math.max(currentPage.value - halfMax, 1);
  let endPage = startPage + maxPagesToShow - 1;
  
  if (endPage > totalPages.value) {
    endPage = totalPages.value;
    startPage = Math.max(endPage - maxPagesToShow + 1, 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  
  return pages;
});

// Helper functions
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
};

const getPaymentStatusLabel = (status) => {
  switch (status) {
    case 'paid': return 'Paid';
    case 'pending': return 'Pending';
    case 'cancelled': return 'Cancelled';
    default: return status;
  }
};

const getOrderStatusLabel = (status) => {
  switch (status) {
    case 'pending': return 'Pending';
    case 'processing': return 'Processing';
    case 'shipped': return 'Shipped';
    case 'delivered': return 'Delivered';
    case 'cancelled': return 'Cancelled';
    default: return status;
  }
};

const getPaymentMethodLabel = (method) => {
  switch (method) {
    case 'creditCard': return 'Credit Card';
    case 'cashOnDelivery': return 'Cash on Delivery';
    default: return method || 'Not specified';
  }
};

// Modal operations
const openOrderDetails = (order) => {
  selectedOrder.value = order;
  newStatus.value = order.status;
};

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

// Convert frontend status value to API status value
const getApiStatusFormat = (uiStatus) => {
  const statusMap = {
    'pending': 'pending',
    'processing': 'processing',
    'shipped': 'shipped',
    'delivered': 'delivered',
    'cancelled': 'cancelled'
  };
  
  return statusMap[uiStatus] || 'pending';
};

// Filtering and Search
const applyFilters = () => {
  currentPage.value = 1; // Return to first page when filter changes
  fetchOrders(); // Perform filtering on API
};

// When status filter changes
watch(statusFilter, () => {
  applyFilters();
});

// When sort changes
watch(sort, () => {
  applyFilters();
});

// Search function
const searchOrders = () => {
  // Reset page number and fetch orders directly
  currentPage.value = 1;
  fetchOrders(); // Call fetchOrders directly
};
</script> 