<script setup lang="ts"></script>
<template>
    <header
        class="flex items-center justify-between px-8 py-4 bg-surface border-b-primary border-b-[3px] sticky top-0 z-50 max-md:flex-wrap max-md:gap-3 max-md:py-3 max-md:px-4 max-md:w-full max-md:box-border max-sm:p-2 max-sm:gap-2"
    >
        <NuxtLink
            href="/"
            class="flex items-center gap-2 no-underline font-extrabold text-2xl flex-shrink-0 max-md:text-xl max-sm:text-base max-sm:gap-1.5"
            external
        >
            <NuxtImg
                class="w-10 h-10 max-md:w-8 max-md:h-8 max-sm:w-6.5 max-sm:h-6.5"
                src="images/icon.svg"
                alt="Pumpkin"
            />
            <span>pumpkin</span>
        </NuxtLink>
        <nav
            class="nav flex gap-2 max-md:order-3 max-md:w-full max-md:justify-center max-md:flex-wrap max-md:gap-1 max-md:box-border"
        >
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
                <Icon
                    name="fa7-brands:github"
                    style="width: 25px; height: 25px"
                />
            </a>
            <a
                href="https://discord.com/invite/wT8XjrjKkf"
                class="icon-btn"
                title="Discord"
            >
                <Icon
                    name="fa7-brands:discord"
                    style="width: 25px; height: 25px"
                />
            </a>
            <a
                href="https://github.com/sponsors/Snowiiii"
                class="sponsor-btn"
                title="Sponsor"
            >
                <Icon
                    name="fa7-solid:heart"
                    style="width: 22px; height: 22px"
                />
            </a>
            <a
                href="/download/"
                class="download-btn flex items-center justify-center h-10.5 px-5 bg-primary text-black font-bold text-[0.95rem] no-underline border-[3px] border-primary shadow-[3px_3px_0_var(--color-primary)] transition-all duration-100 ease-in-out hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_var(--color-primary)]"
                >Download</a
            >
        </div>
    </header>
</template>

<style scoped>
@reference "@/assets/css/main.css"

.nav {
    display: flex;
    gap: 0.5rem;
}

.nav a {
    padding: 0.6rem 1.25rem;
    text-decoration: none;
    @apply text-muted;
    font-weight: 600;
    font-size: 1rem;
    position: relative;
    transition: all 0.15s ease;
}

.nav a::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 3px;
    @apply bg-primary;
    transition: width 0.15s ease;
}

.nav a:hover {
    @apply text-foreground;
}

.nav a:hover::after {
    width: 100%;
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

@media (max-width: 768px) {
    .nav a {
        padding: 0.4rem 0.6rem;
        font-size: 0.8rem;
    }

    .nav a::after {
        display: none;
    }

    .download-btn {
        height: 34px;
        padding: 0 0.75rem;
        font-size: 0.8rem;
        box-shadow: none;
    }

    .icon-btn,
    .sponsor-btn {
        width: 34px;
        height: 34px;
        font-size: 1rem;
        box-shadow: none;
    }
}

@media (max-width: 480px) {
    .nav a {
        padding: 0.3rem 0.4rem;
        font-size: 0.7rem;
    }

    .download-btn {
        height: 28px;
        padding: 0 0.4rem;
        font-size: 0.7rem;
    }

    .icon-btn,
    .sponsor-btn {
        width: 28px;
        height: 28px;
        font-size: 0.85rem;
    }
}
</style>
