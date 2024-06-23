import { isClient } from "@vueuse/core";

interface MangaSource {
  name: string;
  pages_base?: string;
  pages: Array<string>;
}

export const useSourcesStore = defineStore("sourcesStore", {
  state: () => ({
    _sourceList: [] as Array<MangaSource>,
    currentSourceId: 0,
    loadedUrls: new Set([]) as Set<string>,
    _loadedIds: [] as Array<Array<number>>,
  }),
  getters: {
    current(state) {
      let source: MangaSource | undefined;
      let loadedPages: Array<number> | undefined;
      if (state._sourceList != undefined) {
        source = state._sourceList[state.currentSourceId];
        loadedPages = state._loadedIds[state.currentSourceId];
      }

      return {
        source,
        pageCount: source?.pages.length ?? 0,
        loadedPages,
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
      if (index == undefined) index = this.currentSourceId + 1;
      this.currentSourceId = index % this._sourceList.length;
    },
    preloadImage(url: string, source: number, index: number) {
      return new Promise<void>((resolve) => {
        if (!this.loadedUrls.has(url)) {
          const img = new Image();
          img.src = url;
          img.onload = () => {
            this.loadedUrls.add(url);
            this._loadedIds[source].push(index);
            resolve();
          };
          img.onerror = () => resolve();
        } else {
          this._loadedIds[source].push(index);
          resolve();
        }
      });
    },
    preloadImages(start = 0, max = null) {
      let maxPages = Math.max(
        ...this._sourceList.map((el) => {
          let pagesToLoadCount = el.pages.length;
          if (max) pagesToLoadCount = Math.min(pagesToLoadCount, max);
          return pagesToLoadCount;
        })
      );

      for (let i = 0; i < this._sourceList.length; i++) {
        this._loadedIds[i] = [];
      }

      for (let j = start; j < maxPages; j++) {
        for (let i = 0; i < this._sourceList.length; i++) {
          let src = this.getPage(i, j);
          if (src) this.preloadImage(src, i, j);
        }
      }
    },
    async setup(sourcesString: string) {
      let [format, data] = sourcesString.split(":");

      switch (format) {
        case "json":
          this._sourceList = JSON.parse(atob(data));
          break;
        case "pastebin":
          this._sourceList = JSON.parse(
            await $fetch(
              // TODO: avoid using external cors proxy
              "https://corsproxy.io/?https://pastebin.com/raw/" + data
            )
          );
          break;
        case "gist":
          this._sourceList = JSON.parse(
            await $fetch("https://gist.githubusercontent.com/" + data)
          );
          break;
        default:
          break;
      }

      if (isClient) this.preloadImages();

      this.currentSourceId = 0;
    },
    getPage(sourceId: number, page: number) {
      page = clamp(page - 1, 0);
      if (
        this._sourceList[sourceId] &&
        page < this._sourceList[sourceId].pages.length
      ) {
        return (
          (this._sourceList[sourceId].pages_base ?? "") +
          this._sourceList[sourceId].pages[page]
        );
      }
    },
  },
  persist: false,
});
