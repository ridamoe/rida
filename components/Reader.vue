<script setup lang="ts">
const settings = useSettingsStore();

const props = defineProps<{
  image?: string;
}>();

const pageFitImageClass = computed(() => {
  switch (settings.pageFit) {
    case "original":
      return "m-auto h-max w-max max-w-none";
    default:
      return "";
  }
});
</script>

<template>
  <div
    class="max-w-screen align-start relative flex min-h-screen grow overflow-y-auto bg-black sm:max-h-screen"
  >
    <img :src="image" :class="[pageFitImageClass]" />
  </div>
</template>
