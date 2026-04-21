# @onauto/runtime

An in-memory Emmett runtime that serves a narrative model as a GraphQL endpoint
on a Cloudflare Worker. This is the POC deliverable for the "executable model"
direction — the model ships as data + bundled code, the runtime composes it at
boot, and serves it at `/graphql`.

## Premise

A narrative model (`@onauto/narrative`) describes an application as a set of
**moments** — commands, queries, reacts. Historically, auto-engineer took that
model and code-generated files on disk. This runtime takes the same signal
(plus bundled `decide`/`evolve`/`reactor` code) and assembles a live Emmett
application at runtime — no file system, Workers-compatible.

## Shape

A `RuntimeApp` is three things, all JSON/JS-serialisable once bundled:

```ts
{
  graphqlSchema: string            // SDL, from your schema-generator tool
  commands:      { [field]: CommandDescriptor }   // mutation field → handler
  queries:       { [field]: QueryDescriptor }     // query    field → projection + resolver
  reacts?:       ReactDescriptor[]                // side effects on matching events
}
```

Each descriptor carries the real functions (`decide`, `evolve`, `react`,
`resolve`). In the POC those are authored inline as TypeScript; in production
they arrive as strings in the model JSON and are lifted to a TS module by a
bundler step before `esbuild`/`wrangler` wraps them into a Worker.

## How it composes

```
RuntimeApp ──┐
             ▼
        assembleRuntime()            (src/assemble.ts)
             │
             ├── getInMemoryEventStore({ projections })       ← queries become
             │                                                  inline Emmett
             │                                                  projections
             │
             ├── DeciderCommandHandler(decider) per command
             │
             └── react registry keyed by event type
                                  │
                                  ▼
        buildGraphQL(sdl, runtime)   (src/graphql.ts)
             │
             ├── buildSchema(sdl)
             └── rootValue = { [field]: resolver }
                                  │
                                  ▼
        createServer(app)            (src/server.ts)
             │
             └── Hono app → POST /graphql, GET /health
```

## Example

`examples/orders/` contains a minimal Orders model with:

- **Command moment** — `placeOrder` (emits `OrderPlaced`)
- **Query moment** — `viewOrders` (projection over `OrderPlaced`/`OrderConfirmationSent`)
- **React moment** — listens to `OrderPlaced`, dispatches `sendOrderConfirmation`
- **Second command** — `sendOrderConfirmation` (emits `OrderConfirmationSent`)

Run it locally:

```
pnpm install
pnpm dev:orders          # wrangler dev → http://127.0.0.1:8787
```

Try it:

```sh
curl -s http://127.0.0.1:8787/health

curl -s -X POST http://127.0.0.1:8787/graphql \
  -H 'Content-Type: application/json' \
  -d '{"query":"mutation { placeOrder(orderId:\"o1\", productId:\"p1\", quantity:2) { success events } }"}'

curl -s -X POST http://127.0.0.1:8787/graphql \
  -H 'Content-Type: application/json' \
  -d '{"query":"{ viewOrders(orderId:\"o1\") { orderId productId quantity confirmationSent } }"}'
# → confirmationSent: true   (reactor fired)
```

## Tests

```
pnpm test
```

Four end-to-end scenarios against the in-process Hono app:

1. Place order → projection reflects it → reactor flips `confirmationSent`.
2. Duplicate `placeOrder` → decider rejects.
3. Invalid quantity → decider rejects.
4. List all orders when no id is provided.

## What is and isn't in the POC

**In scope:**

- Command / Query / React moments wired end-to-end through Emmett.
- GraphQL served from an author-provided SDL string.
- Runs on `wrangler dev` locally as a real Cloudflare Worker.
- In-memory event store + projections.

**Out of scope (deliberately deferred):**

- D1 persistence — the path is clean: swap `getInMemoryEventStore` for a
  D1-backed `EventStore` implementation against the same interface.
- Code-as-strings in the model. The POC authors handlers inline as TS; the
  next step is a bundler that lifts the `decider`/`evolve`/`react` string
  fields of the narrative model into a generated TS module, then esbuilds
  that module with this runtime into a Worker bundle.
- Hot-swap of a running model. The agreed model is "upload new model →
  bundle → redeploy" — which is what `wrangler deploy` already does.
- GraphQL schema generation. Assumed to come from your existing
  schema-generator function which takes a model and emits SDL.

## File map

```
src/
  types.ts       RuntimeApp + CommandDescriptor/QueryDescriptor/ReactDescriptor
  assemble.ts    RuntimeApp → Emmett event store + handler registry
  graphql.ts     SDL + assembler → executable GraphQL schema + resolvers
  server.ts      Hono app exposing POST /graphql, GET /health
  index.ts       Public exports

examples/orders/
  model.ts       The Orders app (data + inline code)
  worker.ts      Worker entrypoint: createServer(ordersApp).app
  wrangler.toml  wrangler dev / deploy config

test/
  orders.spec.ts End-to-end test via Hono's app.fetch()
```
