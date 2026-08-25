import { isClient } from "@vueuse/core";

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig();

  const ENDPOINT = isClient
    ? runtimeConfig.public.apiEndpoint
    : runtimeConfig.apiEndpoint;

  const api = $fetch.create({
    baseURL: ENDPOINT,
  });

  return {
    provide: {
      api,
    },
  };
});
