<template>
  <div class="ml-4 relative cart-container">
    <button @click="toggleCartModal" class="flex items-center bg-transparent border-0 p-0 cursor-pointer">
      <svg class="h-6 w-6 text-gray-700 hover:text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
      </svg>
      <span v-if="count > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
        {{ count }}
      </span>
    </button>
  </div>
</template>

<script setup>
import { useCartStore } from '../../../stores/cart';

defineProps({
  count: {
    type: Number,
    default: 0
  }
});

const cartStore = useCartStore();

const toggleCartModal = () => {
  cartStore.toggleModal();
};
</script>

<style scoped>
.cart-container {
  position: relative;
  z-index: 55;
}
</style> 