---
title: Node.js Multi-Core Scaling
description: Make a single Node.js container use every CPU core on the host with PM2 cluster mode, using either Dockerfile or Nixpacks builds on Coolify.
---

# Node.js Multi-Core Scaling

A plain Node.js HTTP server runs its event loop on a single core, so `node server.js` in a Coolify container will only ever keep one CPU busy. This is a Node.js runtime characteristic — not a Coolify limit. Coolify containers have no default CPU cap, so the host's other cores are available; you just need to tell Node (or Bun) to use them.

This guide shows how to make one container use every core using **PM2 cluster mode** (Node.js) or **Bun's `reusePort`** — with examples for both the Dockerfile and Nixpacks build packs.

## Why a Plain Node Server Uses One CPU

- V8's event loop is single-threaded **per process**.
- libuv's thread pool (4 threads by default) offloads some I/O work, but your JavaScript still runs on a single core.
- To use more than one core you need either multiple processes inside the container, or a runtime that supports multi-process listeners (like Bun with `reusePort`).

## Options at a Glance

| Approach | Code Change | Notes |
| --- | --- | --- |
| PM2 cluster mode | None | Easiest; wraps your existing start command |
| Bun `reusePort` | One-line app change | Native multi-process HTTP in Bun |

## Dockerfile Example (PM2 Cluster Mode)

Use this when your app is built with the [Dockerfile build pack](/applications/build-packs/dockerfile).

```dockerfile
FROM node:lts-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev && npm install -g pm2

COPY . .

EXPOSE 3000
CMD ["pm2-runtime", "-i", "max", "dist/index.js"]
```

Key points:

- `pm2-runtime -i max` forks one worker per available CPU core and keeps PM2 in the foreground (required because Docker's PID 1 must not exit).
- Replace `dist/index.js` with your actual entry file.
- In Coolify, set **Ports Exposes** to `3000` (or whatever port your app listens on).

## Nixpacks Example

Use this when your app is built with the [Nixpacks build pack](/applications/build-packs/nixpacks).

### Option A — Environment Variable in the Coolify UI

Open your application → **Environment Variables** and add:

```
NIXPACKS_START_CMD=pm2-runtime -i max dist/index.js
```

Then add `pm2` to the `dependencies` section of `package.json` so Nixpacks installs it during the build.

### Option B — `nixpacks.toml` in the Repo Root

```toml
[phases.setup]
nixPkgs = ["nodejs", "pm2"]

[start]
cmd = "pm2-runtime -i max dist/index.js"
```

This keeps the multi-core configuration in version control and works for both local and Coolify builds.

## Bun Alternative (One-Line Multi-Core)

Bun's HTTP server can bind the same port across multiple processes using `SO_REUSEPORT`. Run N Bun processes and the kernel load-balances incoming connections between them.

### App Code

```js
Bun.serve({
  port: 3000,
  reusePort: true,
  fetch(req) {
    return new Response("Hello from Bun");
  },
});
```

### Dockerfile

```dockerfile
FROM oven/bun:alpine

WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --production

COPY . .

EXPOSE 3000
# Spawn one Bun process per available core.
CMD ["sh", "-c", "for i in $(seq 1 $(nproc)); do bun run server.js & done; wait"]
```

### Nixpacks (`nixpacks.toml`)

```toml
[phases.setup]
nixPkgs = ["bun"]

[start]
cmd = "sh -c 'for i in $(seq 1 $(nproc)); do bun run server.js & done; wait'"
```

Notes:

- `reusePort: true` requires Linux kernel ≥ 3.9 (all modern distros).
- Each Bun process is independent — there's no primary/worker IPC, so use Redis or a database for shared state.
- Simpler than PM2 but has no built-in auto-restart per worker; pair with Docker's `restart: unless-stopped` (Coolify's default) for crash recovery of the parent shell.

## Caveats

::: warning In-Process State Does Not Scale
Workers do **not** share in-process memory. Sessions, in-memory caches, rate-limit counters, and WebSocket connection maps must move to Redis or another external store.
:::

- **WebSockets:** connections are split across workers. Use sticky sessions at the proxy layer, or move pub/sub to Redis so any worker can deliver messages.
- **Graceful shutdown:** honor `SIGTERM` in each worker. PM2 does this automatically.
- **Memory:** scales roughly linearly — N workers ≈ N × single-process RSS. Size the server accordingly.
- **Log output:** PM2 merges logs across workers; with Bun's `reusePort` approach each process writes independently, which may interleave. Prefer structured JSON logs.

## Verifying Multi-Core Use

After deploying, SSH to the Coolify server and check inside the running container:

```bash
docker exec -it <container> top
```

You should see multiple `node` (or `bun`) processes. Hit the app under load (for example with `autocannon -c 200 http://<host>:3000/`) and confirm that `htop`/`top` shows load spread across all host cores, not pegged on one.
