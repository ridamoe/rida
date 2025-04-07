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

// Define action based on current reading direction
const action = computed(() => {
  switch (settings.readDirection) {
    case "left-to-right":
      return {
        left: progress.prev,
        right: progress.next,
      };
    case "right-to-left":
      return {
        left: progress.next,
        right: progress.prev,
      };
    default:
      return {
        left: () => {},
        right: () => {},
      };
  }
});

function onClick(e: MouseEvent) {
  let w = (e.target as HTMLElement).offsetWidth;
  let rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
  let calc = w / 2 - e.offsetX;
  if (Math.abs(calc) > 2 * rem) {
    if (calc > 0) action.value.left();
    else action.value.right();
  }
}

function onKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case "ArrowLeft":
      action.value.left();
      break;
    case "ArrowRight":
      action.value.right();
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
  <PageSelector />
  <div class="h-full w-full overflow-y-auto" @click="onClick">
    <Page
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
