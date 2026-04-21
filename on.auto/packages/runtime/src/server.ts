import { Hono } from 'hono';

import { assembleRuntime, type AssembledRuntime } from './assemble';
import { buildGraphQL, type BuiltGraphQL } from './graphql';
import type { RuntimeApp } from './types';

export type Server = {
  app: Hono;
  runtime: AssembledRuntime;
  graphql: BuiltGraphQL;
};

export const createServer = (app: RuntimeApp): Server => {
  const runtime = assembleRuntime(app);
  const gql = buildGraphQL(app.graphqlSchema, runtime);

  const hono = new Hono();

  hono.get('/health', (c) => c.json({ ok: true }));

  hono.post('/graphql', async (c) => {
    let body: {
      query?: string;
      variables?: Record<string, unknown>;
      operationName?: string;
    };
    try {
      body = await c.req.json();
    } catch {
      return c.json({ errors: [{ message: 'Invalid JSON body' }] }, 400);
    }

    if (!body.query) {
      return c.json({ errors: [{ message: 'Missing query' }] }, 400);
    }

    const result = await gql.execute({
      query: body.query,
      variables: body.variables,
      operationName: body.operationName,
    });

    return c.json(result);
  });

  return { app: hono, runtime, graphql: gql };
};
