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
    runtimeConfig: {
        public: {
            siteUrl: 'https://blog.pumpkinmc.org',
        },
    },
    app: {
        head: {
            titleTemplate: '%s | Pumpkin Blog',
            meta: [
                { charset: 'utf-8' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                { name: 'description', content: 'Thoughts, updates, and more from Pumpkin-MC.' },
                { property: 'og:site_name', content: 'Pumpkin Blog' },
                { name: 'twitter:card', content: 'summary_large_image' },
                // any other site‑wide defaults
            ],
            link: [
                {
                    rel: "icon",
                    type: "image/svg+xml",
                    href: "/images/icon.svg",
                },
            ],
        },
    },
    fonts: {
        families: [
            {
                name: "Bricolage Grotesque",
                provider: "google",
                weights: [400, 600, 800],
            },
        ],
    },
    nitro: {
        prerender: {
            ignore: ["/developers", "/contributors", "/download"],
            crawlLinks: true,
            routes: ["/"],
        },
    },
});
