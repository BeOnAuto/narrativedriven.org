---
title: From Narratives to Running Code
---

# From Narratives to Running Code

NDD narratives don't just document your software. On the Auto platform, they generate it.

## The Pipeline

```
Narratives → Domain Model → GraphQL Schema → Server Scaffold → Frontend Scaffold → AI Implementation → Quality Checks → Production Code
```

Each stage validates against your specifications. The tests are deterministic and fixed. The path to passing them is adaptive: the AI retries, escalates to more capable models, or flags the specification for review.

## What Gets Generated

**From your narratives**, Auto derives a domain model: entities, commands, events, queries, and state projections.

**From the domain model**, it generates a GraphQL schema and an event-sourced server scaffold (currently Apollo + Emmett).

**From the scene classifications and interaction specs**, it generates frontend scaffolds (currently React + Vite + Tailwind CSS v4 + shadcn).

**AI agents** then implement the business logic and UI components, constrained by your specifications. Quality checks enforce 100% test coverage, type safety, and linting on every run.

## The Auto Engineer

The open-source engine that powers this pipeline is [Auto Engineer](https://github.com/BeOnAuto/auto-engineer). You can run it as a cloud worker on the Auto platform or locally on your machine. The architecture is modular: pluggable builders allow targeting different tech stacks.

## Try It

```bash
npx create-auto-app@latest my-project
cd my-project
cp .env.template .env  # Add your API key
auto
```

For the full platform experience with visual canvas, document editor, and collaboration features: **[Join the Auto waitlist →](https://on.auto)**

---

*A [spec dialect](https://specdriven.com/dialects/narrative-driven) by the [Auto](https://on.auto) team.*
