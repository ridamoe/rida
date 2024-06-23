export const useProgressStore = defineStore("progressStore", () => {
  const sources = useSourcesStore();

  const title = ref("Unknown");
  const chapter = ref(1);
  const page = ref(1);
  const source = toRef(sources.currentSourceId);

  function setSource(value: any) {
    value = parseInt(value);
    source.value = value ? value : 0;
  }

  function setTitle(value: any) {
    let t = typeof value == "string" ? value : "Unknown";
    t = t.replace(/_/g, " ");
    title.value = t;
  }

  function setChapter(value: any) {
    value = parseInt(value);
    chapter.value = value ? value : 1;
  }

  function setPage(value: any) {
    value = parseInt(value);
    page.value = value ? clamp(value, 0, sources.current.pageCount) : 1;
  }

  watchEffect(() => {
    if (page.value <= 1) page.value = 1;
    if (page.value >= sources.current.pageCount) {
      page.value = sources.current.pageCount;
    }
  });

  const status = computed(() => {
    return `${title.value} - Chapter ${chapter.value}`;
  });

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
