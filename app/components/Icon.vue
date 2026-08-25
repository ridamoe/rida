<script setup lang="ts">
const props = defineProps<{
  icon: string;
}>();
</script>

<template>
  <span class="aspect-square h-full w-full" :class="icon"></span>
</template>
