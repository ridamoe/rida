<script async setup lang="ts">
import { isClient } from "@vueuse/core";

const route = useRoute();
const router = useRouter();
const sources = useSourcesStore();
const progress = useProgressStore();

if (typeof route.query.src == "string") {
  await sources.setup(route.query.src);
}

function updateUrl() {
  const newUrl = router.resolve({
    name: "read-title-chapter-page",
    params: {
      title: progress.title.replace(/ /g, "_"),
      chapter: progress.chapter,
      page: progress.page,
    },
    query: { ...route.query, sid: sources.currentSourceId },
  });
  if (typeof newUrl.fullPath == "string")
    window.history.replaceState(null, "", newUrl.fullPath);
}
if (typeof route.query.sid == "string") {
  let sid = parseInt(route.query.sid);
  if (sid) sources.changeSource(sid);
}
progress.setTitle(route.params.title);
progress.setChapter(route.params.chapter);
progress.setPage(route.params.page);
if (isClient) updateUrl();

useHead({
  title: progress.status,
});

watch(
  [
    () => progress.title,
    () => progress.chapter,
    () => progress.page,
    () => sources.currentSourceId,
  ],
  updateUrl
);
</script>

<template>
  <div class="max-w-screen flex min-h-screen flex-col md:flex-row">
    <OptionPanel />
    <Reader></Reader>
  </div>
</template>
