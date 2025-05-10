<template>
  <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <h1 class="text-2xl font-semibold text-gray-900 mb-8">My Orders</h1>
    
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
    
    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6">
      {{ error }}
    </div>
    
    <div v-else-if="orders.length === 0" class="text-center py-12">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">You don't have any orders yet</h3>
      <p class="text-gray-500 mb-6">Your orders will be displayed here.</p>
      <router-link to="/" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
        Start Shopping
      </router-link>
    </div>
    
    <div v-else class="space-y-6">
      <!-- List orders -->
      <div v-for="order in orders" :key="order._id" class="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <!-- Order header -->
        <div class="bg-gray-50 border-b border-gray-200 px-4 py-4 sm:px-6 flex flex-wrap justify-between items-center">
          <div class="mb-2 sm:mb-0">
            <div class="flex items-center space-x-3">
              <h2 class="text-lg font-medium text-gray-900">Order #{{ order._id.slice(-6).toUpperCase() }}</h2>
              <span class="order-status" :class="getStatusClass(order.status)">
                {{ getStatusText(order.status) }}
              </span>
            </div>
            <p class="text-sm text-gray-500 mt-1">
              {{ new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }}
            </p>
          </div>
          <div class="font-medium">
            <span class="text-gray-700">Total: </span>
            <span class="text-lg text-gray-900">{{ formatPrice(order.totalPrice) }}</span>
          </div>
        </div>
        
        <!-- Order products -->
        <div class="p-4 sm:p-6">
          <ul class="divide-y divide-gray-200">
            <li v-for="item in order.orderItems" :key="item._id" class="py-4 flex flex-wrap sm:flex-nowrap">
              <div class="flex-shrink-0 w-16 h-16 border border-gray-200 rounded-md overflow-hidden">
                <img :src="item.image" :alt="item.name" class="w-full h-full object-center object-cover">
              </div>
              <div class="ml-4 flex-1">
                <div class="flex justify-between">
                  <h3 class="text-sm font-medium text-gray-900">{{ item.name }}</h3>
                  <p class="ml-4 text-sm font-medium text-gray-900">{{ formatPrice(item.price) }}</p>
                </div>
                <p class="mt-1 text-sm text-gray-500">Quantity: {{ item.qty }}</p>
              </div>
            </li>
          </ul>
        </div>
        
        <!-- Order details -->
        <div class="border-t border-gray-200 p-4 sm:p-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
          <div>
            <h3 class="text-sm font-medium text-gray-900 mb-2">Delivery Information</h3>
            <address class="not-italic text-sm text-gray-500">
              <p>{{ order.shippingAddress.address }}</p>
              <p>{{ order.shippingAddress.postalCode }}, {{ order.shippingAddress.city }}</p>
              <p>{{ order.shippingAddress.country }}</p>
            </address>
          </div>
          
          <div>
            <h3 class="text-sm font-medium text-gray-900 mb-2">Order Status</h3>
            <div class="space-y-2 text-sm text-gray-500">
              <p v-if="order.isPaid">
                <span class="font-medium text-green-600">Paid</span>
                <span v-if="order.paidAt"> · {{ new Date(order.paidAt).toLocaleDateString('tr-TR') }}</span>
              </p>
              <p v-else class="font-medium text-yellow-600">Payment Pending</p>
              
              <p v-if="order.isDelivered">
                <span class="font-medium text-green-600">Delivered</span>
                <span v-if="order.deliveredAt"> · {{ new Date(order.deliveredAt).toLocaleDateString('tr-TR') }}</span>
              </p>
              
              <p v-if="order.trackingNumber">
                <span class="font-medium">Tracking: </span>
                <span>{{ order.trackingNumber }}</span>
              </p>
            </div>
          </div>
        </div>
        
        <!-- Order action buttons -->
        <div class="border-t border-gray-200 px-4 py-4 sm:px-6 flex flex-wrap justify-between items-center space-y-2 sm:space-y-0">
          <router-link :to="`/order/${order._id}`" class="text-indigo-600 hover:text-indigo-800 font-medium">
            Order Details
          </router-link>
          
          <div class="flex flex-wrap gap-2">
            <button 
              v-if="order.status === 'Beklemede' || order.status === 'İşleniyor'" 
              @click="cancelOrder(order._id)" 
              class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white hover:bg-gray-50"
              :disabled="cancelling"
            >
              Cancel Order
            </button>
            
            <a 
              v-if="order.trackingNumber" 
              href="#" 
              target="_blank" 
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Track Delivery
            </a>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Cancel Order Confirmation Modal -->
    <ConfirmationModal
      :is-open="showCancelModal"
      title="Cancel Order"
      message="Are you sure you want to cancel this order? This action cannot be undone."
      confirm-text="Yes, Cancel Order"
      cancel-text="No, Keep Order"
      type="danger"
      @confirm="confirmCancelOrder"
      @cancel="hideCancelModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { orderService } from '@/services/orderService';
import { useToast }  from 'vue-toastification';
import ConfirmationModal from '@/components/molecules/ConfirmationModal.vue';

const orders = ref([]);
const loading = ref(true);
const error = ref(null);
const cancelling = ref(false);
const toast = useToast();

// Confirmation modal state
const showCancelModal = ref(false);
const selectedOrderId = ref(null);

// Get orders
const fetchOrders = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    orders.value = await orderService.getUserOrders();
  } catch (err) {
    error.value = err.response?.data?.message || 'Orders could not be loaded. Please try again later.';
    console.error('Error loading orders:', err);
  } finally {
    loading.value = false;
  }
};

// Get status class based on order status
const getStatusClass = (status) => {
  const statusClasses = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'processing': 'bg-blue-100 text-blue-800',
    'shipped': 'bg-purple-100 text-purple-800',
    'delivered': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800 border border-red-400 font-bold'
  };
  
  return statusClasses[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
};

// Get status text
const getStatusText = (status) => {
  // First letter uppercase
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};

// Format price
const formatPrice = (price) => {
  if (!price) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
};

// Cancel order
const cancelOrder = async (orderId) => {
  selectedOrderId.value = orderId;
  showCancelModal.value = true;
};

const confirmCancelOrder = async () => {
  cancelling.value = true;
  
  try {
    await orderService.cancelOrder(selectedOrderId.value);
    toast.success('Order cancelled successfully.');
    
    // Reload orders
    await fetchOrders();
  } catch (err) {
    toast.error(err.response?.data?.message || 'Order cancellation failed. Please try again later.');
    console.error('Order cancellation error:', err);
  } finally {
    cancelling.value = false;
    showCancelModal.value = false;
  }
};

const hideCancelModal = () => {
  showCancelModal.value = false;
};

// Fetch orders when component is mounted
onMounted(() => {
  fetchOrders();
});
</script>

<style scoped>
.order-status {
  @apply inline-flex text-xs font-medium px-2.5 py-0.5 rounded-full;
}
</style> 