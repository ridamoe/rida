export const useConfigDataStore = defineStore("configDataStore", () => {
  const runtimeConfig = useRuntimeConfig();
  const sourcesStore = useSourcesStore();
  const API = useApi();

  let configData: Ref<ConfigDataSpec> = ref({});

  async function loadConfigData(dataString: string) {
    let [format, data] = dataString.split(":");

    switch (format) {
      case "json":
        configData.value = JSON.parse(atob(data));
        break;
      case "pastebin":
        configData.value = JSON.parse(
          await $fetch(
            runtimeConfig.public.corsEndpoint +
              "https://pastebin.com/raw/" +
              data
          )
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
      for (let remote of configData.value.remotes) {
        let chapters = remote.chapters ?? ["?"];
        let series = await API.getSeries(remote);
        if (series.result?.chapters) chapters = series.result.chapters;

        await sourcesStore.addSource(remote.website, chapters, remote);
      }
    }
  }

  return {
    setup,
  };
});
