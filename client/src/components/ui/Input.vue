<script setup>
import InputComponent from '../atoms/Input.vue';

// All props and emits are passed through from Input component
defineProps(InputComponent.props);
defineEmits(InputComponent.emits);
</script>

<template>
  <InputComponent
    v-bind="$attrs"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    @blur="$emit('blur', $event)"
    @focus="$emit('focus', $event)"
  >
    <template v-if="$slots['icon-left']" #icon-left>
      <slot name="icon-left"></slot>
    </template>
    
    <template v-if="$slots['icon-right']" #icon-right>
      <slot name="icon-right"></slot>
    </template>
  </InputComponent>
</template>
