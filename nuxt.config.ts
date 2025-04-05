// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },

  modules: [
    "@nuxtjs/tailwindcss",
    "@vueuse/nuxt",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "@nuxthub/core",
  ],

  tailwindcss: {
    cssPath: "~/assets/css/tailwind.css",
  },

  app: {
    head: {
      link: [{ rel: "icon", href: "/icon.svg" }],
    },
  },

  runtimeConfig: {
    apiEndpoint: "",
    corsEndpoint: "https://corsproxy.io/?",

    public: {
      apiEndpoint: "",
      corsEndpoint: "https://corsproxy.io/?",
    },
  },

  compatibilityDate: "2024-07-05",
});