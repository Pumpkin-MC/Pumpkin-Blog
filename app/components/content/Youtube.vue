<script setup lang="ts">
defineProps<{ videoId: string }>();
</script>

<template>
    <div class="not-prose mx-auto max-w-3xl w-full aspect-video overflow-hidden rounded-lg">
        <iframe
            :src="`https://www.youtube.com/embed/${videoId}`"
            class="h-full w-full"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
        />
    </div>
</template>
