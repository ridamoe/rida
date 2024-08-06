<script async setup lang="ts">
import { isClient } from "@vueuse/core";

const route = useRoute();
const router = useRouter();
const runtimeConfig = useRuntimeConfig();
const progress = useProgressStore();
const providerStore = useProvidersStore();
const provider = useProvider();

await useAsyncData("config-data", async () => {
  let [format, query] = route.query.d.split(":");
  const corsEndpoint = isClient
    ? runtimeConfig.public.corsEndpoint
    : runtimeConfig.corsEndpoint;
  let data;
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
      throw new Error("Unknown format");
  }

  for (let providerSpec of data.providers) {
    providerStore.addProvider(await provider.init(providerSpec));
  }
  return true;
});

if (progress.chapter == undefined) {
  progress.chapter = providerStore.chapterList[0];
}

if (progress.provider == undefined) {
  progress.provider = Object.values(providerStore.providers).find((el) =>
    Object.keys(el.chapters).includes(progress.chapter)
  )?.spec.key;
}

if (Array.isArray(route.params.slug)) {
  progress.setChapter(route.params.slug.at(-1));
}

if (typeof route.query.page == "string") {
  progress.setPage(route.query.page);
}

await useAsyncData("set-title", async () => {
  const API = useAPI();
  if (providerStore.current && progress.title == undefined) {
    let spec = providerStore.current?.spec;
    if (spec.type === "local") {
      if (spec.metadata) progress.setTitle(spec.metadata.title);
      else progress.setTitle("Unknown");
    } else {
      let series = await API.getSeries(spec);
      if (series.result?.title) progress.setTitle(series.result.title);
      updateUrl();
    }
  }
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
      slug: [urlTitle, progress.chapter].filter((v) => v).join("/"),
    },
    query: { ...route.query, page: progress.page },
  };
  const newUrl = router.resolve(routeParams);
  if (newUrl.fullPath != route.fullPath)
    if (isClient) {
      if (typeof newUrl.fullPath == "string")
        window.history.replaceState(null, "", newUrl.fullPath);
    } else {
      navigateTo(newUrl.fullPath);
    }
}

watchEffect(() => {
  progress.title;
  progress.chapter;
  progress.page;
  progress.status;

  useHead({
    title: progress.status,
  });
  updateUrl();
});
</script>

<template>
  <div class="max-w-screen flex min-h-screen flex-col md:flex-row">
    <OptionPanel />
    <Reader></Reader>
  </div>
</template>
