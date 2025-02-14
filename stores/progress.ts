export const useProgressStore = defineStore("progressStore", () => {
  const providersStore = useProvidersStore();

  const title = ref();
  const chapter = ref<Chapter>();
  const page = ref(1);
  const providerKey = ref();
  const sourceId = ref(0);

  function $reset() {
    title.value = undefined;
    chapter.value = undefined;
    page.value = 1;
    providerKey.value = undefined;
    sourceId.value = 0;
  }

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

  const next = (skipChapter = false) => {
    let nextChapters = providersStore.chapters.filter((c) =>
      chapter.value == null ? true : c.value > chapter.value.value
    );

    let nextInLang = nextChapters.find(
      (c) => c.language == chapter.value?.language
    );
    let next = nextChapters.at(0);

    if (
      next?.chapter == nextInLang?.chapter ||
      next?.value == nextInLang?.value
    )
      next = nextInLang;

    if (skipChapter && next) {
      chapter.value = next;
      page.value = 1;
    } else {
      if (page.value + 1 > pageCount.value && next) {
        chapter.value = next;
        page.value = 1;
      } else page.value++;
    }
  };

  const prev = (skipChapter = false) => {
    let prevChapters = providersStore.chapters.filter((c) =>
      chapter.value == null ? true : c.value < chapter.value.value
    );

    let prevInLang = prevChapters.findLast(
      (c) => c.language == chapter.value?.language
    );
    let prev = prevChapters.at(-1);
    if (
      prev?.chapter == prevInLang?.chapter ||
      prev?.value == prevInLang?.value
    )
      prev = prevInLang;

    if (skipChapter && prev) {
      chapter.value = prev;
      page.value = 1;
    } else {
      if (page.value - 1 < 1 && prev) {
        chapter.value = prev;
        page.value = pageCount.value;
      } else page.value--;
    }
  };

  return {
    provider,
    source,
    title,
    chapter,
    page,

    $reset,

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
