import type tsNS from 'typescript';
import { type FieldTypeInfo, jsonToExpr, type TypeResolver } from '../ast/emit-helpers';

/**
 * Build a specs() rule() example() block for a GWT entry.
 *
 * Emits the runtime-tagged DSL shape:
 *   example("description")
 *     .given(Ref, "sentence", { ...data })
 *     .and(Ref, "sentence", { ...data })
 *     .when(Ref, "sentence", { ...data })
 *     .then(Ref, "sentence", { ...data });
 *   thenError("sentence", "ValidationError", "optional message");
 *
 * Refs are emitted as bare identifiers (e.g. `AddTodo`) that resolve to
 * the `const X = defineCommand<...>('X')` declarations the types generator
 * produces at the top of the file.
 */

type GivenItem = {
  eventRef?: string;
  stateRef?: string;
  commandRef?: string;
  exampleData: Record<string, unknown>;
  sentence?: string;
};

type WhenItem = {
  commandRef?: string;
  eventRef?: string;
  exampleData: Record<string, unknown>;
  sentence?: string;
};

type ThenItem =
  | {
      eventRef?: string;
      commandRef?: string;
      stateRef?: string;
      exampleData: Record<string, unknown>;
      sentence?: string;
    }
  | {
      errorType: 'IllegalStateError' | 'ValidationError' | 'NotFoundError';
      message?: string;
      sentence?: string;
    };

export type GWTBlock = {
  given?: GivenItem[];
  when?: WhenItem | WhenItem[];
  then: ThenItem[];
};

type Message = { type: string; name: string; fields: Array<{ name: string; type: string; required: boolean }> };

function getRefName(item: { eventRef?: string; stateRef?: string; commandRef?: string }): string {
  return item.eventRef ?? item.stateRef ?? item.commandRef ?? '';
}

function isErrorThenItem(t: ThenItem): t is Extract<ThenItem, { errorType: unknown }> {
  return 'errorType' in t;
}

function getFieldTypeInfo(messages: Message[] | undefined, typeName: string): FieldTypeInfo | undefined {
  if (!messages) return undefined;
  const message = messages.find((msg) => msg.name === typeName);
  if (!message) return undefined;
  const info: FieldTypeInfo = {};
  for (const field of message.fields) info[field.name] = field.type;
  return Object.keys(info).length > 0 ? info : undefined;
}

function createTypeResolver(messages?: Message[]): TypeResolver | undefined {
  if (!messages) return undefined;
  return (typeName: string) => getFieldTypeInfo(messages, typeName);
}

/**
 * When the GWTBlock has no explicit sentence (legacy-shape input where
 * text was the type name, so flow.ts emitted sentence=undefined), fall back
 * to just the type name. Keeps round-tripping of legacy-shape models stable
 * (re-loaded step will store text === typeName, matching the input).
 */
function defaultSentence(_method: string, refName: string): string {
  return refName;
}

function buildStepCallArgs(
  ts: typeof import('typescript'),
  f: tsNS.NodeFactory,
  method: 'given' | 'when' | 'then' | 'and',
  refName: string,
  sentence: string | undefined,
  exampleData: Record<string, unknown>,
  messages?: Message[],
): tsNS.Expression[] {
  const info = getFieldTypeInfo(messages, refName);
  const resolver = createTypeResolver(messages);
  return [
    f.createIdentifier(refName),
    f.createStringLiteral(sentence ?? defaultSentence(method, refName)),
    jsonToExpr(ts, f, exampleData, info, resolver),
  ];
}

function appendStepCall(
  f: tsNS.NodeFactory,
  base: tsNS.Expression,
  method: 'given' | 'when' | 'then' | 'and',
  args: tsNS.Expression[],
): tsNS.Expression {
  return f.createCallExpression(f.createPropertyAccessExpression(base, f.createIdentifier(method)), undefined, args);
}

function chainGivenCalls(
  ts: typeof import('typescript'),
  f: tsNS.NodeFactory,
  base: tsNS.Expression,
  g: GWTBlock,
  messages?: Message[],
): tsNS.Expression {
  if (!g.given || g.given.length === 0) return base;

  let result = base;
  for (let i = 0; i < g.given.length; i++) {
    const item = g.given[i];
    const refName = getRefName(item);
    if (!refName) continue;
    const method = i === 0 ? 'given' : 'and';
    result = appendStepCall(
      f,
      result,
      method,
      buildStepCallArgs(ts, f, method, refName, item.sentence, item.exampleData, messages),
    );
  }
  return result;
}

function normalizeWhen(g: GWTBlock): WhenItem[] {
  if (!g.when) return [];
  return Array.isArray(g.when) ? g.when : [g.when];
}

function isEmptyWhenItem(item: WhenItem): boolean {
  const hasRef = Boolean(item.eventRef ?? item.commandRef);
  const hasData = Object.keys(item.exampleData).length > 0;
  return !hasRef && !hasData;
}

function chainWhenCalls(
  ts: typeof import('typescript'),
  f: tsNS.NodeFactory,
  base: tsNS.Expression,
  g: GWTBlock,
  messages?: Message[],
): tsNS.Expression {
  const whens = normalizeWhen(g);
  if (whens.length === 0) return base;

  let result = base;
  let isFirst = true;
  for (const item of whens) {
    if (isEmptyWhenItem(item)) continue;
    const refName = getRefName(item);
    if (!refName) continue;
    const method = isFirst ? 'when' : 'and';
    result = appendStepCall(
      f,
      result,
      method,
      buildStepCallArgs(ts, f, method, refName, item.sentence, item.exampleData, messages),
    );
    isFirst = false;
  }
  return result;
}

function chainThenCalls(
  ts: typeof import('typescript'),
  f: tsNS.NodeFactory,
  base: tsNS.Expression,
  g: GWTBlock,
  messages?: Message[],
): { expression: tsNS.Expression; errorStatements: tsNS.Statement[] } {
  if (g.then.length === 0) return { expression: base, errorStatements: [] };

  let result = base;
  let isFirst = true;
  const errorStatements: tsNS.Statement[] = [];

  for (const item of g.then) {
    if (isErrorThenItem(item)) {
      const args: tsNS.Expression[] = [
        f.createStringLiteral(item.sentence ?? `rejected with ${item.errorType}`),
        f.createStringLiteral(item.errorType),
      ];
      if (item.message !== undefined && item.message !== null && item.message !== '') {
        args.push(f.createStringLiteral(item.message));
      }
      errorStatements.push(
        f.createExpressionStatement(f.createCallExpression(f.createIdentifier('thenError'), undefined, args)),
      );
      continue;
    }

    const refName = getRefName(item);
    if (!refName) continue;
    const method = isFirst ? 'then' : 'and';
    result = appendStepCall(
      f,
      result,
      method,
      buildStepCallArgs(ts, f, method, refName, item.sentence, item.exampleData, messages),
    );
    isFirst = false;
  }

  return { expression: result, errorStatements };
}

function getDescriptions(
  g: GWTBlock & { description?: string; ruleDescription?: string; exampleDescription?: string },
) {
  const ruleDesc =
    g.ruleDescription !== null && g.ruleDescription !== undefined && g.ruleDescription !== ''
      ? g.ruleDescription
      : 'Generated rule description';

  const exampleDesc =
    g.exampleDescription !== null && g.exampleDescription !== undefined && g.exampleDescription !== ''
      ? g.exampleDescription
      : g.description !== null && g.description !== undefined && g.description !== ''
        ? g.description
        : 'Generated example description';

  return { ruleDesc, exampleDesc };
}

function buildExampleStatements(
  ts: typeof import('typescript'),
  f: tsNS.NodeFactory,
  g: GWTBlock & { description?: string; exampleDescription?: string },
  messages?: Message[],
): tsNS.Statement[] {
  const { exampleDesc } = getDescriptions(
    g as GWTBlock & { description?: string; ruleDescription?: string; exampleDescription?: string },
  );

  let chain: tsNS.Expression = f.createCallExpression(f.createIdentifier('example'), undefined, [
    f.createStringLiteral(exampleDesc),
  ]);

  chain = chainGivenCalls(ts, f, chain, g, messages);
  chain = chainWhenCalls(ts, f, chain, g, messages);
  const { expression, errorStatements } = chainThenCalls(ts, f, chain, g, messages);

  return [f.createExpressionStatement(expression), ...errorStatements];
}

function buildRuleCall(
  ts: typeof import('typescript'),
  f: tsNS.NodeFactory,
  ruleDesc: string,
  ruleId: string | undefined,
  exampleStatements: tsNS.Statement[],
): tsNS.Statement {
  const ruleArgs: tsNS.Expression[] = [f.createStringLiteral(ruleDesc)];

  if (ruleId !== null && ruleId !== undefined) {
    ruleArgs.push(f.createStringLiteral(ruleId));
  }

  ruleArgs.push(
    f.createArrowFunction(
      undefined,
      undefined,
      [],
      undefined,
      f.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
      f.createBlock(exampleStatements, true),
    ),
  );

  return f.createExpressionStatement(f.createCallExpression(f.createIdentifier('rule'), undefined, ruleArgs));
}

export function buildGwtSpecBlock(
  ts: typeof import('typescript'),
  f: tsNS.NodeFactory,
  g: GWTBlock & { description?: string; ruleDescription?: string; exampleDescription?: string; ruleId?: string },
  _sliceKind: 'command' | 'react' | 'query' | 'experience',
  messages?: Message[],
): tsNS.Statement {
  const { ruleDesc } = getDescriptions(g);
  const exampleStatements = buildExampleStatements(ts, f, g, messages);
  return buildRuleCall(ts, f, ruleDesc, g.ruleId, exampleStatements);
}

export function buildConsolidatedGwtSpecBlock(
  ts: typeof import('typescript'),
  f: tsNS.NodeFactory,
  rule: { id?: string; description: string },
  gwtBlocks: Array<
    GWTBlock & { description?: string; ruleDescription?: string; exampleDescription?: string; ruleId?: string }
  >,
  _sliceKind: 'command' | 'react' | 'query' | 'experience',
  messages?: Message[],
): tsNS.Statement {
  const exampleStatements: tsNS.Statement[] = [];
  for (const g of gwtBlocks) {
    exampleStatements.push(...buildExampleStatements(ts, f, g, messages));
  }
  return buildRuleCall(ts, f, rule.description, rule.id, exampleStatements);
}
