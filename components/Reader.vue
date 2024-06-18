<script setup lang="ts">
const props = defineProps<{
  image?: string;
  pageFit:
    | "original"
    | "stretch-height"
    | "stretch-all"
    | "stretch-width"
    | "limit-all"
    | "limit-height"
    | "limit-width";
}>();

const imageClass = computed(() => {
  switch (props.pageFit) {
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
    <img :src="image" :class="imageClass" />
  </div>
</template>
