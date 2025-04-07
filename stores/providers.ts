const useData = defineStore("providerStoreData", () => {
  let providers = ref<{ spec: ProviderSpec; series: Series | undefined }[]>([]);

  return {
    providers,
  };
});

export const useProvidersStore = defineStore(
  "providersStore",
  () => {
    let loadedImages: Ref<Record<string, string>> = ref({});
    let data = useData();

    function $reset() {
      data.providers = [];
    }

    let providers = computed(() => {
      let list = [];
      for (const [i, { spec, series }] of data.providers.entries()) {
        let provider = useProvider(spec, series);
        data.providers[i].series = provider.series.value;
        list.push(provider);
      }
      return list;
    });

    async function addProvider(spec: ProviderSpec) {
      if (!data.providers.find((d) => d.spec.key == spec.key)) {
        let provider = useProvider(spec);
        await provider.init();
        data.providers?.push({ spec, series: provider.series.value });
      }
    }

    const chapters = computed(() => {
      let chapters = providers.value.reduce((a: Chapter[], p) => {
        if (p.series.value) a.push(...p.series.value.chapters);
        return a;
      }, []);
      chapters.sort((a, b) => a.value - b.value);
      return chapters;
    });

    async function load(chapter: Chapter): Promise<Chapter> {
      let provider = providers.value.find(
        (p) => p.key == chapter.provider_key
      )!;
      if (!provider) throw new Error("No provider for this chapter");
      return await provider.load(chapter);
    }

    async function loadImage(url: string) {
      let blob: Blob = await $fetch(url, { responseType: "blob" });
      loadedImages.value[url] = URL.createObjectURL(blob);
    }

    return {
      loadedImages,
      providers,
      chapters,

      $reset,
      load,
      loadImage,
      addProvider,
    };
  },
  { persist: false }
);
