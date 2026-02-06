<script setup lang="ts">
const route = useRoute();

const { data: page } = await useAsyncData("page-" + route.path, () => {
    return queryCollection("blog").path(route.path).first();
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
        <ContentRenderer v-if="page" :value="page" />
    </article>
</template>

<style>
@import "tailwindcss";
@plugin "@tailwindcss/typography";

h1 {
    @apply text-5xl font-extrabold pb-8 pt-12;
}
</style>
