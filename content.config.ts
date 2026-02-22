import { defineContentConfig, defineCollection, property } from "@nuxt/content";
import { z } from "zod";

export default defineContentConfig({
    collections: {
        blog: defineCollection({
            type: "page",
            source: "*.md",
            schema: z.object({
                date: z.date(),
                author: z.object({
                    name: z.string(),
                    url: z.string().url(),
                }),
                title: z.string(),
                description: z.string().optional(),
                image: z.string().url().optional(),
            }),
        }),
    },
});
