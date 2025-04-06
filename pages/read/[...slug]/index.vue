<script async setup lang="ts">
import { isClient } from "@vueuse/core";
import type { WatchStopHandle } from "vue";

const route = useRoute();
const router = useRouter();
const runtimeConfig = useRuntimeConfig();
const progress = useProgressStore();
const providerStore = useProvidersStore();

let { data: result } = await useAsyncData(
  `config-data-${route.query.d}`,
  async () => {
    let [format, query] = route.query.d.split(":");
    const corsEndpoint = isClient
      ? runtimeConfig.public.corsEndpoint
      : runtimeConfig.corsEndpoint;
    let data, error;
    try {
      switch (format) {
        case "json":
          data = JSON.parse(atob(query));
          break;
        case "pastebin":
          data = JSON.parse(
            await $fetch(corsEndpoint + "https://pastebin.com/raw/" + query)
          );
          break;
        case "gist":
          data = JSON.parse(
            await $fetch("https://gist.githubusercontent.com/" + query)
          );
          break;
        default:
          error = "Unknown format";
      }
    } catch (e) {
      error = "Something bad happened";
    }
    return { data, error };
  }
);

if (!result.value?.error) {
  for (let providerSpec of result.value?.data.providers) {
    await providerStore.addProvider(providerSpec);
  }
}

function findChapter(c: Chapter, data: string) {
  if (c.chapter == data) return true;

  if (c.params && Object.values(c.params).includes(data)) return true;
  return false;
}

let chapterSlugData = route.params.slug.at(-1);
let chapter = providerStore.chapters.find((c) =>
  findChapter(c, chapterSlugData)
);

if (chapter == null)
  chapter = providerStore.chapters.reduce((p, c) =>
    c.value < p.value ? c : p
  );

if (chapter != null) {
  progress.setChapter(chapter);
  progress.setProvider(chapter.provider_key);
}

if (typeof route.query.page == "string") {
  progress.setPage(route.query.page);
}

await useAsyncData(`set-title-${route.query.d}`, async () => {
  let titles = providerStore.providers
    .map((p) => p.series.value?.title)
    .filter((n) => n);

  let title = titles.length > 0 ? titles[0] : "Unknown";
  progress.setTitle(title);
  updateUrl();
  return true;
});

function updateUrl() {
  let urlTitle = progress.title?.toLowerCase() ?? "";
  urlTitle = urlTitle.replace(/\s?~.*?~\s?/g, "");
  urlTitle = urlTitle.replace(/\s\.\s*?.*/g, "");
  urlTitle = urlTitle.replace(/[^a-z0-9 ]/g, "");
  urlTitle = urlTitle.replace(/ /g, "-");
  if (!urlTitle) urlTitle = route.params.slug.at(-2);

  let routeParams = {
    name: "read-slug",
    params: {
      slug: [urlTitle, progress.chapter?.chapter].filter((v) => v).join("/"),
    },
    query: { ...route.query, page: progress.page },
  };
  const newUrl = router.resolve(routeParams);
  if (newUrl.fullPath != route.fullPath)
    navigateTo(newUrl.fullPath, { replace: isClient });
}

let stopUrlUpdater: WatchStopHandle;

onMounted(() => {
  stopUrlUpdater = watchEffect(() => {
    progress.title;
    progress.chapter;
    progress.page;
    progress.status;

    useHead({
      title: progress.status,
    });
    updateUrl();
  });
});

onBeforeRouteLeave((to: any, from: any, next: any) => {
  if (to.name != from.name) {
    if (stopUrlUpdater) stopUrlUpdater();

    // Clean stores on page leave
    progress.$reset();
    providerStore.$reset();
  }
  next();
});
</script>

<template>
  <div class="flex min-h-screen max-w-screen flex-col md:flex-row">
    <OptionPanel />
    <Reader></Reader>
  </div>
</template>
