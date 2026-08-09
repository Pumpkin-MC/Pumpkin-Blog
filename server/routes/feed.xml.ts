import { Feed } from "feed";

export default defineEventHandler(async (event) => {
    const { siteUrl } = useRuntimeConfig(event).public;
    const site = new URL(siteUrl);
    const feedUrl = new URL("/feed.xml", site).href;
    const posts = await queryCollection(event, "blog")
        .select("title", "description", "date", "path")
        .where("path", "<>", "/")
        .order("date", "DESC")
        .all();
    const updated = posts[0] ? new Date(posts[0].date) : new Date();
    const feed = new Feed({
        title: "Pumpkin Blog",
        description: "Thoughts, updates, and more from Pumpkin-MC.",
        id: site.href,
        link: site.href,
        updated,
        feedLinks: { rss: feedUrl },
    });

    for (const post of posts) {
        feed.addItem({
            title: post.title,
            id: new URL(post.path, site).href,
            link: new URL(post.path, site).href,
            description: post.description,
            date: new Date(post.date),
        });
    }

    setResponseHeader(event, "content-type", "application/rss+xml; charset=utf-8");
    return feed.rss2();
});
