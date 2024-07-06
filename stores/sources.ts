import { isClient } from "@vueuse/core";

// Needed, otherwise TS complains with
// 'Source' refers to a value, but is being used as a type here. Did you mean 'typeof Source'?ts(2749)
import { Source } from "../utils/source";

export const useSourcesStore = defineStore(
  "sourcesStore",
  () => {
    const progress = useProgressStore();
    let loadedUrls: Ref<Set<string>> = ref(new Set([]));
    let sources = reactive({} as Record<string, Source>);

    const current: Ref<Source | undefined> = computed(() => {
      return Object.values(toValue(sources)).at(progress.source);
    });

    function preloadURL(url: string) {
      return new Promise<void>((resolve) => {
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
      });
    }

    async function addSource(
      name: string,
      chapters: string[],
      spec: RemoteSpec | LocalSpec
    ) {
      let key = `source-${name}`;
      if (!Object.keys(sources).includes(key)) {
        sources[key] = new Source(
          name,
          Chapter.asChapterRecord(chapters, spec),
          spec
        );
      }
    }

    return {
      loadedUrls,
      sources,
      current,

      preloadURL,
      addSource,
      setLoaded: (url: string) => {
        loadedUrls.value.add(url);
      },
    };
  },
  { persist: false }
);
