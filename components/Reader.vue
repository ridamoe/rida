<script setup lang="ts">
const settings = useSettingsStore();

const props = defineProps<{
  image?: string;
}>();

const pageFitImageClass = computed(() => {
  switch (settings.pageFit) {
    case "original":
      return tw`h-max w-max max-w-none`;
    case "limit-all":
      return tw`h-full max-h-full w-auto max-w-full object-contain`;
    case "limit-width":
      return tw`max-w-full object-contain`;
    case "limit-height":
      return tw`h-min max-h-full w-min max-w-full`;
    case "fit-all":
      return tw`h-full min-w-0 object-contain`;
    case "fit-width":
      return tw`h-max w-full min-w-0 max-w-[unset] grow`;
    case "fit-height":
      return tw`shrink-1 max-h-full min-h-full min-w-[unset] max-w-[unset]`;
    default:
      return "";
  }
});
</script>

<template>
  <div
    class="max-w-screen align-start relative flex h-screen min-h-screen grow overflow-y-auto bg-black"
  >
    <img :src="image" :class="['m-auto', pageFitImageClass]" />
  </div>
</template>
