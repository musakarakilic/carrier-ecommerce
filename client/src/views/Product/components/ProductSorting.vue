<!-- ProductSorting.vue - Product sorting component -->
<template>
  <div class="flex items-center space-x-3">
    <span class="text-sm text-gray-700">Sort by:</span>
    <select 
      v-model="localSorting" 
      @change="changeSorting"
      class="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm bg-white"
    >
      <option value="newest">Newest</option>
      <option value="price_asc">Price (Low to High)</option>
      <option value="price_desc">Price (High to Low)</option>
      <option value="name_asc">Name (A-Z)</option>
      <option value="name_desc">Name (Z-A)</option>
      <option value="rating_desc">Most Rated</option>
    </select>
    <button 
      @click="applySorting"
      class="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-md border border-indigo-200 hover:bg-indigo-200 transition-colors"
    >
      Apply
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  sorting: {
    type: String,
    default: 'newest'
  }
});

const emit = defineEmits(['apply-sorting']);

// Local sorting variable (for v-model)
const localSorting = ref(props.sorting);

// Update local variable when props change
watch(() => props.sorting, (newValue) => {
  localSorting.value = newValue;
});

// Trigger event when sorting changes
function changeSorting() {
  // Apply automatically when selection changes
  emit('apply-sorting', localSorting.value);
  console.log(`Sorting selected and applied: ${localSorting.value}`);
}

// Apply sorting
function applySorting() {
  emit('apply-sorting', localSorting.value);
}
</script> 