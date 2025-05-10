<template>
  <!-- OrderDetail page -->
  <div class="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
    <div v-if="loading" class="flex justify-center items-center py-16">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
    
    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6">
      {{ error }}
    </div>
    
    <template v-else>
      <!-- Order title and navigation -->
      <div class="mb-8">
        <div class="flex flex-wrap items-center justify-between">
          <div>
            <router-link to="/orders" class="text-sm text-indigo-600 hover:text-indigo-900 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Orders
            </router-link>
            <h1 class="text-2xl font-bold text-gray-900 mt-2">Order #{{ order._id?.slice(-6).toUpperCase() }}</h1>
            <p class="text-sm text-gray-500 mt-1">
              {{ new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) }}
            </p>
          </div>
          
          <div class="mt-4 sm:mt-0">
            <span class="order-status" :class="getStatusClass(order.status)">
              {{ getStatusText(order.status) }}
            </span>
          </div>
        </div>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left side: Order information -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Products -->
          <div class="bg-white shadow-sm rounded-lg overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200">
              <h2 class="text-lg font-medium text-gray-900">Products</h2>
            </div>
            
            <div>
              <ul role="list" class="divide-y divide-gray-200">
                <li v-for="item in order.orderItems" :key="item._id" class="p-6 flex flex-wrap sm:flex-nowrap">
                  <div class="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                    <img :src="item.image" :alt="item.name" class="w-full h-full object-center object-cover">
                  </div>
                  
                  <div class="flex-1 ml-6">
                    <div class="flex justify-between">
                      <div>
                        <h3 class="text-base font-medium text-gray-900">{{ item.name }}</h3>
                        <p class="mt-1 text-sm text-gray-500">Quantity: {{ item.qty || item.quantity }}</p>
                      </div>
                      <p class="text-base font-medium text-gray-900">{{ formatPrice(item.price) }}</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          
          <!-- Delivery Information -->
          <div class="bg-white shadow-sm rounded-lg overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200">
              <h2 class="text-lg font-medium text-gray-900">Delivery Information</h2>
            </div>
            
            <div class="p-6">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <!-- Recipient Information -->
                <div>
                  <h3 class="text-sm font-medium text-gray-900 mb-2">Recipient</h3>
                  <p class="text-sm text-gray-500">{{ order.shippingAddress?.fullName }}</p>
                  <p class="text-sm text-gray-500">{{ order.shippingAddress?.phone }}</p>
                </div>
                
                <!-- Delivery Address -->
                <div>
                  <h3 class="text-sm font-medium text-gray-900 mb-2">Address</h3>
                  <address class="not-italic text-sm text-gray-500">
                    <p>{{ order.shippingAddress?.address }}</p>
                    <p>{{ order.shippingAddress?.postalCode }}, {{ order.shippingAddress?.city }}</p>
                    <p>{{ order.shippingAddress?.country }}</p>
                  </address>
                </div>
              </div>
              
              <!-- Shipping Information -->
              <div class="mt-6 pt-6 border-t border-gray-200">
                <h3 class="text-sm font-medium text-gray-900 mb-2">Shipping Status</h3>
                
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900">
                      {{ order.isDelivered ? 'Delivered' : 'Not Delivered' }}
                    </p>
                    <p class="text-sm text-gray-500" v-if="order.isDelivered && order.deliveredAt">
                      {{ new Date(order.deliveredAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }}
                    </p>
                    <p class="text-sm text-gray-500" v-else-if="order.trackingNumber">
                      Tracking number: {{ order.trackingNumber }}
                    </p>
                    <p class="text-sm text-gray-500" v-else>
                      Shipping information has not been entered yet.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Right side: Order Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white shadow-sm rounded-lg sticky top-6">
            <div class="px-6 py-4 border-b border-gray-200">
              <h2 class="text-lg font-medium text-gray-900">Order Summary</h2>
            </div>
            
            <div class="p-6 space-y-4">
              <!-- Price details -->
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Products</span>
                <span class="font-medium">{{ formatPrice(order.itemsPrice) }}</span>
              </div>
              
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Shipping</span>
                <span class="font-medium">{{ formatPrice(order.shippingPrice) }}</span>
              </div>
              
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Tax</span>
                <span class="font-medium">{{ formatPrice(order.taxPrice) }}</span>
              </div>
              
              <div class="pt-4 mt-2 border-t border-gray-200">
                <div class="flex justify-between items-center">
                  <span class="text-base font-medium text-gray-900">Total</span>
                  <span class="text-base font-medium text-gray-900">{{ formatPrice(order.totalPrice) }}</span>
                </div>
              </div>
              
              <!-- Payment Information -->
              <div class="pt-4 mt-2 border-t border-gray-200">
                <h3 class="text-sm font-medium text-gray-900 mb-3">Payment Information</h3>
                
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900">
                      {{ getPaymentMethodText(order.paymentMethod) }}
                    </p>
                    <p class="text-sm text-gray-500">
                      {{ order.isPaid ? 'Paid' : 'Payment Pending' }}
                      <span v-if="order.isPaid && order.paidAt">
                        · {{ new Date(order.paidAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              
              <!-- Order Status -->
              <div class="pt-4 mt-2 border-t border-gray-200">
                <h3 class="text-sm font-medium text-gray-900 mb-3">Order Status</h3>
                
                <div class="relative">
                  <!-- Status Steps -->
                  <div class="ml-6">
                    <div class="relative pb-8">
                      <span class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"></span>
                      <div class="relative flex items-start">
                        <div class="flex h-8 items-center">
                          <div class="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-green-100 ring-8 ring-white">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                        <div class="ml-4 min-w-0">
                          <p class="text-sm font-medium text-gray-900">Order Received</p>
                          <p class="text-xs text-gray-500">
                            {{ new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }) }}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div class="relative pb-8" v-if="order.isPaid">
                      <span v-if="order.isDelivered" class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"></span>
                      <div class="relative flex items-start">
                        <div class="flex h-8 items-center">
                          <div class="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-green-100 ring-8 ring-white">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                        <div class="ml-4 min-w-0">
                          <p class="text-sm font-medium text-gray-900">Payment Received</p>
                          <p class="text-xs text-gray-500">
                            {{ new Date(order.paidAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }) }}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div class="relative" v-if="order.isDelivered">
                      <div class="relative flex items-start">
                        <div class="flex h-8 items-center">
                          <div class="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-green-100 ring-8 ring-white">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                        <div class="ml-4 min-w-0">
                          <p class="text-sm font-medium text-gray-900">Delivered</p>
                          <p class="text-xs text-gray-500">
                            {{ new Date(order.deliveredAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }) }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Buttons -->
              <div class="pt-4 mt-2 border-t border-gray-200">
                
                <button 
                  v-if="order.status?.toLowerCase() === 'pending' || order.status?.toLowerCase() === 'processing'" 
                  @click="cancelOrder" 
                  class="w-full bg-white border border-red-500 text-red-600 py-2 px-6 rounded-lg hover:bg-red-50 font-medium transition-colors duration-300 focus:outline-none flex items-center justify-center"
                  :disabled="isCancelling"
                >
                  <span v-if="isCancelling" class="flex items-center">
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                  <span v-else>Cancel Order</span>
                </button>
                
                <a 
                  v-if="order.trackingNumber" 
                  href="#" 
                  target="_blank" 
                  class="mt-3 w-full bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 font-medium transition-colors duration-300 flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Track Shipment
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
  
  <!-- Order Cancellation Confirmation Modal -->
  <ConfirmationModal
    :is-open="showCancelModal"
    title="Cancel Order"
    message="Are you sure you want to cancel this order? This action cannot be undone."
    confirm-text="Yes, Cancel Order"
    cancel-text="No, Keep Order"
    type="danger"
    @confirm="handleConfirmCancel"
    @cancel="closeModal"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { orderService } from '@/services/orderService';
import { useToast } from 'vue-toastification';
import ConfirmationModal from '@/components/molecules/ConfirmationModal.vue';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const order = ref({});
const loading = ref(true);
const error = ref(null);
const isCancelling = ref(false);

// Confirmation modal state
const showCancelModal = ref(false);

// Fetch order
const fetchOrder = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const orderId = route.params.id;
    
    if (!orderId) {
      throw new Error('Order ID not found');
    }
    
    order.value = await orderService.getOrderById(orderId);
  } catch (err) {
    error.value = err.response?.data?.message || 'Could not load order details. Please try again later.';
    console.error('Error fetching order details:', err);
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

// Get payment method text
const getPaymentMethodText = (method) => {
  const methods = {
    'cash_on_delivery': 'Cash on Delivery',
    'credit_card': 'Credit/Debit Card'
  };
  
  return methods[method] || method;
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
const cancelOrder = async () => {
  showCancelModal.value = true;
};

// Handle confirmation
const handleConfirmCancel = async () => {
  isCancelling.value = true;
  showCancelModal.value = false;
  
  try {
    await orderService.cancelOrder(order.value._id);
    toast.success('Your order has been successfully cancelled.');
    
    // Reload order
    await fetchOrder();
  } catch (err) {
    toast.error(err.response?.data?.message || 'Could not cancel order. Please try again later.');
    console.error('Error cancelling order:', err);
  } finally {
    isCancelling.value = false;
  }
};

// Close modal
const closeModal = () => {
  showCancelModal.value = false;
};

// Fetch order when component is mounted
onMounted(() => {
  fetchOrder();
});
</script>

<style scoped>
.order-status {
  @apply inline-flex text-xs font-medium px-2.5 py-0.5 rounded-full;
}
</style> 