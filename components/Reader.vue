<script setup lang="ts">
const settings = useSettingsStore();
const progress = useProgressStore();
const sources = useSourcesStore();

const currentImageSrc = computed(() => {
  if (sources.current) {
    return sources.getPage(sources.currentSourceId!, progress.page);
  }
});

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

function onClick(e: MouseEvent) {
  let w = (e.target as HTMLElement).offsetWidth;
  let rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
  let calc = w / 2 - e.offsetX;
  if (Math.abs(calc) > 2 * rem) {
    progress.page += calc > 0 ? 1 : -1;
  }
}

onMounted(() => {
  document.addEventListener("keydown", function (event) {
    switch (event.key) {
      case "ArrowLeft":
        progress.page++;
        break;
      case "ArrowRight":
        progress.page--;
        break;
      case "j":
        sources.changeSource();
    }
  });
});
</script>

<template>
  <div
    @click="onClick"
    class="max-w-screen align-start relative flex h-screen grow select-none bg-black"
  >
    <PageSelector v-model="progress.page" />
    <div class="h-full w-full overflow-y-auto">
      <img :src="currentImageSrc" :class="['m-auto', pageFitImageClass]" />
    </div>
  </div>
</template>
