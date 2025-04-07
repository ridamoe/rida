<script setup lang="ts">
const settings = useSettingsStore();
const progress = useProgressStore();
const providersStore = useProvidersStore();

watchEffect(() => {
  progress.source?.images.map(providersStore.loadImage);
});

const currentSrc = computed(() =>
  progress.source?.images.at(progress.page - 1)
);

function onClick(e: MouseEvent) {
  let w = (e.target as HTMLElement).offsetWidth;
  let rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
  let calc = w / 2 - e.offsetX;
  if (Math.abs(calc) > 2 * rem) {
    if (calc > 0) progress.next();
    else progress.prev();
  }
}

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
  <ReaderPageSelector v-model="progress.page" />
  <div class="h-full w-full overflow-y-auto" @click="onClick">
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
</template>
