<script setup lang="ts">
withDefaults(
  defineProps<{
    selected?: boolean;
  }>(),
  { selected: false }
);
</script>

<template>
  <p
    class="w-full p-2.5 text-center"
    :class="$props.selected ? 'bg-neutral-900' : 'hover:bg-neutral-700'"
  >
    <slot></slot>
  </p>
</template>
