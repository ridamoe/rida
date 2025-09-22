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
    class="align-start md:scrollbar-styled relative scrollbar-hidden flex grow flex-col bg-black select-none md:h-screen md:max-w-screen"
  >
    <ReaderVertical v-if="settings.readDirection == 'vertical'" />
    <ReaderHorizontal v-else />
    <footer
      class="inline-block w-full items-center gap-0 bg-neutral-800 text-stone-200 md:hidden"
      v-if="settings.readDirection == 'vertical'"
    >
      <ChapterSelector />
    </footer>
  </div>
</template>
