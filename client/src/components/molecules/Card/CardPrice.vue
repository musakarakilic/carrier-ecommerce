<template>
  <div class="flex items-center">
    <span class="text-lg font-bold" :class="priceClass">{{ formattedPrice }}</span>
    <span v-if="oldPrice" class="ml-2 text-sm text-gray-500 line-through">{{ formattedOldPrice }}</span>
    <slot name="discount-badge"></slot>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  price: {
    type: Number,
    required: true
  },
  oldPrice: {
    type: Number,
    default: null
  },
  currency: {
    type: String,
    default: '$'
  },
  priceClass: {
    type: String,
    default: 'text-indigo-600'
  },
  locale: {
    type: String,
    default: 'en-US'
  },
  minimumFractionDigits: {
    type: Number,
    default: 2
  },
  maximumFractionDigits: {
    type: Number,
    default: 2
  }
});

const formattedPrice = computed(() => {
  return formatPrice(props.price);
});

const formattedOldPrice = computed(() => {
  return props.oldPrice ? formatPrice(props.oldPrice) : '';
});

// Price format
const formatPrice = (price) => {
  return `${parseFloat(price).toLocaleString(props.locale, { 
    minimumFractionDigits: props.minimumFractionDigits,
    maximumFractionDigits: props.maximumFractionDigits
  })} ${props.currency}`;
};

// Discount percentage
const discountPercentage = computed(() => {
  if (!props.oldPrice || props.oldPrice <= props.price) return null;
  return Math.round((1 - props.price / props.oldPrice) * 100);
});

defineExpose({ discountPercentage });
</script> 