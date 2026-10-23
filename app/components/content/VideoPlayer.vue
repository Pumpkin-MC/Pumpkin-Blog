<script setup lang="ts">
defineProps<{
    src: string;
    caption?: string;
}>();
</script>

<template>
    <figure class="my-6">
        <div class="not-prose mx-auto max-w-3xl w-full overflow-hidden rounded-xl border border-black/10 dark:border-white/10 shadow-lg bg-black">
            <video
                controls
                preload="metadata"
                class="w-full h-auto block rounded-xl"
            >
                <source :src="src" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
        <figcaption v-if="caption" class="text-center text-sm text-foreground/70 mt-2">
            {{ caption }}
        </figcaption>
    </figure>
</template>
