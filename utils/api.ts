import { isClient } from "@vueuse/core";
import type { NitroFetchOptions, NitroFetchRequest } from "nitropack";

export const useApi = () => {
  const runtimeConfig = useRuntimeConfig();

  function replaceVariable(
    params: string[] | Record<string, string>,
    variable: string | null = null
  ): string[] | Record<string, string> {
    if (params.length == 0) return [];
    if (Array.isArray(params))
      return params.reduce((a: string[], el) => {
        if (el === "@") {
          if (variable != null) a.push(variable);
        } else a.push(el);
        return a;
      }, []);
    else {
      let obj: Record<string, string> = {};
      Object.keys(params).forEach((key) => {
        if (params[key] === "@") {
          if (variable != null) obj[key] = variable;
        } else obj[key] = params[key];
      });
      return obj;
    }
  }

  return class API {
    static ENDPOINT = isClient
      ? runtimeConfig.public.apiEndpoint
      : runtimeConfig.apiEndpoint;

    static async fetch(
      params: string[] | Record<string, string>,
      url: string,
      opts:
        | NitroFetchOptions<
            NitroFetchRequest,
            | "get"
            | "head"
            | "patch"
            | "post"
            | "put"
            | "delete"
            | "connect"
            | "options"
            | "trace"
          >
        | undefined = undefined
    ) {
      opts = Object.assign({}, opts);
      if (Array.isArray(params)) url += "/" + params.join("/");
      else opts["query"] = params;
      return await $fetch<APIResponse>(url, opts);
    }

    static async getSeries(remote: RemoteSpec): Promise<APISeriesResponse> {
      return await API.fetch(
        replaceVariable(remote.params),
        `${API.ENDPOINT}/website/${remote.website}/series`
      );
    }

    static async getChapterPages(
      remote: RemoteSpec,
      chapter: string | null
    ): Promise<APIChapterPagesResponse> {
      return await API.fetch(
        replaceVariable(remote.params, chapter),
        `${API.ENDPOINT}/website/${remote.website}/chapter/pages`
      );
    }
  };
};
