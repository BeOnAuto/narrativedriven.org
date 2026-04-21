/**
 * Orders example narrative model, inlined for the POC.
 *
 * This module represents what would ship as the "bundled" result of taking a
 * narrative model (from @onauto/narrative) + the AI-authored decider/evolve/
 * reactor code and compiling them into a runnable app.
 *
 * Structure:
 *   - graphqlSchema: SDL string, as produced by the schema-generator tool
 *   - commands:      one CommandDescriptor per mutation field
 *   - queries:       one QueryDescriptor  per query field
 *   - reacts:        list of ReactDescriptors reacting to events
 */

import type { Event, ReadEvent } from '@event-driven-io/emmett';
import type {
  CommandDescriptor,
  QueryDescriptor,
  ReactDescriptor,
  RuntimeApp,
} from '@onauto/runtime';

// ---------- Commands, Events, State ----------------------------------------

type PlaceOrder = {
  type: 'PlaceOrder';
  kind: 'Command';
  data: {
    orderId: string;
    productId: string;
    quantity: number;
  };
};

type OrderPlaced = Event<
  'OrderPlaced',
  {
    orderId: string;
    productId: string;
    quantity: number;
    placedAt: string;
  }
>;

type OrderConfirmationSent = Event<
  'OrderConfirmationSent',
  {
    orderId: string;
    sentAt: string;
  }
>;

type OrderEvent = OrderPlaced | OrderConfirmationSent;

type OrderState =
  | { status: 'empty' }
  | {
      status: 'placed';
      orderId: string;
      productId: string;
      quantity: number;
      placedAt: string;
      confirmationSent: boolean;
    };

// ---------- Command moment: PlaceOrder -------------------------------------

const placeOrderCommand: CommandDescriptor<OrderState, PlaceOrder, OrderEvent> =
  {
    kind: 'command',
    commandType: 'PlaceOrder',
    streamId: (input) => `order-${String(input.orderId)}`,
    initialState: () => ({ status: 'empty' }),
    evolve: (state, event): OrderState => {
      switch (event.type) {
        case 'OrderPlaced':
          return {
            status: 'placed',
            orderId: event.data.orderId,
            productId: event.data.productId,
            quantity: event.data.quantity,
            placedAt: event.data.placedAt,
            confirmationSent: false,
          };
        case 'OrderConfirmationSent':
          return state.status === 'placed'
            ? { ...state, confirmationSent: true }
            : state;
        default:
          return state;
      }
    },
    decide: (command, state): OrderPlaced => {
      if (state.status !== 'empty') {
        throw new Error(`Order ${command.data.orderId} already exists`);
      }
      if (command.data.quantity <= 0) {
        throw new Error('Quantity must be positive');
      }
      return {
        type: 'OrderPlaced',
        data: {
          orderId: command.data.orderId,
          productId: command.data.productId,
          quantity: command.data.quantity,
          placedAt: new Date().toISOString(),
        },
      };
    },
  };

// Second command, used by the reactor to record the confirmation.
type SendOrderConfirmation = {
  type: 'SendOrderConfirmation';
  kind: 'Command';
  data: { orderId: string };
};

const sendOrderConfirmationCommand: CommandDescriptor<
  OrderState,
  SendOrderConfirmation,
  OrderEvent
> = {
  kind: 'command',
  commandType: 'SendOrderConfirmation',
  streamId: (input) => `order-${String(input.orderId)}`,
  initialState: () => ({ status: 'empty' }),
  evolve: placeOrderCommand.evolve,
  decide: (command, state): OrderConfirmationSent => {
    if (state.status !== 'placed') {
      throw new Error(`Cannot confirm non-existent order ${command.data.orderId}`);
    }
    if (state.confirmationSent) {
      throw new Error(`Confirmation already sent for ${command.data.orderId}`);
    }
    return {
      type: 'OrderConfirmationSent',
      data: {
        orderId: command.data.orderId,
        sentAt: new Date().toISOString(),
      },
    };
  },
};

// ---------- Query moment: ViewOrders ---------------------------------------

type OrderView = {
  _id?: string;
  orderId: string;
  productId: string;
  quantity: number;
  placedAt: string;
  confirmationSent: boolean;
};

const viewOrdersQuery: QueryDescriptor<OrderView, OrderEvent> = {
  kind: 'query',
  collectionName: 'orderViews',
  canHandle: ['OrderPlaced', 'OrderConfirmationSent'] as const,
  getDocumentId: (event: ReadEvent<OrderEvent>) =>
    (event.data as { orderId: string }).orderId,
  evolve: (doc, event): OrderView | null => {
    switch (event.type) {
      case 'OrderPlaced':
        return {
          orderId: event.data.orderId,
          productId: event.data.productId,
          quantity: event.data.quantity,
          placedAt: event.data.placedAt,
          confirmationSent: false,
        };
      case 'OrderConfirmationSent':
        return doc ? { ...doc, confirmationSent: true } : doc;
      default:
        return doc;
    }
  },
  resolve: async (args, db) => {
    const collection = db.collection<OrderView>('orderViews');
    if (typeof args.orderId === 'string') {
      const found = await collection.findOne(
        (d) => d.orderId === args.orderId,
      );
      return found ?? null;
    }
    const all = await collection.find();
    return all;
  },
};

// ---------- React moment: SendOrderConfirmation ----------------------------

const sendOrderConfirmationReact: ReactDescriptor<OrderEvent> = {
  kind: 'react',
  name: 'SendOrderConfirmation',
  canHandle: ['OrderPlaced'] as const,
  react: async (event, ctx) => {
    if (event.type !== 'OrderPlaced') return;
    await ctx.dispatch('sendOrderConfirmation', {
      orderId: event.data.orderId,
    });
  },
};

// ---------- GraphQL schema (as produced by the schema-gen tool) ------------

const graphqlSchema = /* GraphQL */ `
  type CommandResult {
    success: Boolean!
    error: String
    events: [String!]
  }

  type OrderView {
    orderId: ID!
    productId: String!
    quantity: Int!
    placedAt: String!
    confirmationSent: Boolean!
  }

  type Query {
    viewOrders(orderId: ID): [OrderView!]
  }

  type Mutation {
    placeOrder(
      orderId: ID!
      productId: String!
      quantity: Int!
    ): CommandResult!
    sendOrderConfirmation(orderId: ID!): CommandResult!
  }
`;

// Wrap the single-doc resolver so the `[OrderView]` return type works
// whether the caller asks for one order or all of them.
const viewOrdersWrapped: QueryDescriptor<OrderView, OrderEvent> = {
  ...viewOrdersQuery,
  resolve: async (args, db) => {
    const result = await viewOrdersQuery.resolve(args, db);
    if (result === null) return [];
    if (Array.isArray(result)) return result;
    return [result];
  },
};

export const ordersApp: RuntimeApp = {
  graphqlSchema,
  commands: {
    placeOrder: placeOrderCommand,
    sendOrderConfirmation: sendOrderConfirmationCommand,
  },
  queries: {
    viewOrders: viewOrdersWrapped,
  },
  reacts: [sendOrderConfirmationReact],
};
