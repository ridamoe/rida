<script setup lang="ts">
import { isClient } from "@vueuse/core";

const settings = useSettingsStore();
const progress = useProgressStore();
const sources = useSourcesStore();

const image = ref();

useAsyncData(
  `pages-test-${progress.chapter}`,
  async () => {
    return await sources.current?.chapters[progress.chapter]
      .fetchPages()
      .then(() => true);
  },
  { watch: [() => progress.source, () => progress.chapter] }
);

const pages = computed(
  () => sources.current?.chapters[progress.chapter]?.pages
);

watchEffect(() => {
  pages.value?.map(sources.preloadURL);
});

const currentSrc = computed(() => pages.value?.at(progress.page - 1));

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
    if (calc > 0) progress.next();
    else progress.prev();
  }
}

const onImageLoad = () => sources.setLoaded(currentSrc.value!);

onMounted(() => {
  onImageLoad();
});

onMounted(() => {
  document.addEventListener("keydown", function (event) {
    switch (event.key) {
      case "ArrowLeft":
        progress.next();
        break;
      case "ArrowRight":
        progress.prev();
        break;
      case "j":
        progress.setSource(progress.source + 1);
    }
  });
});
</script>

<template>
  <div
    @click="onClick"
    class="max-w-screen align-start relative flex h-screen grow select-none bg-black"
  >
    <PageSelector v-model="progress.page" :current-src="currentSrc" />
    <div class="h-full w-full overflow-y-auto">
      <img
        v-show="currentSrc && sources.loadedUrls.has(currentSrc)"
        ref="image"
        @load="onImageLoad"
        :src="currentSrc"
        :class="['m-auto', pageFitImageClass]"
      />
      <div v-show="currentSrc && !sources.loadedUrls.has(currentSrc)"></div>
    </div>
  </div>
</template>
