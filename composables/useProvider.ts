export function useProvider() {
  const API = useAPI();

  async function init(spec: ProviderSpec): Promise<Provider> {
    let chapters: Record<string, Source[] | undefined> = {};
    let chapterList: string[] = [];
    if (spec.type === "local")
      chapterList = spec.sources.map((el) => el.chapter);
    else {
      if (spec.chapter === "_auto") {
        let apiSeries = await API.getSeries(spec);
        let apiChapterList = apiSeries?.result?.chapters;
        if (apiChapterList) chapterList = apiChapterList;
      } else {
        chapterList = Array.isArray(spec.chapter)
          ? spec.chapter
          : [spec.chapter];
      }
    }
    for (let chapter of chapterList) {
      chapters[chapter] = undefined;
    }

    return { spec, chapters };
  }

  async function load(provider: Provider, chapter: string) {
    if (!Object.keys(provider.chapters).includes(chapter))
      throw new Error("Invalid Chapter");

    let sourceSpecs: SourceSpec[] | undefined;
    if (provider.spec.type == "remote") {
      let apiPages = await API.getChapterPages(provider.spec, chapter);
      if (apiPages && apiPages.result) sourceSpecs = apiPages.result;
    } else sourceSpecs = provider.spec.sources;

    provider.chapters[chapter] = [];
    if (!sourceSpecs) throw new Error("No sources for chapter");

    for (let sourceSpec of sourceSpecs) {
      let source: Source = {
        name: sourceSpec.name,
        chapter: chapter,
        pages: sourceSpec.pages.map((page) => (sourceSpec.base ?? "") + page),
      };

      provider.chapters[chapter].push(source);
    }
    return provider;
  }

  return {
    init,
    load,
  };
}
