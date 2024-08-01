import { isClient } from "@vueuse/core";

export const useApi = () => {
  const runtimeConfig = useRuntimeConfig();

  function replaceParams(
    params: string[],
    substs: Record<string, string | null> = {}
  ): string[] {
    let newParams: string[] = [];
    for (let param of params) {
      let match = /^@\{([a-zA-Z0-9]+)\}$/.exec(param);
      if (match) {
        let key = match[1];
        if (
          Object.keys(substs).includes(key) &&
          ![null, "?"].includes(substs[key])
        )
          param = substs[key]!;
        else continue;
      }
      newParams.push(param);
    }
    return newParams;
  }

  return class API {
    static async get(url: string) {
      const apiEndpoint = isClient
        ? runtimeConfig.public.apiEndpoint
        : runtimeConfig.apiEndpoint;
      const URL = apiEndpoint + "/" + url;
      return await $fetch<APIResponse>(URL);
    }
    static async getSeries(remote: RemoteSpec): Promise<APISeriesResponse> {
      return await API.get(
        [remote.website, "series", ...replaceParams(remote.params)].join("/")
      );
    }
    static async getChapterPages(
      remote: RemoteSpec,
      chapter: string | null
    ): Promise<APIChapterPagesResponse> {
      return await API.get(
        [
          remote.website,
          "chapter",
          "pages",
          ...replaceParams(remote.params, { chapter }),
        ].join("/")
      );
    }
  };
};
