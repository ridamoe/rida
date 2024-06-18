<script setup lang="ts">
const route = useRoute();
</script>

<template>
  <div class="max-w-screen flex min-h-screen flex-col sm:flex-row">
    <OptionPanel />
    <Reader :image="String(route.query.url)" page-fit="original"></Reader>
  </div>
</template>
