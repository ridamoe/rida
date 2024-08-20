import { isClient } from "@vueuse/core";
import mergeChapterLists from "~/utils/sort";

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
      let lists = [];
      for (let provider of Object.values(providers.value)) {
        lists.push(Object.keys(provider.chapters));
      }
      // Order and remove duplicates
      return mergeChapterLists(lists);
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
