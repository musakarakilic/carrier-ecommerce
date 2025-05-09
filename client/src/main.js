import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './style.css';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import defaultToastOptions from './utils/toast-config';

// Create Pinia store
const pinia = createPinia();

// Create Vue app
const app = createApp(App);

// Add Pinia, Router and Toast
app.use(pinia);
app.use(router);
app.use(Toast, defaultToastOptions);

// Start the app
app.mount('#app'); 