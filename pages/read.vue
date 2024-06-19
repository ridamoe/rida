<script setup lang="ts">
const route = useRoute();
</script>

<template>
  <div class="max-w-screen flex min-h-screen flex-col md:flex-row">
    <OptionPanel />
    <Reader :image="String(route.query.url)"></Reader>
  </div>
</template>
