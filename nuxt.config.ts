import tailwindcss from "@tailwindcss/vite";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  modules: ["@vueuse/nuxt", "@pinia/nuxt", "pinia-plugin-persistedstate/nuxt"],

  css: ["~/assets/css/tailwind.css"],

  app: {
    head: {
      link: [{ rel: "icon", href: "/icon.svg" }],
    },
  },

  runtimeConfig: {
    apiEndpoint: "",
    corsEndpoint: "https://corsproxy.io/?",
    deploy_nuxthub: "true",

    public: {
      apiEndpoint: "",
      corsEndpoint: "https://corsproxy.io/?",
      deploy_nuxthub: "true",
    },
  },

  experimental: {
    asyncContext: true,
  },

  compatibilityDate: "2024-07-05",
});
