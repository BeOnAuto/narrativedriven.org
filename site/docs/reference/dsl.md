---
title: DSL Reference
prev:
  text: Glossary
  link: /reference/glossary
---

# DSL Reference

![Code editor card with the @on.auto/narrative DSL surfaced](/images/heroes/reference-index.png){.page-hero}

The TypeScript DSL is one view of the narrative model. The JSON model is another. Both describe the same structure, and the DSL is what most practitioners read and write when working in code.

## A Complete Example

```typescript
import { narrative, scene, command, query, data, source, sink, gql, describe, it, specs, rule, example, defineCommand, defineEvent, defineState } from "@on.auto/narrative";
import { ProductCatalog } from "./integrations";

const PlaceOrder = defineCommand<{ orderId: string; itemId: string; quantity: number }>("PlaceOrder");
const OrderPlaced = defineEvent<{ orderId: string; itemId: string; quantity: number; placedAt: Date }>("OrderPlaced");
const Inventory = defineState<{ itemId: string; available: number }>("Inventory");
const Orders = defineState<{ orderId: string; itemId: string; quantity: number }>("Orders");

narrative("Placing Orders", () => {
  scene("Place an order", () => {
    command("places an order")
      .client(() => {
        describe("Order form", () => {
          it("should let the user pick an item from the catalog");
          it("should let the user enter a quantity");
          it("should disable submit while the request is in flight");
        });
      })
      .request(gql`
        mutation PlaceOrder($input: PlaceOrderInput!) {
          placeOrder(input: $input) {
            success
          }
        }
      `)
      .server(() => {
        data([
          source().state("Inventory").fromIntegration(ProductCatalog),
          sink().event("OrderPlaced").toStream("order-${orderId}"),
        ]);
        specs("Orders are placed against live inventory", () => {
          rule("an order is accepted when stock is available", () => {
            example("customer places order for in-stock item")
              .given(Inventory, "the item has stock", {
                itemId: "item-1",
                available: 10,
              })
              .when(PlaceOrder, "the customer submits the order", {
                orderId: "order-001",
                itemId: "item-1",
                quantity: 2,
              })
              .then(OrderPlaced, "the order is placed", {
                orderId: "order-001",
                itemId: "item-1",
                quantity: 2,
                placedAt: new Date("2026-04-01T10:00:00Z"),
              });
          });
        });
      });

    query("views their order")
      .client(() => {
        describe("Order detail", () => {
          it("should show the order id, item, and quantity");
          it("should show a confirmation timestamp");
        });
      })
      .request(gql`
        query Order($orderId: ID!) {
          order(orderId: $orderId) {
            orderId
            itemId
            quantity
          }
        }
      `)
      .server(() => {
        data([
          source().state("Orders").fromProjection("OrdersProjection", "orderId"),
        ]);
        specs("Order detail reflects the latest event", () => {
          rule("the projection updates when an OrderPlaced event arrives", () => {
            example("order is visible after placement")
              .when(OrderPlaced, "an order has just been placed", {
                orderId: "order-001",
                itemId: "item-1",
                quantity: 2,
                placedAt: new Date("2026-04-01T10:00:00Z"),
              })
              .then(Orders, "the order is listed", {
                orderId: "order-001",
                itemId: "item-1",
                quantity: 2,
              });
          });
        });
      });
  });
});
```

The rest of this page walks through each construct in the order it appears above.

## narrative

`narrative` is the top-level wrapper. It names the goal thread and holds the scenes that fulfil it. Every model rooted in the DSL begins with a `narrative` call.

```typescript
narrative("Placing Orders", () => {
  scene("Place an order", () => {
    // moments go here
  });
});
```

## scene

`scene` declares one outcome inside the narrative. A scene contains one or more moments that move it toward that outcome.

```typescript
scene("Place an order", () => {
  command("places an order")
    // ...
});
```

## command

`command` is a moment where an actor changes state. The string passed in describes the actor's action. Commands carry both client and server specs.

```typescript
command("places an order")
  .client(() => { /* interaction specs */ })
  .request(gql`/* GraphQL mutation */`)
  .server(() => { /* business specs */ });
```

## query

`query` is a moment where an actor receives data. Queries carry interaction specs for the read-side UI and business specs that describe how state is projected.

```typescript
query("views their order")
  .client(() => { /* interaction specs */ })
  .request(gql`/* GraphQL query */`)
  .server(() => { /* business specs */ });
```

## .client() with describe / it

The `.client()` block holds interaction specs. `describe` names a UI surface, `it` names an observable behaviour. These render directly as component tests.

```typescript
.client(() => {
  describe("Order form", () => {
    it("should let the user pick an item from the catalog");
    it("should let the user enter a quantity");
    it("should disable submit while the request is in flight");
  });
})
```

## .request() with gql

`.request()` carries the GraphQL document the moment exchanges with the server. The `gql` tag enables typed parsing and tooling integration.

```typescript
.request(gql`
  mutation PlaceOrder($input: PlaceOrderInput!) {
    placeOrder(input: $input) {
      success
    }
  }
`)
```

## .server()

The `.server()` block holds the data wiring and the business specs for a moment. Everything inside it describes server behaviour.

```typescript
.server(() => {
  data([ /* sources and sinks */ ]);
  specs("...", () => { /* rules and examples */ });
});
```

## data() with source() and sink()

`data` declares the state the moment reads from and the events it writes to. `source()` describes a read, `sink()` describes a write. Together they form the data-completeness chain.

```typescript
data([
  source().state("Inventory").fromIntegration(ProductCatalog),
  sink().event("OrderPlaced").toStream("order-${orderId}"),
]);
```

## specs()

`specs` opens a block of business specs for the moment. The string is the heading the rules live under.

```typescript
specs("Orders are placed against live inventory", () => {
  rule("an order is accepted when stock is available", () => {
    // examples
  });
});
```

## rule()

`rule` declares one business rule inside a `specs` block. Rules hold the examples that prove them.

```typescript
rule("an order is accepted when stock is available", () => {
  example("customer places order for in-stock item")
    // ...
});
```

## example() with given / when / then

`example` is the executable form of a rule: a Given/When/Then sequence that compiles into a verifiable test. `given` sets prior state or events, `when` triggers a command or event, `then` asserts the resulting events or state.

```typescript
example("customer places order for in-stock item")
  .given(Inventory, "the item has stock", {
    itemId: "item-1",
    available: 10,
  })
  .when(PlaceOrder, "the customer submits the order", {
    orderId: "order-001",
    itemId: "item-1",
    quantity: 2,
  })
  .then(OrderPlaced, "the order is placed", {
    orderId: "order-001",
    itemId: "item-1",
    quantity: 2,
    placedAt: new Date("2026-04-01T10:00:00Z"),
  });
```

## defineCommand

`defineCommand` declares a typed command with its payload shape. The returned reference is what `.when(...)` accepts in examples.

```typescript
const PlaceOrder = defineCommand<{ orderId: string; itemId: string; quantity: number }>("PlaceOrder");
```

## defineEvent

`defineEvent` declares a typed event with its payload shape. Events appear in `.given(...)` (as prior state) and `.then(...)` (as resulting state).

```typescript
const OrderPlaced = defineEvent<{ orderId: string; itemId: string; quantity: number; placedAt: Date }>("OrderPlaced");
```

## defineState

`defineState` declares a typed state projection. State references appear in `data` blocks and in `.then(...)` clauses for query examples.

```typescript
const Inventory = defineState<{ itemId: string; available: number }>("Inventory");
```

The Zod schema and JSON model reference is coming next. See the [reference index](/reference/) for what is shipping.
