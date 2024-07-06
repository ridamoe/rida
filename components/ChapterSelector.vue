<script setup lang="ts">
const progress = useProgressStore();
const sources = useSourcesStore();

const chapterList = computed(() => {
  return sources.current ? Object.keys(sources.current.chapters) : [];
});

const chapterListIndex = computed(() =>
  chapterList.value.indexOf(progress.chapter)
);

const hasPrev = computed(() => {
  if (sources.current) return chapterListIndex.value > 0;
  else return false;
});

const hasNext = computed(() => {
  if (sources.current) return chapterListIndex.value < chapterList.value.length;
  else return false;
});

function onNext() {
  progress.chapter = chapterList.value[chapterListIndex.value + 1];
}

function onPrev() {
  progress.chapter = chapterList.value[chapterListIndex.value - 1];
}
</script>

<template>
  <div
    class="flex h-12 w-full justify-between bg-neutral-900 p-2.5 text-center align-middle"
  >
    <IconButton
      icon="i-[iconamoon--arrow-left-2]"
      :disabled="!hasPrev"
      @click="onPrev"
    />
    <p>Chapter {{ progress.chapter }}</p>
    <IconButton
      icon="i-[iconamoon--arrow-right-2]"
      :disabled="!hasNext"
      @click="onNext"
    />
  </div>
</template>
