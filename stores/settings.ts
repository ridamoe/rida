interface State {
  showPanel: boolean;
  pageFit:
    | "original"
    | "stretch-height"
    | "stretch-all"
    | "stretch-width"
    | "limit-all"
    | "limit-height"
    | "limit-width";
  pinProgress: boolean;
  spreadLayout: "single-page" | "double-page" | "double-page-odd";
  readDirection: "left-to-right" | "right-to-left" | "vertical";
}

export const useSettingsStore = defineStore("settingsStore", {
  state: (): State => ({
    showPanel: true,
    pageFit: "limit-all",
    pinProgress: true,
    spreadLayout: "single-page",
    readDirection: "right-to-left",
  }),
});
