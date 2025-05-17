<script setup lang="ts">
const settings = useSettingsStore();
const progress = useProgressStore();
const providersStore = useProvidersStore();

const load = async () => {
  if (progress.chapter && !progress.chapter.sources) {
    progress.setChapter(await providersStore.load(progress.chapter));
  }
  return true;
};
await callOnce("preload-chapter", load, { mode: "navigation" });
watchEffect(load);
</script>

<template>
  <div
    class="align-start relative flex h-screen max-w-screen grow bg-black select-none"
  >
    <ReaderVertical v-if="settings.readDirection == 'vertical'" />
    <ReaderHorizontal v-else />
  </div>
</template>
