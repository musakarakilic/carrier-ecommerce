import { createRouter, createWebHistory } from 'vue-router';

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
        component: () => import('../views/Cart/Checkout.vue')
      },
      {
        path: '/order-confirmation',
        name: 'OrderConfirmation',
        component: () => import('../views/Order/Confirmation.vue')
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
        component: () => import('../views/Order/Detail.vue'),
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
    component: () => import('../views/admin/AdminLayout.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('../views/admin/Dashboard.vue')
      },
      {
        path: 'products',
        name: 'Products',
        component: () => import('../views/admin/Products.vue')
      },
      {
        path: 'categories',
        name: 'Categories',
        component: () => import('../views/admin/Categories.vue')
      },
      {
        path: 'collections',
        name: 'Collections',
        component: () => import('../views/admin/Collections.vue')
      },
      {
        path: 'brands',
        name: 'Brands',
        component: () => import('../views/admin/Brands.vue')
      },
      {
        path: 'subscriptions',
        name: 'Subscriptions',
        component: () => import('../views/admin/Subscriptions.vue')
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('../views/admin/Users.vue')
      },
      {
        path: 'orders',
        name: 'AdminOrders',
        component: () => import('../views/admin/Orders.vue')
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