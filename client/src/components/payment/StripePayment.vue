<template>
  <div class="stripe-payment-container">
    <div v-if="loading" class="flex justify-center items-center py-8">
      <div class="animate-spin h-10 w-10 border-4 border-indigo-500 rounded-full border-t-transparent"></div>
      <span class="ml-3 text-gray-600">Preparing payment system...</span>
    </div>
    
    <div v-if="error" class="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mt-4">
      <p class="font-medium">An error occurred</p>
      <p class="text-sm">{{ error }}</p>
      <button 
        @click="initializeStripe" 
        class="mt-3 bg-red-100 hover:bg-red-200 text-red-800 py-2 px-4 rounded-lg text-sm transition-colors"
      >
        Try Again
      </button>
    </div>
    
    <div class="stripe-payment-form mt-4" :class="{ 'hidden': loading || error }">
      
      <div class="mb-6">
        <label for="cardElement" class="block text-sm font-medium text-gray-700 mb-1">
          Card Information
        </label>
        
        <div 
          id="cardElement" 
          class="p-4 border border-gray-300 rounded-lg bg-white"
          :class="{'border-red-500 bg-red-50': cardError}"
        ></div>
        
        <p v-if="cardError" class="mt-1 text-sm text-red-600">{{ cardError }}</p>
        
        <p class="mt-2 text-xs text-gray-500">
          No payment will be charged from your card, this is only for testing the payment system.
          You can use card number 4242 4242 4242 4242 for testing.
        </p>
      </div>
      
      <button 
        @click="processPayment" 
        class="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 font-medium shadow-sm transition-colors disabled:bg-indigo-300"
        :disabled="processing || !stripe || !clientSecret"
      >
        <span v-if="processing" class="flex items-center justify-center">
          <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing Payment...
        </span>
        <span v-else>Complete Payment</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, reactive } from 'vue';
import { paymentService } from '@/services/paymentService';

const props = defineProps({
  orderId: {
    type: String,
    required: false,
    default: null
  },
  amount: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['payment-success', 'payment-error']);

// State variables
const stripe = ref(null);
const elements = ref(null);
const cardElement = ref(null);
const clientSecret = ref(null);
const loading = ref(true);
const processing = ref(false);
const error = ref(null);
const cardError = ref(null);
const customerInfo = reactive({
  firstName: '',
  lastName: ''
});

// Initialize Stripe
const initializeStripe = async () => {
  loading.value = true;
  error.value = null;
  cardError.value = null;
  
  try {
    // Load Stripe script
    if (!window.Stripe) {
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/';
      script.async = true;
      document.head.appendChild(script);
      
      await new Promise((resolve) => {
        script.onload = resolve;
      });
    }
    
    // Create Stripe object
    stripe.value = window.Stripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
    
    // Create payment intent
    let clientSecretResponse;
    
    if (props.orderId) {
      // If orderId exists, use it
      clientSecretResponse = await paymentService.createPaymentIntent(props.orderId, props.amount);
    } else {
      // Otherwise create intent with just the amount
      clientSecretResponse = await paymentService.createPaymentIntent(null, props.amount);
    }
    
    clientSecret.value = clientSecretResponse.clientSecret;
    
    // Create Elements and CardElement with English locale
    elements.value = stripe.value.elements({
      locale: 'en'
    });
    
    cardElement.value = elements.value.create('card', {
      style: {
        base: {
          color: '#32325d',
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          fontSmoothing: 'antialiased',
          fontSize: '16px',
          '::placeholder': {
            color: '#aab7c4'
          }
        },
        invalid: {
          color: '#fa755a',
          iconColor: '#fa755a'
        }
      }
    });
    
    // Wait for DOM to render
    await nextTick();
    
    // Wait for element to exist in DOM (max 10 attempts)
    let attempts = 0;
    let cardElementContainer = null;
    
    while (attempts < 10 && !cardElementContainer) {
      cardElementContainer = document.getElementById('cardElement');
      
      if (!cardElementContainer) {
        await new Promise(resolve => setTimeout(resolve, 100)); // Wait 100ms
        attempts++;
      }
    }
    
    if (!cardElementContainer) {
      throw new Error('cardElement DOM element not found after 10 attempts');
    }
    
    
    // Mount CardElement to DOM
    cardElement.value.mount('#cardElement');
    
    // Listen for card changes
    cardElement.value.on('change', (event) => {
      cardError.value = event.error ? event.error.message : null;
    });
    
    loading.value = false;
  } catch (err) {
    console.error('Stripe initialization error:', err);
    error.value = 'Payment system could not be initialized: ' + (err.message || 'Unknown error');
    loading.value = false;
  }
};

// Process payment
const processPayment = async () => {
  if (processing.value || !stripe.value || !clientSecret.value) return;
  
  processing.value = true;
  cardError.value = null;
  
  try {
    const { error: stripeError, paymentIntent } = await stripe.value.confirmCardPayment(
      clientSecret.value, {
        payment_method: {
          card: cardElement.value,
          billing_details: {
            name: `${customerInfo.firstName} ${customerInfo.lastName}`.trim()
          }
        }
      }
    );
    
    if (stripeError) {
      cardError.value = stripeError.message;
      emit('payment-error', stripeError.message);
    } else {
      // Payment successful
      if (paymentIntent.status === 'succeeded') {
        
        // Emit success event with payment intent
        emit('payment-success', paymentIntent);
      } else {
        cardError.value = 'Payment status in unexpected state: ' + paymentIntent.status;
        emit('payment-error', cardError.value);
      }
    }
  } catch (err) {
    console.error('Payment confirmation error:', err);
    cardError.value = 'An error occurred during payment processing: ' + (err.message || 'Unknown error');
    emit('payment-error', cardError.value);
  } finally {
    processing.value = false;
  }
};

// When component is mounted
onMounted(() => {
  // Add delay to ensure DOM is completely ready
  setTimeout(() => {
    
    // Check if element with cardElement id exists in DOM
    if (document.getElementById('cardElement')) {
      initializeStripe();
    } else {
      // If element not found, try again with longer delay
      console.warn('cardElement not found in DOM, retrying with longer delay');
      setTimeout(() => {
        initializeStripe();
      }, 500);
    }
  }, 200);
});

// When component is unmounted
onUnmounted(() => {
  if (cardElement.value) {
    cardElement.value.unmount();
    cardElement.value = null;
  }
});
</script> 