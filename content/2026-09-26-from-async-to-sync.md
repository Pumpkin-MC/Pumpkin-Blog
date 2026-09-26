---
title: "From Async to Sync"
date: "2026-09-26"
author:
  name: Alexander Medvedev
  url: https://github.com/Snowiiii
description: "Many Rust developers assume async is always faster. In Pumpkin, using Tokio for entity ticking and game logic was one of our biggest early mistakes. Here is why we rewrote the core loop to be synchronous—and how Rayon changed everything."
---

If you spend any time in the modern Rust ecosystem, you will hear a universal gospel preached across every blog post, Reddit thread, and Discord server:

*"Use Tokio. Make it async. Async Rust is blazingly fast."*

When we first started building Pumpkin, we fell for this trap hook, line, and sinker. The reasoning felt airtight at the time: Pumpkin is a high-performance Minecraft server written from scratch in Rust. We wanted it to handle thousands of entities, dozens of players, and massive worlds without breaking a sweat. Tokio handles millions of concurrent web connections—so naturally, making everything in Pumpkin `async` had to be the secret sauce for raw performance. Right?

Wrong. In fact, it was probably the single worst architectural decision we made in the early days of the project.

Over the last few months, we undertook a massive, grueling, four-part refactor to rip `async` and `.await` completely out of our game loop, our entity ticking, our inventory management, and our commands.

Here is the honest story of why async game loops are a trap, why Tokio and Rayon solve two completely opposite problems, and how moving from async to synchronous ticking made Pumpkin faster, cleaner, and drastically more stable.

---

### "Async = Fast"

The fundamental mistake so many Rust developers make (and the one we made) comes from misunderstanding what `async` is actually designed to do.

In web backends, microservices, and proxy servers, asynchronous runtimes like Tokio are unbeatable. Why? Because web servers spend 99% of their lifespan doing absolutely nothing. A request comes in, the server fires off a SQL query or reads a file from disk, and then it waits. While waiting on network sockets or disk I/O, the operating system thread doesn't need to sit idle. Tokio uses non-blocking I/O primitives (`epoll` on Linux, `kqueue` on macOS, `io_uring`) so a tiny handful of worker threads can juggle tens of thousands of idle connections concurrently.

That is **I/O-bound concurrency**.

A game server, however, is a completely different beast.

A Minecraft server operates on a fixed heartbeat—20 ticks per second. That gives you exactly **50 milliseconds** per tick to update the entire universe. And here is the crucial realization we completely missed at the beginning:

**By the time a game tick starts, all network packets are already buffered in memory.**

During those 50 milliseconds, you aren't making HTTP requests. You aren't waiting on a database query. You aren't waiting on slow network packets. You are:
- Looping over hundreds of living mobs.
- Computing bounding box collisions.
- Running pathfinding algorithms and line-of-sight raycasts.
- Updating physics, velocity, and gravity.
- Checking crafting recipes and slot states.

Every single one of these tasks is **100% CPU-bound**.

When you write CPU-bound simulation code inside Tokio tasks, you aren't doing non-blocking I/O. You are asking an asynchronous event loop to schedule raw computation. And that is where the nightmare begins.

---

### Tokio vs. Rayon

To understand why this hurt us so badly, you have to look at the architectural difference between **Tokio** and **Rayon**.

| Aspect | Tokio | Rayon |
| :--- | :--- | :--- |
| **Primary Goal** | Asynchronous I/O multiplexing | Data-parallel CPU computation |
| **Work Unit** | `Future` / Asynchronous Task | Work-stealing task / Iterator chunk |
| **Yield Mechanism** | Explicit `.await` on I/O or timers | Work-stealing across physical cores |
| **Allocation Cost** | Future state-machines, task queues | Zero allocation across stack slices |
| **Ideal Workload** | Sockets, WebSockets, DB queries, Timers | Matrix math, physics, pathfinding, raycasts |

#### Ticking Entities with Tokio
At our worst point, we were literally spawning Tokio tasks for entities:

```rust
// The naive async past: Spawning Tokio tasks per entity
for entity in entities_to_tick.iter() {
    let e = entity.clone();
    tasks.spawn(async move {
        e.tick().await;
    });
}
```

Think about what this actually does under the hood.

Every single tick, for every single entity in the world, Tokio has to allocate a `Future` state machine, push it onto a task queue, notify worker threads, and context-switch into it. When an entity finishes updating its coordinates 4 nanoseconds later, Tokio has to clean up that task and coordinate its completion.

We were spending more CPU cycles inside Tokio's runtime scheduler managing task queues and waking futures than the actual entities spent calculating their physics!

Even worse: Tokio worker threads rely on tasks voluntarily yielding via `.await`. If an entity pathfinding calculation takes 2 milliseconds of pure CPU crunching without awaiting an I/O event, it **starves the Tokio worker thread**. Other tasks queued on that thread—including reading incoming TCP packets from real players—get blocked behind it!

#### What Rayon Does Instead
Rayon doesn't care about futures, event loops, or `.await`. Rayon is a pure data-parallel work-stealing thread pool.

Rayon spins up a thread pool that matches your physical CPU cores. When you give it a slice of entities, it divides the slice among available cores:

```rust
// The synchronous present: Straightforward Rayon data parallelism
tickable
    .par_chunks(ENTITY_TICK_BATCH_SIZE)
    .for_each(|batch| {
        for (entity, _) in batch {
            entity.tick(entity.as_ref(), server_ref);
        }
    });
```

There are no heap-allocated state machines. There is no runtime polling. There are no yield points. The threads just burn through the batches sequentially on the CPU with fantastic L1/L2 cache locality. If core 3 finishes its chunk of 16 zombies before core 2 finishes its creepers, core 3 instantly steals work from core 2's queue.

It is direct, unadulterated CPU throughput.

---

### Wrapping Everything in Arc<Mutex>

The performance penalty of Tokio tasks was bad, but the damage async did to our codebase architecture was even worse.

In Rust, the borrow checker is your best friend. If you have synchronous code, you can pass a `&mut World` or `&mut Entity` down the stack, update whatever you need, and the compiler guarantees at compile time that nothing else is mutating it. Zero runtime overhead.

The moment you mark a function as `async`, you lose this superpower.

Because an `async fn` can yield at an `.await` point and resume on a completely different OS thread, you cannot easily hold a normal mutable reference across that boundary without running into `!Send` compile errors.

So what do developers do when the compiler screams at them?

**They wrap everything in `Arc<Mutex<T>>`.**

It started innocently with `Arc<Mutex<Player>>`. But async is a virus. If player interaction is async, then opening a chest is async. If opening a chest is async, then accessing a slot is async.

At one point in Pumpkin, we literally had **per-slot `Arc<Mutex<ItemStack>>` in player inventories**.

Just imagine what happened when a player crafted an item or sorted a chest:
1. Lock slot 0 asynchronously.
2. Await lock on slot 1.
3. Await lock on slot 2.
4. Risk lock contention with the main tick thread or another packet handler.
5. Pray you don't hit an async deadlock because two tasks acquired slot locks in reverse order.

It was madness. Reading a simple inventory required locking dozens of individual mutexes across multiple async boundaries. What should have been a 5-nanosecond array lookup turned into a festival of atomic CAS operations, thread parking, and cache line invalidation.

---

### async_trait, Box<Pin>, and Compile Hell

It wasn't just runtime performance that suffered—the developer experience became completely miserable.

For a long time, contributors rightfully complained about how painful it was to work on Pumpkin. Want to add a simple command? Want to implement a new entity goal, or handle a block interaction? You had to wade through thick layers of async boilerplate, confusing lifetime annotations, and compiler errors that stretched across three terminal screens.

And then came the dynamic dispatch problem. Because Rust didn't support native `async fn` in traits for `dyn Trait` objects, we had to figure out how to make our entity, block, and command traits async.

1. **First, we slapped `#[async_trait]` on everything.**  
   At first, this felt like an easy fix. But as the codebase grew to hundreds of entities, blocks, and packet types, `#[async_trait]` brought our compile times to their knees. Every single trait method was expanding into proc-macro-generated code, boxing futures behind the scenes, and blowing up LLVM codegen times. Clean builds took an eternity, and incremental compilation ground to a crawl. Contributors were waiting minutes just to see if a tiny one-line change compiled.

2. **Then, we tried to escape it with manual `Box<Pin<dyn Future<...>>>`.**  
   In a desperate attempt to shave off macro overhead and regain control over compilation times, we started manually desugaring trait return types. Suddenly, almost every trait method in Pumpkin was littered with this hideous monstrosity:
   ```rust
   fn tick<'a>(&'a mut self, world: &'a World) -> Pin<Box<dyn Future<Output = ()> + Send + 'a>>
   ```
   If you have ever tried explaining that signature to a new open-source contributor who just wanted to add a simple mob mechanic, you know the feeling of pure despair. Writing new features felt like playing 4D chess against the borrow checker and the type system while blindfolded. New contributors would open a PR, get buried under unreadable lifetime diagnostics and trait bound mismatches, get frustrated, and leave.

Our architecture was actively driving contributors away. That was our biggest wake-up call: we couldn't just keep patching over it with clever macros or manual pin-boxing. The design was fundamentally broken from the beginning, and async had no business being in those traits.

---

### Four Parts from Async to Sync

By mid-2026, we stopped making excuses. We realized that no amount of profiling or micro-optimization would fix the fact that our core architecture was fighting the hardware.

We sat down and systematically dismantled the async loop across four major milestones:

1. **Part 1: The Core Game Loop (`World::tick`):** We converted the world tick, player ticking, and entity loops from `async fn` to plain, synchronous `fn`.
2. **Part 2: Entities & Projectiles:** We refactored all entity goals, AI routines, and projectile movements to synchronous execution. No more `JoinSet` allocations for mob updates.
3. **Part 3: Inventories & Commands:** We completely eliminated the per-slot `Arc<Mutex<ItemStack>>` locks. Inventories moved to clean, container-level synchronization with synchronous screen handlers. Commands no longer return futures.
4. **Part 4: Block Entities & World Actions:** Furnaces, chests, brewing stands, and hoppers were transitioned to synchronous ticks.

Alongside this, we made another critical move: **offloading chunk serialization, region compression, and packet encoding completely off Tokio workers and onto dedicated Rayon pools.**

---

### Where Tokio and Rayon Belong

We didn't delete Tokio from Pumpkin. Tokio is still an essential, beloved foundation of our server. But we finally drew a firm, uncrossable line between where Tokio belongs and where Rayon belongs:

#### Tokio at the Edge
Tokio handles the raw network connections. It listens on TCP and UDP sockets, negotiates TLS, handles Bedrock RakNet packets, performs Mojang/Bedrock authentication over HTTP, and streams raw bytes. When a packet arrives, Tokio decodes the header and places the raw packet into an in-memory queue.

#### Rayon in the Game Loop
When the dedicated 50ms tick timer fires, the server ticker executes **synchronously**:
- It pulls queued packets from memory.
- It executes entity ticks in parallel batches of 16 using Rayon's `par_chunks`.
- It processes player movements, collisions, block placements, and crafting recipes using plain Rust references (`&` and `&mut`).
- Once finished, outgoing packets are pushed to network buffers for Tokio to flush asynchronously to the sockets.

---

### What We Gained

The results of this transition blew away even our most optimistic expectations:

- **Massive Drop in Tick Duration:** Ticking hundreds of entities no longer fluctuates wildly. The scheduler overhead disappeared, reducing baseline entity tick times by several orders of magnitude.
- **Zero Mutex Contention:** By moving inventory and entity state to synchronous container-level ownership, we eliminated hundreds of `Arc<Mutex>` locks. Code that used to spend milliseconds waiting on lock contention now executes in nanoseconds.
- **Predictable 20 TPS:** The game loop no longer starves when complex pathfinding or physics calculations run. CPU-heavy work is executed across Rayon's worker threads without blocking incoming network packets.
- **Saner, Cleaner Code:** We deleted thousands of lines of boilerplate. Gone are the endless `.await` calls, `ArcSwap` acrobatics, and complex async trait wrappers. The codebase looks like idiomatic, clean Rust again.

---

### Don't Cargo-Cult Async

If you are building a game server, an emulator, a physics engine, or any real-time simulation in Rust, take this as our cautionary tale:

**Do not cargo-cult async.**

Async Rust is an extraordinary tool for multiplexing I/O over network sockets and file handles. But the moment you let `async` leak into your core simulation loop, you are paying a massive tax in runtime allocation, scheduler overhead, and lock proliferation for a benefit that doesn't exist.

Use **Tokio** for the wire. Use **Rayon** for the world. Keep your game loop synchronous, let the CPU do what it does best, and trust the borrow checker.
