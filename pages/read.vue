<script async setup lang="ts">
const route = useRoute();
const sources = useSourcesStore();
if (typeof route.query.src == "string") {
  await sources.setup(route.query.src);
}
</script>

<template>
  <div class="max-w-screen flex min-h-screen flex-col md:flex-row">
    <OptionPanel />
    <Reader></Reader>
  </div>
</template>
