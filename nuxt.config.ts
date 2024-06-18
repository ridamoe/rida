// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
  modules: ["@nuxtjs/tailwindcss", "@vueuse/nuxt"],
  tailwindcss: {
    cssPath: "~/assets/css/tailwind.css",
  },
});
