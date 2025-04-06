<script setup lang="ts">
const settings = useSettingsStore();
const progress = useProgressStore();
const providersStore = useProvidersStore();
const image = ref();

const load = async () => {
  if (progress.chapter && !progress.chapter.sources) {
    progress.setChapter(await providersStore.load(progress.chapter));
  }
  return true;
};

await useAsyncData(`preload-chapter`, load);
watchEffect(load);

const images = computed(() => progress.source?.images);

watchEffect(() => {
  images.value?.map(providersStore.loadImage);
});

const currentSrc = computed(() => images.value?.at(progress.page - 1));

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
      return tw`h-max w-full max-w-[unset] min-w-0 grow`;
    case "fit-height":
      return tw`max-h-full min-h-full max-w-[unset] min-w-[unset] shrink-1`;
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

// const onImageLoad = () => providersStore.setLoaded(currentSrc.value!);

onMounted(async () => {
  await providersStore.loadImage(currentSrc.value!);
});

function onKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case "ArrowLeft":
      progress.next();
      break;
    case "ArrowRight":
      progress.prev();
      break;
    case "j":
      // TODO: toggle source
      break;
  }
}

onMounted(() => {
  document.addEventListener("keydown", onKeydown);
});

onBeforeUnmount(() => {
  document.removeEventListener("keydown", onKeydown);
});
</script>

<template>
  <div
    @click="onClick"
    class="align-start relative flex h-screen max-w-screen grow bg-black select-none"
  >
    <PageSelector v-model="progress.page" />
    <div class="h-full w-full overflow-y-auto">
      <img
        v-if="
          currentSrc &&
          Object.keys(providersStore.loadedImages).includes(currentSrc)
        "
        ref="image"
        :src="providersStore.loadedImages[currentSrc]"
        :class="['m-auto', pageFitImageClass]"
      />
      <div v-else>
        <p>Loading...</p>
      </div>
    </div>
  </div>
</template>
