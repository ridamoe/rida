export const useData = defineStore("progressStoreData", () => {
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

  return {
    title,
    chapter,
    page,
    providerKey,
    sourceId,

    $reset,
  };
});

export const useProgressStore = defineStore("progressStore", () => {
  const providersStore = useProvidersStore();
  const data = useData();

  const source: Ref<Source | undefined> = computed(
    () => data.chapter?.sources?.[data.sourceId]
  );

  const provider = computed(() =>
    providersStore.providers.find((p) => p.key == data.providerKey)
  );

  const pageCount = computed(() => source.value?.images.length ?? 1);

  function setProvider(key: string) {
    data.providerKey = key;
    let chapters = provider.value?.series.value?.chapters;
    if (chapters) {
      let sameValue = chapters.find((c) => c.chapter == data.chapter?.chapter);
      if (sameValue) data.chapter = sameValue;
      else data.chapter = chapters[0];
    }
  }

  function setSource(id: number) {
    data.sourceId = id;
  }

  function setTitle(value: any) {
    if (value && typeof value == "string")
      data.title = value.replace(/_/g, " ");
  }

  function setChapter(value: Chapter) {
    data.chapter = value;
  }

  function setPage(value: any) {
    value = parseInt(value);
    data.page = value;
  }

  function clampPage(page: number): number {
    if (page < 1) page = 1;
    if (page > pageCount.value) {
      page = pageCount.value;
    }
    return page;
  }

  watch([() => data.page, pageCount], () => {
    data.page = clampPage(data.page);
  });

  const status = () => {
    return `${data.title} - Chapter ${data.chapter?.chapter}`;
  };

  const next = (skipChapter = false) => {
    let nextChapters = providersStore.chapters.filter((c) =>
      data.chapter == null ? true : c.value > data.chapter.value
    );

    let nextInLang = nextChapters.find(
      (c) => c.language == data.chapter?.language
    );
    let next = nextChapters.at(0);

    if (
      next?.chapter == nextInLang?.chapter ||
      next?.value == nextInLang?.value
    )
      next = nextInLang;

    if (skipChapter && next) {
      data.chapter = next;
      data.page = 1;
    } else {
      if (data.page + 1 > pageCount.value && next) {
        data.chapter = next;
        data.page = 1;
      } else data.page++;
    }
  };

  const prev = (skipChapter = false) => {
    let prevChapters = providersStore.chapters.filter((c) =>
      data.chapter == null ? true : c.value < data.chapter.value
    );

    let prevInLang = prevChapters.findLast(
      (c) => c.language == data.chapter?.language
    );
    let prev = prevChapters.at(-1);
    if (
      prev?.chapter == prevInLang?.chapter ||
      prev?.value == prevInLang?.value
    )
      prev = prevInLang;

    if (skipChapter && prev) {
      data.chapter = prev;
      data.page = 1;
    } else {
      if (data.page - 1 < 1 && prev) {
        data.chapter = prev;
        data.page = pageCount.value;
      } else data.page--;
    }
  };

  const title = computed(() => data.title);
  const chapter = computed(() => data.chapter);
  const page = computed(() => data.page);

  function $reset() {
    data.$reset();
  }

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
