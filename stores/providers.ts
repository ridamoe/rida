import { isClient } from "@vueuse/core";

export const useProvidersStore = defineStore(
  "providersStore",
  () => {
    let loadedUrls: Ref<Set<string>> = ref(new Set([]));
    let providersData = ref<
      { spec: ProviderSpec; series: Series | undefined }[]
    >([]);

    let providers = computed(() => {
      let list = [];
      for (const [i, { spec, series }] of providersData.value.entries()) {
        let provider = useProvider(spec, series);
        providersData.value[i].series = provider.series.value;
        list.push(provider);
      }
      return list;
    });

    async function addProvider(spec: ProviderSpec) {
      if (!providersData.value.find((d) => d.spec.key == spec.key)) {
        let provider = useProvider(spec);
        await provider.init();
        providersData.value?.push({ spec, series: provider.series.value });
      }
    }

    const chapters = computed(() => {
      return providers.value.reduce((a: Chapter[], p) => {
        if (p.series.value) a.push(...p.series.value.chapters);
        return a;
      }, []);
    });

    async function load(chapter: Chapter): Promise<Chapter> {
      let provider = providers.value.find(
        (p) => p.key == chapter.provider_key
      )!;
      let loaded = await provider.load(chapter);
      return loaded;
    }

    function preloadURL(url: string) {
      return new Promise<void>((resolve) => {
        if (isClient) {
          if (!loadedUrls.value.has(url)) {
            const img = new Image();
            img.src = url;
            img.onload = () => {
              loadedUrls.value.add(url);
              resolve();
            };
            img.onerror = () => resolve();
          } else {
            resolve();
          }
        }
      });
    }

    return {
      loadedUrls,
      providers,
      chapters,

      load,
      preloadURL,
      addProvider,
      setLoaded: (url: string) => {
        loadedUrls.value.add(url);
      },
    };
  },
  { persist: false }
);
