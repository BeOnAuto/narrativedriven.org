type BuildImportsOpts = { flowImport: string; integrationImport: string };

export const ALL_FLOW_FUNCTION_NAMES = [
  'actor',
  'assumptions',
  'command',
  'data',
  'defineCommand',
  'defineEvent',
  'defineQuery',
  'defineState',
  'describe',
  'entity',
  'example',
  'experience',
  'gql',
  'it',
  'narrative',
  'outcome',
  'query',
  'react',
  'requirements',
  'rule',
  'scene',
  'sink',
  'source',
  'specs',
  'target',
] as const;

export function buildImports(
  ts: typeof import('typescript'),
  opts: BuildImportsOpts,
  messages: Array<{ type: string; name: string }>,
  typeIntegrationNames: string[],
  valueIntegrationNames: string[] = [],
  usedFlowFunctionNames: string[] = [],
) {
  const f = ts.factory;

  // Runtime factories needed per message-type so the emitted
  // `const X = define<Kind>(...)` declarations resolve.
  const factoryMapping: Record<string, string> = {
    command: 'defineCommand',
    event: 'defineEvent',
    state: 'defineState',
    query: 'defineQuery',
  };
  const usedMessageTypes = new Set(messages.map((msg) => msg.type));
  const factoryNames = Array.from(usedMessageTypes)
    .map((type) => factoryMapping[type])
    .filter(Boolean);

  const flowValueNames = Array.from(new Set([...usedFlowFunctionNames, ...factoryNames])).sort();

  // Type-level imports for `Command<...>` / `Event<...>` aliases are no longer
  // emitted — factory call declarations replace them. Empty the list.
  const flowTypeNames: string[] = [];

  const importFlowValues =
    flowValueNames.length > 0
      ? f.createImportDeclaration(
          undefined,
          f.createImportClause(
            false,
            undefined,
            f.createNamedImports([
              ...flowValueNames.map((n) => f.createImportSpecifier(false, undefined, f.createIdentifier(n))),
            ]),
          ),
          f.createStringLiteral(opts.flowImport),
        )
      : null;

  const importFlowTypes =
    flowTypeNames.length > 0
      ? f.createImportDeclaration(
          undefined,
          f.createImportClause(
            true,
            undefined,
            f.createNamedImports([
              ...flowTypeNames.map((n) => f.createImportSpecifier(false, undefined, f.createIdentifier(n))),
            ]),
          ),
          f.createStringLiteral(opts.flowImport),
        )
      : null;

  const importIntegrationValues =
    valueIntegrationNames.length > 0
      ? f.createImportDeclaration(
          undefined,
          f.createImportClause(
            false,
            undefined,
            f.createNamedImports([
              ...valueIntegrationNames.map((n) => f.createImportSpecifier(false, undefined, f.createIdentifier(n))),
            ]),
          ),
          f.createStringLiteral(opts.integrationImport),
        )
      : null;

  const importIntegrationTypes =
    typeIntegrationNames.length > 0
      ? f.createImportDeclaration(
          undefined,
          f.createImportClause(
            true,
            undefined,
            f.createNamedImports([
              ...typeIntegrationNames.map((n) => f.createImportSpecifier(false, undefined, f.createIdentifier(n))),
            ]),
          ),
          f.createStringLiteral(opts.integrationImport),
        )
      : null;

  return {
    importFlowValues,
    importFlowTypes,
    importIntegrationValues,
    importIntegrationTypes,
  };
}
