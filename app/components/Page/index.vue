<script setup lang="ts">
const props = defineProps<{
  pageFit:
    | "original"
    | "fit-height"
    | "fit-all"
    | "fit-width"
    | "limit-all"
    | "limit-height"
    | "limit-width";
  src: string | undefined;
  loaded: boolean;
}>();

const pageFitImageClass = computed(() => {
  switch (props.pageFit) {
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
      return tw`h-max w-full max-w-[unset] min-w-0 grow`;
    case "fit-height":
      return tw`max-h-full min-h-full max-w-[unset] min-w-[unset] shrink-1`;
    default:
      return "";
  }
});
</script>

<template>
  <img
    v-if="src && loaded"
    :src="src"
    :class="['m-auto mb-[-0.005px]', pageFitImageClass]"
  />
  <div v-else class="flex items-center justify-center">
    <p class="text-lg text-white">Loading...</p>
  </div>
</template>
