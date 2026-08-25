<script setup lang="ts">
const settings = useSettingsStore();
const providers = useProvidersStore();
const progress = useProgressStore();

const images = computed(() => progress.source?.images);

// Convert index (0-based) to page value (1-based)
// depending on current reading direction
function idxToPage(idx: number): number {
  switch (settings.readDirection) {
    case "right-to-left":
      return progress.pageCount - idx;
    case "left-to-right":
      return idx + 1;
    default:
      return idx;
  }
}

function onPageSelect(idx: number) {
  progress.setPage(idxToPage(idx));
}
</script>

<template>
  <div
    class="absolute bottom-0 flex w-full flex-row gap-0.5 overflow-hidden bg-gradient-to-t from-black transition-opacity"
    :class="[settings.pinPageSelector ? '' : tw`opacity-0 hover:opacity-100`]"
    v-show="progress.pageCount > 1"
  >
    <span
      class="pointer-events-none absolute right-1/2 z-10 self-center align-middle text-sm font-bold text-white"
      >{{ progress.page }}/{{ progress.pageCount }}</span
    >
    <PageSelectorItem
      v-for="(_, idx) in progress.pageCount"
      @click="onPageSelect"
      :idx="idx"
      :data-idx="idx"
      :active="idxToPage(idx) == progress.page"
      :loaded="
        Object.keys(providers.loadedImages).includes(
          images?.at(idxToPage(idx) - 1)!
        )
      "
    />
  </div>
</template>
