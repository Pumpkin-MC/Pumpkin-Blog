<script setup lang="ts">
import { withoutTrailingSlash } from "ufo";

definePageMeta({
    documentDriven: true,
});

const route = useRoute();

const { data: page } = await useAsyncData("page-" + route.path, () => {
    return queryCollection("blog")
        .path(withoutTrailingSlash(route.path))
        .first();
});

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
        class="prose prose-invert prose-orange m-auto min-h-[70%] max-w-screen-lg px-12 pb-20"
    >
        <h1 class="pb-0! mb-0! leading-none!" v-if="page?.title">
            {{ page.title }}
        </h1>
        <div class="opacity-60">
            <a v-if="page?.author" :href="page.author.url">{{
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
        <ContentRenderer class="mt-10" v-if="page" :value="page">
            Hello
        </ContentRenderer>
    </article>
</template>

<style>
@import "tailwindcss";
@plugin "@tailwindcss/typography";

h1 {
    @apply text-5xl font-extrabold pb-8 pt-12;
}
</style>
