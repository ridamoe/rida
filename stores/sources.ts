interface MangaSource {
  name: string;
  pages_base?: string;
  pages: Array<string>;
}

export const useSourcesStore = defineStore("sourcesStore", {
  state: () => ({
    sourceList: [] as Array<MangaSource>,
    currentSourceIndex: undefined as number | undefined,
  }),
  getters: {
    currentSource(state): MangaSource | undefined {
      if (
        state.sourceList != undefined &&
        state.currentSourceIndex != undefined
      ) {
        return state.sourceList[state.currentSourceIndex];
      } else return undefined;
    },
  },
  actions: {
    async setup(sourcesString: string) {
      let [format, data] = sourcesString.split(":");

      switch (format) {
        case "json":
          this.sourceList = JSON.parse(atob(data));
          break;
        case "pastebin":
          this.sourceList = JSON.parse(
            await $fetch("https://pastebin.com/raw/" + data)
          );
          break;
        case "gist":
          this.sourceList = JSON.parse(
            await $fetch("https://gist.githubusercontent.com/" + data)
          );
          break;
        default:
          break;
      }

      this.currentSourceIndex = 0;
    },
    getPage(id: number) {
      if (this.currentSource) {
        return (
          (this.currentSource.pages_base ?? "") + this.currentSource.pages[id]
        );
      }
    },
  },
  persist: false,
});
