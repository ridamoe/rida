import { isClient } from "@vueuse/core";

interface MangaSource {
  name: string;
  pages_base?: string;
  pages: Array<string>;
}

export const useSourcesStore = defineStore("sourcesStore", {
  state: () => ({
    sourceList: [] as Array<MangaSource>,
    currentSourceId: undefined as number | undefined,
    loadedUrls: new Set([]) as Set<string>,
    loadedIds: [] as Array<[number, number]>,
  }),
  getters: {
    current(state) {
      let source: MangaSource | undefined;
      if (state.sourceList != undefined && state.currentSourceId != undefined) {
        source = state.sourceList[state.currentSourceId];
      } else source = undefined;

      return {
        source,
        pageCount: source?.pages.length ?? 0,
      };
    },
  },
  actions: {
    /** Changes source based on `index`.
     * If the number is more than the avalable sources count, it cycles to the first.
     * If no index is specified it defaults to the current source index + 1.
     * @param index
     */
    changeSource(index: number | undefined = undefined) {
      if (this.currentSourceId != undefined) {
        if (index == undefined) index = this.currentSourceId + 1;
        this.currentSourceId = index % this.sourceList.length;
      }
    },
    preloadImage(url: string, imageData: [number, number]) {
      return new Promise<void>((resolve) => {
        if (!this.loadedUrls.has(url)) {
          const img = new Image();
          img.src = url;
          img.onload = () => {
            this.loadedUrls.add(url);
            this.loadedIds.push(imageData);
            resolve();
          };
          img.onerror = () => resolve();
        } else {
          resolve();
        }
      });
    },
    preloadImages(start = 0, max = null) {
      for (let i = 0; i < this.sourceList.length; i++) {
        let pagesToLoadCount = this.sourceList[i].pages.length;
        if (max) Math.min(pagesToLoadCount, max);
        for (let j = start; j < pagesToLoadCount; j++) {
          let src = this.getPage(i, j);
          if (src) this.preloadImage(src, [i, j]);
        }
      }
    },
    async setup(sourcesString: string) {
      let [format, data] = sourcesString.split(":");

      switch (format) {
        case "json":
          this.sourceList = JSON.parse(atob(data));
          break;
        case "pastebin":
          this.sourceList = JSON.parse(
            await $fetch(
              // TODO: avoid using external cors proxy
              "https://corsproxy.io/?https://pastebin.com/raw/" + data
            )
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

      if (isClient) this.preloadImages();

      this.currentSourceId = 0;
    },
    getPage(sourceId: number, pageId: number) {
      if (
        this.sourceList[sourceId] &&
        pageId < this.sourceList[sourceId].pages.length
      ) {
        return (
          (this.sourceList[sourceId].pages_base ?? "") +
          this.sourceList[sourceId].pages[pageId]
        );
      }
    },
  },
  persist: false,
});
