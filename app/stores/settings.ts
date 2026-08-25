interface State {
  showPanel: boolean;
  pageFit:
    | "original"
    | "fit-height"
    | "fit-all"
    | "fit-width"
    | "limit-all"
    | "limit-height"
    | "limit-width";
  pinPageSelector: boolean;
  spreadLayout: "single-page" | "double-page" | "double-page-odd";
  readDirection: "left-to-right" | "right-to-left" | "vertical";
}

export const useSettingsStore = defineStore("settingsStore", {
  state: (): State => ({
    showPanel: true,
    pageFit: "limit-all",
    pinPageSelector: true,
    spreadLayout: "single-page",
    readDirection: "right-to-left",
  }),
  persist: true,
});
