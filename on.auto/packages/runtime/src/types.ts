import type {
  Command,
  Event,
  InMemoryDatabase,
  ReadEvent,
} from '@event-driven-io/emmett';

export type AnyCommand = Command<string, Record<string, unknown>>;
export type AnyEvent = Event<string, Record<string, unknown>>;

export type CommandDescriptor<
  State = unknown,
  C extends AnyCommand = AnyCommand,
  E extends AnyEvent = AnyEvent,
> = {
  kind: 'command';
  commandType: C['type'];
  streamId: (input: Record<string, unknown>) => string;
  toCommand?: (args: Record<string, unknown>) => C['data'];
  decide: (command: C, state: State) => E | E[];
  evolve: (state: State, event: E) => State;
  initialState: () => State;
};

export type QueryDescriptor<
  Doc extends Record<string, unknown> = Record<string, unknown>,
  E extends AnyEvent = AnyEvent,
> = {
  kind: 'query';
  collectionName: string;
  canHandle: readonly E['type'][];
  getDocumentId?: (event: ReadEvent<E>) => string;
  initialState?: () => Doc;
  evolve: (doc: Doc | null, event: ReadEvent<E>) => Doc | null;
  resolve: (
    args: Record<string, unknown>,
    db: InMemoryDatabase,
  ) => Promise<unknown>;
};

export type ReactContext = {
  dispatch: (
    mutationName: string,
    args: Record<string, unknown>,
  ) => Promise<unknown>;
};

export type ReactDescriptor<E extends AnyEvent = AnyEvent> = {
  kind: 'react';
  name: string;
  canHandle: readonly E['type'][];
  react: (event: ReadEvent<E>, ctx: ReactContext) => void | Promise<void>;
};

/**
 * Registry view — intentionally uses `any` at the boundary so strongly-typed
 * user-land descriptors can be collected into a single heterogeneous record
 * without triggering TS's strict function-parameter variance errors.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyCommandDescriptor = CommandDescriptor<any, any, any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyQueryDescriptor = QueryDescriptor<any, any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyReactDescriptor = ReactDescriptor<any>;

export type RuntimeApp = {
  graphqlSchema: string;
  commands: Record<string, AnyCommandDescriptor>;
  queries: Record<string, AnyQueryDescriptor>;
  reacts?: AnyReactDescriptor[];
};
