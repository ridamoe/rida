<script setup lang="ts">
const showPanel = ref(true);

const pageFit = ref(0);
const pinProgress = ref(0);
const readDirection = ref(0);
const pageLayout = ref(0);
</script>

<template>
  <aside
    class="relative flex h-auto min-h-52 w-full flex-none flex-col items-center gap-0 bg-neutral-800 text-stone-200 transition-[margin] ease-in-out sm:h-screen sm:w-80"
    :class="showPanel ? '' : '-ml-80'"
  >
    <div
      class="absolute z-10 hidden h-12 w-12 bg-neutral-900 p-3 sm:block"
      :class="
        showPanel
          ? 'triangle-left right-0 top-0 text-right'
          : 'triangle-right -right-12 text-left'
      "
    >
      <IconButton
        @click="showPanel = !showPanel"
        disable-animation
        :icon="
          showPanel
            ? 'i-[iconamoon--arrow-left-2]'
            : 'i-[iconamoon--arrow-right-2]'
        "
        class="relative bottom-[0.5rem]"
        :class="showPanel ? 'left-[0.5rem]' : 'right-[0.5rem]'"
      />
    </div>
    <header class="flex w-full">
      <IconButton icon="i-[ic--round-close]" class="p-2" />
      <h1 class="flex-1 p-3 text-center">
        <a class="hover:underline" href="#">Example Title</a>
      </h1>
      <div class="h-12 w-12"></div>
    </header>
    <div class="flex max-h-8 w-full items-center justify-end gap-1 px-2 py-1.5">
      <IconButton icon="i-[mdi--share-variant-outline]" />
    </div>
    <div
      class="flex max-h-12 w-full justify-between bg-neutral-900 p-2.5 text-center"
    >
      <IconButton icon="i-[iconamoon--arrow-left-2]" />
      <p>Chapter 1</p>
      <IconButton icon="i-[iconamoon--arrow-right-2]" />
    </div>
    <div class="flex max-h-8 w-full items-center justify-end gap-1 py-1.5">
      <div class="mx-3 flex h-full gap-6">
        <IconCycleButton
          :states="[
            {
              name: 'original',
              icon: 'i-[icon-park-outline--one-to-one]',
            },
            { name: 'limit-all', icon: 'i-[majesticons--maximize-line]' },
            {
              name: 'limit-height',
              icon: 'i-[ic--round-expand] rotate-90',
            },
            { name: 'limit-width', icon: 'i-[ic--round-expand]' },
            {
              name: 'stretch-all',
              icon: 'i-[mage--arrows-all-direction]',
            },
            {
              name: 'stretch-width',
              icon: 'i-[ph--arrows-horizontal-fill]',
            },
            {
              name: 'stretch-height',
              icon: 'i-[ph--arrows-vertical-fill]',
            },
          ]"
          v-model="pageFit"
        />
        <IconCycleButton
          :states="[
            {
              name: 'right-to-left',
              icon: 'i-[mingcute--arrow-to-left-line]',
            },
            {
              name: 'left-to-right',
              icon: 'i-[mingcute--arrow-to-right-line]',
            },
            {
              name: 'vertical',
              icon: 'i-[mingcute--arrow-to-down-line]',
            },
          ]"
          v-model="readDirection"
        />
        <IconCycleButton
          :states="[
            {
              name: 'single-page',
              icon: 'i-[mdi--file-image-outline]',
            },
            {
              name: 'double-page',
              icon: 'i-[mdi--book-open-blank-variant-outline]',
            },
            {
              name: 'double-page-odd',
              icon: 'i-[mdi--book-open-blank-variant] scale-x-[-1]',
            },
          ]"
          v-model="pageLayout"
        />
        <IconCycleButton
          :states="[
            {
              name: 'pinned',
              icon: 'i-[ic--round-push-pin]',
            },
            {
              name: 'unpinned',
              icon: 'i-[ic--round-pin-off]',
            },
          ]"
          v-model="pinProgress"
        />
      </div>
      <div class="h-full w-[1.5px] rounded-xl bg-rose-600"></div>
      <IconButton icon="i-[solar--settings-bold]" class="mx-2" />
    </div>
    <div class="mb-6 flex w-full flex-col">
      <h2 class="w-full text-center">Sources</h2>
      <div class="mb-2 h-[2px] w-24 self-center rounded-xl bg-rose-600"></div>
      <SourceSelect :selected="true">Source one</SourceSelect>
      <SourceSelect>Source two</SourceSelect>
    </div>
  </aside>
</template>

<style scoped>
.triangle-left {
  clip-path: polygon(0 0, 100% 0, 100% 100%);
}
.triangle-right {
  clip-path: polygon(0 0, 100% 0, 0 100%);
}
</style>
