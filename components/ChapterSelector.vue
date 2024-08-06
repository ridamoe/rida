<script setup lang="ts">
const progress = useProgressStore();
const providers = useProvidersStore();

const chapterListIndex = computed(() =>
  providers.chapterList.indexOf(progress.chapter)
);

const hasPrev = computed(() => {
  if (providers.current) return chapterListIndex.value > 0;
  else return false;
});

const hasNext = computed(() => {
  if (providers.current)
    return chapterListIndex.value < providers.chapterList.length;
  else return false;
});

function onNext() {
  progress.chapter = providers.chapterList[chapterListIndex.value + 1];
}

function onPrev() {
  progress.chapter = providers.chapterList[chapterListIndex.value - 1];
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
