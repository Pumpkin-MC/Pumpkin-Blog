---
date: 2026-02-20
author:
  name: RoosterBooster007
  url: https://github.com/RoosterBooster007
title: Update - 20th February 2026
---

### Keeping the Momentum Going

Hey everyone, RB007 here. Last week, Purdze gave an awesome rundown of the vision behind Pumpkin and the massive strides we made in a single week. This week, it’s my turn to step up to the plate. Building a Minecraft server from scratch in Rust is no small feat—it takes patience, an obsession with performance, and a whole lot of trial and error. 

But looking at what we’ve accomplished over the last seven days? It’s completely worth it. We merged another **41 pull requests** between February 14th and February 20th. Let’s dive right into what’s new, because the world of Pumpkin is getting a lot more lively.

### Mobs are Coming Alive

If you log into Pumpkin today, the world won't feel so empty anymore. Purdze went on an absolute tear this week, implementing a massive chunk of Animal AI. 

Cows, Sheep, Chickens, Bats, and Cats now populate the world ([#1605](https://github.com/Pumpkin-MC/Pumpkin/pull/1605), [#1604](https://github.com/Pumpkin-MC/Pumpkin/pull/1604), [#1606](https://github.com/Pumpkin-MC/Pumpkin/pull/1606), [#1580](https://github.com/Pumpkin-MC/Pumpkin/pull/1580), [#1612](https://github.com/Pumpkin-MC/Pumpkin/pull/1612)). But they don't just stand there—they actually have goals now. I should mention that goal tracking and AI behaviors are still very much a WIP, so the mobs don't fully work flawlessly just yet, but a massive amount of the groundwork is finally there. We're actively building out their ability to breed, follow their owners or parents, beg, avoid certain entities, and react when their owner gets hurt ([#1607](https://github.com/Pumpkin-MC/Pumpkin/pull/1607)-[#1615](https://github.com/Pumpkin-MC/Pumpkin/pull/1615)). 

Oh, and watch your step: creepers explode now ([#1575](https://github.com/Pumpkin-MC/Pumpkin/pull/1575)). Aw man.

### World Interactions & Mechanics

We’ve also added a ton of crucial block and item mechanics that make the world behave exactly as you'd expect:
- **Boats**: Full boat implementation is in, thanks to Purdze ([#1440](https://github.com/Pumpkin-MC/Pumpkin/pull/1440)). 
- **Collisions**: GreenedDev added Wither rose collision ([#1590](https://github.com/Pumpkin-MC/Pumpkin/pull/1590)), and JustMarfix tackled cobweb blocks and their slow-down collision ([#1560](https://github.com/Pumpkin-MC/Pumpkin/pull/1560)). 
- **Visuals & Immersion**: KsawierWilczynski implemented firework data components ([#1548](https://github.com/Pumpkin-MC/Pumpkin/pull/1548)), and tylercritchlow made sure entity eye heights are now dynamically set ([#1503](https://github.com/Pumpkin-MC/Pumpkin/pull/1503)).
- **World Generation Hooks**: yunuservices brought in the blender biome supplier hook ([#1508](https://github.com/Pumpkin-MC/Pumpkin/pull/1508)).
- **Localization**: Huge shoutout to Axillux for bringing Russian and Ukrainian translations to the server ([#1586](https://github.com/Pumpkin-MC/Pumpkin/pull/1586)).

### Bug Squashing & Stability

A server is only as good as its stability. We dedicated a lot of time to tracking down edge cases and weird vanilla quirks. 

I managed to get inventory saving and loading completely sorted out ([#1582](https://github.com/Pumpkin-MC/Pumpkin/pull/1582)), as well as proper lava and fire behavior ([#1509](https://github.com/Pumpkin-MC/Pumpkin/pull/1509)). Here are some of the other massive fixes from our community:

- **Performance**: Purdze resolved a nasty bug causing constant CPU core load after a player joined ([#1573](https://github.com/Pumpkin-MC/Pumpkin/pull/1573)). 
- **Inventory Quirks**: AnthonyDuong1 fixed double-click behaviors on empty slots ([#1595](https://github.com/Pumpkin-MC/Pumpkin/pull/1595)) and creative item dragging/middle-clicking in chests ([#1585](https://github.com/Pumpkin-MC/Pumpkin/pull/1585)). 
- **Combat & Damage**: TheRealMusawer fixed spectator explosion immunity and TNT fuse underflows ([#1588](https://github.com/Pumpkin-MC/Pumpkin/pull/1588)), Purdze preserved knockback velocity on the killing blow ([#1591](https://github.com/Pumpkin-MC/Pumpkin/pull/1591)) and proper armor stand damage ([#1574](https://github.com/Pumpkin-MC/Pumpkin/pull/1574)). PrintedScript also made sure dead mobs can no longer attack you from the grave ([#1549](https://github.com/Pumpkin-MC/Pumpkin/pull/1549)).
- **Fluids & Physics**: Purdze squashed multiple fluid flow bugs ([#1561](https://github.com/Pumpkin-MC/Pumpkin/pull/1561)) and fixed waterlogged blocks not acting as water sources ([#1563](https://github.com/Pumpkin-MC/Pumpkin/pull/1563)). chocodev11 corrected item drop velocities ([#1584](https://github.com/Pumpkin-MC/Pumpkin/pull/1584)) and entity teleportation ([#1556](https://github.com/Pumpkin-MC/Pumpkin/pull/1556)). 
- **And more**: Improvements to level.dat deserialization ([#1568](https://github.com/Pumpkin-MC/Pumpkin/pull/1568)), campfire logic matching vanilla ([#1576](https://github.com/Pumpkin-MC/Pumpkin/pull/1576) - GreenedDev), log file rotation ([#1565](https://github.com/Pumpkin-MC/Pumpkin/pull/1565) - Solitarju), chunk ACK stalls ([#1558](https://github.com/Pumpkin-MC/Pumpkin/pull/1558) - yunuservices), and preventing subtraction overflows ([#1511](https://github.com/Pumpkin-MC/Pumpkin/pull/1511) - tylercritchlow).

### A Massive Shift for Plugins: Hello WASM!

On the ecosystem front, we have a major announcement: **Server plugins are switching to WASM (WebAssembly)** for better compatibility and security! This is a massive step forward for our API ecosystem.

If you see BjornTheProgrammer, thank him for his insane work here.

To support the growing plugin architecture, Purdze also added brand-new plugin events for entity interaction, block placement ([#1572](https://github.com/Pumpkin-MC/Pumpkin/pull/1572)), and permission checking ([#1671](https://github.com/Pumpkin-MC/Pumpkin/pull/1671)).

### The Expanding Pumpkin Ecosystem

Pumpkin isn't just about the core server anymore. We've got two new exciting releases to help you manage your instances (thanks to Purdze):
- **Sprout v1.0.3**: The first official release of a sleek GUI management portal is now available! Grab it here: [Sprout v1.0.3 Release](https://github.com/Purdze/Sprout/releases/tag/v1.0.3)
- **Gourd v0.1.0**: The first release of a dedicated proxy is out too! Check it out: [Gourd v0.1.0 Release](https://github.com/Purdze/Gourd/releases/tag/v0.1.0)

### Pumpkin on YouTube!

To top it all off, PumpkinMC officially has a new YouTube channel! We'll be posting updates, showcases, and development logs there. Make sure to subscribe at [@PumpkinServer](https://www.youtube.com/@PumpkinServer). 

Check out our latest video below to see some of the new features in action:
https://youtu.be/Zz6YbXRX7d8

This video covers several updates to the Pumpkin server over the last two weeks.

### Final Thoughts

To echo what Purdze said last week, the best part of this project is the community. We hit **41 PRs merged this week**, which is just phenomenal. It's even more than last week! 🎉

A massive thank you to everyone who contributed code, reported bugs, tested features, or just engaged with us in the Discord. Whether you're opening a pull request or just pointing out a typo in our docs, you are part of making this server a reality. Let's keep building the future of Minecraft servers together. 

See you all next week!