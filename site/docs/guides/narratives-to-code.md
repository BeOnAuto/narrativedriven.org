---
title: From Narratives to Running Code
---

# From Narratives to Running Code

![Narrative card to coding agent to code-bracket card to phone wireframe, connected by arrows](/images/heroes/narratives-to-code.png){.page-hero}

NDD doesn't just document your software. On the Auto platform, the four-level model (Domain → Narrative → Scene → Moment) generates it.

## What Goes In

Every step of the pipeline reads from one input: a narrative model written in the typed DSL. Here is the shape of one moment. The full breakdown lives in the [DSL reference](/reference/dsl).

```typescript
import {
  narrative, scene, command, gql, describe, it, specs, rule, example,
  defineCommand, defineEvent,
} from "@on.auto/narrative";

const PlaceOrder = defineCommand<{ orderId: string; itemId: string; quantity: number }>("PlaceOrder");
const OrderPlaced = defineEvent<{ orderId: string; itemId: string; quantity: number }>("OrderPlaced");

narrative("Placing Orders", () => {
  scene("Place an order", () => {
    command("places an order")
      .client(() => {
        describe("Order form", () => {
          it("should disable submit while the request is in flight");
        });
      })
      .request(gql`mutation PlaceOrder($input: PlaceOrderInput!) { placeOrder(input: $input) { success } }`)
      .server(() => {
        specs("Orders are placed against live inventory", () => {
          rule("an order is accepted when stock is available", () => {
            example("in-stock order is placed")
              .when(PlaceOrder, "submitted", { orderId: "o1", itemId: "i1", quantity: 2 })
              .then(OrderPlaced, "recorded", { orderId: "o1", itemId: "i1", quantity: 2 });
          });
        });
      });
  });
});
```

## The Pipeline

```
Domain Model → Schema → Server Scaffold → Frontend Scaffold → AI Implementation → Quality Checks → Production Code
```

The input to this pipeline is your domain. Each stage validates against your specifications. The tests are deterministic and fixed. The path to passing them is adaptive: the AI retries, escalates to more capable models, or flags the specification for review.

## What Gets Generated

**From your domain**, Auto derives the type system: entities, commands, events, queries, and state projections. The domain's actors and entities become the canonical vocabulary the rest of the pipeline reads from.

**From the messages**, it generates a GraphQL schema and an event-sourced server scaffold (currently Apollo + Emmett).

**From each scene's moments and their interaction specs**, it generates frontend scaffolds (currently React + Vite + Tailwind CSS v4 + shadcn).

**AI agents** then implement the business logic and UI components, constrained by your specifications. Quality checks enforce 100% test coverage, type safety, and linting on every run.

For the empirical case for spec-first development with AI, see the [evidence pack on specdriven.com](https://specdriven.com/guides/roi).

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
