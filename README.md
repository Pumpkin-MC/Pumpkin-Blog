# Pumpkin Blog

## Blog Post Format & YouTube Embeds

- Posts are regular Markdown files in the `content/` folder and require frontmatter. Example frontmatter:

```yaml
---
date: yyyy-mm-dd
author:
	name: Me
	url: https://github.com/Me
title: Update - Day Month Year
---
```

- To embed YouTube videos use the `Youtube` content component (with 11-character video ID):

```md
<Youtube videoId="Zz6YbXRX7d8"></Youtube>
```

Look at the [Nuxt Content documentation](https://content.nuxt.com) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
