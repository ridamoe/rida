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

  modules: [
    "@vueuse/nuxt",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "@nuxthub/core",
    "@vite-pwa/nuxt",
  ],

  pwa: {
    registerType: "autoUpdate",
    manifest: {
      name: "Rida",
      display: "standalone",
      short_name: "Rida",
      description: "An intuitive manga reader",
      theme_color: "#0a0a0a",
      background_color: "#0f172a",
      icons: [
        {
          sizes: "1024x1024",
          src: "maskable_icon.png",
          type: "image/png",
        },
      ],
    },
    workbox: {
      globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
    },
  },

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
