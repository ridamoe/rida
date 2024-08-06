import { isClient } from "@vueuse/core";

export const useProvidersStore = defineStore(
  "providersStore",
  () => {
    const progress = useProgressStore();

    let loadedUrls: Ref<Set<string>> = ref(new Set([]));
    let providers = ref<Record<string, Provider>>({});

    async function addProvider(provider: Provider) {
      providers.value[provider.spec.key] = provider;
    }

    const chapterList = computed(() => {
      let all = [];
      for (let provider of Object.values(providers.value)) {
        all.push(...Object.keys(provider.chapters));
      }
      all = Array.from(new Set(all.sort())); // Remove duplicates, keep order
      return all;
    });

    const current: Ref<Provider | undefined> = computed(() => {
      return Object.values(providers.value).find(
        (el) => el.spec.key == progress.provider
      );
    });

    const currentSource: Ref<Source | undefined> = computed(() => {
      let sources = current.value?.chapters[progress.chapter];
      return sources?.[progress.source];
    });

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

      chapterList,

      current,
      currentSource,

      preloadURL,
      addProvider,
      setLoaded: (url: string) => {
        loadedUrls.value.add(url);
      },
    };
  },
  { persist: false }
);
