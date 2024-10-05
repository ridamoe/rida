<script setup lang="ts">
const providers = useProvidersStore();
const progress = useProgressStore();

let props = defineProps<{ provider: Provider }>();

const expanded = ref(false);

const chapterProviders = computed(() =>
  providers.chapters
    .filter((c) => c.chapter == progress.chapter?.chapter)
    .map((c) => c.provider_key)
);

const providedChapters = computed(() =>
  props.provider.series.value?.chapters.filter(
    (c: any) => c.chapter == progress.chapter?.chapter
  )
);

const hasMultipleChapters = computed(
  () => providedChapters.value && providedChapters.value.length > 1
);

const languageName = new Intl.DisplayNames(["en"], { type: "language" });

function flag(chapter: Chapter) {
  const locale = new Intl.Locale(chapter.language || "und");
  const country = locale.maximize().region;
  return `http://purecatamphetamine.github.io/country-flag-icons/3x2/${country}.svg`;
}
</script>

<template>
  <div v-if="providedChapters && providedChapters.length > 0">
    <template v-if="hasMultipleChapters">
      <ItemSelect
        class="p-2"
        :selected="provider.key == progress.provider?.key"
        :disabled="!chapterProviders.includes(provider.key)"
      >
        <div class="flex h-8 items-center">
          <IconCycleButton
            class="p-1"
            :states="[
              {
                value: true,
                icon: 'i-[material-symbols--arrow-back-ios-new-rounded] -rotate-90',
              },
              {
                value: false,
                icon: 'i-[material-symbols--arrow-back-ios-new-rounded] -rotate-180',
              },
            ]"
            disable-animation
            v-model="expanded"
          />

          <span class="ml-2">{{
            provider.key[0].toUpperCase() + provider.key.substring(1)
          }}</span>
        </div>
      </ItemSelect>
      <div class="ml-6" v-show="expanded" v-for="chapter in providedChapters">
        <ItemSelect
          :selected="chapter == progress.chapter"
          class="m-0 flex items-center border-l-2 border-rose-500 px-1 py-2 pl-6"
          @click="progress.setChapter(chapter)"
        >
          <p class="mr-1">
            <span>
              {{ chapter.volume ? `Vol.${chapter.volume} ` : ""
              }}{{ `Ch.${chapter.chapter}` }}
            </span>
            <br />
            <span>{{ chapter.title ? chapter.title : "" }} </span>
          </p>
          <img
            v-if="chapter.language"
            class="ml-auto inline-block h-4"
            :src="flag(chapter)"
            :title="languageName.of(chapter.language)"
          />
        </ItemSelect>
      </div>
    </template>
    <template v-else>
      <ItemSelect
        class="p-2"
        :selected="providedChapters[0] == progress.chapter"
        :disabled="!chapterProviders.includes(provider.key)"
        @click="progress.setChapter(providedChapters[0])"
      >
        <div class="flex h-8 items-center">
          <span class="ml-10">{{
            provider.key[0].toUpperCase() + provider.key.substring(1)
          }}</span>
          <img
            v-if="providedChapters[0].language"
            class="ml-auto inline-block h-4"
            :src="flag(providedChapters[0])"
            :title="languageName.of(providedChapters[0].language)"
          />
        </div>
      </ItemSelect>
    </template>
  </div>
</template>
