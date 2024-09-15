<script setup lang="ts">
const progress = useProgressStore();
const providers = useProvidersStore();

const chapterValue = ref(progress.chapter?.chapter);

watch(chapterValue, () => {
  let chapter = providers.chapters.find((c) => c.chapter == chapterValue.value);
  progress.chapter = chapter;
});

watch([() => progress.chapter], () => {
  chapterValue.value = progress.chapter?.chapter;
});

const uniqueChapterList = computed(() => {
  let values: number[] = [];
  let chapters = [];
  for (let chapter of providers.chapters) {
    if (!values.includes(chapter.value)) {
      values.push(chapter.value);
      chapters.push(chapter);
    }
  }
  return chapters;
});

const index = computed(() =>
  progress.chapter ? uniqueChapterList.value.indexOf(progress.chapter) : null
);

const hasPrev = computed(() => {
  if (index.value != null) {
    return index.value > 0;
  }
  return false;
});

const hasNext = computed(() => {
  if (index.value != null) {
    return index.value < uniqueChapterList.value.length - 1;
  }
  return false;
});
</script>

<template>
  <div
    class="flex h-12 w-full justify-between bg-neutral-900 p-2.5 text-center align-middle"
  >
    <IconButton
      icon="i-[iconamoon--arrow-left-2]"
      :disabled="!hasPrev"
      @click="progress.prev(true)"
    />
    <select class="bg-neutral-900 outline-none" v-model="chapterValue">
      <option
        v-for="chapter in uniqueChapterList"
        :value="chapter.chapter"
        :selected="chapter.chapter == progress.chapter?.chapter"
      >
        Chapter {{ chapter.chapter }}
      </option>
    </select>
    <IconButton
      icon="i-[iconamoon--arrow-right-2]"
      :disabled="!hasNext"
      @click="progress.next(true)"
    />
  </div>
</template>
