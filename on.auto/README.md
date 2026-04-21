# on.auto

Private workspace for the executable-model runtime.

## Packages

- [`@onauto/runtime`](./packages/runtime) — in-memory Emmett runtime that
  serves a narrative model as a GraphQL endpoint on Cloudflare Workers. See
  the package README for architecture and usage.

## Getting started

```
pnpm install
pnpm --filter @onauto/runtime test
pnpm --filter @onauto/runtime dev:orders
```
