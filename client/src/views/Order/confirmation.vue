<template>
  <div class="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
    <div v-if="loading" class="flex justify-center items-center py-16">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
    
    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6">
      {{ error }}
    </div>
    
    <div v-else class="bg-white rounded-lg shadow-lg overflow-hidden">
      <!-- Success Message -->
      <div class="bg-green-50 p-8 sm:p-12 flex flex-col items-center">
        <div class="bg-green-100 p-3 rounded-full mb-5">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 text-center">Your Order Has Been Received</h1>
        <p class="text-gray-600 mt-3 mb-6 text-center max-w-2xl">
          Your order has been successfully created. You can see your order details below. You can visit the "My Orders" page in your account to track your order.
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <router-link to="/orders" class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            My Orders
          </router-link>
          <router-link to="/" class="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-50">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7m-7-7v14" />
            </svg>
            Continue Shopping
          </router-link>
        </div>
      </div>
      
      <!-- Order Information -->
      <div class="p-8 sm:px-12">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-xl font-semibold text-gray-900">Order Details</h2>
          <span class="text-gray-500">Order No: <span class="font-medium text-gray-900">{{ order._id?.slice(-6).toUpperCase() }}</span></span>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Products -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Products</h3>
            
            <ul class="divide-y divide-gray-200">
              <li v-for="item in order.orderItems" :key="item._id" class="py-4 flex">
                <div class="flex-shrink-0 w-16 h-16 border border-gray-200 rounded-md overflow-hidden">
                  <img :src="item.image" :alt="item.name" class="w-full h-full object-center object-cover">
                </div>
                <div class="ml-4 flex-1 flex flex-col">
                  <div>
                    <div class="flex justify-between text-base font-medium text-gray-900">
                      <h4>{{ item.name }}</h4>
                      <p class="ml-4">{{ formatPrice(item.price * (item.qty || item.quantity)) }}</p>
                    </div>
                    <p class="mt-1 text-sm text-gray-500">Quantity: {{ item.qty || item.quantity }}</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          
          <!-- Delivery and Payment -->
          <div>
            <div class="mb-8">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Delivery Information</h3>
              
              <div class="bg-gray-50 rounded-lg p-4">
                <p class="font-medium text-gray-900">{{ order.shippingAddress?.fullName }}</p>
                <address class="mt-2 not-italic text-gray-500">
                  <p>{{ order.shippingAddress?.address }}</p>
                  <p>{{ order.shippingAddress?.postalCode }}, {{ order.shippingAddress?.city }}</p>
                  <p>{{ order.shippingAddress?.country }}</p>
                  <p class="mt-2">{{ order.shippingAddress?.phone }}</p>
                </address>
              </div>
            </div>
            
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-4">Payment Information</h3>
              
              <div class="bg-gray-50 rounded-lg p-4">
                <p class="font-medium text-gray-900">{{ getPaymentMethodText(order.paymentMethod) }}</p>
                
                <div class="mt-4 border-t border-gray-200 pt-4 space-y-2">
                  <div class="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>{{ formatPrice(order.itemsPrice) }}</span>
                  </div>
                  <div class="flex justify-between text-sm text-gray-600">
                    <span>Shipping</span>
                    <span v-if="order.shippingPrice <= 0" class="text-green-600">Free</span>
                    <span v-else>{{ formatPrice(order.shippingPrice) }}</span>
                  </div>
                  <div class="flex justify-between text-sm text-gray-600">
                    <span>Tax</span>
                    <span>{{ formatPrice(order.taxPrice) }}</span>
                  </div>
                  <div class="flex justify-between font-medium text-gray-900 pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span>{{ formatPrice(order.totalPrice) }}</span>
                  </div>
                </div>
                
                <div v-if="order.isPaid" class="mt-4 bg-green-50 border border-green-100 text-green-700 px-4 py-2 rounded-md flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Payment received on {{ new Date(order.paidAt).toLocaleDateString('en-US') }}</span>
                </div>
                
                <div v-else-if="order.paymentMethod === 'cash_on_delivery'" class="mt-4 bg-yellow-50 border border-yellow-100 text-yellow-700 px-4 py-2 rounded-md flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>You can pay at delivery with the cash on delivery option.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Thank You for Choosing Us -->
      <div class="bg-gray-50 px-8 sm:px-12 py-6 text-center">
        <h3 class="text-lg font-medium text-gray-900 mb-2">Thank You for Choosing Us!</h3>
        <p class="text-gray-600">You will receive updates related to your order via email.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { orderService } from '@/services/orderService';

const route = useRoute();
const router = useRouter();

const order = ref({});
const loading = ref(true);
const error = ref(null);

// Fetch order
const fetchOrder = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const orderId = route.query.orderId;
    
    if (!orderId) {
      throw new Error('Order ID not found');
    }
    
    console.log('Fetching order details. ID:', orderId);
    order.value = await orderService.getOrderById(orderId);
    console.log('Order details:', order.value);
  } catch (err) {
    console.error('Error fetching order details:', err);
    error.value = err.response?.data?.message || 'Could not load order details. Please try again later.';
  } finally {
    loading.value = false;
  }
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

// Fetch order when component is mounted
onMounted(() => {
  if (!route.query.orderId) {
    console.error('Order ID not found, redirecting to home page...');
    router.push('/');
    return;
  }
  
  fetchOrder();
});
</script> 