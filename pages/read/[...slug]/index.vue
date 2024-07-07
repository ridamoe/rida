<script async setup lang="ts">
import { isClient } from "@vueuse/core";

const route = useRoute();
const router = useRouter();
const configData = useConfigDataStore();
const progress = useProgressStore();
const sources = useSourcesStore();

let loadConfig = useAsyncData("config-data", async () => {
  return await configData.setup(route.query.d).then(() => true);
});

if (Array.isArray(route.params.slug)) {
  progress.setTitle(route.params.slug.at(-2));
  progress.setChapter(route.params.slug.at(-1));
}

if (typeof route.query.page == "string") {
  progress.setPage(route.query.page);
}

useAsyncData("set-title", async () => {
  const API = useApi();
  await loadConfig;
  if (sources.current && progress.title == undefined) {
    let spec = sources.current?._spec;
    if ("name" in spec) progress.setTitle(spec.name);
    else {
      let series = await API.getSeries(spec);
      if (series.result?.title) progress.setTitle(series.result.title);
      updateUrl();
    }
  }
  return true;
});

function updateUrl() {
  let routeParams = {
    name: "read-slug",
    params: {
      slug: [progress.title?.replace(/ /g, "_"), progress.chapter]
        .filter((v) => v)
        .join("/"),
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
