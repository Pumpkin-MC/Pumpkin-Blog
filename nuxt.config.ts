import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: ["@nuxt/content", "@nuxt/fonts", "@nuxt/image", "@nuxt/icon"],
    devtools: { enabled: true },
    compatibilityDate: "2024-04-03",
    css: ["./assets/css/main.css"],
    vite: {
        plugins: [tailwindcss()],
    },
});
