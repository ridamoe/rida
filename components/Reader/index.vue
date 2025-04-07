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
</script>

<template>
  <div
    class="align-start relative flex h-screen max-w-screen grow bg-black select-none"
  >
    <ReaderHorizontal />
  </div>
</template>
