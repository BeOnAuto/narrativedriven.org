import {
  DeciderCommandHandler,
  getInMemoryEventStore,
  inMemorySingleStreamProjection,
  type InMemoryEventStore,
  type InMemoryReadEventMetadata,
  type ProjectionRegistration,
  type ReadEvent,
} from '@event-driven-io/emmett';

import type {
  AnyCommand,
  AnyCommandDescriptor,
  AnyEvent,
  AnyQueryDescriptor,
  AnyReactDescriptor,
  ReactContext,
  RuntimeApp,
} from './types';

export type AssembledRuntime = {
  eventStore: InMemoryEventStore;
  dispatchMutation: (
    field: string,
    args: Record<string, unknown>,
  ) => Promise<{ ok: true; events: AnyEvent[] } | { ok: false; error: string }>;
  runQuery: (
    field: string,
    args: Record<string, unknown>,
  ) => Promise<unknown>;
  mutationFields: string[];
  queryFields: string[];
};

const buildProjection = (
  query: AnyQueryDescriptor,
): ProjectionRegistration<'inline', InMemoryReadEventMetadata> => {
  // canHandle is typed as a string tuple — runtime takes any string list
  const canHandle = query.canHandle as unknown as never;

  const projection = query.initialState
    ? inMemorySingleStreamProjection<Record<string, unknown>, AnyEvent>({
        collectionName: query.collectionName,
        canHandle,
        getDocumentId: query.getDocumentId,
        initialState: query.initialState as () => Record<string, unknown>,
        evolve: (doc: Record<string, unknown>, event: ReadEvent<AnyEvent>) =>
          (query.evolve(doc, event) ?? null) as Record<string, unknown> | null,
      })
    : inMemorySingleStreamProjection<Record<string, unknown>, AnyEvent>({
        collectionName: query.collectionName,
        canHandle,
        getDocumentId: query.getDocumentId,
        evolve: (
          doc: Record<string, unknown> | null,
          event: ReadEvent<AnyEvent>,
        ) => query.evolve(doc, event) as Record<string, unknown> | null,
      });

  return { type: 'inline', projection };
};

export const assembleRuntime = (app: RuntimeApp): AssembledRuntime => {
  const projections = Object.values(app.queries).map(buildProjection);
  const eventStore = getInMemoryEventStore({ projections });

  const commandHandlers = new Map<
    string,
    ReturnType<typeof DeciderCommandHandler>
  >();
  const commandDescriptorByField = new Map<string, AnyCommandDescriptor>();

  for (const [field, descriptor] of Object.entries(app.commands)) {
    commandHandlers.set(
      field,
      DeciderCommandHandler({
        decide: descriptor.decide,
        evolve: descriptor.evolve,
        initialState: descriptor.initialState,
      }),
    );
    commandDescriptorByField.set(field, descriptor);
  }

  const reactsByEventType = new Map<string, AnyReactDescriptor[]>();
  for (const react of app.reacts ?? []) {
    for (const et of react.canHandle) {
      const list = reactsByEventType.get(et) ?? [];
      list.push(react);
      reactsByEventType.set(et, list);
    }
  }

  const dispatchMutation: AssembledRuntime['dispatchMutation'] = async (
    field,
    args,
  ) => {
    const descriptor = commandDescriptorByField.get(field);
    const handler = commandHandlers.get(field);
    if (!descriptor || !handler) {
      return { ok: false, error: `Unknown mutation: ${field}` };
    }

    const data = descriptor.toCommand ? descriptor.toCommand(args) : args;
    const streamId = descriptor.streamId(
      data as unknown as Record<string, unknown>,
    );
    const command: AnyCommand = {
      type: descriptor.commandType,
      data: data as Record<string, unknown>,
      kind: 'Command',
    } as AnyCommand;

    try {
      const result = (await handler(eventStore, streamId, command)) as {
        newEvents: AnyEvent[];
      };
      const newEvents = result.newEvents ?? [];

      const reactCtx: ReactContext = {
        dispatch: async (mutationField, mArgs) => {
          const r = await dispatchMutation(mutationField, mArgs);
          if (!r.ok) throw new Error(r.error);
          return r;
        },
      };

      for (const evt of newEvents) {
        const matches = reactsByEventType.get(evt.type) ?? [];
        for (const reactor of matches) {
          await reactor.react(evt as ReadEvent<AnyEvent>, reactCtx);
        }
      }

      return { ok: true, events: newEvents };
    } catch (err) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  };

  const runQuery: AssembledRuntime['runQuery'] = async (field, args) => {
    const descriptor = app.queries[field];
    if (!descriptor) throw new Error(`Unknown query: ${field}`);
    return descriptor.resolve(args, eventStore.database);
  };

  return {
    eventStore,
    dispatchMutation,
    runQuery,
    mutationFields: Object.keys(app.commands),
    queryFields: Object.keys(app.queries),
  };
};
