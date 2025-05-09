import { ref, reactive, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import { useToast } from 'vue-toastification';
import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';
import { collectionService } from '@/services/collectionService';
import { brandService } from '@/services/brandService';
import { subscriptionService } from '@/services/subscriptionService';

export function useHomeData() {
  const router = useRouter();
  const toast = useToast();
  const cartStore = useCartStore();
  
  // Slider data
  const slides = [
    {
      title: 'Summer',
      titleAccent: 'Collection',
      description: 'Discover our vibrant summer collection with modern and colorful designs to keep you cool.',
      buttonText: 'Shop Collection',
      bgClass: 'bg-gradient-to-r from-blue-500 to-teal-400',
      accentClass: 'text-orange-300',
      buttonClass: 'bg-white text-teal-600 hover:bg-orange-300 hover:text-teal-700',
      hashtag: 'SummerFashion',
      link: '/collections/summer-collection',
      image: 'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      title: 'Electronics',
      titleAccent: 'Category',
      description: 'Explore our latest electronic devices and gadgets with cutting-edge technology.',
      buttonText: 'Browse Electronics',
      bgClass: 'bg-gradient-to-r from-gray-800 to-gray-600',
      accentClass: 'text-blue-300',
      buttonClass: 'bg-white text-gray-800 hover:bg-blue-300 hover:text-gray-900',
      hashtag: 'TechInnovation',
      link: '/category/electronics',
      image: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      title: 'Best',
      titleAccent: 'Sellers',
      description: 'Shop our most popular products loved by thousands of customers.',
      buttonText: 'View Best Sellers',
      bgClass: 'bg-gradient-to-r from-indigo-600 to-purple-700',
      accentClass: 'text-yellow-300',
      buttonClass: 'bg-white text-indigo-700 hover:bg-yellow-300 hover:text-indigo-800',
      hashtag: 'BestSellers',
      link: '/products/bestsellers',
      image: 'https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg?auto=compress&cs=tinysrgb&w=800'
    }
  ];

  const currentSlide = ref(0);
  const slideInterval = ref(null);
  const emailSubscription = ref('');
  const isSubscribing = ref(false);
  
  // Loading states
  const loading = reactive({
    categories: true,
    featuredProducts: true,
    specialCollections: true,
    bestsellerProducts: true,
    newProducts: true,
    collections: true,
    brands: true
  });
  
  // Data
  const categories = ref([]);
  const featuredProducts = ref([]);
  const collections = ref([]);
  const specialCollections = ref([]);
  const bestsellerProducts = ref([]);
  const newProducts = ref([]);
  const brands = ref([]);
  const luxuryBrands = ref([]);
  const trendingBrands = ref([]);
  const sportBrands = ref([]);
  const accessoryBrands = ref([]);
  const testimonials = ref([]);
  
  // Slider functions
  function goToSlide(index) {
    currentSlide.value = index;
    resetSlideTimer();
  }
  
  function prevSlide() {
    currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length;
    resetSlideTimer();
  }
  
  function nextSlide() {
    currentSlide.value = (currentSlide.value + 1) % slides.length;
    resetSlideTimer();
  }

  function startSlideTimer() {
    slideInterval.value = setInterval(() => {
      nextSlide();
    }, 5000); // Change every 5 seconds
  }

  function resetSlideTimer() {
    clearInterval(slideInterval.value);
    startSlideTimer();
  }

  // Navigate to the page when slider is clicked
  function navigateToSlide(slide) {
    if (slide.link) {
      router.push(slide.link);
    }
  }
  
  // Subscribe to newsletter
  async function handleNewsletter(email) {
    if (!email) {
      toast.error('Please enter your email address.');
      return;
    }
    
    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    
    isSubscribing.value = true;
    
    try {
      // Make API call
      await subscriptionService.subscribe(email);
      toast.success('Newsletter subscription created successfully!');
      emailSubscription.value = '';
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      if (error.response?.status === 400 && error.response?.data?.message === 'This email is already subscribed') {
        toast.info('This email is already subscribed to the newsletter.');
      } else {
        toast.error('An error occurred during subscription. Please try again.');
      }
    } finally {
      isSubscribing.value = false;
    }
  }

  // E-posta doğrulama
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // Fetch categories
  async function fetchCategories() {
    try {
      loading.categories = true;
      const result = await categoryService.getAll();
      categories.value = result;
    } catch (error) {
      console.error('Error loading categories:', error);
      categories.value = [];
    } finally {
      loading.categories = false;
    }
  }

  // Fetch featured products
  async function fetchFeaturedProducts() {
    try {
      loading.featuredProducts = true;
      const result = await productService.getFeaturedProducts(8);
      featuredProducts.value = result.products || [];
    } catch (error) {
      console.error('Error loading featured products:', error);
      featuredProducts.value = [];
    } finally {
      loading.featuredProducts = false;
    }
  }

  // Fetch new products
  async function fetchNewProducts() {
    try {
      loading.newProducts = true;
      const result = await productService.getNewProducts({ limit: 4 });
      newProducts.value = result.products || [];
    } catch (error) {
      console.error('Error loading new products:', error);
      newProducts.value = [];
    } finally {
      loading.newProducts = false;
    }
  }

  // Fetch bestseller products
  async function fetchBestsellerProducts() {
    try {
      loading.bestsellerProducts = true;
      const result = await productService.getBestsellerProducts(8);
      bestsellerProducts.value = result.products || [];
    } catch (error) {
      console.error('Error loading bestseller products:', error);
      bestsellerProducts.value = [];
    } finally {
      loading.bestsellerProducts = false;
    }
  }

  // Fetch all collections
  async function fetchCollections() {
    try {
      loading.collections = true;
      const result = await collectionService.getAll({ isActive: true });
      collections.value = result;
    } catch (error) {
      console.error('Error loading collections:', error);
      collections.value = [];
    } finally {
      loading.collections = false;
    }
  }

  // Fetch special collections
  async function fetchSpecialCollections() {
    try {
      loading.specialCollections = true;
      const result = await collectionService.getSpecialCollections(3);
      specialCollections.value = result;
    } catch (error) {
      console.error('Error loading special collections:', error);
      specialCollections.value = [];
    } finally {
      loading.specialCollections = false;
    }
  }

  // Fetch brands
  async function fetchBrands() {
    try {
      loading.brands = true;
      
      // Luxury brands
      const luxuryResult = await brandService.getByCategory('luxury');
      luxuryBrands.value = luxuryResult;
      
      // Trend brands
      const trendResult = await brandService.getByCategory('trend');
      trendingBrands.value = trendResult;
      
      // Sport brands
      const sportResult = await brandService.getByCategory('sport');
      sportBrands.value = sportResult;
      
      // Accessory brands
      const accessoryResult = await brandService.getByCategory('accessories');
      accessoryBrands.value = accessoryResult;
    } catch (error) {
      console.error('Error loading brands:', error);
    } finally {
      loading.brands = false;
    }
  }

  // Add product to cart
  function addToCart(product) {
    try {
      // Product ID check - ensure product ID is in _id field
      const productToAdd = { ...product };
      if (!productToAdd._id && productToAdd.id) {
        productToAdd._id = productToAdd.id;
      }
      
      // Add product to cart store
      cartStore.addToCart({
        _id: productToAdd._id,
        name: productToAdd.name,
        price: productToAdd.price,
        image: productToAdd.images?.[0] || 'https://placehold.co/400',
        quantity: 1
      });
      
      // Toast notification is shown only once
      // We don't call it here as there might already be a notification in cartStore
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('An error occurred while adding the product to cart.');
    }
  }
  
  // Load data and start slider when page is mounted
  onMounted(() => {
    fetchCategories();
    fetchFeaturedProducts();
    fetchNewProducts();
    fetchBestsellerProducts();
    fetchCollections();
    fetchSpecialCollections();
    fetchBrands();
    startSlideTimer();
    
    // Using static data for customer testimonials for now
    // Can be replaced with real API call when available
    testimonials.value = [
      { id: 1, name: 'John D.', comment: 'Great products, very satisfied!', rating: 5, avatar: 'https://ui-avatars.com/api/?name=John+D' },
      { id: 2, name: 'Sarah M.', comment: 'Fast delivery and quality products.', rating: 4, avatar: 'https://ui-avatars.com/api/?name=Sarah+M' },
      { id: 3, name: 'Michael R.', comment: 'Great value for money.', rating: 5, avatar: 'https://ui-avatars.com/api/?name=Michael+R' }
    ];
  });
  
  // Component unmounted olduğunda timer'ı temizle
  const cleanup = () => {
    clearInterval(slideInterval.value);
  };
  
  return {
    // Slider data
    slides,
    currentSlide,
    goToSlide,
    prevSlide,
    nextSlide,
    navigateToSlide,
    
    // Collections data
    collections,
    specialCollections,
    
    // Products data
    featuredProducts,
    bestsellerProducts,
    newProducts,
    
    // Categories data
    categories,
    
    // Brands data
    brands,
    luxuryBrands,
    trendingBrands,
    sportBrands,
    accessoryBrands,
    
    // Testimonials
    testimonials,
    
    // Newsletter data
    emailSubscription,
    isSubscribing,
    
    // Loading states
    loading,
    
    // Actions
    addToCart,
    handleNewsletter,
    
    // Router
    router,
    
    // Cleanup function
    cleanup
  };
} 