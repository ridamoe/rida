<script setup lang="ts">
useHead({
  link: [{ rel: "icon", href: "/icon.svg" }],
});
</script>

<template>
  <div>
    <NuxtPwaManifest />
    <NuxtPage />
  </div>
</template>
