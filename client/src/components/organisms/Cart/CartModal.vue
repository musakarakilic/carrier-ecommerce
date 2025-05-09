<template>
  <div>
    <!-- Backdrop -->
    <div 
      v-if="cartStore.modalIsOpen" 
      class="fixed inset-0 bg-black bg-opacity-50 z-[1001]"
      @click="closeModal"
    ></div>
    
    <!-- Cart Sidebar -->
    <div 
      class="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white shadow-lg z-[1002] transform transition-transform duration-300 ease-in-out overflow-auto"
      :class="cartStore.modalIsOpen ? 'translate-x-0' : 'translate-x-full'"
    >
      <div class="flex flex-col h-full">
        <!-- Header -->
        <div class="p-4 border-b flex justify-between items-center bg-white sticky top-0 z-10">
          <h2 class="text-xl font-semibold">Shopping Cart</h2>
          <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- Empty Cart State -->
        <div v-if="!cartItems.length" class="flex-grow flex flex-col items-center justify-center p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-1">Your cart is empty</h3>
          <p class="text-gray-500 mb-6">Add items to your cart to checkout</p>
          <button @click="closeModal" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Continue Shopping
          </button>
        </div>
        
        <!-- Cart with Items -->
        <div v-else class="flex-grow flex flex-col">
          <!-- Cart Items Header -->
          <div class="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
            <span class="font-medium text-gray-700">Products ({{ cartItems.length }})</span>
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
          
          <!-- Cart Items -->
          <div class="flex-grow overflow-auto p-4">
            <ul class="divide-y divide-gray-200">
              <li v-for="(item, index) in cartItems" :key="index" class="py-4 flex">
                <!-- Product image -->
                <div class="flex-shrink-0 w-20 h-20">
                  <img 
                    :src="item.image || 'https://placehold.co/100'" 
                    :alt="item.name"
                    class="w-full h-full object-cover rounded"
                  >
                </div>
                
                <!-- Product details -->
                <div class="ml-4 flex-1 flex flex-col">
                  <div>
                    <div class="flex justify-between">
                      <h3 class="text-sm font-medium text-gray-900">{{ item.name }}</h3>
                      <p class="ml-1 text-sm font-medium text-indigo-600">{{ formatPrice(item.price) }} $</p>
                    </div>
                  </div>
                  
                  <!-- Quantity and remove -->
                  <div class="flex-1 flex items-end justify-between">
                    <!-- Quantity -->
                    <div class="flex items-center border rounded-full overflow-hidden">
                      <button 
                        @click="decreaseQuantity(index)" 
                        class="w-6 h-6 flex items-center justify-center bg-gray-50 hover:bg-gray-100"
                        :disabled="item.quantity <= 1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                        </svg>
                      </button>
                      <span class="w-8 text-center text-sm">{{ item.quantity }}</span>
                      <button 
                        @click="increaseQuantity(index)" 
                        class="w-6 h-6 flex items-center justify-center bg-gray-50 hover:bg-gray-100"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                    </div>
                    
                    <!-- Remove button -->
                    <button 
                      @click="removeFromCart(item._id || item.productId)" 
                      class="text-xs text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          
          <!-- Summary and buttons -->
          <div class="border-t border-gray-200 p-4 bg-gray-50">
            <!-- Subtotal -->
            <div class="flex justify-between mb-2">
              <span class="text-sm text-gray-600">Subtotal</span>
              <span class="text-sm font-medium">{{ formatPrice(subtotal) }} $</span>
            </div>
            
            <!-- Shipping -->
            <div class="flex justify-between mb-2">
              <span class="text-sm text-gray-600">Shipping</span>
              <span class="text-sm font-medium">{{ formatPrice(shipping) }} $</span>
            </div>
            
            <!-- Total -->
            <div class="flex justify-between pt-2 border-t border-gray-200 mb-4">
              <span class="text-base font-medium text-gray-900">Total</span>
              <span class="text-base font-medium text-indigo-600">{{ formatPrice(total) }} $</span>
            </div>
            
            <!-- Buttons -->
            <div class="space-y-3">
              <button 
                @click="goToCheckout" 
                class="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Proceed to Checkout
              </button>
              <button 
                @click="goToCart" 
                class="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                View Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useCartStore } from '../../../stores/cart';

const router = useRouter();
const toast = useToast();
const cartStore = useCartStore();

// Close the modal
const closeModal = () => {
  cartStore.toggleModal();
};

// Cart items from store
const cartItems = computed(() => cartStore.items);

// Calculations
const subtotal = computed(() => {
  return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0);
});

const shipping = computed(() => {
  return subtotal.value > 500 ? 0 : 25; // Free shipping over $500
});

const total = computed(() => {
  return subtotal.value + shipping.value;
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
  if (confirm('Are you sure you want to remove all items from your cart?')) {
    cartStore.clearCart();
    toast.success('Cart cleared');
  }
};

// Navigation
const goToCart = () => {
  closeModal();
  router.push('/cart');
};

const goToCheckout = () => {
  closeModal();
  router.push('/checkout');
};

// Price formatting
const formatPrice = (price) => {
  return price.toLocaleString('en-US', { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};
</script>

<style scoped>
/* Additional styling if needed */
</style> 