import type { ZodTypeAny } from 'zod';

type IntegrationHandler = (...args: any[]) => Promise<any>;

// Enhanced WithSchema type that includes schemas for each handler
type WithSchema<T extends Record<string, IntegrationHandler>> = T & {
  schema?: {
    [K in keyof T]?: ZodTypeAny;
  };
};

export interface Integration<
  Type extends string = string,
  Q extends Record<string, IntegrationHandler> = Record<string, IntegrationHandler>,
  C extends Record<string, IntegrationHandler> = Record<string, IntegrationHandler>,
  R extends Record<string, IntegrationHandler> = Record<string, IntegrationHandler>,
> {
  readonly __brand: 'Integration';
  readonly type: Type;
  readonly name: string;
  readonly exportName?: string; // The name used when exporting this integration
  readonly Queries?: WithSchema<Q>;
  readonly Commands?: WithSchema<C>;
  readonly Reactions?: WithSchema<R>;
}

export const createIntegration = <T extends string>(type: T, name: string): Integration<T> =>
  ({
    __brand: 'Integration' as const,
    type,
    name,
  }) as Integration<T>;

/**
 * Helper function to set the export name on an integration
 */
export function withExportName<T extends Integration>(integration: T, exportName: string): T {
  return {
    ...integration,
    exportName,
  };
}

// Data flow types (keeping existing types)
export interface MessageTarget {
  type: 'Event' | 'Command' | 'State';
  name: string;
  fields?: Record<string, unknown>;
}

export interface StreamDestination {
  type: 'stream';
  pattern: string;
}

export interface IntegrationDestination {
  type: 'integration';
  systems: string[];
  message?: {
    name: string;
    type: 'command' | 'query' | 'reaction';
  };
}

export interface DatabaseDestination {
  type: 'database';
  collection: string;
}

export interface TopicDestination {
  type: 'topic';
  name: string;
}

export type Destination = StreamDestination | IntegrationDestination | DatabaseDestination | TopicDestination;

// Helper functions to create destinations
export const createStreamDestination = (pattern: string): StreamDestination => ({ type: 'stream', pattern });
export const createIntegrationDestination = (systems: string[]): IntegrationDestination => ({
  type: 'integration',
  systems,
});
export const createDatabaseDestination = (collection: string): DatabaseDestination => ({
  type: 'database',
  collection,
});
export const createTopicDestination = (name: string): TopicDestination => ({ type: 'topic', name });

export interface ProjectionOriginWithId {
  type: 'projection';
  name: string;
  idField?: string | string[];
  singleton?: boolean;
}

export interface ReadModelOrigin {
  type: 'readModel';
  name: string;
}

export interface DatabaseOrigin {
  type: 'database';
  collection: string;
  query?: Record<string, unknown>;
}

export interface ApiOrigin {
  type: 'api';
  endpoint: string;
  method?: string;
}

export interface IntegrationOrigin {
  type: 'integration';
  systems: string[];
}

export type Origin = ProjectionOriginWithId | ReadModelOrigin | DatabaseOrigin | ApiOrigin | IntegrationOrigin;

// Helper functions to create origins
export const createProjectionOrigin = (name: string): ProjectionOriginWithId => ({ type: 'projection', name });
export const createReadModelOrigin = (name: string): ReadModelOrigin => ({ type: 'readModel', name });
export const createDatabaseOrigin = (collection: string, query?: Record<string, unknown>): DatabaseOrigin => ({
  type: 'database',
  collection,
  query,
});
export const createApiOrigin = (endpoint: string, method?: string): ApiOrigin => ({ type: 'api', endpoint, method });
export const createIntegrationOrigin = (systems: string[]): IntegrationOrigin => ({ type: 'integration', systems });

export interface DataSink {
  id?: string;
  target: MessageTarget;
  destination: Destination;
  transform?: string;
  _additionalInstructions?: string;
  _withState?: DataSource;
}

export interface DataSource {
  id?: string;
  target: MessageTarget;
  origin: Origin;
  transform?: string;
  _additionalInstructions?: string;
}

// Branded types for type safety in arrays
export interface DataSinkItem extends DataSink {
  readonly __type: 'sink';
}

export interface DataSourceItem extends DataSource {
  readonly __type: 'source';
}

export interface DataItem {
  __type: 'sink' | 'source';
}

export interface Data {
  id?: string;
  items: (DataSink | DataSource)[];
}

export type DefaultRecord = Record<string, unknown>;

export type State<
  StateType extends string = string,
  StateData extends DefaultRecord = DefaultRecord,
  EventMetaData extends DefaultRecord | undefined = undefined,
> = Readonly<
  EventMetaData extends undefined
    ? {
        type: StateType;
        data: StateData;
      }
    : {
        type: StateType;
        data: StateData;
        metadata: EventMetaData;
      }
> & {
  readonly kind?: 'State';
};

export interface DefaultCommandMetadata extends Record<string, unknown> {
  now: Date;
}

export type Command<
  CommandType extends string = string,
  CommandData extends DefaultRecord = DefaultRecord,
  CommandMetaData extends DefaultRecord | undefined = undefined,
> = Readonly<
  CommandMetaData extends undefined
    ? {
        type: CommandType;
        data: Readonly<CommandData>;
        metadata?: DefaultCommandMetadata | undefined;
      }
    : {
        type: CommandType;
        data: CommandData;
        metadata: CommandMetaData;
      }
> & {
  readonly kind?: 'Command';
};

export type Event<
  EventType extends string = string,
  EventData extends DefaultRecord = DefaultRecord,
  EventMetaData extends DefaultRecord | undefined = undefined,
> = Readonly<
  EventMetaData extends undefined
    ? {
        type: EventType;
        data: EventData;
      }
    : {
        type: EventType;
        data: EventData;
        metadata: EventMetaData;
      }
> & {
  readonly kind?: 'Event';
};

export type Query<QueryType extends string, QueryData extends Record<string, unknown> = Record<string, unknown>> = {
  type: QueryType;
  data: QueryData;
};

export type ExtractStateData<T> = T extends State<string, infer Data, DefaultRecord | undefined> ? Data : never;

export const ClassificationValues = ['command', 'event', 'state', 'query'] as const;
export type Classification = (typeof ClassificationValues)[number];

export interface TypedRef<K extends Classification, N extends string, D extends DefaultRecord> {
  readonly __kind: K;
  readonly name: N;
  readonly _data?: D;
}

export type AnyTypedRef = TypedRef<Classification, string, DefaultRecord>;
export type DataOf<T> = T extends TypedRef<Classification, string, infer D> ? D : never;
export type NameOf<T> = T extends TypedRef<Classification, infer N, DefaultRecord> ? N : never;
export type KindOf<T> = T extends TypedRef<infer K, string, DefaultRecord> ? K : never;

// Use a globalThis-scoped registry so the loader's isolated module runtime
// (runtime-cjs / `new Function` sandbox) shares the same map with the host
// process. Without this, factory calls in a loaded `.narrative.ts` file
// register into a local map that the resolver never sees.
const GLOBAL_REGISTRY_KEY = '__narrativeRefRegistry_v1';
type GlobalWithRegistry = typeof globalThis & { [GLOBAL_REGISTRY_KEY]?: Map<string, Classification> };
const globalContainer = globalThis as GlobalWithRegistry;
if (!globalContainer[GLOBAL_REGISTRY_KEY]) {
  globalContainer[GLOBAL_REGISTRY_KEY] = new Map<string, Classification>();
}
const refRegistry: Map<string, Classification> = globalContainer[GLOBAL_REGISTRY_KEY]!;

export function registerRef(name: string, kind: Classification): void {
  const existing = refRegistry.get(name);
  if (existing !== undefined && existing !== kind) {
    throw new Error(`Type "${name}" is already registered as "${existing}"; cannot reregister as "${kind}".`);
  }
  refRegistry.set(name, kind);
}

export function getClassificationFor(name: string): Classification | undefined {
  return refRegistry.get(name);
}

export function resetRefRegistry(): void {
  refRegistry.clear();
}

export function defineCommand<D extends DefaultRecord = DefaultRecord, N extends string = string>(
  name: N,
): TypedRef<'command', N, D> {
  registerRef(name, 'command');
  return Object.freeze({ __kind: 'command' as const, name }) as TypedRef<'command', N, D>;
}

export function defineEvent<D extends DefaultRecord = DefaultRecord, N extends string = string>(
  name: N,
): TypedRef<'event', N, D> {
  registerRef(name, 'event');
  return Object.freeze({ __kind: 'event' as const, name }) as TypedRef<'event', N, D>;
}

export function defineState<D extends DefaultRecord = DefaultRecord, N extends string = string>(
  name: N,
): TypedRef<'state', N, D> {
  registerRef(name, 'state');
  return Object.freeze({ __kind: 'state' as const, name }) as TypedRef<'state', N, D>;
}

export function defineQuery<D extends DefaultRecord = DefaultRecord, N extends string = string>(
  name: N,
): TypedRef<'query', N, D> {
  registerRef(name, 'query');
  return Object.freeze({ __kind: 'query' as const, name }) as TypedRef<'query', N, D>;
}
