<script setup lang="ts">
const settings = useSettingsStore();
const progress = useProgressStore();
const providersStore = useProvidersStore();

await callOnce(
  "preload-chapter",
  async () => {
    if (progress.chapter && !progress.chapter.sources) {
      progress.setChapter(await providersStore.load(progress.chapter));
    }
    return true;
  },
  { mode: "navigation" }
);

const images = computed(() => progress.source?.images);

watchEffect(() => {
  images.value?.map(providersStore.loadImage);
});

const currentSrc = computed(() => images.value?.at(progress.page - 1));

function onClick(e: MouseEvent) {
  let w = (e.target as HTMLElement).offsetWidth;
  let rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
  let calc = w / 2 - e.offsetX;
  if (Math.abs(calc) > 2 * rem) {
    if (calc > 0) progress.next();
    else progress.prev();
  }
}

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
    <ReaderPageSelector v-model="progress.page" />
    <div class="h-full w-full overflow-y-auto">
      <ReaderPage
        :src="currentSrc && providersStore.loadedImages[currentSrc]"
        :page-fit="settings.pageFit"
        :loaded="
          currentSrc
            ? Object.keys(providersStore.loadedImages).includes(currentSrc)
            : false
        "
      />
    </div>
  </div>
</template>
