<script async setup lang="ts">
import { isClient } from "@vueuse/core";

const route = useRoute();
const router = useRouter();
const configData = useConfigDataStore();
const progress = useProgressStore();

if (typeof route.query.d == "string") {
  await configData.setup(route.query.d);
}

function updateUrl() {
  let routeParams = {
    name: "read-slug",
    params: {
      slug: [
        progress.title.replace(/ /g, "_"),
        progress.chapter,
        String(progress.page),
      ].join("/"),
    },
    query: { ...route.query },
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

if (typeof route.query.sid == "string") {
  let sid = parseInt(route.query.sid);
}

if (Array.isArray(route.params.slug)) {
  progress.setTitle(route.params.slug.at(-3));
  progress.setChapter(route.params.slug.at(-2));
  progress.setPage(route.params.slug.at(-1));
}
updateUrl();

useHead({
  title: progress.status,
});

watch(
  [() => progress.title, () => progress.chapter, () => progress.page],
  updateUrl
);
</script>

<template>
  <div class="max-w-screen flex min-h-screen flex-col md:flex-row">
    <OptionPanel />
    <Reader></Reader>
  </div>
</template>
