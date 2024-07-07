export const useProgressStore = defineStore("progressStore", () => {
  const sources = useSourcesStore();

  const title = ref();
  const chapter = ref("1");
  const page = ref(1);
  const source = ref(0);

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

  watch([page, pageCount], () => {
    page.value = clampPage(page.value);
  });

  const status = () => {
    return `${title.value} - Chapter ${chapter.value}`;
  };

  return {
    source,
    title,
    chapter,
    page,

    setSource,
    setTitle,
    setChapter,
    setPage,

    status,
  };
});
