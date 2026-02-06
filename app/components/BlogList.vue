<script setup lang="ts">
const { data: posts } = await useAsyncData("blog-posts", () => {
    return queryCollection("blog")
        .select("id", "title", "description", "date", "path", "author")
        .order("date", "DESC")
        .where("path", "NOT LIKE", "/blog")
        .all();
});
</script>

<template>
    <div>
        <NuxtLink
            v-for="post in posts"
            :to="post.path"
            :key="post.id"
            class="no-underline text-inherit block mb-5"
        >
            <section class="px-5 pt-5 hover:bg-white/2 bg-inherit rounded-2xl">
                <h2 class="mt-2">{{ post.title }}</h2>
                <p>{{ post.description }}</p>
                <div class="opacity-60 mb-5">
                    <span>{{ post.author.name }}</span>
                    <span class="mx-2">•</span>
                    <span>{{
                        new Date(post.date).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })
                    }}</span>
                </div>
                <div class="border-b-2 border-primary"></div>
            </section>
        </NuxtLink>
    </div>
</template>

<style scoped></style>
