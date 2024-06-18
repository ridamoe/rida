<script setup lang="ts">
const props = defineProps<{
  icon: string;
}>();
</script>

<template>
  <div class="h-full w-full" :class="icon"></div>
</template>
