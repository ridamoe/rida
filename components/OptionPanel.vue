<script setup lang="ts">
const settings = useSettingsStore();
const providers = useProvidersStore();
const progress = useProgressStore();
</script>

<template>
  <aside
    class="relative flex w-full flex-none flex-col items-center gap-0 bg-neutral-800 text-stone-200 md:h-screen md:w-80 md:transition-[margin] md:ease-in-out"
    :class="settings.showPanel ? '' : 'md:-ml-80'"
  >
    <div
      class="absolute z-10 hidden h-12 w-12 bg-neutral-900 p-3 md:block"
      :class="
        settings.showPanel
          ? 'triangle-left right-0 top-0 text-right'
          : 'triangle-right -right-12 text-left'
      "
    >
      <IconButton
        @click="settings.showPanel = !settings.showPanel"
        disable-animation
        :icon="
          settings.showPanel
            ? 'i-[iconamoon--arrow-left-2]'
            : 'i-[iconamoon--arrow-right-2]'
        "
        class="relative bottom-[0.5rem]"
        :class="settings.showPanel ? 'left-[0.5rem]' : 'right-[0.5rem]'"
      />
    </div>
    <header class="flex min-h-12 w-full shrink-0 align-middle">
      <div class="h-12">
        <IconButton
          icon="i-[ic--round-close]"
          class="p-2"
          @click="navigateTo('/')"
        />
      </div>
      <h1 class="flex h-max p-3 text-center">
        <a class="text-balance break-words text-lg hover:underline" href="#">{{
          progress.title
        }}</a>
      </h1>
      <div class="h-12 w-12 flex-none"></div>
    </header>
    <div
      class="flex h-8 w-full shrink-0 items-center justify-end gap-1 px-2 py-1.5"
    >
      <IconButton icon="i-[mdi--share-variant-outline]" />
    </div>
    <ChapterSelector class="shrink-0" />
    <div class="flex h-8 w-full shrink-0 justify-end gap-1 py-1.5 align-middle">
      <div class="mx-3 flex h-full gap-6">
        <IconCycleButton
          :states="[
            {
              value: 'original',
              icon: 'i-[icon-park-outline--one-to-one]',
            },
            { value: 'limit-all', icon: 'i-[majesticons--maximize-line]' },
            {
              value: 'limit-width',
              icon: 'i-[ic--round-expand] rotate-90',
            },
            { value: 'limit-height', icon: 'i-[ic--round-expand]' },
            {
              value: 'fit-all',
              icon: 'i-[mage--arrows-all-direction]',
            },
            {
              value: 'fit-width',
              icon: 'i-[ph--arrows-horizontal-fill]',
            },
            {
              value: 'fit-height',
              icon: 'i-[ph--arrows-vertical-fill]',
            },
          ]"
          v-model="settings.pageFit"
        />
        <IconCycleButton
          :states="[
            {
              value: 'right-to-left',
              icon: 'i-[mingcute--arrow-to-left-line]',
            },
            {
              value: 'left-to-right',
              icon: 'i-[mingcute--arrow-to-right-line]',
            },
            {
              value: 'vertical',
              icon: 'i-[mingcute--arrow-to-down-line]',
            },
          ]"
          v-model="settings.readDirection"
        />
        <IconCycleButton
          :states="[
            {
              value: 'single-page',
              icon: 'i-[mdi--file-image-outline]',
            },
            {
              value: 'double-page',
              icon: 'i-[mdi--book-open-blank-variant-outline]',
            },
            {
              value: 'double-page-odd',
              icon: 'i-[mdi--book-open-blank-variant] scale-x-[-1]',
            },
          ]"
          v-model="settings.spreadLayout"
        />
        <IconCycleButton
          :states="[
            {
              value: true,
              icon: 'i-[ic--round-push-pin]',
            },
            {
              value: false,
              icon: 'i-[ic--round-pin-off]',
            },
          ]"
          v-model="settings.pinPageSelector"
        />
      </div>
      <div class="h-full w-[1.5px] rounded-xl bg-rose-600"></div>
      <IconButton icon="i-[solar--settings-bold]" class="mx-2" />
    </div>
    <div class="flex grow-0 flex-col">
      <h2 class="w-full p-2 text-center">Sources</h2>
      <div class="mb-2 h-[2px] w-24 self-center rounded-xl bg-rose-600"></div>
    </div>
    <ProviderSelector
      class="w-full grow select-none overflow-y-auto"
      v-for="provider in providers.providers"
      :provider="provider"
      :key="provider.key"
    />
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
