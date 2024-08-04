export const useProgressStore = defineStore("progressStore", () => {
  const sources = useSourcesStore();

  const title = ref();
  const chapter = ref();
  const page = ref(1);
  const source = ref();

  const pageCount = computed(
    () => sources.current?.chapters[chapter.value]?.pages?.length ?? 1
  );

  // const pages = useAsyncData("current-pages", async () => {
  //   return await
  // });

  function setSource(locator: number | string) {
    let index: number = -1;

    if (typeof locator == "string") {
      let parsed = parseInt(locator);
      if (!isNaN(parsed)) index = parsed;
      else {
        index = Object.keys(sources.sources).findIndex((v) => v == locator);
      }
    } else if (typeof locator == "number") index = locator;

    if (index == -1) index = 0;
    index %= Object.values(sources.sources).length;
    console.log("setSource", locator, index);
    source.value = index;
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

  watch([chapter], () => {
    page.value = 1;
  });

  watch([page, pageCount], () => {
    page.value = clampPage(page.value);
  });

  const status = () => {
    return `${title.value} - Chapter ${chapter.value}`;
  };

  const next = () => {
    let chapterKeys = Object.keys(sources.current?.chapters!);
    let index = chapterKeys.findIndex((v) => v == chapter.value);
    if (page.value + 1 > pageCount.value) {
      if (index + 1 < chapterKeys.length) {
        chapter.value = chapterKeys[index + 1];
      }
    } else page.value++;
  };

  const prev = () => {
    let chapterKeys = Object.keys(sources.current?.chapters!);
    let index = chapterKeys.findIndex((v) => v == chapter.value);
    if (page.value - 1 < 1) {
      if (index - 1 > 0) {
        chapter.value = chapterKeys[index - 1];
      }
    } else page.value--;
  };

  return {
    source,
    title,
    chapter,
    page,

    next,
    prev,

    setSource,
    setTitle,
    setChapter,
    setPage,

    status,
  };
});
