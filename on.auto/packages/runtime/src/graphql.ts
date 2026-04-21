import {
  buildSchema,
  graphql,
  type ExecutionResult,
  type GraphQLSchema,
} from 'graphql';

import type { AssembledRuntime } from './assemble';

export type BuiltGraphQL = {
  schema: GraphQLSchema;
  rootValue: Record<string, unknown>;
  execute: (params: {
    query: string;
    variables?: Record<string, unknown>;
    operationName?: string;
  }) => Promise<ExecutionResult>;
};

export const buildGraphQL = (
  sdl: string,
  runtime: AssembledRuntime,
): BuiltGraphQL => {
  const schema = buildSchema(sdl);

  const rootValue: Record<string, unknown> = {};

  for (const field of runtime.mutationFields) {
    rootValue[field] = async (args: Record<string, unknown>) => {
      const result = await runtime.dispatchMutation(field, args);
      if (!result.ok) {
        return { success: false, error: result.error };
      }
      return { success: true, events: result.events.map((e) => e.type) };
    };
  }

  for (const field of runtime.queryFields) {
    rootValue[field] = (args: Record<string, unknown>) =>
      runtime.runQuery(field, args);
  }

  const execute: BuiltGraphQL['execute'] = ({
    query,
    variables,
    operationName,
  }) =>
    graphql({
      schema,
      source: query,
      rootValue,
      variableValues: variables,
      operationName,
    });

  return { schema, rootValue, execute };
};
