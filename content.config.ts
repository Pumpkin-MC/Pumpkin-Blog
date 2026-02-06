import { defineContentConfig, defineCollection } from "@nuxt/content";
import { z } from "zod";

export default defineContentConfig({
    collections: {
        blog: defineCollection({
            type: "page",
            source: "blog/*.md",
            // Define custom schema for docs collection
            schema: z.object({
                tags: z.array(z.string()),
                date: z.date(),
                author: z.string(),
            }),
        }),
    },
});
