---
date: 2026-02-13
author:
  name: Purdze
  url: https://github.com/Purdze
title: Update - 13th February 2026
---

### Who Am I?

Hey, I'm Purdze. I'm newer to the Pumpkin project than most of the team, but from the moment I found it, I saw the vision. A Minecraft server written in Rust, built from scratch, designed to actually be good. Not just a port or a wrapper, but something that rethinks how a server should work. That passion is what got me contributing, and it's what keeps me here.

Alex wrote the first blog post explaining why Pumpkin exists. This one is different. I want to talk about what's actually happening right now, because honestly, a lot is happening.

### 40 PRs in One Week

This past week we merged **40 pull requests**. Forty. For context, that's not a huge team doing this. It's a growing community of contributors who care about getting Minecraft right, one system at a time.

Let me walk through the highlights.

### Lighting

RoosterBooster007 landed the lighting system along with a refactored chunk system ([#1431](https://github.com/Pumpkin-MC/Pumpkin/pull/1431)). This was a big one. Lighting is one of those things that seems simple until you actually have to implement it. Block light propagation, sky light, and making it all work with the chunk pipeline without tanking performance. It's in, and it works.

### Mob Pathfinding

vyPal brought in a basic pathfinder implementation based on vanilla's logic ([#1456](https://github.com/Pumpkin-MC/Pumpkin/pull/1456)). Mobs can now actually navigate the world. It's the foundation, not the full vanilla AI yet, but having proper A* pathfinding with node evaluation is a major step toward mobs that feel real.

### Packet Performance

chocodev11 reworked packet encoding, decoding, and compression ([#1517](https://github.com/Pumpkin-MC/Pumpkin/pull/1517)). This is the kind of unglamorous work that makes a massive difference. When you're handling hundreds of players, every microsecond in the packet pipeline matters. The new approach is cleaner and faster.

### Redstone Progress

Rorical added redstone power support for fence gates ([#1534](https://github.com/Pumpkin-MC/Pumpkin/pull/1534)) and fixed piston ghost blocks, block swapping, and retraction desync ([#1535](https://github.com/Pumpkin-MC/Pumpkin/pull/1535)). Redstone is probably the most complex system in Minecraft, and getting it right piece by piece is exactly how it needs to be done. Pistons that actually work without ghost blocks? That's a win.

### Getting the Basics Right

A lot of this week was about polish and correctness:

- **Collision fixes**: JustMarfix fixed entity collision ([#1522](https://github.com/Pumpkin-MC/Pumpkin/pull/1522)) and added sweet berry bush collision with movement slowdown ([#1547](https://github.com/Pumpkin-MC/Pumpkin/pull/1547))
- **Block placement**: chocodev11 fixed block placement to check all entity hitboxes, not just players ([#1494](https://github.com/Pumpkin-MC/Pumpkin/pull/1494))
- **Player pose**: aShanki aligned player pose resolution with vanilla so you don't take damage from crawling into walls ([#1464](https://github.com/Pumpkin-MC/Pumpkin/pull/1464))
- **Water flow**: I fixed water not spreading correctly ([#1461](https://github.com/Pumpkin-MC/Pumpkin/pull/1461))
- **Trapdoors**: MusawerGaming fixed trapdoor placement to match vanilla behavior ([#1545](https://github.com/Pumpkin-MC/Pumpkin/pull/1545))

These might not sound exciting individually, but they're what separate "a server that technically runs" from "a server that feels like Minecraft."

### Plugin System

xStarless-Skyx implemented custom payload packet support ([#1536](https://github.com/Pumpkin-MC/Pumpkin/pull/1536)). This is important for the plugin ecosystem. Custom payloads are how mods and plugins communicate custom data between client and server. Things like voice chat mods, minimaps, and custom UIs all rely on this.

### Quality of Life

- denys-shatin added sleep percentage ([#1527](https://github.com/Pumpkin-MC/Pumpkin/pull/1527)), world names ([#1521](https://github.com/Pumpkin-MC/Pumpkin/pull/1521)), and player samples in the server list ([#1519](https://github.com/Pumpkin-MC/Pumpkin/pull/1519))
- GreenedDev made the console output colorful ([#1531](https://github.com/Pumpkin-MC/Pumpkin/pull/1531)). Small thing, but it makes development so much nicer
- Laptop59 added the string reader from Brigadier ([#1427](https://github.com/Pumpkin-MC/Pumpkin/pull/1427)), bringing us closer to full command parsing

### Bug Squashing

RoosterBooster007 went on a fixing spree: fire loop crashes ([#1502](https://github.com/Pumpkin-MC/Pumpkin/pull/1502)), totem behavior ([#1500](https://github.com/Pumpkin-MC/Pumpkin/pull/1500)), void damage ([#1488](https://github.com/Pumpkin-MC/Pumpkin/pull/1488)), fall damage death loops ([#1447](https://github.com/Pumpkin-MC/Pumpkin/pull/1447)), and door drops ([#1445](https://github.com/Pumpkin-MC/Pumpkin/pull/1445)). That's five bug fixes from one person in one week. yunuservices tackled chunk visibility issues ([#1510](https://github.com/Pumpkin-MC/Pumpkin/pull/1510)) and screen handler lock inversion ([#1466](https://github.com/Pumpkin-MC/Pumpkin/pull/1466)). I fixed container screens not closing when their block is destroyed ([#1539](https://github.com/Pumpkin-MC/Pumpkin/pull/1539)) and jukebox music disc handling ([#1438](https://github.com/Pumpkin-MC/Pumpkin/pull/1438)).

### Documentation

illyrius666 improved documentation across pumpkin-config, pumpkin-macros, and pumpkin-api-macros ([#1449](https://github.com/Pumpkin-MC/Pumpkin/pull/1449), [#1450](https://github.com/Pumpkin-MC/Pumpkin/pull/1450), [#1451](https://github.com/Pumpkin-MC/Pumpkin/pull/1451)). Documentation doesn't get enough credit. It's what makes a project approachable for new contributors.

### What's Coming

Looking at what's currently in the pipeline: trapped chests with redstone ([#1550](https://github.com/Pumpkin-MC/Pumpkin/pull/1550)), bell blocks ([#1542](https://github.com/Pumpkin-MC/Pumpkin/pull/1542)), firework data components ([#1548](https://github.com/Pumpkin-MC/Pumpkin/pull/1548)), dependency cleanup ([#1540](https://github.com/Pumpkin-MC/Pumpkin/pull/1540)), dead mob attack prevention ([#1549](https://github.com/Pumpkin-MC/Pumpkin/pull/1549)), and more entity/attribute work ([#1526](https://github.com/Pumpkin-MC/Pumpkin/pull/1526)). The pace isn't slowing down.

### Beyond the Server

Pumpkin isn't just a server anymore. The ecosystem around it is growing too.

[**PatchBukkit**](https://github.com/Pumpkin-MC/PatchBukkit) is coming along slowly but steadily. The goal is Bukkit API compatibility, so existing Java plugins can run on Pumpkin without being rewritten. It's a massive undertaking, but it's the bridge that will let server owners migrate without throwing away their entire plugin setup.

**Sprout** is a GUI management portal for those who prefer a visual experience over the command line. Not everyone wants to SSH into a box and edit config files. Sprout gives you a clean interface to manage your Pumpkin server.

And finally, **a proxy built specifically for Pumpkin** is close to release. Purpose-built rather than adapted from existing solutions, it's designed to work seamlessly with Pumpkin's architecture from the ground up.

### Final Thoughts

What I love about this project is that it's not just one person grinding away. It's a community building something together. Forty PRs from over 15 different contributors in a single week. That's real momentum.

If you've been watching from the sidelines and want to jump in, now is a great time.

Thanks to everyone who contributed this week. You're all making this happen.
