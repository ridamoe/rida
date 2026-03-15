import tailwindcss from "@tailwindcss/vite";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: false,

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
    "@vite-pwa/nuxt",
  ],

  pwa: {
    registerType: "autoUpdate",
    manifest: {
      name: "Rida",
      display: "fullscreen",
      short_name: "Rida",
      description: "An intuitive manga reader",
      theme_color: "#0a0a0a",
      background_color: "#0f172a",
      start_url: "/?utm_source=pwa",
      icons: [
        {
          sizes: "1024x1024",
          src: "maskable_icon.png",
          type: "image/png",
        },
      ],
    },
    devOptions: {
      enabled: true,
      navigateFallbackAllowlist: [/^\/$/],
    },
    workbox: {
      globPatterns: ["**/*.{js,css,png,svg,ico}"],
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

    public: {
      apiEndpoint: "",
      corsEndpoint: "https://corsproxy.io/?",
    },
  },

  experimental: {
    asyncContext: true,
  },

  compatibilityDate: "2026-03-15",
});
