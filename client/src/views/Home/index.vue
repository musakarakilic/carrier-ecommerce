<template>
  <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
    <!-- Main Slider -->
    <HomeSlider 
      :slides="slides" 
      :current-slide="currentSlide"
      @slide-change="goToSlide"
      @prev-slide="prevSlide"
      @next-slide="nextSlide"
    />

    <!-- Collections and Target Audiences -->
    <CollectionSection 
      :collections="collections" 
      :loading="loading.collections"
      @navigate="router.push"
    />

    <!-- Special Collections -->
    <SpecialCollections
      :special-collections="specialCollections"
      :loading="loading.specialCollections"
      @navigate="router.push"
    />

    <!-- Featured Products -->
    <ProductSection
      title="Best Sellers"
      route="/products/bestsellers"
      :products="bestsellerProducts"
      :loading="loading.bestsellerProducts"
      @add-to-cart="addToCart"
      @navigate="router.push"
    />

    <!-- New Products -->
    <ProductSection
      title="New Arrivals"
      route="/products/new"
      :products="newProducts"
      :loading="loading.newProducts"
      :is-new="true"
      @add-to-cart="addToCart"
      @navigate="router.push"
    />

    <!-- Popular Brands -->
    <BrandSection
      :brands="brands"
      :luxury-brands="luxuryBrands"
      :trending-brands="trendingBrands"
      :sport-brands="sportBrands"
      :accessory-brands="accessoryBrands"
      :loading="loading.brands"
      @navigate="router.push"
    />

    <!-- Email Subscription -->
    <NewsletterSection @subscribe="handleNewsletter" />
  </div>
</template>

<script>
import { useHomeData } from './composables/useHomeData';
import HomeSlider from './components/HomeSlider.vue';
import CollectionSection from './components/CollectionSection.vue';
import SpecialCollections from './components/SpecialCollections.vue';
import ProductSection from './components/ProductSection.vue';
import BrandSection from './components/BrandSection.vue';
import NewsletterSection from './components/NewsletterSection.vue';

export default {
  name: 'HomePage',
  
  components: {
    HomeSlider,
    CollectionSection,
    SpecialCollections,
    ProductSection,
    BrandSection,
    NewsletterSection
  },
  
  setup() {
    const {
      // Slider data
      slides,
      currentSlide,
      goToSlide,
      prevSlide,
      nextSlide,
      
      // Collections data
      collections,
      specialCollections,
      
      // Products data
      bestsellerProducts,
      newProducts,
      
      // Brands data
      brands,
      luxuryBrands,
      trendingBrands,
      sportBrands,
      accessoryBrands,
      
      // Testimonials
      testimonials,
      
      // Loading states
      loading,
      
      // Actions
      addToCart,
      handleNewsletter,
      
      // Router
      router
    } = useHomeData();
    
    return {
      // Slider data
      slides,
      currentSlide,
      goToSlide,
      prevSlide,
      nextSlide,
      
      // Collections data
      collections,
      specialCollections,
      
      // Products data
      bestsellerProducts,
      newProducts,
      
      // Brands data
      brands,
      luxuryBrands,
      trendingBrands,
      sportBrands,
      accessoryBrands,
      
      // Testimonials
      testimonials,
      
      // Loading states
      loading,
      
      // Actions
      addToCart,
      handleNewsletter,
      
      // Router
      router
    };
  }
};
</script>

<style scoped>
.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-left-color: #3B82F6;
  animation: spin 1s ease infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.bg-pattern {
  background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E");
}
</style> 