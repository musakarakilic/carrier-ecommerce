<template>
  <div class="container mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
    <!-- Loading Indicator -->
    <LoadingState v-if="loading" message="Loading profile..." />
    
    <!-- Error Indicator -->
    <ErrorAlert v-else-if="error" :message="error" />
    
    <div v-else>
      <!-- Profile Header -->
      <ProfileHeader 
        :userName="user.firstName + ' ' + user.lastName" 
        :editMode="editMode"
        @toggle-edit="toggleEditMode"
      />
      
      <div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <!-- Left Column: Profile Card -->
        <div class="lg:col-span-1">
          <ProfileCard 
            :user="user" 
            :profile="profile" 
            :editMode="editMode"
            @image-upload="handleImageUpload"
            @show-password-modal="showPasswordModal = true"
          />
        </div>
        
        <!-- Right Column: Profile Details or Edit Form -->
        <div class="lg:col-span-2">
          <ProfileEditForm 
            v-if="editMode" 
            :formData="formData" 
            :saving="saving"
            @save="saveProfile" 
            @cancel="cancelEdit"
          />
          <ProfileDetails v-else :user="user" :profile="profile" />
        </div>
      </div>
      
      <!-- Orders Section 
      <div class="mt-8">
        <OrdersSection 
          :orders="orders" 
          @view-order="viewOrder"
        />
    </div>-->
    
      <!-- Password Change Modal -->
    <PasswordChangeModal 
        v-if="showPasswordModal" 
        :changingPassword="changingPassword"
        @close="showPasswordModal = false"
      @submit="changePassword"
    />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useToast }  from 'vue-toastification';
import { useRouter } from 'vue-router';
import { userService } from '@/services/userService';
import { orderService } from '@/services/orderService';
import api from '@/services/api';

// Import components
import LoadingState from '@/components/ui/LoadingState.vue';
import ErrorAlert from '@/components/ui/ErrorAlert.vue';
import ProfileHeader from '@/components/profile/ProfileHeader.vue';
import ProfileCard from '@/components/profile/ProfileCard.vue';
import ProfileDetails from '@/components/profile/ProfileDetails.vue';
import ProfileEditForm from '@/components/profile/ProfileEditForm.vue';
import OrdersSection from '@/components/profile/OrdersSection.vue';
import PasswordChangeModal from '@/components/profile/PasswordChangeModal.vue';

// Router and toast
const router = useRouter();
const toast = useToast();

// User and profile data
const user = ref({
  _id: '',
  firstName: '',
  lastName: '',
  email: '',
  role: 'user',
  profileImage: '',
  createdAt: ''
});

// Profile information (address, phone, etc.)
const profile = ref({
  phone: '',
  birthDate: '',
  gender: '',
  address: ''
});

// Copies for form
const formData = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  birthDate: '',
  gender: '',
  address: ''
});

// Edit mode
const editMode = ref(false);

// Loading states
const loading = ref(true);
const saving = ref(false);
const changingPassword = ref(false);
const error = ref(null);

// Password change modal state
const showPasswordModal = ref(false);

// Orders
const orders = ref([]);

// Fetch profile data when page loads
onMounted(async () => {
  try {
    loading.value = true;
    await fetchUserProfile();
    await fetchOrders();
  } catch (err) {
    error.value = 'An error occurred while loading profile information';
    console.error('Profile loading error:', err);
  } finally {
    loading.value = false;
  }
});

// Fetch profile data from API
const fetchUserProfile = async () => {
  try {
    console.log('Making API request: ', api.defaults.baseURL + '/auth/profile');
    const userData = await userService.getProfile();
    console.log('Received data: ', userData);
    user.value = userData;
    
    // Set profile data
    profile.value = {
      phone: userData.phone || '',
      birthDate: userData.birthDate || '',
      gender: userData.gender || '',
      address: userData.address || ''
    };
    
    // Update form data
    Object.keys(formData).forEach(key => {
      if (userData[key]) {
        formData[key] = userData[key];
      }
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    if (error.response) {
      console.error('API response:', error.response.status, error.response.data);
    }
    throw error;
  }
};

// Fetch orders
const fetchOrders = async () => {
  try {
    const orderData = await orderService.getUserOrders();
    orders.value = orderData;
  } catch (error) {
    console.error('Error fetching orders:', error);
    // Only logging to not disrupt main user experience
  }
};

// Toggle edit mode
const toggleEditMode = () => {
  if (editMode.value) {
    // Reset values when exiting edit mode
    cancelEdit();
  } else {
    // Load current values when entering edit mode
    editMode.value = true;
    // Update form data
    Object.keys(formData).forEach(key => {
      if (user.value[key]) {
        formData[key] = user.value[key];
      } else if (profile.value[key]) {
        formData[key] = profile.value[key];
      }
    });
  }
};

// Cancel profile editing
const cancelEdit = () => {
  editMode.value = false;
  // Reset form data
  Object.keys(formData).forEach(key => {
    if (user.value[key]) {
      formData[key] = user.value[key];
    } else if (profile.value[key]) {
      formData[key] = profile.value[key];
    } else {
      formData[key] = '';
    }
  });
};

// Save profile information
const saveProfile = async () => {
  try {
    saving.value = true;
  
    // Prepare data to send to API
    const userData = { ...formData };
    
    // Send profile update request
    const updatedUser = await userService.updateProfile(userData);
    
    // Update state after successful update
    user.value = {
      ...user.value,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email
    };
    
    profile.value = {
      phone: updatedUser.phone || '',
      birthDate: updatedUser.birthDate || '',
      gender: updatedUser.gender || '',
      address: updatedUser.address || ''
    };
      
    // Exit edit mode
    editMode.value = false;
      
    toast.success('Your profile information has been successfully updated');
  } catch (error) {
    console.error('Profile update error:', error);
    toast.error('An error occurred while updating your profile');
  } finally {
    saving.value = false;
  }
};

// Upload profile image
const handleImageUpload = async (file) => {
  try {
    saving.value = true;
    
    const formData = new FormData();
    formData.append('profileImage', file);
    
    const response = await userService.uploadProfileImage(formData);
    
    // Update profile image
    user.value.profileImage = response.profileImage;
    
    toast.success('Your profile image has been successfully updated');
  } catch (error) {
    console.error('Image upload error:', error);
    toast.error('An error occurred while uploading your profile image');
  } finally {
    saving.value = false;
  }
};

// Change password
const changePassword = async (passwordData) => {
  try {
    changingPassword.value = true;
  
    await userService.changePassword(passwordData);
    
    showPasswordModal.value = false;
    toast.success('Your password has been successfully changed');
  } catch (error) {
    console.error('Password change error:', error);
    toast.error(error.response?.data?.message || 'An error occurred while changing your password');
  } finally {
    changingPassword.value = false;
  }
};

// View order details
const viewOrder = (orderId) => {
  // Redirect to order detail page
  router.push(`/order/${orderId}`);
};
</script>

<style scoped>
/* Add specific styles here */
</style> 