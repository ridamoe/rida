export function useProvider(
  spec: ProviderSpec,
  defaultSeries: Series | undefined = undefined
) {
  const API = useAPI();

  let series = ref<Series | undefined>(defaultSeries);

  function flattenSources(
    sources: APISource[] | undefined
  ): Source[] | undefined {
    return sources?.map((el) => ({
      name: el.name,
      images: el.images.map((im) => (el.base ?? "") + im),
    }));
  }

  async function init() {
    if (defaultSeries) series.value = defaultSeries;
    else {
      let apiSeries: APISeries = {};

      if (spec.type === "remote") {
        let data = await API.getSeries(spec);
        if (data.result) apiSeries = data.result;

        if (spec.chapters) {
          apiSeries.chapters = Array.isArray(spec.chapters)
            ? spec.chapters
            : [spec.chapters];
        }
      } else apiSeries = spec.series;

      if (!apiSeries.chapters) apiSeries.chapters = [];

      series.value = {
        ...apiSeries,
        chapters: apiSeries.chapters.map((el) => ({
          ...el,
          provider_key: spec.key,
          sources: flattenSources(el.sources),
        })),
      };
    }
  }

  const load = async (chapter: Chapter): Promise<Chapter> => {
    if (chapter.provider_key != spec.key) throw new Error("Wrong provider");

    let index = series.value?.chapters.indexOf(chapter);
    if (index == null) throw new Error("Missing chapter");

    if (!chapter.sources) {
      if (spec.type == "remote") {
        let images = await API.getImages(spec, chapter.params!);
        if (images && images.result)
          chapter.sources = flattenSources(images.result);
      } else {
        throw new Error("No sources for chapter");
      }
    }

    series.value!.chapters[index] = chapter;
    return chapter;
  };

  return { key: toValue(spec).key, series, load, init };
}
