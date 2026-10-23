---
title: "PatchBukkit Update: Headless Paper, Real NMS, and Running Major Plugins on Pumpkin"
date: "2026-10-23"
author:
  name: Alexander Medvedev
  url: https://github.com/Snowiiii
description: "A deep dive into PatchBukkit's new architecture: moving away from mocking the Bukkit API to running a headless Paper server, unlocking real NMS support, and running WorldEdit, EssentialsX, GrimAC, and VeinMiner on top of Rust."
---

When we set out to build Pumpkin, the vision was clear: build a blazingly fast, multithreaded Minecraft server from scratch in Rust. But anyone who has ever managed a production Minecraft network knows there is an 800-pound gorilla in the room:

**The 15-year-old Java plugin ecosystem.**

Server administrators don't just want raw ticks-per-second and memory safety, they want their permissions, their region protection, their economy setups, their building brushes, and their protocol tools. They rely on plugins like EssentialsX, WorldEdit, LuckPerms, and PacketEvents. Telling server owners to abandon that entire ecosystem and start from scratch with custom plugins was never going to fly.

That is why we created **PatchBukkit**: a native Pumpkin plugin that bridges Pumpkin's high-performance Rust core with Java's Bukkit, Spigot, and Paper plugin APIs.

Today, we are announcing PatchBukkit's most significant update yet. We have completely discarded our old approach and rewritten the system to boot a **real, headless Paper server** with full `net.minecraft.server` (NMS) support, high-speed memory bridges, and an emulated network pipeline.

Even better: we are already successfully running 17 major plugins, including **EssentialsX**, **WorldEdit**, **GrimAC / PacketEvents**, and **VeinMiner**, simultaneously on a live Pumpkin server.

Here is the story of why our initial approach hit a wall, how running Paper headlessly changed everything, and how we got some of the most complex Java plugins in existence running smoothly on top of Rust.

---

### Why Mocking Failed

In the early days of PatchBukkit, our strategy seemed straightforward: implement the Bukkit and Paper API interfaces from scratch in Java, package them into a library, and route calls down to Pumpkin over native bridges.

It was a classic clean-room implementation. For simple plugins that only listened to player join events or sent basic chat messages, it worked fine.

Then we tried loading real, production plugins.

The harsh reality of the Minecraft server ecosystem is that **the Bukkit API is only the tip of the iceberg**. Almost no advanced plugin strictly adheres to clean API boundaries:
- **WorldEdit** doesn't casually call high-level block methods. It reaches straight down into raw Minecraft server internals (NMS) and manipulates block states directly.
- **GrimAC**, **PacketEvents**, and **ProtocolLib** don't wait for Bukkit events. They look up player network connections, tap directly into the low-level communication pipeline, and intercept raw network packets.
- **LuckPerms**, **Vault**, and **EssentialsX** inspect server metadata, datapack registries, and internal scheduler state.
- Nearly every plugin expects authentic registries for biomes, enchantments, damage types, and sound events.

Attempting to hand-mock all of this became an impossible nightmare. Our mock server code ballooned to thousands of lines of stubbed methods. We were constantly writing dummy classes, fake data wrappers, and mock registry accessors.

Every time we tested a new plugin, it would crash because it touched some obscure internal field or method that we hadn't mocked yet. We were playing an endless game of whack-a-mole.

We realized we needed to stop trying to fake Paper and instead embrace it.

---

### The New Architecture: Running a Headless Paper Server

If plugins require authentic Paper and authentic Minecraft internals to function, why not just give them the real thing?

In our latest update, we completely removed thousands of lines of mock server code. Instead, PatchBukkit now **boots a real Paper server headlessly inside the JVM**.

```
+-----------------------------------------------------------+
|                   Pumpkin (Rust Core)                     |
|  - World simulation, physics & entity ticking             |
|  - Network connections & player sessions                  |
+-----------------------------+-----------------------------+
                              |
              [High-Speed Rust <-> Java Bridge]
                              |
+-----------------------------v-----------------------------+
|               PatchBukkit (Embedded Java)                 |
|                                                           |
|  +-----------------------------------------------------+  |
|  |                Headless Paper Server                |  |
|  |  - Full NMS support & vanilla registries            |  |
|  |  - Real CraftBukkit types & datapack tags           |  |
|  +-----------------------------------------------------+  |
|  |            Dynamic State Synchronization            |  |
|  |  - World blocks, entities, players, inventories     |  |
|  |  - Commands & event dispatching                     |  |
|  +-----------------------------------------------------+  |
|  |               Virtual Network Pipeline              |  |
|  |  - Channel emulation for packet & protocol tools   |  |
|  +-----------------------------------------------------+  |
|                                                           |
|     [EssentialsX]   [WorldEdit]   [GrimAC]   [VeinMiner]  |
+-----------------------------------------------------------+
```

#### Automatic and Legal Setup via Paperclip

Pumpkin and PatchBukkit are open-source and do not redistribute Mojang's proprietary code. To solve this legally and automatically, PatchBukkit handles Paper setup right at runtime.

On first boot:
1. PatchBukkit queries PaperMC's official API for the configured Minecraft version and build.
2. It downloads the official Paperclip installer and verifies its integrity with a SHA-256 checksum.
3. It runs the patch process locally in a cache directory, applying Paper's patches to generate the authentic server jar and libraries.
4. PatchBukkit automatically loads those jars onto the classpath before starting the Java worker.

No manual downloads or complicated setups required.

#### Headless Bootstrapping

Once the dependencies are loaded, PatchBukkit boots Paper headlessly:
- It runs the complete bootstrap sequence, initializing all vanilla registries, including biomes, enchantments, damage types, and datapack tags.
- It provides authentic server and world instances that plugins expect.
- It isolates all Paper configuration files (`bukkit.yml`, `spigot.yml`, `paper.yml`, `server.properties`) inside a dedicated `patchbukkit/` folder, keeping Pumpkin's own root directory clean.

Crucially: **Paper's network listeners and game ticking loops are never started**. Paper runs purely as an in-memory backend that provides authentic Minecraft internals, registries, and plugin loaders.

#### First-Class Java Dependency Support

Another major benefit of running authentic Paper is that **all Java dependencies just work**, exactly like they do on standard Bukkit or Paper.

Modern plugins frequently rely on external libraries, runtime Maven dependencies, and packaged database drivers. In PatchBukkit, all of these dependencies load onto the classpath naturally. For instance, GeyserMC was able to use its packaged MySQL connector to handle database operations out of the box without requiring custom workarounds, shading hacks, or manual library juggling.

---

### Bridging the Worlds: Dynamic Synchronization

Running a headless server solves the compatibility problem: when a plugin asks for Minecraft internals, it gets real ones.

However, the actual world simulation and physics live in Pumpkin (Rust), not in Paper. If a plugin places a block, damages an entity, or inspects the world, that action has to happen in Pumpkin.

To synchronize state seamlessly, PatchBukkit dynamically hooks into Paper's internals at runtime:

- **World & Blocks**: Intercepts block placements, chunk queries, particles, and sound broadcasts, forwarding them directly to Pumpkin.
- **Entities & Players**: Synchronizes player movements, health, velocities, teleports, and equipment between Rust and Java.
- **Inventories**: Bridges player inventory clicks, container views, and item changes.
- **Commands**: Automatically registers commands from Bukkit plugins into Pumpkin's native command system.
- **Events**: Translates Pumpkin game events into authentic Paper events so plugin listeners trigger normally.

#### Smooth Threading & Low Latency

Paper includes strict internal checks ensuring game operations run on its expected main thread. Because PatchBukkit manages Java operations on its own dedicated worker thread, we dynamically adapt these checks so plugins can run smoothly without triggering unexpected crashes.

For communication between Rust and Java, we use direct, low-latency memory bridges. High-frequency operations, like checking block types, placing blocks, or updating player positions, bypass heavy serialization entirely, allowing Pumpkin and Java plugins to communicate at near-native speed.

---

### Supporting Packets/Protocol: The Virtual Network Pipeline

One of the biggest hurdles in plugin compatibility is supporting packet-level and protocol libraries. Many advanced plugins, such as **PacketEvents**, **ProtocolLib**, and packet-based tools like **GrimAC**, don't rely on standard Bukkit events. Instead, they look for raw network channels to intercept, listen to, and inject packets directly into the connection stream.

Because our Paper server is headless, no physical network sockets exist on the Java side, Pumpkin handles all networking in Rust.

To make packet-level plugins and protocol libraries work out of the box, PatchBukkit creates an **emulated network pipeline** for each player:
1. When a player connects to Pumpkin, PatchBukkit creates an authentic player handle with an emulated network channel containing the full Minecraft packet pipeline.
2. When Pumpkin receives network packets from a client, it forwards the raw packet data into this virtual channel.
3. Plugins using PacketEvents, ProtocolLib, or custom packet listeners intercept and analyze the packet stream exactly as if they were running on a standard Paper server.
4. When a plugin sends a packet back to the player, PatchBukkit catches it and routes it back through Pumpkin to be sent over the wire.

---

### In Practice: 17 Major Plugins Running Concurrently

Architectures sound good on paper, but the real test is whether popular plugins actually work. In our automated integration test suite, we load **17 plugins simultaneously** on a single live Pumpkin server:

#### 1. EssentialsX
EssentialsX is the backbone of thousands of servers, handling everything from economy to teleportation and player management.
- Console and player commands (`/eco`, `/balance`, `/baltop`, `/warps`, `/afk`, `/seen`, `/kit`) execute seamlessly.
- We also resolved player list ping handling, allowing EssentialsX to properly hide vanished players from server ping samples without warnings.

![EssentialsX running on Pumpkin](/images/patchbukkit/essentialsx-on-pumpkin.png)

#### 2. WorldEdit
WorldEdit is known for touching low-level world structures for fast editing.
- Selection tools (`//wand`, `//pos1`, `//pos2`) respond cleanly to player clicks.
- Region analysis commands (`/count`, `/distr`, `/size`, `/expand`, `/contract`) work accurately.
- Block modifications write directly into Pumpkin's world simulation.

<VideoPlayer src="/videos/patchbukkit/worldedit-on-pumpkin.mp4" caption="WorldEdit running on Pumpkin"></VideoPlayer>

#### 3. PacketEvents, Protocol & GrimAC
Packet and protocol plugins require tight timing and deep access to the raw network stream.
- PacketEvents and ProtocolLib inject directly into our virtual network pipeline without connection errors.
- GrimAC runs its predictive physics simulations, tracking sprinting states, movement trajectories, and combat packets directly against our virtual stream without false flagging or crashing.

![GrimAC running on Pumpkin](/images/patchbukkit/grim-on-pumpkin.png)

#### 4. VeinMiner
VeinMiner detects block-breaking chains when a player sneaks and mines an ore vein.
- When a player holding a pickaxe sneaks and breaks a block in a connected ore vein, VeinMiner triggers, identifies adjacent blocks, and clears the vein directly in Pumpkin's world.

<VideoPlayer src="/videos/patchbukkit/veinminer-on-pumpkin.mp4" caption="VeinMiner running on Pumpkin"></VideoPlayer>

#### 5. Permissions, World Guard, and Utilities
- **LuckPerms**: Complex permission inheritance, meta calculations, and command trees function smoothly.
- **WorldGuard**: Region flags, boundary checks, and build protections integrate cleanly.
- **AuraSkills**: Skill leveling, custom experience dispatch, and stat calculations.
- **Chunky & Multiverse-Core**: World pre-generation and multi-world coordination.
- **PlaceholderAPI, TAB, GSit, Vault Unlocked, and ViaVersion**: All load, register their services, and interact without conflicts.

---

### The Reality Check: What Still Needs Work

While loading 17 major plugins together and watching them run on Pumpkin is an incredible milestone, we want to be completely transparent: **many things are still broken and do not fully work yet**.

PatchBukkit is still an active, rapidly evolving work in progress. You will inevitably run into:
- Unimplemented or partially firing Bukkit events.
- Edge cases in entity AI, mob pathfinding, and combat mechanics that haven't been fully synchronized between Rust and Java yet.
- Complex custom inventory menus and drag-and-drop actions that behave unexpectedly.
- Plugins that load up and register commands fine, but encounter errors when touching unsupported world features.

Replicating 15 years of server platform quirks on top of a completely new Rust engine is a massive undertaking. We are testing and fixing edge cases every day, but please keep expectations realistic: this is an active effort, not yet a drop-in replacement for production servers.

---

### What's Next?

Adopting a headless Paper architecture has completely transformed PatchBukkit. Instead of spending months reverse-engineering and stubbing thousands of internal Minecraft classes, we can focus our efforts where they matter most: refining state synchronization, expanding game event coverage, and optimizing bridge performance.

Our roadmap for upcoming updates includes:
- **Expanded Entity AI Synchronization**: Deeper bridging of custom entity goals and pathfinding.
- **Advanced Menu & GUI Support**: Further hardening custom inventory click events and container interactions.
- **Dynamic Resource & Datapack Refinements**: Streamlining how custom plugin datapacks register into Pumpkin.

If you want to try PatchBukkit or follow development, check out the [PatchBukkit GitHub repository](https://github.com/Pumpkin-MC/PatchBukkit). You can drop the PatchBukkit plugin into your Pumpkin setup, add your favorite `.jar` plugins, and experience your existing plugin stack running on top of Rust.
