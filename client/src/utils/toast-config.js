/**
 * Centralized toast configuration for the application
 * This allows consistent toast styling and behavior across the app
 */

// Default toast configuration
export const defaultToastOptions = {
  position: 'top-right',
  timeout: 1500,
  closeOnClick: true,
  pauseOnFocusLoss: false,
  pauseOnHover: false,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: true,
  hideProgressBar: true,
  closeButton: false,
  icon: true,
  rtl: false,
  transition: 'Vue-Toastification__fade',
  maxToasts: 3,
  newestOnTop: true
};

// Success toast preset
export const successToast = {
  ...defaultToastOptions,
  timeout: 1000 // Shorter timeout for success messages
};

// Error toast preset
export const errorToast = {
  ...defaultToastOptions,
  timeout: 3000 // Longer timeout for error messages
};

// Warning toast preset
export const warningToast = {
  ...defaultToastOptions,
  timeout: 2500
};

// Info toast preset
export const infoToast = {
  ...defaultToastOptions,
  timeout: 2000
};

export default defaultToastOptions; 