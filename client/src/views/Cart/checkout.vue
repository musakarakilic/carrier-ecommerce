<template>
  <div class="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8 text-center">Checkout</h1>
    
    <!-- Empty cart state -->
    <div v-if="!cartItems.length" class="bg-white rounded-xl shadow-lg p-16 text-center">
      <div class="flex flex-col items-center">
        <div class="bg-gray-100 p-6 rounded-full mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-20 w-20 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h2 class="text-2xl font-semibold text-gray-800 mb-3">Your cart is empty</h2>
        <p class="text-gray-500 mb-8 max-w-md">Add items to your cart to proceed with checkout.</p>
        <RouterLink to="/" class="bg-indigo-600 text-white py-3 px-8 rounded-lg hover:bg-indigo-700 transition-colors duration-300 shadow-md inline-flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7m-7-7v14" />
          </svg>
          Start Shopping
        </RouterLink>
      </div>
    </div>
    
    <!-- Checkout form -->
    <div v-else>
      <!-- Step indicator -->
      <div class="mb-12">
        <div class="max-w-4xl mx-auto">
          <!-- Step indicator titles -->
          <div class="relative flex justify-between mb-2">
            <div class="text-center">
              <div :class="[currentStep >= 1 ? 'text-indigo-600 font-medium' : 'text-gray-500']" class="mb-1 text-sm md:text-base">Shipping</div>
            </div>
            <div class="text-center">
              <div :class="[currentStep >= 2 ? 'text-indigo-600 font-medium' : 'text-gray-500']" class="mb-1 text-sm md:text-base">Payment</div>
            </div>
            <div class="text-center">
              <div class="text-gray-500 mb-1 text-sm md:text-base">Completed</div>
            </div>
          </div>
          
          <!-- Step indicator lines and icons -->
          <div class="relative">
            <!-- Background line -->
            <div class="absolute top-1/2 transform -translate-y-1/2 left-0 right-0 h-1 bg-gray-200 rounded-full"></div>
            
            <!-- Progress line (dynamic) -->
            <div class="absolute top-1/2 transform -translate-y-1/2 left-0 h-1 bg-indigo-500 rounded-full transition-all duration-500 ease-in-out" 
                 :style="{ width: currentStep === 1 ? '25%' : currentStep === 2 ? '75%' : '100%' }"></div>
            
            <!-- Step dots -->
            <div class="relative flex justify-between">
              <!-- Step 1 -->
              <div class="z-10">
                <div class="w-14 h-14 mx-auto flex items-center justify-center rounded-full transition-all duration-300"
                     :class="[currentStep >= 1 ? 'bg-indigo-600 shadow-lg shadow-indigo-300' : 'bg-gray-300']">
                  <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <div class="w-10 h-10 flex items-center justify-center rounded-full transition-all" 
                         :class="[currentStep >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500']">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Step 2 -->
              <div class="z-10">
                <div class="w-14 h-14 mx-auto flex items-center justify-center rounded-full transition-all duration-300"
                     :class="[currentStep >= 2 ? 'bg-indigo-600 shadow-lg shadow-indigo-300' : 'bg-gray-300']">
                  <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <div class="w-10 h-10 flex items-center justify-center rounded-full transition-all" 
                         :class="[currentStep >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500']">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Step 3 (Completed) -->
              <div class="z-10">
                <div class="w-14 h-14 mx-auto flex items-center justify-center rounded-full transition-all duration-300 bg-gray-300">
                  <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <div class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <!-- Form fields -->
        <div class="lg:col-span-3 space-y-6">
          <!-- STEP 1: Shipping Address -->
          <div v-if="currentStep === 1" class="bg-white rounded-xl shadow-lg p-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <span class="bg-indigo-100 text-indigo-700 p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
              Shipping Address
            </h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input 
                  v-model="form.firstName" 
                  type="text" 
                  id="firstName" 
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  :class="{ 'border-red-500 bg-red-50': errors.firstName }"
                >
                <p v-if="errors.firstName" class="mt-1 text-sm text-red-600">{{ errors.firstName }}</p>
              </div>
              
              <div>
                <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input 
                  v-model="form.lastName" 
                  type="text" 
                  id="lastName" 
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  :class="{ 'border-red-500 bg-red-50': errors.lastName }"
                >
                <p v-if="errors.lastName" class="mt-1 text-sm text-red-600">{{ errors.lastName }}</p>
              </div>
              
              <div class="md:col-span-2">
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  v-model="form.email" 
                  type="email" 
                  id="email" 
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  :class="{ 'border-red-500 bg-red-50': errors.email }"
                >
                <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
              </div>
              
              <div class="md:col-span-2">
                <label for="address" class="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea 
                  v-model="form.address" 
                  id="address" 
                  rows="3" 
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  :class="{ 'border-red-500 bg-red-50': errors.address }"
                ></textarea>
                <p v-if="errors.address" class="mt-1 text-sm text-red-600">{{ errors.address }}</p>
              </div>
              
              <div>
                <label for="city" class="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input 
                  v-model="form.city" 
                  type="text" 
                  id="city" 
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  :class="{ 'border-red-500 bg-red-50': errors.city }"
                >
                <p v-if="errors.city" class="mt-1 text-sm text-red-600">{{ errors.city }}</p>
              </div>
              
              <div>
                <label for="postalCode" class="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                <input 
                  v-model="form.postalCode" 
                  type="text" 
                  id="postalCode" 
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  :class="{ 'border-red-500 bg-red-50': errors.postalCode }"
                >
                <p v-if="errors.postalCode" class="mt-1 text-sm text-red-600">{{ errors.postalCode }}</p>
              </div>
              
              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input 
                  v-model="form.phone" 
                  type="tel" 
                  id="phone" 
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  :class="{ 'border-red-500 bg-red-50': errors.phone }"
                >
                <p v-if="errors.phone" class="mt-1 text-sm text-red-600">{{ errors.phone }}</p>
              </div>
            </div>
          </div>
          
          <!-- STEP 2: Payment Method -->
          <div v-if="currentStep === 2" class="bg-white rounded-xl shadow-lg p-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <span class="bg-indigo-100 text-indigo-700 p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </span>
              Payment Method
            </h2>
            
            <div class="space-y-4">
              <!-- Credit Card - Stripe -->
              <div class="border border-gray-200 rounded-lg overflow-hidden hover:border-indigo-400 transition-colors duration-300">
                <label class="flex items-center p-5 cursor-pointer">
                  <input 
                    type="radio" 
                    v-model="form.paymentMethod" 
                    value="stripe" 
                    class="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    @change="onPaymentMethodChange"
                  >
                  <div class="ml-3">
                    <span class="text-gray-900 font-medium">Credit/Debit Card (Stripe)</span>
                    <div class="flex mt-1 space-x-2">
                      <span class="text-2xl">💳</span>
                      <span class="text-xs text-gray-500 self-end">Secure payment via Stripe</span>
                    </div>
                  </div>
                </label>
                
                <div v-if="form.paymentMethod === 'stripe' && stripeVisible" class="p-5 bg-gray-50 border-t border-gray-200 space-y-5">
                  <!-- Stripe payment form without requiring orderId first -->
                  <StripePayment 
                    :amount="total"
                    @payment-success="handleStripeSuccess" 
                    @payment-error="handlePaymentError"
                  />
                </div>
              </div>
              
              <!-- Cash on Delivery -->
              <div class="border border-gray-200 rounded-lg overflow-hidden hover:border-indigo-400 transition-colors duration-300">
                <label class="flex items-center p-5 cursor-pointer">
                  <input 
                    type="radio" 
                    v-model="form.paymentMethod" 
                    value="cash_on_delivery" 
                    class="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    @change="onPaymentMethodChange"
                  >
                  <div class="ml-3">
                    <span class="text-gray-900 font-medium">Cash on Delivery <span class="text-indigo-600">(+{{ cashOnDeliveryCost }} $)</span></span>
                    <div class="flex mt-1 space-x-2">
                      <span class="text-2xl">💵</span>
                      <span class="text-xs text-gray-500 self-end">Pay with cash or card upon delivery</span>
                    </div>
                  </div>
                </label>
                
                <div v-if="form.paymentMethod === 'cash_on_delivery'" class="p-5 bg-gray-50 border-t border-gray-200">
                  <div class="flex items-start">
                    <div class="flex-shrink-0 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p class="ml-3 text-sm text-gray-600">
                      You can pay when you receive your order. An additional fee is charged for cash on delivery.
                      You can pay with cash or credit card to the courier.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Back and create order buttons in payment step -->
            <div class="mt-8 flex space-x-4">
              <button 
                @click="prevStep" 
                class="flex-1 border border-indigo-600 text-indigo-600 py-4 px-6 rounded-lg hover:bg-indigo-50 font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center"
              >
                <span class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Go Back
                </span>
              </button>
              
              <button 
                @click="submitOrder" 
                class="flex-1 bg-indigo-600 text-white py-4 px-6 rounded-lg hover:bg-indigo-700 font-medium transition-colors duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center"
                :disabled="isSubmitting || (form.paymentMethod === 'stripe' && orderId)"
              >
                <span v-if="isSubmitting" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
                <span v-else-if="form.paymentMethod === 'stripe' && orderId" class="flex items-center text-white opacity-70">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Secure Payment
                </span>
                <span v-else class="flex items-center">
                  Confirm Order
                  <svg xmlns="http://www.w3.org/2000/svg" class="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Order Summary -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-xl shadow-lg p-8 sticky top-4">
            <h2 class="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <span class="bg-indigo-100 text-indigo-700 p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </span>
              Order Summary
            </h2>
            
            <div class="space-y-4 mb-6">
              <div v-for="item in cartItems" :key="item._id" class="flex gap-4 py-3 border-b border-gray-100 last:border-0">
                <div class="w-16 h-16 rounded-md bg-gray-100 overflow-hidden flex-shrink-0">
                  <img :src="item.image" :alt="item.name" class="w-full h-full object-cover" />
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="text-sm font-medium text-gray-900 truncate">{{ item.name }}</h3>
                  <p class="text-sm text-gray-500">{{ item.quantity }} pcs</p>
                </div>
                <div class="text-right">
                  <p class="text-sm font-medium text-gray-900">{{ formatPrice(item.price * item.quantity) }} $</p>
                </div>
              </div>
            </div>
            
            <div class="border-t border-gray-200 pt-4 space-y-3">
              <div class="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span class="font-medium">{{ formatPrice(subtotal) }} $</span>
              </div>
              
              <div class="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span v-if="isShippingFree" class="font-medium text-green-600">Free</span>
                <span v-else class="font-medium">{{ formatPrice(shippingCost) }} $</span>
              </div>
              
              <div class="flex justify-between text-gray-600">
                <span>Tax (18%)</span>
                <span class="font-medium">{{ formatPrice(calculateTax()) }} $</span>
              </div>
              
              <div v-if="form.paymentMethod !== 'stripe'" class="flex justify-between text-gray-600">
                <span>Cash on Delivery Charge</span>
                <span class="font-medium">{{ formatPrice(cashOnDeliveryCost) }} $</span>
              </div>
              
              <div class="flex justify-between pt-3 border-t border-gray-200 text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>{{ formatPrice(total) }} $</span>
              </div>
            </div>
            
            <!-- Next step button -->
            <div v-if="currentStep === 1">
              <button 
                @click="nextStep" 
                class="w-full bg-indigo-600 text-white py-4 px-6 mt-8 rounded-lg hover:bg-indigo-700 font-medium transition-colors duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center"
              >
                <span class="flex items-center">
                  Proceed to Payment
                  <svg xmlns="http://www.w3.org/2000/svg" class="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </button>
            </div>
            
            <RouterLink to="/cart" class="flex items-center justify-center w-full text-indigo-600 py-2 mt-4 hover:text-indigo-800">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              Return to Cart
            </RouterLink>
            
            <!-- Secure Payment -->
            <div class="mt-8 pt-6 border-t border-gray-200">
              <div class="flex items-center justify-center space-x-2 text-gray-500 text-sm mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                </svg>
                <span>Secure Payment</span>
              </div>
              <div class="flex justify-center space-x-4 opacity-60">
                <img src="https://cdn-icons-png.flaticon.com/512/179/179457.png" alt="Visa" class="h-8" />
                <img src="https://cdn-icons-png.flaticon.com/512/179/179453.png" alt="Mastercard" class="h-8" />
                <img src="https://cdn-icons-png.flaticon.com/512/349/349228.png" alt="American Express" class="h-8" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { orderService } from '@/services/orderService';
import { useToast } from 'vue-toastification';
import StripePayment from '@/components/payment/StripePayment.vue';
import { useCartStore } from '@/stores/cart';

const router = useRouter();
const toast = useToast();
const cartItems = ref([]);
const isSubmitting = ref(false);
const shippingCost = ref(25); // Fixed shipping cost
const freeShippingThreshold = ref(500); // Free shipping threshold
const cashOnDeliveryCost = ref(10); // Cash on delivery fee
const orderId = ref(null); // Created order ID
const currentStep = ref(1); // 1: Shipping Address, 2: Payment
const stripeVisible = ref(false); // Stripe form visibility
const cartStore = useCartStore();

// Form data
const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  address: '',
  city: '',
  postalCode: '',
  phone: '',
  paymentMethod: '', // Remove default selection, wait for user to choose
  cardNumber: '',
  cardExpiry: '',
  cardCvc: '',
});

// Validation errors
const errors = ref({});

// Load cart data from local storage
const loadCartItems = () => {
  try {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      cartItems.value = parsedCart;
      
      // Check if cart is empty
      if (parsedCart.length === 0) {
        toast.info('Your cart is empty.');
        setTimeout(() => {
          router.push('/');
        }, 1000);
        return;
      }
      
      // Check cart items
      cartItems.value.forEach((item, index) => {
        if (!item._id && !item.product) {
          // Silent check for missing IDs
        }
      });
    } else {
      toast.info('Your cart is empty.');
      setTimeout(() => {
        router.push('/');
      }, 1000);
    }
  } catch (error) {
    cartItems.value = [];
    toast.error('An error occurred while loading cart information.');
    setTimeout(() => {
      router.push('/');
    }, 1500);
  }
};

// Check cart periodically
const setupCartWatcher = () => {
  const cartCheckInterval = setInterval(() => {
    const savedCart = localStorage.getItem('cart');
    
    // If cart was removed from localStorage
    if (!savedCart) {
      cartItems.value = [];
      clearInterval(cartCheckInterval);
      return;
    }
    
    // Update state if cart content changed
    try {
      const parsedCart = JSON.parse(savedCart);
      if (parsedCart.length !== cartItems.value.length) {
        cartItems.value = parsedCart;
      }
    } catch (e) {
      // Silent error handling
    }
  }, 2000); // Check every 2 seconds
  
  // Clear interval when component is unmounted
  onUnmounted(() => {
    clearInterval(cartCheckInterval);
  });
};

// Calculations
const subtotal = computed(() => {
  return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0);
});

const isShippingFree = computed(() => {
  return subtotal.value >= freeShippingThreshold.value;
});

const total = computed(() => {
  let totalPrice = subtotal.value;
  
  // Add shipping cost
  if (!isShippingFree.value) {
    totalPrice += shippingCost.value;
  }
  
  // Add cash on delivery fee
  if (form.value.paymentMethod !== 'stripe') {
    totalPrice += cashOnDeliveryCost.value;
  }
  
  // Add tax
  totalPrice += calculateTax();
  
  return totalPrice;
});

// Form validation
const validateForm = () => {
  const newErrors = {};
  
  // Shipping information validation
  if (!form.value.firstName.trim()) {
    newErrors.firstName = 'First name is required';
  }
  
  if (!form.value.lastName.trim()) {
    newErrors.lastName = 'Last name is required';
  }
  
  if (!form.value.email.trim()) {
    newErrors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(form.value.email)) {
    newErrors.email = 'Please enter a valid email address';
  }
  
  if (!form.value.address.trim()) {
    newErrors.address = 'Address is required';
  }
  
  if (!form.value.city.trim()) {
    newErrors.city = 'City is required';
  }
  
  if (!form.value.postalCode.trim()) {
    newErrors.postalCode = 'Postal code is required';
  }
  
  if (!form.value.phone.trim()) {
    newErrors.phone = 'Phone number is required';
  }
  
  errors.value = newErrors;
  return Object.keys(newErrors).length === 0;
};

// When payment method changes
const onPaymentMethodChange = async () => {
  if (form.value.paymentMethod === 'stripe') {
    // Show Stripe form
    stripeVisible.value = true;
    
    // Make sure form is valid
    if (!validateForm()) {
      toast.error('Please complete all shipping information.');
      form.value.paymentMethod = ''; // Reset payment method selection
      stripeVisible.value = false;
      return;
    }
  } else {
    // For cash_on_delivery, just update UI
    stripeVisible.value = false;
  }
  
  // Clear any previous order ID
  orderId.value = null;
};

// Complete order - only for cash on delivery
const submitOrder = async () => {
  // Check form validation in step 1
  if (currentStep.value === 1) {
    if (validateForm()) {
      nextStep();
    } else {
      window.scrollTo(0, 0);
    }
    return;
  }
  
  // Show warning if payment method not selected
  if (!form.value.paymentMethod) {
    toast.error('Please select a payment method.');
    return;
  }
  
  // For Stripe payments, don't do anything here - handled in handleStripeSuccess
  if (form.value.paymentMethod === 'stripe') {
    return;
  }
  
  // For Cash on Delivery, create order
  isSubmitting.value = true;
  
  try {
    // Validate cart items
    if (!validateCartItems()) {
      isSubmitting.value = false;
      return;
    }
    
    // Create order
    const orderData = prepareOrderData();
    
    // Send order request to API - only for cash on delivery
    const result = await orderService.createOrder(orderData);
    
    // Save order ID
    orderId.value = result._id || result.order._id;
    
    // Clear cart and redirect to confirmation page
    clearCart();
    
    toast.success('Your order has been successfully created!');
    router.push({
      path: '/order-confirmation',
      query: { orderId: orderId.value }
    });
  } catch (error) {
    toast.error(error.response?.data?.message || 'An error occurred while creating your order. Please try again.');
  } finally {
    isSubmitting.value = false;
  }
};

// Validate cart items - helper function
const validateCartItems = () => {
  // Convert proxy object to normal JSON
  const cartItemsJSON = JSON.parse(JSON.stringify(cartItems.value));
  
  // Check if cart is empty
  if (!cartItemsJSON || !Array.isArray(cartItemsJSON) || cartItemsJSON.length === 0) {
    toast.error('Your cart appears to be empty. Please add items to your cart first.');
    return false;
  }
  
  return true;
};

// Prepare order data - helper function
const prepareOrderData = () => {
  const cartItemsJSON = JSON.parse(JSON.stringify(cartItems.value));
  
  // Prepare order items
  const orderItems = cartItemsJSON.map(item => {
    // Check product ID in different fields
    const productId = item._id || item.product || item.productId;
    
    if (!productId) {
      console.error('Invalid item found:', item);
      return null;
    }
    
    return {
      product: productId,
      quantity: item.quantity
    };
  }).filter(item => item !== null);
  
  // Prepare order data
  return {
    orderItems: orderItems,
    shippingAddress: {
      fullName: `${form.value.firstName} ${form.value.lastName}`,
      address: form.value.address,
      city: form.value.city,
      postalCode: form.value.postalCode,
      country: 'Turkey',
      phone: form.value.phone
    },
    paymentMethod: form.value.paymentMethod === 'stripe' ? 'credit_card' : 'cash_on_delivery',
    itemsPrice: subtotal.value,
    shippingPrice: isShippingFree.value ? 0 : shippingCost.value,
    taxPrice: calculateTax(),
    totalPrice: total.value,
    notes: ''
  };
};

// Clear cart - helper function
const clearCart = () => {
  localStorage.removeItem('cart');
  // More effective cart clearing
  cartStore.clearCart();
  window.localStorage.setItem('cart', '[]');
};

// When Stripe payment is successful - create order and redirect
const handleStripeSuccess = async (paymentIntent) => {
  isSubmitting.value = true;
  
  try {
    // Validate cart items
    if (!validateCartItems()) {
      isSubmitting.value = false;
      return;
    }
    
    // Create order with Stripe payment
    const orderData = prepareOrderData();
    
    // Create the order AFTER payment is successful
    const result = await orderService.createOrder(orderData);
    
    // Save order ID
    orderId.value = result._id || result.order._id;
    
    // Update payment status
    await orderService.updatePaymentStatus(orderId.value, paymentIntent);
    
    // Clear cart
    clearCart();
    
    // Show success message
    toast.success('Payment completed and order created successfully!');
    
    // Redirect to confirmation page
    router.push({
      path: '/order-confirmation',
      query: { orderId: orderId.value, paymentId: paymentIntent.id }
    });
  } catch (error) {
    toast.error(error.response?.data?.message || 'An error occurred while creating your order. Please try again.');
  } finally {
    isSubmitting.value = false;
  }
};

// When Stripe payment fails
const handlePaymentError = (errorMessage) => {
  toast.error(`Payment failed: ${errorMessage}`);
};

// Calculate tax
const calculateTax = () => {
  return subtotal.value * 0.18; // 18% VAT
};

// Price format
const formatPrice = (price) => {
  return parseFloat(price).toLocaleString('en-US', { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

// Functions for step transitions
const nextStep = () => {
  if (currentStep.value === 1) {
    if (validateForm()) {
      currentStep.value = 2;
      window.scrollTo(0, 0);
    } else {
      window.scrollTo(0, 0);
    }
  }
};

const prevStep = () => {
  if (currentStep.value === 2) {
    currentStep.value = 1;
    window.scrollTo(0, 0);
  }
};

onMounted(() => {
  loadCartItems();
  setupCartWatcher(); // Watch cart changes
});

// Watch payment method changes
watch(() => form.value.paymentMethod, async (newValue, oldValue) => {
  // Only attempt to cancel if there's an orderId and payment method actually changed
  if (oldValue && newValue !== oldValue && orderId.value) {
    try {
      // Cancel previous order
      await orderService.cancelOrder(orderId.value);
      console.log('Order cancelled due to payment method change in watcher');
    } catch (error) {
      console.error('Error cancelling order in watcher:', error);
    }
    
    // Reset order ID
    orderId.value = null;
  }
});
</script>

<style scoped>
/* Add any required styles here */
</style> 