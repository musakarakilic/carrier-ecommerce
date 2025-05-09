<template>
  <div class="mb-12 rounded-xl overflow-hidden shadow-xl">
    <div class="relative h-96 md:h-[450px]">
      <!-- For slider control -->
      <div 
        v-for="(slide, index) in slides" 
        :key="index"
        class="absolute inset-0 transition-opacity duration-700 ease-in-out cursor-pointer"
        :class="{ 'opacity-0': currentSlide !== index, 'opacity-100': currentSlide === index }"
        @click="navigateToSlide(slide)"
      >
        <div class="h-full w-full flex items-center relative">
          <img :src="slide.image" :alt="slide.title" class="absolute inset-0 w-full h-full object-cover" />
          <div class="absolute inset-0 bg-black bg-opacity-40"></div>
          <div class="relative px-8 md:px-16 text-white animate-fadeIn z-10">
            <h1 class="text-4xl md:text-6xl font-bold mb-4 tracking-tight">{{ slide.title }} <span :class="slide.accentClass">{{ slide.titleAccent }}</span></h1>
            <p class="text-xl mb-8 max-w-lg text-gray-100">{{ slide.description }}</p>
            <button 
              class="px-6 py-3 rounded-lg shadow-lg font-medium transition-all duration-300 transform hover:scale-105"
              :class="slide.buttonClass"
            >
              {{ slide.buttonText }}
            </button>
          </div>
          <div class="absolute bottom-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-medium z-10">
            #{{ slide.hashtag || 'NewSeason' }}
          </div>
        </div>
      </div>

      <!-- Slide control buttons -->
      <div class="absolute top-1/2 left-0 right-0 flex justify-between items-center px-0 md:px-0 z-10">
        <button 
          @click.stop="$emit('prev-slide')" 
          class="bg-white/30 hover:bg-white/50 rounded-full p-2 backdrop-blur-sm text-white transition-all duration-300 focus:outline-none transform hover:scale-110 ml-2 lg:ml-6"
          aria-label="Previous Slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button 
          @click.stop="$emit('next-slide')" 
          class="bg-white/30 hover:bg-white/50 rounded-full p-2 backdrop-blur-sm text-white transition-all duration-300 focus:outline-none transform hover:scale-110 mr-2 lg:mr-6"
          aria-label="Next Slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <!-- Slide indicators -->
      <div class="absolute bottom-4 left-0 right-0 flex justify-center space-x-3 z-10">
        <button 
          v-for="(_, index) in slides" 
          :key="index"
          @click.stop="$emit('slide-change', index)"
          :class="{ 'opacity-100 w-4': currentSlide === index, 'opacity-50 w-3': currentSlide !== index }"
          class="h-3 rounded-full bg-white transition-all duration-300 focus:outline-none"
          :aria-label="`Slide ${index + 1}`"
        ></button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeSlider',
  props: {
    slides: {
      type: Array,
      required: true
    },
    currentSlide: {
      type: Number,
      default: 0
    }
  },
  emits: ['slide-change', 'prev-slide', 'next-slide'],
  methods: {
    navigateToSlide(slide) {
      if (slide.link) {
        this.$router.push(slide.link);
      }
    }
  }
}
</script>

<style scoped>
.bg-pattern {
  background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E");
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style> 