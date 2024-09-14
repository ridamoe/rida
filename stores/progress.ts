export const useProgressStore = defineStore("progressStore", () => {
  const providersStore = useProvidersStore();

  const title = ref();
  const chapter = ref<Chapter>();
  const page = ref(1);
  const providerKey = ref();
  const sourceId = ref(0);

  const source: Ref<Source | undefined> = computed(
    () => chapter.value?.sources?.[sourceId.value]
  );

  const provider = computed(() =>
    providersStore.providers.find((p) => p.key == providerKey.value)
  );

  const pageCount = computed(
    () => chapter.value?.sources?.[sourceId.value].images.length ?? 1
  );

  function setProvider(key: string) {
    providerKey.value = key;
    let chapters = provider.value?.series.value?.chapters;
    if (chapters) {
      let sameValue = chapters.find((c) => c.chapter == chapter.value?.chapter);
      if (sameValue) chapter.value = sameValue;
      else chapter.value = chapters[0];
    }
  }

  function setSource(id: number) {
    sourceId.value = id;
  }

  function setTitle(value: any) {
    if (value && typeof value == "string")
      title.value = value.replace(/_/g, " ");
  }

  function setChapter(value: Chapter) {
    chapter.value = value;
  }

  function setPage(value: any) {
    value = parseInt(value);
    page.value = value;
  }

  function clampPage(page: number): number {
    if (page < 1) page = 1;
    if (page > pageCount.value) {
      page = pageCount.value;
    }
    return page;
  }

  watch([page, pageCount], () => {
    page.value = clampPage(page.value);
  });

  const status = () => {
    return `${title.value} - Chapter ${chapter.value?.chapter}`;
  };

  const next = () => {
    let index = providersStore.chapters.findIndex((v) => v == chapter.value);
    if (page.value + 1 > pageCount.value) {
      if (index + 1 < providersStore.chapters.length) {
        chapter.value = providersStore.chapters[index + 1];
        page.value = 1;
      }
    } else page.value++;
  };

  const prev = () => {
    let index = providersStore.chapters.findIndex((v) => v == chapter.value);
    if (page.value - 1 < 1) {
      if (index - 1 > 0) {
        chapter.value = providersStore.chapters[index - 1];
        page.value = pageCount.value;
      }
    } else page.value--;
  };

  return {
    provider,
    source,
    title,
    chapter,
    page,

    next,
    prev,

    setProvider,
    setSource,
    setTitle,
    setChapter,
    setPage,

    status,
  };
});
