import type { Message } from '../../index';
import type { TypeInfo } from '../../loader/ts-utils';
import { collectExampleHintsForData, type ExampleShapeHints } from './example-shapes';
import { createMessage } from './messages';
import { preferNewFields } from './normalize';

/**
 * Extracts the query name from a GraphQL request string.
 * Supports both SDL strings and JSON-serialized AST.
 *
 * Kept as a standalone utility — consumed by external tooling that inspects
 * moment requests. The classification path no longer needs it.
 */
export function extractQueryNameFromRequest(request: string | undefined): string | null {
  if (!request) return null;
  const queryMatch = request.match(/query\s+(\w+)/i);
  if (queryMatch) {
    return queryMatch[1];
  }
  if (request.startsWith('{') && request.includes('"kind"')) {
    try {
      const ast = JSON.parse(request) as unknown;
      if (
        typeof ast === 'object' &&
        ast !== null &&
        'definitions' in ast &&
        Array.isArray((ast as { definitions: unknown[] }).definitions)
      ) {
        const definitions = (ast as { definitions: Array<{ kind?: string; name?: { value?: string } }> }).definitions;
        const opDef = definitions.find((d) => d.kind === 'OperationDefinition');
        if (opDef?.name?.value) {
          return opDef.name.value;
        }
      }
    } catch {}
  }
  return null;
}

/**
 * Detects if a When-text is a query-action name (the GraphQL query name in the
 * moment's request). Retained for backward compat — internal classification
 * arrives via the TypedRef factory registry, so internal code no longer needs
 * this.
 */
export function detectQueryAction(whenText: string, slice: { type: string; request?: string }): boolean {
  if (slice.type !== 'query') return false;
  if (!whenText) return false;
  const queryName = extractQueryNameFromRequest(slice.request);
  if (!queryName) return false;
  return whenText === queryName || whenText.toLowerCase() === queryName.toLowerCase();
}

type TypeResolver = (
  t: string,
  expected?: 'command' | 'event' | 'state' | 'query',
  exampleData?: unknown,
) => { resolvedName: string; typeInfo: TypeInfo | undefined };

type RefItem = {
  eventRef?: string;
  commandRef?: string;
  stateRef?: string;
  exampleData?: unknown;
};

function getRefName(item: RefItem): string | undefined {
  return item.eventRef ?? item.commandRef ?? item.stateRef;
}

function registerMessage(
  name: string,
  typeInfo: TypeInfo | undefined,
  fallbackKind: 'command' | 'event' | 'state' | 'query',
  messages: Map<string, Message>,
): void {
  const kind = typeInfo?.classification ?? fallbackKind;
  const msg = createMessage(name, typeInfo, kind);
  const existing = messages.get(name);
  if (!existing || preferNewFields(msg.fields, existing.fields)) {
    messages.set(name, msg);
  }
}

function handleRef(
  item: RefItem,
  fallbackKind: 'command' | 'event' | 'state' | 'query',
  resolveTypeAndInfo: TypeResolver,
  messages: Map<string, Message>,
  exampleShapeHints: ExampleShapeHints,
): void {
  const name = getRefName(item);
  if (typeof name !== 'string' || name.length === 0) return;

  const { typeInfo } = resolveTypeAndInfo(name);

  if (item.exampleData !== undefined) {
    collectExampleHintsForData(name, item.exampleData, exampleShapeHints);
  }

  registerMessage(name, typeInfo, fallbackKind, messages);
}

export function processGiven(
  given: RefItem[],
  resolveTypeAndInfo: TypeResolver,
  messages: Map<string, Message>,
  exampleShapeHints: ExampleShapeHints,
): void {
  // Fallback kind is 'event' (most common Given classification); resolver's
  // typeInfo.classification wins when present.
  for (const g of given) {
    handleRef(g, 'event', resolveTypeAndInfo, messages, exampleShapeHints);
  }
}

export function processWhen(
  when: RefItem | RefItem[],
  slice: { type: string; request?: string },
  resolveTypeAndInfo: TypeResolver,
  messages: Map<string, Message>,
  exampleShapeHints: ExampleShapeHints,
): void {
  const items = Array.isArray(when) ? when : [when];
  const baseFallback: 'command' | 'event' = slice.type === 'command' ? 'command' : 'event';
  for (const item of items) {
    const name = getRefName(item);
    // Query-action shape: in a query moment, a When whose ref name matches the
    // moment's GraphQL query name is the query itself being executed, not an event.
    // When the resolver can't classify (e.g. unregistered ref), this falls through
    // to `baseFallback`.
    const fallbackKind = name && detectQueryAction(name, slice) ? 'query' : baseFallback;
    handleRef(item, fallbackKind, resolveTypeAndInfo, messages, exampleShapeHints);
  }
}

export function processThen(
  then: RefItem[],
  resolveTypeAndInfo: TypeResolver,
  messages: Map<string, Message>,
  exampleShapeHints: ExampleShapeHints,
): void {
  for (const t of then) {
    handleRef(t, 'event', resolveTypeAndInfo, messages, exampleShapeHints);
  }
}
