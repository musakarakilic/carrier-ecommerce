<template>
  <div class="bg-white shadow overflow-hidden sm:rounded-lg">
    <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
      <div>
        <h3 class="text-lg leading-6 font-medium text-gray-900">My Orders</h3>
        <p class="mt-1 max-w-2xl text-sm text-gray-500">Your recent purchases and order statuses</p>
      </div>
    </div>
    
    <div v-if="orders.length === 0" class="border-t border-gray-200 px-4 py-8 text-center text-sm text-gray-500">
      <component is="i-ph-shopping-cart" class="mx-auto h-12 w-12 text-gray-400" />
      <p class="mt-2">You haven't placed any orders yet.</p>
      <p class="mt-1">
        <router-link to="/" class="text-primary-600 hover:text-primary-500">
          Click here to start shopping
        </router-link>
      </p>
    </div>
    
    <div v-else class="border-t border-gray-200 overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Order No
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="order in orders" :key="order._id">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ formatOrderId(order._id) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(order.createdAt) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatPrice(order.totalPrice) }} TL
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="getOrderStatusClass(order.status)"
              >
                {{ getOrderStatusText(order.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <button 
                @click="emit('view-order', order._id)"
                class="bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700 transition-colors duration-200"
              >
                Details
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
defineProps({
  orders: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['view-order']);

// Format order number
const formatOrderId = (id) => {
  if (!id) return '';
  
  // Get last 6 characters of ID
  const shortId = id.slice(-6).toUpperCase();
  return `#${shortId}`;
};

// Format date
const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

// Format price
const formatPrice = (price) => {
  if (!price) return '0.00';
  
  return parseFloat(price).toFixed(2);
};

// Get order status class
const getOrderStatusClass = (status) => {
  const statusClasses = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'processing': 'bg-blue-100 text-blue-800',
    'shipped': 'bg-indigo-100 text-indigo-800',
    'delivered': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800'
  };
  
  return statusClasses[status] || 'bg-gray-100 text-gray-800';
};

// Get order status text
const getOrderStatusText = (status) => {
  const statusTexts = {
    'pending': 'Pending',
    'processing': 'Processing',
    'shipped': 'Shipped',
    'delivered': 'Delivered',
    'cancelled': 'Cancelled'
  };
  
  return statusTexts[status] || 'Unknown';
};
</script> 