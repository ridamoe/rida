<script setup lang="ts">
const settings = useSettingsStore();
const sources = useSourcesStore();
const currentPage = defineModel<number>();
</script>

<template>
  <div
    class="absolute bottom-0 flex w-full flex-row gap-0.5 overflow-hidden bg-gradient-to-t from-black transition-opacity"
    :class="[settings.pinPageSelector ? '' : tw`opacity-0 hover:opacity-100`]"
  >
    <span
      class="pointer-events-none absolute right-1/2 z-10 self-center align-middle text-sm font-bold text-white"
      >{{ (currentPage ?? 0) + 1 }}/{{ sources.current.pageCount }}</span
    >
    <template v-for="n in sources.current.pageCount">
      <div
        @click="
          () => {
            currentPage = sources.current.pageCount - n;
          }
        "
        class="relative flex h-8 grow items-end hover:bottom-1"
        :class="[
          {
            [tw`bg-gradient-to-t from-white`]:
              sources.current.pageCount - n == currentPage,
          },
        ]"
      >
        <div
          class="h-[0.3rem] w-full bg-neutral-600"
          :class="[
            {
              [tw`border-t-[0.1rem] border-rose-600`]:
                sources.current.loadedPages?.includes(
                  sources.current.pageCount - n
                ),
            },
          ]"
        ></div>
      </div>
    </template>
  </div>
</template>
