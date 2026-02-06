<script setup lang="ts"></script>
<template>
    <header
        class="flex items-center justify-between px-8 py-4 bg-surface border-b-primary border-b-[3px] sticky top-0 z-50"
    >
        <NuxtLink
            href="/"
            class="flex items-center gap-2 no-underline font-extrabold text-2xl"
            external
        >
            <NuxtImg
                width="40px"
                height="40px"
                src="images/icon.svg"
                alt="Pumpkin"
            />
            <span>pumpkin</span>
        </NuxtLink>
        <nav class="nav flex gap-2">
            <NuxtLink to="/" external>Home</NuxtLink>
            <NuxtLink to="https://docs.pumpkinmc.org/" external>Docs</NuxtLink>
            <NuxtLink to="/developers/" external>Developers</NuxtLink>
            <NuxtLink to="/contributors/" external>Contributors</NuxtLink>
        </nav>
        <div class="flex items-center gap-2">
            <a
                href="https://github.com/Pumpkin-MC/Pumpkin"
                class="icon-btn"
                title="GitHub"
            >
                <Icon size="100%" name="fa7-brands:github" />
            </a>
            <a
                href="https://discord.com/invite/wT8XjrjKkf"
                class="icon-btn"
                title="Discord"
            >
                <Icon size="100%" name="fa7-brands:discord" />
            </a>
            <a
                href="https://github.com/sponsors/Snowiiii"
                class="sponsor-btn"
                title="Sponsor"
            >
                <Icon size="100%" name="fa7-solid:heart" />
            </a>
            <a
                href="/download/"
                class="flex items-center justify-center h-10.5 px-5 bg-primary text-black font-bold text-[0.95rem] no-underline border-[3px] border-primary shadow-[3px_3px_0_var(--color-primary)] transition-all duration-100 ease-in-out hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_var(--color-primary)]"
                >Download</a
            >
        </div>
    </header>
</template>

<style scoped>
@reference "@/assets/css/main.css"

.nav a {
    @apply px-5 py-2.5 no-underline text-muted font-semibold text-base relative transition-all duration-150 ease-in-out;
}
.nav a::after {
    @apply content-[''] absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.75 bg-primary transition-[width] duration-150 ease-in-out;
}
.nav a:hover {
    @apply text-foreground;
}
.nav a:hover::after {
    @apply w-full;
}

.icon-btn {
    @apply flex items-center justify-center w-10.5 h-10.5 bg-background text-foreground text-xl no-underline border-[3px] border-foreground shadow-[3px_3px_0_var(--color-foreground)] transition-all duration-100 ease-in-out;
}

.icon-btn:hover {
    @apply -translate-x-0.5 -translate-y-0.5 shadow-[5px_5px_0_var(--color-primary)] border-primary text-primary;
}

.sponsor-btn {
    @apply flex items-center justify-center w-10.5 h-10.5 bg-pink text-black text-[1.1rem] no-underline border-[3px] border-pink shadow-[3px_3px_0_var(--color-pink)] transition-all duration-100 ease-in-out;
}

.sponsor-btn:hover {
    @apply -translate-x-0.5 -translate-y-0.5 shadow-[5px_5px_0_var(--color-pink)];
}
</style>
