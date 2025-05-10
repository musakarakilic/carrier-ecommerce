<template>
  <div class="bg-gray-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">My Cart</h1>
      
      <!-- Empty cart state -->
      <div v-if="!cartItems.length" class="bg-white rounded-xl shadow-md p-8 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h2 class="text-xl font-semibold text-gray-800 mb-2">Your cart is empty</h2>
        <p class="text-gray-600 mb-6">There are no products in your cart.</p>
        <RouterLink to="/" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          Continue Shopping
        </RouterLink>
      </div>
      
      <!-- Cart with items -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Cart items list -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-xl shadow-md overflow-hidden">
            <!-- Bulk actions -->
            <div class="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <h3 class="font-medium text-gray-700">Products ({{ cartItems.length }})</h3>
              <button 
                @click="clearCart"
                class="text-sm text-red-600 hover:text-red-800 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear All
              </button>
            </div>
            <ul class="divide-y divide-gray-200">
              <li v-for="(item, index) in cartItems" :key="index" class="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <!-- Product image -->
                <a :href="`/product/${item._id || item.productId}`" target="_blank" class="block">
                  <img 
                    :src="item.image || 'https://placehold.co/100'" 
                    :alt="item.name"
                    class="h-20 w-20 object-cover rounded-lg bg-gray-50"
                  >
                </a>
                
                <!-- Product details -->
                <div class="flex-grow">
                  <a :href="`/product/${item._id || item.productId}`" target="_blank" class="hover:text-indigo-600">
                    <h3 class="text-base font-medium text-gray-900">{{ item.name }}</h3>
                  </a>
                  <p class="text-sm text-gray-500">Unit Price: {{ formatPrice(item.price) }} $</p>
                </div>
                
                <!-- Quantity control -->
                <div class="flex items-center border rounded-full overflow-hidden">
                  <button 
                    @click="decreaseQuantity(index)" 
                    class="w-8 h-8 flex items-center justify-center bg-gray-50 hover:bg-gray-100"
                    :disabled="item.quantity <= 1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                    </svg>
                  </button>
                  <span class="w-10 text-center">{{ item.quantity }}</span>
                  <button 
                    @click="increaseQuantity(index)" 
                    class="w-8 h-8 flex items-center justify-center bg-gray-50 hover:bg-gray-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
                
                <!-- Total price and remove button -->
                <div class="flex flex-col items-end gap-2">
                  <span class="font-semibold text-indigo-600">{{ formatPrice(item.price * item.quantity) }} $</span>
                  <button 
                    @click="removeFromCart(item._id || item.productId)" 
                    class="text-sm text-red-600 hover:text-red-800 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Remove
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <!-- Order summary -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl shadow-md p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
            
            <div class="space-y-3 mb-6">
              <div class="flex justify-between">
                <span class="text-gray-600">Subtotal:</span>
                <span class="font-medium">{{ formatPrice(subtotal) }} $</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Shipping:</span>
                <span class="font-medium">{{ formatPrice(shipping) }} $</span>
              </div>
              <div v-if="discount > 0" class="flex justify-between text-green-600">
                <span>Discount:</span>
                <span class="font-medium flex items-center">
                  -{{ formatPrice(discount) }} $
                  <button @click="removeCoupon" class="ml-2 text-red-500 hover:text-red-700">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </span>
              </div>
              <div class="border-t pt-3 mt-3 flex justify-between">
                <span class="text-gray-900 font-semibold">Total:</span>
                <span class="text-indigo-600 font-bold text-xl">{{ formatPrice(total) }} $</span>
              </div>
            </div>
            
            <!-- Discount coupon -->
            <div class="mb-6">
              <label for="coupon" class="block text-sm font-medium text-gray-700 mb-1">Discount Coupon</label>
              <div class="flex">
                <input
                  type="text"
                  id="coupon"
                  v-model="couponCode"
                  placeholder="Enter coupon code"
                  class="flex-grow rounded-l-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <button 
                  @click="applyCoupon"
                  class="bg-gray-100 px-4 py-2 rounded-r-md border border-gray-300 hover:bg-gray-200 text-gray-700 font-medium"
                >
                  Apply
                </button>
              </div>
            </div>
            
            <!-- Payment buttons -->
            <div class="space-y-3">
              <button 
                @click="checkout"
                class="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
                Proceed to Checkout
              </button>
              <RouterLink 
                to="/" 
                class="w-full flex justify-center items-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                </svg>
                Continue Shopping
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Clear Cart Confirmation Modal -->
  <ConfirmationModal
    :is-open="showClearCartModal"
    title="Clear Cart"
    message="Are you sure you want to remove all items from your cart? This action cannot be undone."
    confirm-text="Yes, Clear Cart"
    cancel-text="No, Keep Items"
    type="danger"
    @confirm="confirmClearCart"
    @cancel="cancelClearCart"
  />
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useCartStore } from '../../stores/cart';
import ConfirmationModal from '@/components/molecules/ConfirmationModal.vue';

const router = useRouter();
const toast = useToast();
const cartStore = useCartStore();

// Confirmation modal state
const showClearCartModal = ref(false);

// Cart items
const cartItems = computed(() => cartStore.items);

// Discount coupon
const couponCode = ref('');
const appliedCoupon = ref(null);

// Price calculations
const subtotal = computed(() => {
  return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0);
});

const shipping = computed(() => {
  return subtotal.value > 500 ? 0 : 25; // Free shipping over $500
});

const discount = computed(() => {
  return appliedCoupon.value ? (subtotal.value * appliedCoupon.value.discountRate) : 0;
});

const total = computed(() => {
  return subtotal.value + shipping.value - discount.value;
});

// Quantity management
const increaseQuantity = (index) => {
  const item = cartItems.value[index];
  const newQuantity = item.quantity + 1;
  cartStore.updateCartItemQuantity(item._id || item.productId, newQuantity);
};

const decreaseQuantity = (index) => {
  const item = cartItems.value[index];
  if (item.quantity > 1) {
    const newQuantity = item.quantity - 1;
    cartStore.updateCartItemQuantity(item._id || item.productId, newQuantity);
  }
};

// Remove product
const removeFromCart = (productId) => {
  cartStore.removeFromCart(productId);
  toast.success('Product removed from cart');
};

// Clear all products
const clearCart = () => {
  showClearCartModal.value = true;
};

const confirmClearCart = () => {
  cartStore.clearCart();
  toast.success('Cart cleared');
  showClearCartModal.value = false;
};

const cancelClearCart = () => {
  showClearCartModal.value = false;
};

// Apply coupon
const applyCoupon = () => {
  if (!couponCode.value) {
    toast.error('Please enter a coupon code');
    return;
  }
  
  const fakeCoupons = {
    'DISCOUNT10': { code: 'DISCOUNT10', discountRate: 0.1 },
    'DISCOUNT20': { code: 'DISCOUNT20', discountRate: 0.2 }
  };
  
  if (fakeCoupons[couponCode.value]) {
    appliedCoupon.value = fakeCoupons[couponCode.value];
    toast.success(`${appliedCoupon.value.discountRate * 100}% discount applied`);
  } else {
    toast.error('Invalid coupon code');
  }
};

// Remove coupon
const removeCoupon = () => {
  appliedCoupon.value = null;
  couponCode.value = '';
  toast.success('Coupon removed');
};

// Proceed to checkout
const checkout = () => {
  if (cartItems.value.length === 0) {
    toast.error('Your cart is empty');
    return;
  }
  
  // Redirect to checkout page
  router.push('/checkout');
};

// Price format
const formatPrice = (price) => {
  return price.toLocaleString('en-US', { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};
</script> 