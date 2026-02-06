import { defineContentConfig, defineCollection, property } from "@nuxt/content";
import { z } from "zod";

export default defineContentConfig({
    collections: {
        blog: defineCollection({
            type: "page",
            source: "*.md",
            schema: z.object({
                hero: property(z.object({})).inherit(
                    "app/components/TitleSection.vue",
                ),
                date: z.date(),
                author: z.object({
                    name: z.string(),
                    url: z.string().url(),
                }),
                title: z.string(),
            }),
        }),
    },
});
