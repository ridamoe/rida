<script async setup lang="ts">
import { isClient } from "@vueuse/core";
import type { WatchStopHandle } from "vue";

const route = useRoute();
const router = useRouter();
const runtimeConfig = useRuntimeConfig();
const progress = useProgressStore();
const providerStore = useProvidersStore();

const corsEndpoint = isClient
  ? runtimeConfig.public.corsEndpoint
  : runtimeConfig.corsEndpoint;

async function parseProviderData(format: string, query: string) {
  switch (format) {
    case "json":
      return JSON.parse(atob(query));
    case "pastebin":
      return JSON.parse(
        await $fetch(corsEndpoint + "https://pastebin.com/raw/" + query)
      );
    case "gist":
      return JSON.parse(
        await $fetch("https://gist.githubusercontent.com/" + query)
      );
    default:
      throw new Error("Unknown format");
  }
}

// Locates chapter based on slug
function getChapterFromSlug() {
  let chapterSlugData = route.params.slug.at(-1);
  return providerStore.chapters.find((c) => {
    if (c.chapter == chapterSlugData) return true;
    if (c.params && Object.values(c.params).includes(chapterSlugData))
      return true;
    return false;
  });
}

// Finds first available chapter
function getFirstAvailableChapter() {
  return providerStore.chapters.reduce((p, c) => (c.value < p.value ? c : p));
}

function getChapter() {
  let chapter = getChapterFromSlug();
  if (chapter == null) chapter = getFirstAvailableChapter();
  return chapter;
}

await callOnce(
  "load-reading-config",
  async () => {
    // Parse config data
    let [format, query] = route.query.d.split(":");
    let data = await parseProviderData(format, query);
    for (let providerSpec of data.providers) {
      await providerStore.addProvider(providerSpec);
    }

    // Load chapter
    let chapter = getChapter();
    if (chapter != null) {
      progress.setChapter(chapter);
      progress.setProvider(chapter.provider_key);
    }

    // Load page
    if (typeof route.query.page == "string") {
      progress.setPage(route.query.page);
    }

    // Set title
    let titles = providerStore.providers
      .map((p) => p.series.value?.title)
      .filter((n) => n);

    let title = titles.length > 0 ? titles[0] : "Unknown";
    progress.setTitle(title);
    updateUrl();
  },
  { mode: "navigation" }
);

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
