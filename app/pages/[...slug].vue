<script setup lang="ts">
import { withoutTrailingSlash } from "ufo";
import { useHead, useRuntimeConfig } from '#imports';

definePageMeta({
    documentDriven: true,
});

const route = useRoute();
const path = withoutTrailingSlash(route.path);

const { data: page } = await useAsyncData(`blog-${path}`, () => {
    return queryCollection("blog").path(path).first();
});

if (page.value) {
    // dynamically set document head for SEO / social previews
    const title = page.value.title || 'Pumpkin Blog';
    const description = page.value.description || '';
    const image = page.value.image || '/images/icon.svg';
    const url = useRuntimeConfig().public.siteUrl + path;

    useHead({
        title,
        meta: [
            { name: 'description', content: description },
            { property: 'og:title', content: title },
            { property: 'og:description', content: description },
            { property: 'og:type', content: 'article' },
            { property: 'og:url', content: url },
            { property: 'og:image', content: image },
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:title', content: title },
            { name: 'twitter:description', content: description },
            { name: 'twitter:image', content: image },
        ],
    });
}

if (!page.value) {
    throw createError({
        statusCode: 404,
        statusMessage: "Page not found",
        fatal: true,
    });
}
</script>

<template>
    <article
        class="prose dark:prose-invert prose-orange m-auto min-h-[70%] max-w-screen-lg px-4 sm:px-6 md:px-8 lg:px-12 pb-20"
    >
        <h1 class="break-words font-extrabold tracking-tight leading-tight pt-6 sm:pt-12 pb-2 sm:pb-4 text-2xl sm:text-4xl md:text-5xl" v-if="page?.title">
            {{ page.title }}
        </h1>
        <div class="text-muted mt-2 sm:mt-3">
            <a v-if="page?.author" :href="page.author.url" class="hover:text-primary transition-colors">{{
                page.author.name
            }}</a>
            <span v-if="page?.author && page?.date" class="mx-2">•</span>
            <span v-if="page?.date">{{
                new Date(page.date).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })
            }}</span>
        </div>
        <ContentRenderer class="mt-8 sm:mt-10" v-if="page" :value="page">
            Hello
        </ContentRenderer>
    </article>
</template>

<style scoped>
@reference "@/assets/css/main.css";

h1 {
    @apply text-2xl sm:text-4xl md:text-5xl font-extrabold pt-6 sm:pt-12 pb-2 sm:pb-4 leading-tight tracking-tight break-words;
}
</style>
