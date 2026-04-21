import { describe, expect, it } from 'vitest';
import { createServer } from '../src';
import { ordersApp } from '../examples/orders/model';

const PLACE_ORDER = /* GraphQL */ `
  mutation Place($orderId: ID!, $productId: String!, $quantity: Int!) {
    placeOrder(orderId: $orderId, productId: $productId, quantity: $quantity) {
      success
      error
      events
    }
  }
`;

const VIEW_ORDERS = /* GraphQL */ `
  query View($orderId: ID) {
    viewOrders(orderId: $orderId) {
      orderId
      productId
      quantity
      confirmationSent
    }
  }
`;

const callGraphQL = async (
  app: ReturnType<typeof createServer>['app'],
  query: string,
  variables?: Record<string, unknown>,
) => {
  const res = await app.fetch(
    new Request('http://localhost/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    }),
  );
  expect(res.status).toBe(200);
  return res.json() as Promise<{
    data?: Record<string, unknown>;
    errors?: unknown[];
  }>;
};

describe('orders runtime POC', () => {
  it('places an order, projection reflects it, reactor fires confirmation', async () => {
    const { app } = createServer(ordersApp);

    const placed = await callGraphQL(app, PLACE_ORDER, {
      orderId: 'order_001',
      productId: 'product_abc',
      quantity: 3,
    });

    expect(placed.errors).toBeUndefined();
    const placeResult = placed.data?.placeOrder as {
      success: boolean;
      error: string | null;
      events: string[];
    };
    expect(placeResult.success).toBe(true);
    expect(placeResult.events).toContain('OrderPlaced');

    const viewed = await callGraphQL(app, VIEW_ORDERS, {
      orderId: 'order_001',
    });
    expect(viewed.errors).toBeUndefined();
    const orders = viewed.data?.viewOrders as Array<{
      orderId: string;
      productId: string;
      quantity: number;
      confirmationSent: boolean;
    }>;

    expect(orders).toHaveLength(1);
    expect(orders[0]).toMatchObject({
      orderId: 'order_001',
      productId: 'product_abc',
      quantity: 3,
      confirmationSent: true,
    });
  });

  it('rejects duplicate orders via the decider', async () => {
    const { app } = createServer(ordersApp);

    await callGraphQL(app, PLACE_ORDER, {
      orderId: 'order_dup',
      productId: 'product_xyz',
      quantity: 1,
    });

    const again = await callGraphQL(app, PLACE_ORDER, {
      orderId: 'order_dup',
      productId: 'product_xyz',
      quantity: 1,
    });

    const result = again.data?.placeOrder as {
      success: boolean;
      error: string;
    };
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/already exists/);
  });

  it('rejects invalid commands (non-positive quantity)', async () => {
    const { app } = createServer(ordersApp);

    const bad = await callGraphQL(app, PLACE_ORDER, {
      orderId: 'order_bad',
      productId: 'product_xyz',
      quantity: 0,
    });

    const result = bad.data?.placeOrder as {
      success: boolean;
      error: string;
    };
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/positive/);
  });

  it('lists all orders when no id is provided', async () => {
    const { app } = createServer(ordersApp);

    await callGraphQL(app, PLACE_ORDER, {
      orderId: 'a',
      productId: 'p',
      quantity: 1,
    });
    await callGraphQL(app, PLACE_ORDER, {
      orderId: 'b',
      productId: 'p',
      quantity: 2,
    });

    const viewed = await callGraphQL(app, VIEW_ORDERS, {});
    const orders = viewed.data?.viewOrders as Array<{ orderId: string }>;
    expect(orders.map((o) => o.orderId).sort()).toEqual(['a', 'b']);
  });
});
