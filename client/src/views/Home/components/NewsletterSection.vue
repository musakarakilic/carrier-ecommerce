<template>
  <div class="mb-16 rounded-xl overflow-hidden shadow-lg relative">
    <div class="absolute inset-0 bg-indigo-900 opacity-90"></div>
    <div class="relative z-10 py-12 px-8 md:px-16 text-center text-white">
      <h2 class="text-3xl md:text-4xl font-bold mb-4">Special Offers</h2>
      <p class="text-xl max-w-2xl mx-auto mb-8">Subscribe to our newsletter to benefit from our limited-time campaigns and special discounts.</p>
      <div class="flex flex-col sm:flex-row max-w-lg mx-auto space-y-3 sm:space-y-0 sm:space-x-4">
        <input 
          v-model="email"
          type="email" 
          placeholder="Your email address" 
          class="py-3 px-4 rounded-lg flex-grow text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
        <button 
          @click="subscribe" 
          class="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center"
          :disabled="isSubscribing"
        >
          <span v-if="isSubscribing" class="flex items-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing
          </span>
          <span v-else>Subscribe</span>
        </button>
      </div>
      <div class="mt-4 flex justify-center space-x-6">
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-indigo-200 text-sm">Weekly Newsletter</span>
        </div>
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span class="text-indigo-200 text-sm">Cancel Anytime</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NewsletterSection',
  
  data() {
    return {
      email: '',
      isSubscribing: false
    };
  },
  
  methods: {
    subscribe() {
      if (!this.email) {
        // Show notification if email is empty
        return;
      }
      
      if (!this.validateEmail(this.email)) {
        // Show notification if email is invalid
        return;
      }
      
      this.isSubscribing = true;
      
      // API call will be made here
      setTimeout(() => {
        this.$emit('subscribe', this.email);
        this.email = '';
        this.isSubscribing = false;
      }, 1000);
    },
    
    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }
  }
};
</script> 