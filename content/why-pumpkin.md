---
date: 2026-02-06
author:
  name: Alexander Medvedev
  url: https://github.com/Snowiiii
title: Why Pumpkin?
---

Hello! We have a new blog now, and we plan to release regular updates here regarding the progress Pumpkin has made. Huge thanks to BjornTheProgrammer (and also Purdze for the fixes)

In this first blog post, I want to share the history of Pumpkin: why and how it was made, what I’ve learned, and the difficulties I faced during the process

### A Bit of Background

I’ve been coding Bukkit plugins since I was 12, and it has always been a lot of fun. Over time, I gained more experience and was "hired" (for free) as a developer for multiple Minecraft servers, eventually selling some of my plugins on a freelancing platform
I was also actively involved in client-side modding, which allowed me to learn almost the entire Minecraft codebase during that project

### Bukkit

While using the Bukkit API, I often felt that certain things were missing. There are design flaws that have resulted in third-party libraries becoming the norm (Adventure, ProtocolLib, PacketEvents, etc.), especially when working on plugins that require spawning Player NPCs or building anti-cheats (good luck with that!)

While these third-party libraries work fine most of the time, it results in users having to download essential dependencies, or unnecessarily large plugin sizes when developers statically include the entire library inside every plugin that uses it

Developing these libraries is a pain as well. The only way to interact with the protocol in Bukkit is by using NMS (internal Minecraft code). While this might be fine if you only target one specific version of Minecraft, the approach breaks when you want to support multiple versions. You end up having to use Java reflection hacks, which can easily lead to bugs and don't forget that almost every update requires adding new code just to keep things from breaking.

Some other problems include but not limited to:

- Bukkit still heavily relies on outdated section-sign (§) color codes, while modern Minecraft has moved to complex JSON components

- The Bukkit API for scoreboards is notoriously difficult to use for "per-player" displays because it mirrors how the vanilla server stores data, rather than how the client actually needs to receive it

- Thread Safety is a constant battle. Almost the entire Bukkit API is not thread-safe, meaning if you try to improve performance by moving tasks to a background thread, you risk crashing the server

### Performance

One of the reasons for creating Pumpkin was that the laptop I used at the time really struggled to run a Minecraft server regardless of whether it was Vanilla or a high-performance fork like Paper. It got to the point where having IntelliJ open or compiling my Bukkit plugin while the server was running simply wouldn't work,

#### Rust?

Around that time, I also started learning C++ and dived deeper into graphics development. I noticed that my C++ games were running smoother, faster, and had a lower binary size compared to their Java equivalents. I found working with low-level components much more interesting and spent hours optimizing code,

I used C++ for about a year and even created a working [Game Engine fully using the Vulkan API](https://github.com/Snowiiii/Vent-Engine-OLD). At that time, I wasn't actively playing Minecraft anymore, but one day I decided to join a small server I used to play on. I met someone there, we hopped on a Discord call, and I told him about my engine. He actually recommended Rust.

At that time, I had zero clue about Rust, I was skeptical and didn't really want to try it out. But we kept chatting, and eventually, he "annoyed" me so much with it that I decided it was worth a try. As a challenge, instead of the usual "Hello World" to learn the language, I decided to try rewriting my [Game Engine in Rust](https://github.com/ventengine/Vent-Engine) to see how it went. It was at that moment that I fell in love with the language.

### PumpkinMC?

I was busy working on the rewrite of the engine and learned a lot along the way. Reflecting back, I’m really thankful I first learned C++, it made many things much easier to understand.

I still had contact with an old friend from the Minecraft scene who was also a Bukkit developer and a former server owner. We had a talk after a long time and I was joking about a Minecraft server being written in Rust, wondering if there were any. I saw some online, but all of them seemed to be abandoned and didn't really get that far. So, I decided to try my luck and start one myself. I was 15 at the time and it was the holidays, so I had plenty of time.

I had zero experience with networking and learned everything like I always do using YouTube and the internet in general. It took me a while to actually understand how packets are read and written and that the core concept is simpler than I imagined, I also had some experience with Minecraft packets due to my previous work in Bukkit.

#### Progress

After a while, I actually got a player to spawn. I also created a Discord server at that time and posted [updates sometimes even every day](https://discord.com/channels/1268592337445978193/1269592005084971038/1269603623382421565). During that period, I was working on the project so actively that it could only be described as unhealthy basically coding 16 hours a day, sleeping 8 hours, and repeating.

Reddit was what really started the popularity around Pumpkin. Rust has a community like no other, and I’m sure that is an important part of why Pumpkin is as successful and popular as it is today. I remember first posting on r/rust and the [post got quite a lot of attention](https://www.reddit.com/r/rust/comments/1egx979/minecraft_server_written_in_rust/).

I also just tried to spread a word in general and activitly search for contributors without annoying people or letting it look as if i'm just posting self advertisement

This actually helped at that time, one of the biggest issues was saving and loading chunks from Minecraft's Anvil format. It got solved by a very talented contributor and short-term Pumpkin team member, [Lukas](https://github.com/lukas0008) (big thanks this is one of the most complicated things I’ve ever seen)

Another contributor, [Bryntet](https://github.com/Bryntet) made a bunch of PRs and helped a lot with the project. We also developed a close connection on Discord. He actually applied for a job, and the employers went through all the commits he made in Pumpkin shortly after, he got the job! This was a huge motivation for me, especially because I was much younger than him.

But what really made the difference was [posting about Pumpkin on HackerNews](https://www.webbindustries.com/hackernews/story/41846636), The post got a lot of attention, which led to the first YouTuber a really big YouTuber [to cover Pumpkin](https://youtu.be/meup98Okxwk?si=WEZzPpy1KqWAR7tP) (Theo t3.gg <3). These events brought many new people in and the popularity of Pumpkin increased by a lot.


### Problems

At this point, I still worked on Pumpkin **every day** with maybe a few rare exceptions. I finally got what I wanted: there were many new contributors & pull requests coming in. But then it happened for the first time in my life, I had the experience of just sitting there and, instead of spending time coding, going through PR after PR to see what was changed. I have to say, I still prefer coding myself over reviewing code from others, but no matter what, I still tried my best.

Around that time, even some "hype" began to evolve. I also saw the first "hate" directed at the project, and also people constantly posting [a Website listing some other mostly abonden Minecraft rust server](https://dayssincelastrustmcserver.com/) still until this day, making it look as if this project is nothing special (i swear someone needs to make such an list about Java mc server software)

Besides that, some people were just not happy with Pumpkin becoming successful especially some maintainers of similar projects who wanted a piece of the cake. This led to straight advertising on our Discord or even attempts to catfish my account.

Opinion was generally split: some people shared my vision of Pumpkin reaching the top, while others believe Pumpkin can never replace Vanilla/Paper servers.

The real problems began when I experienced burnout for the first time. Reflecting back, this is exactly what is expected when working every single day on a project. This was definitely a difficult period, especially since it was the time when many community members joined and expected regular updates and commits.

Recovery from the burnout took about a month. I felt very sick at that time, and my body really tried to protect me from doing any work. I also still had a life to live I'm still going to school, going to the gym, doing homework, and wanting to keep personal relationships. Many of these things often take more time than expected, and they are things I enjoy.

That being said, the project was definitely hurt community-wise because of my inactivity and the lack of updates or merged PRs. To be honest, I feel bad about that myself. Because of this, we missed my initial plan of releasing Pumpkin in 2025.

### What about now?

The situation definitely improved a while ago, I'm still busy but I would say Pumpkin is in a good state as of now. Not perfect, but good. I still work a lot on the project sometimes maybe too much but the balance between work and life has gotten better.

We recently started PatchBukkit, which is pretty much fully maintained by BjornTheProgrammer. I’ve also found people who seem really motivated about the project and want to help, so we have formed a little team.

### Future

My plans are to release Pumpkin soon this time for real. I cannot give a specific date, but the list of things left to implement becomes smaller pretty much every day.

I would also love to expand the team. Trust me when I say I really feel bad being the "blocker" for anything, and I know from first-hand experience that without a team, it is very difficult and almost impossible to succeed long-term.

Ideally, I would want to work on Pumpkin full-time. Currently, this isn't possible since financial support is lacking, but it’s something to dream about.


### Last words

I read a blog post a bit ago by Nolan Lawson called [What it feels like to be an open-source maintainer](https://nolanlawson.com/2017/03/05/what-it-feels-like-to-be-an-open-source-maintainer/), and I really laughed at how much of it is true. I recommend checking his blog out.

Lastly, I want to thank all the contributors and sponsors supporting this project, but also everyone else who has supported the project in any way, shape, or form and kept me motivated! :heart: