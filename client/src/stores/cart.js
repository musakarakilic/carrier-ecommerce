import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('cart')) || [],
    loading: false,
    error: null,
    modalIsOpen: false
  }),

  getters: {
    totalItems: (state) => {
      return state.items.reduce((total, item) => total + (item.quantity || 1), 0);
    },
    
    cartTotalPrice: (state) => {
      return state.items.reduce((total, item) => {
        return total + (item.price * (item.quantity || 1));
      }, 0);
    },

    // Get quantity of a specific product in cart
    getItemQuantity: (state) => (productId) => {
      const existingItem = state.items.find(item => item._id === productId || item.productId === productId);
      return existingItem ? existingItem.quantity : 0;
    }
  },

  actions: {
    toggleModal() {
      this.modalIsOpen = !this.modalIsOpen;
    },
    
    addToCart(item) {
      try {
        if (!item || (!item._id && !item.productId)) {
          console.error('Invalid product:', JSON.stringify(item, null, 2));
          this.error = 'Product information is missing or invalid';
          return;
        }

        const normalizedItem = JSON.parse(JSON.stringify(item));
        const itemId = normalizedItem._id || normalizedItem.productId;

        const existingItemIndex = this.items.findIndex(
          cartItem => (cartItem._id === itemId || cartItem.productId === itemId)
        );

        if (existingItemIndex >= 0) {
          this.items[existingItemIndex].quantity = (this.items[existingItemIndex].quantity || 1) + (normalizedItem.quantity || 1);
        } else {
          this.items.push({
            ...normalizedItem,
            quantity: normalizedItem.quantity || 1
          });
        }

        // Save cart to localStorage and update state
        this.saveCart();
      } catch (error) {
        this.error = 'An error occurred while adding product to cart';
        console.error('Add to cart error:', error);
      }
    },

    updateCartItemQuantity(productId, quantity) {
      try {
        if (!productId) {
          console.error('Invalid product ID:', productId);
          return;
        }
        
        const itemIndex = this.items.findIndex(item => item._id === productId || item.productId === productId);
        
        if (itemIndex >= 0) {
          if (quantity <= 0) {
            this.removeFromCart(productId);
          } else {
            this.items[itemIndex].quantity = quantity;
            this.saveCart();
          }
        }
      } catch (error) {
        this.error = 'An error occurred while updating product quantity';
        console.error('Quantity update error:', error);
      }
    },

    removeFromCart(productId) {
      try {
        if (!productId) {
          console.error('Invalid product ID:', productId);
          return;
        }
        
        this.items = this.items.filter(item => item._id !== productId && item.productId !== productId);
        this.saveCart();
      } catch (error) {
        this.error = 'An error occurred while removing product from cart';
        console.error('Remove from cart error:', error);
      }
    },

    clearCart() {
      this.items = [];
      localStorage.removeItem('cart');
      // Update state and UI after clearing cart
      this.saveCart();
    },

    // Save cart to localStorage
    saveCart() {
      try {
        localStorage.setItem('cart', JSON.stringify(this.items));
      } catch (error) {
        console.error('Error saving cart:', error);
      }
    }
  }
}); 