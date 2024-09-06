export const useProgressStore = defineStore("progressStore", () => {
  const providersStore = useProvidersStore();

  const title = ref();
  const chapter = ref();
  const page = ref(1);
  const provider = ref();
  const source = ref(0);

  const pageCount = computed(
    () => providersStore.currentSource?.pages.length ?? 1
  );

  function setProvider(key: string) {
    provider.value = key;
  }

  function setTitle(value: any) {
    if (value && typeof value == "string")
      title.value = value.replace(/_/g, " ");
  }

  function setChapter(value: any) {
    chapter.value = value ? value : "1";
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
    return `${title.value} - Chapter ${chapter.value}`;
  };

  const next = () => {
    let index = providersStore.chapterList.findIndex((v) => v == chapter.value);
    if (page.value + 1 > pageCount.value) {
      if (index + 1 < providersStore.chapterList.length) {
        chapter.value = providersStore.chapterList[index + 1];
        page.value = 1;
      }
    } else page.value++;
  };

  const prev = () => {
    let index = providersStore.chapterList.findIndex((v) => v == chapter.value);
    if (page.value - 1 < 1) {
      if (index - 1 > 0) {
        chapter.value = providersStore.chapterList[index - 1];
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
    setTitle,
    setChapter,
    setPage,

    status,
  };
});
