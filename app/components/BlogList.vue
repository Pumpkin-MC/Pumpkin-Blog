<script setup lang="ts">
const { data: posts } = await useAsyncData("blog-posts", () => {
    return queryCollection("blog")
        .select("id", "title", "description", "date", "path", "author")
        .order("date", "DESC")
        .where("path", "<>", "/")
        .all();
});
</script>

<template>
    <div>
        <NuxtLink
            v-for="post in posts"
            :to="post.path"
            :key="post.id"
            class="group no-underline text-inherit block mb-5"
        >
            <section class="px-5 pt-5 hover:bg-black/5 dark:hover:bg-white/5 bg-inherit rounded-2xl transition-colors duration-150">
                <h2 class="mt-2 text-foreground group-hover:text-primary transition-colors">{{ post.title }}</h2>
                <p class="text-foreground/80 my-2">{{ post.description }}</p>
                <div class="text-muted text-sm mb-5">
                    <span v-if="post.author">{{ post.author.name }}</span>
                    <span v-if="post.author" class="mx-2">•</span>
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
