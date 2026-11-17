<script setup lang="ts">
const colorMode = useColorMode();

const toggleTheme = () => {
    colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
};
</script>

<template>
    <header class="sticky top-0 z-50 border-b-3 border-primary bg-surface text-foreground">
        <div class="mx-auto flex max-w-325 flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 lg:flex-nowrap lg:gap-x-3 lg:py-3.5 xl:gap-x-4 xl:px-8">
            <NuxtLink to="/" class="flex shrink-0 items-center gap-2 text-xl font-extrabold lg:text-2xl">
                <NuxtImg src="/images/icon.svg" class="size-8 lg:size-10" alt="" />
                <span>Pumpkin Blog</span>
            </NuxtLink>

            <nav aria-label="Main navigation" class="nav order-last flex w-full flex-wrap gap-x-1 lg:order-0 lg:w-auto lg:flex-nowrap">
                <NuxtLink to="https://pumpkinmc.org/" external>Home</NuxtLink>
                <NuxtLink to="https://docs.pumpkinmc.org/" external>Docs</NuxtLink>
                <NuxtLink to="https://pumpkinmc.org/developers/" external>Developers</NuxtLink>
                <NuxtLink to="https://pumpkinmc.org/contributors/" external>Contributors</NuxtLink>
                <NuxtLink to="/">Blog</NuxtLink>
            </nav>

            <div class="flex flex-wrap items-center gap-2 sm:ml-auto lg:flex-nowrap">
                <button type="button" class="header-btn icon-btn cursor-pointer" title="Toggle color theme" @click="toggleTheme">
                    <span class="sr-only dark:hidden">Switch to dark mode</span>
                    <span class="sr-only hidden dark:inline">Switch to light mode</span>
                    <svg aria-hidden="true" class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path class="dark:hidden" d="M20.9 13.3A9 9 0 0 1 10.7 3.1a9 9 0 1 0 10.2 10.2Z" />
                        <g class="hidden dark:inline">
                            <circle cx="12" cy="12" r="4" />
                            <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
                        </g>
                    </svg>
                </button>
                <a href="https://github.com/Pumpkin-MC/Pumpkin" class="header-btn icon-btn" aria-label="GitHub">
                    <Icon name="fa7-brands:github" size="20" />
                </a>
                <a href="https://discord.com/invite/wT8XjrjKkf" class="header-btn icon-btn" aria-label="Discord">
                    <Icon name="fa7-brands:discord" size="20" />
                </a>
                <a href="https://pumpkinmc.org/sponsor/" class="header-btn sponsor-btn" aria-label="Sponsor">
                    <Icon name="fa7-solid:heart" size="18" />
                </a>
                <a href="https://pumpkinmc.org/download/" class="header-btn download-btn">Download</a>
            </div>
        </div>
    </header>
</template>

<style scoped>
@reference "@/assets/css/main.css";

.nav a {
    @apply relative inline-flex h-8 items-center whitespace-nowrap px-1.5 text-sm font-semibold text-muted lg:h-10.5 lg:px-2.5 lg:text-base xl:px-4;
}

.nav a:is(:hover, :focus-visible, [aria-current="page"]) {
    @apply text-foreground after:absolute after:inset-x-2 after:bottom-0 after:h-0.75 after:bg-primary xl:after:inset-x-4;
}

.header-btn {
    @apply inline-flex h-9 items-center justify-center border-3 border-current transition duration-100 lg:h-10.5 lg:shadow-[3px_3px_0_var(--button-shadow)] lg:hover:-translate-0.5 lg:hover:shadow-[5px_5px_0_var(--button-shadow)] motion-reduce:transition-none;
}

.icon-btn {
    --button-shadow: currentColor;
    @apply w-9 bg-background text-foreground hover:text-primary lg:w-10.5;
}

.sponsor-btn {
    --button-shadow: var(--color-pink);
    @apply w-9 border-pink bg-pink text-black lg:w-10.5;
}

.download-btn {
    --button-shadow: var(--color-primary);
    @apply border-primary bg-primary px-3 text-sm font-bold text-black lg:px-5 lg:text-[0.95rem];
}
</style>
