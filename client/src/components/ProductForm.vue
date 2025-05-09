<template>
  <BaseForm @submit="handleSubmit" @cancel="$emit('cancel')" :loading="loading">
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <!-- Product Name -->
      <div class="col-span-2">
        <FormField 
          id="name" 
          label="Product Name" 
          v-model="formData.name" 
          required
        />
      </div>

      <!-- Category -->
      <FormSelect
        id="category"
        label="Category"
        v-model="formData.category"
        placeholder="Select Category"
        required
      >
        <option v-for="category in categories" :key="category._id" :value="category._id">
          {{ category.name }}
        </option>
      </FormSelect>

      <!-- Price -->
      <FormField
        id="price"
        label="Price ($)"
        v-model="formData.price"
        type="number"
        min="0"
        step="0.01"
        required
      >
        <template #prefix>
          <span class="text-gray-500 sm:text-sm">$</span>
        </template>
      </FormField>

      <!-- Stock -->
      <FormField
        id="stock"
        label="Stock Quantity"
        v-model="formData.stock"
        type="number"
        min="0"
        required
      />

      <!-- Brand -->
      <FormSelect
        id="brand"
        label="Brand"
        v-model="formData.brand"
        placeholder="Select Brand"
      >
        <option v-for="brand in brands" :key="brand._id" :value="brand._id">
          {{ brand.name }}
        </option>
      </FormSelect>

      <!-- Collections -->
      <FormSelect
        id="collections"
        label="Collections"
        v-model="formData.collections"
        multiple
        helpText="Hold Ctrl key to select multiple collections"
      >
        <option v-for="collection in collections" :key="collection._id" :value="collection._id">
          {{ collection.title }}
        </option>
      </FormSelect>

      <!-- Status -->
      <div class="flex items-center h-full pt-5">
        <FormCheckbox
          id="isActive"
          v-model="formData.isActive"
          label="Active"
        />
      </div>
    </div>

    <!-- Image URL -->
    <FormImageUpload
      id="productImages"
      label="Product Images"
      :images="formData.images"
      :error="uploadError"
      :uploading="uploadingImages"
      :required="true"
      helpText="You can upload up to 5 images. JPG, PNG or JPEG formats are supported."
      @file-selected="onFileSelected"
      @remove-image="removeImage"
    />

    <!-- Description -->
    <FormTextarea
      id="description"
      label="Description"
      v-model="formData.description"
      rows="4"
      required
    />
  </BaseForm>
</template>

<script setup>
import { ref, onMounted} from 'vue';
import { productService } from '../services/productService';
import { brandService } from '../services/brandService';
import { collectionService } from '../services/collectionService';
import { useToast } from 'vue-toastification';

// Modular form components
import BaseForm from './molecules/Form/index.vue';
import FormField from './molecules/Form/FormField.vue';
import FormSelect from './molecules/Form/FormSelect.vue';
import FormTextarea from './molecules/Form/FormTextarea.vue';
import FormCheckbox from './molecules/Form/FormCheckbox.vue';
import FormImageUpload from './molecules/Form/FormImageUpload.vue';

const props = defineProps({
  product: {
    type: Object,
    default: () => ({})
  },
  categories: {
    type: Array,
    default: () => []
  },
  brands: {
    type: Array,
    default: () => []
  },
  collections: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['submit', 'cancel']);
const toast = useToast();
const uploadingImages = ref(false);
const uploadError = ref('');
const fileInput = ref(null);
const brands = ref([]);
const collections = ref([]);

const formData = ref({
  name: '',
  price: 0,
  description: '',
  images: [],
  brand: '',
  category: '',
  stock: 0,
  isActive: true,
  collections: []
});

onMounted(async () => {
  if (props.product._id) {
    formData.value = { 
      ...props.product,
      images: props.product.images || (props.product.image ? [props.product.image] : [])
    };
  }
  
  try {
    // Get brands and collections if not provided in props
    if (props.brands.length === 0 || props.collections.length === 0) {
      const [brandsData, collectionsData] = await Promise.all([
        brandService.getAll(),
        collectionService.getAll()
      ]);
      
      brands.value = brandsData || [];
      collections.value = collectionsData || [];
    } else {
      brands.value = props.brands;
      collections.value = props.collections;
    }
  } catch (error) {
    console.error('Error loading data:', error);
    toast.error('Error loading brands and collections.');
  }
});

const handleSubmit = () => {
  if (formData.value.images.length === 0) {
    uploadError.value = 'You must upload at least one product image.';
    return;
  }
  
  if (formData.value.images.length > 0) {
    formData.value.image = formData.value.images[0];
  }
  
  uploadError.value = '';
  emit('submit', formData.value);
};

const onFileSelected = async ({ files, error }) => {
  if (error) {
    uploadError.value = error;
    return;
  }
  
  if (!files || files.length === 0) return;
  
  uploadingImages.value = true;
  uploadError.value = '';
  
  try {
    for (const file of files) {
      const result = await productService.uploadImage(file);
      
      if (result && result.url) {
        formData.value.images.push(result.url);
        toast.success('Image uploaded successfully.');
      } else {
        throw new Error('An error occurred while uploading the image.');
      }
    }
  } catch (error) {
    console.error('Image upload error:', error);
    uploadError.value = error.message || 'An error occurred while uploading the image. Please try again.';
    toast.error(uploadError.value);
  } finally {
    uploadingImages.value = false;
  }
};

const removeImage = (index) => {
  if (index >= 0 && index < formData.value.images.length) {
    formData.value.images.splice(index, 1);
    toast.success('Image removed.');
  }
};
</script> 