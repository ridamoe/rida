import { isClient } from "@vueuse/core";

export const useConfigDataStore = defineStore("configDataStore", () => {
  const runtimeConfig = useRuntimeConfig();
  const sourcesStore = useSourcesStore();
  const progressStore = useProgressStore();
  const API = useApi();

  let configData: Ref<ConfigDataSpec> = ref({});

  async function loadConfigData(dataString: string) {
    let [format, data] = dataString.split(":");
    const corsEndpoint = isClient
      ? runtimeConfig.public.corsEndpoint
      : runtimeConfig.corsEndpoint;
    switch (format) {
      case "json":
        configData.value = JSON.parse(atob(data));
        break;
      case "pastebin":
        configData.value = JSON.parse(
          await $fetch(corsEndpoint + "https://pastebin.com/raw/" + data)
        );
        break;
      case "gist":
        configData.value = JSON.parse(
          await $fetch("https://gist.githubusercontent.com/" + data)
        );
        break;
      default:
        break;
    }
  }

  async function setup(dataString: string) {
    await loadConfigData(dataString);

    if (configData.value.remotes) {
      for (let [chapter, remotes] of Object.entries(configData.value.remotes)) {
        for (let remote of remotes) {
          let chapters = [];
          if (chapter === "@") {
            let series = await API.getSeries(remote);
            chapters = series.result?.chapters!;
          } else chapters = [chapter];

          await sourcesStore.addSource(remote.website, chapters, remote);
        }
      }
    }

    if (progressStore.chapter == undefined) {
      progressStore.chapter = sourcesStore.chapters[0];
    }

    if (progressStore.source == undefined) {
      progressStore.source = Object.values(sourcesStore.sources).findIndex(
        (el) => Object.keys(el.chapters).includes(progressStore.chapter)
      );
    }
  }

  return {
    setup,
  };
});
