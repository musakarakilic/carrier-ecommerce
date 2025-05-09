<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Header -->
    <HeaderNav />

    <!-- Main Content -->
    <main class="flex-grow">
      <RouterView />
    </main>

    <!-- Footer -->
    <FooterSection />
  </div>
</template>

<script setup>
import HeaderNav from '../components/HeaderNav.vue';
import FooterSection from '../components/FooterSection.vue';
import { RouterView } from 'vue-router';
</script> 