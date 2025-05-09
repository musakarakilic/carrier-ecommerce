import { createRouter, createWebHistory } from 'vue-router';
import AdminLayout from '../views/Admin/AdminLayout.vue';
import Dashboard from '../views/Admin/Dashboard.vue';
import Products from '../views/Admin/Products.vue';
import Categories from '../views/Admin/Categories.vue';
import Users from '../views/Admin/Users.vue';
import Orders from '../views/Admin/Orders.vue';
import Collections from '../views/Admin/Collections.vue';
import Brands from '../views/Admin/Brands.vue';
import Subscriptions from '../views/Admin/Subscriptions.vue';


const routes = [
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('../views/Home/index.vue')
      },
      {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Auth/Login.vue')
      },
      {
        path: '/register',
        name: 'Register',
        component: () => import('../views/Auth/Register.vue')
      },
      {
        path: '/profile',
        name: 'Profile',
        component: () => import('../views/Auth/Profile.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/category',
        name: 'category',
        component: () => import('../views/Product/Products.vue')
      },
      {
        path: '/category/:categorySlug',
        name: 'categoryBySlug',
        component: () => import('../views/Product/Products.vue')
      },
      {
        path: '/category/:categorySlug/:subcategorySlug',
        name: 'subcategoryBySlug',
        component: () => import('../views/Product/Products.vue')
      },
      {
        path: '/collections/:slug',
        name: 'collection',
        component: () => import('../views/Product/Products.vue')
      },
      {
        path: '/product/:id',
        name: 'ProductDetail',
        component: () => import('../views/Product/Detail/index.vue')
      },
      {
        path: '/product/:slug-:id([a-f0-9]{24})',
        name: 'ProductDetailWithSlug',
        component: () => import('../views/Product/Detail/index.vue')
      },
      {
        path: '/cart',
        name: 'Cart',
        component: () => import('../views/Cart/index.vue')
      },
      {
        path: '/checkout',
        name: 'Checkout',
        component: () => import('../views/Cart/checkout.vue')
      },
      {
        path: '/order-confirmation',
        name: 'OrderConfirmation',
        component: () => import('../views/Order/confirmation.vue')
      },
      {
        path: '/orders',
        name: 'Orders',
        component: () => import('../views/Order/index.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/order/:id',
        name: 'OrderDetail',
        component: () => import('../views/Order/detail.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/search',
        name: 'SearchResults',
        component: () => import('../views/Search/Results.vue')
      },
      {
        path: '/products/bestsellers',
        name: 'BestsellerProducts',
        component: () => import('../views/Product/Bestsellers.vue')
      },
      {
        path: '/products/new',
        name: 'NewProducts',
        component: () => import('../views/Product/New.vue')
      },
      {
        path: '/brands',
        name: 'AllBrands',
        component: () => import('../views/Brand/AllBrands.vue')
      },
      {
        path: '/brands/:brandSlug',
        name: 'BrandProducts',
        component: () => import('../views/Brand/BrandProducts.vue')
      },
      {
        path: '/brands/:brandSlug/:productSlug',
        name: 'BrandProductDetail',
        component: () => import('../views/Brand/BrandProductDetail.vue')
      },
      {
        path: '/collections',
        name: 'AllCollections',
        component: () => import('../views/Collection/AllCollections.vue')
      },
      {
        path: '/404',
        name: 'NotFound',
        component: () => import('../views/Error/NotFound.vue')
      },
      {
        path: '/:pathMatch(.*)*',
        redirect: to => {
          return { path: '/404', query: { from: to.fullPath } };
        }
      }
    ]
  },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: Dashboard
      },
      {
        path: 'products',
        name: 'Products',
        component: Products
      },
      {
        path: 'categories',
        name: 'Categories',
        component: Categories
      },
      {
        path: 'collections',
        name: 'Collections',
        component: Collections
      },
      {
        path: 'brands',
        name: 'Brands',
        component: Brands
      },
      {
        path: 'subscriptions',
        name: 'Subscriptions',
        component: Subscriptions
      },
      {
        path: 'users',
        name: 'Users',
        component: Users
      },
      {
        path: 'orders',
        name: 'AdminOrders',
        component: Orders
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Always scroll to top on page navigation
    return { top: 0 }
  }
});

// Navigation Guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  if (to.meta.requiresAuth && !token) {
    next('/login');
  } else if (to.meta.requiresAdmin && userRole !== 'admin') {
    next('/');
  } else {
    next();
  }
});

export default router; 