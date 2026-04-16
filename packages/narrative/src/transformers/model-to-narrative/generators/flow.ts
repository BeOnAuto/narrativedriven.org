import type tsNS from 'typescript';
import type { z } from 'zod';
import type {
  CommandMoment as CommandMomentType,
  ExperienceMoment as ExperienceMomentType,
  QueryMoment as QueryMomentType,
  ReactMoment as ReactMomentType,
  Scene,
} from '../../../index';
import type {
  ClientSpecNode,
  DataSinkSchema,
  DataSourceSchema,
  DataTargetSchema,
  DestinationSchema,
  ExampleSchema,
  OriginSchema,
} from '../../../schema';
import { jsonToExpr } from '../ast/emit-helpers';
import { integrationNameToPascalCase } from '../utils/strings';
import { buildConsolidatedGwtSpecBlock, type GWTBlock } from './gwt';
import { buildAssumptionsCall, buildRequirementsCall } from './metadata';

type CommandMoment = CommandMomentType;
type QueryMoment = QueryMomentType;
type ReactMoment = ReactMomentType;
type ExperienceMoment = ExperienceMomentType;
type Example = z.infer<typeof ExampleSchema>;
type DataSinkItem = z.infer<typeof DataSinkSchema>;
type DataSourceItem = z.infer<typeof DataSourceSchema>;
type DataTargetItem = z.infer<typeof DataTargetSchema>;
type Destination = z.infer<typeof DestinationSchema>;
type Origin = z.infer<typeof OriginSchema>;
type Moment = CommandMoment | QueryMoment | ReactMoment | ExperienceMoment;

function buildClientSpecNode(
  ts: typeof import('typescript'),
  f: tsNS.NodeFactory,
  node: ClientSpecNode,
): tsNS.Statement {
  if (node.type === 'it') {
    const args: tsNS.Expression[] = [];

    args.push(f.createStringLiteral(node.title));
    if (node.id !== undefined && node.id !== '') {
      args.push(f.createStringLiteral(node.id));
    }

    return f.createExpressionStatement(f.createCallExpression(f.createIdentifier('it'), undefined, args));
  } else {
    const childStatements = (node.children || []).map((child) => buildClientSpecNode(ts, f, child));

    const args: tsNS.Expression[] = [];

    args.push(f.createStringLiteral(node.title ?? ''));
    if (node.id !== undefined && node.id !== '') {
      args.push(f.createStringLiteral(node.id));
    }

    args.push(
      f.createArrowFunction(
        undefined,
        undefined,
        [],
        undefined,
        f.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
        f.createBlock(childStatements, true),
      ),
    );

    return f.createExpressionStatement(f.createCallExpression(f.createIdentifier('describe'), undefined, args));
  }
}

function buildClientSpecs(
  ts: typeof import('typescript'),
  f: tsNS.NodeFactory,
  specs: ClientSpecNode[],
): tsNS.Statement[] {
  return specs.map((node) => buildClientSpecNode(ts, f, node));
}

function buildInitialChain(
  ts: typeof import('typescript'),
  f: tsNS.NodeFactory,
  target: DataSinkItem['target'] | DataSourceItem['target'],
  id?: string,
): tsNS.Expression {
  const op = target.type === 'Event' ? 'event' : target.type === 'Command' ? 'command' : 'state';
  const sinkOrSourceArgs: tsNS.Expression[] = id != null && id !== '' ? [f.createStringLiteral(id)] : [];
  return f.createCallExpression(
    f.createPropertyAccessExpression(
      target.type === 'State'
        ? f.createCallExpression(f.createIdentifier('source'), undefined, sinkOrSourceArgs)
        : f.createCallExpression(f.createIdentifier('sink'), undefined, sinkOrSourceArgs),
      ts.factory.createIdentifier(op),
    ),
    undefined,
    [f.createStringLiteral(target.name)],
  );
}

function addDestinationToChain(f: tsNS.NodeFactory, chain: tsNS.Expression, destination: Destination): tsNS.Expression {
  switch (destination.type) {
    case 'stream':
      return f.createCallExpression(
        f.createPropertyAccessExpression(chain, f.createIdentifier('toStream')),
        undefined,
        [f.createStringLiteral(destination.pattern)],
      );
    case 'database':
      return f.createCallExpression(
        f.createPropertyAccessExpression(chain, f.createIdentifier('toDatabase')),
        undefined,
        [f.createStringLiteral(destination.collection)],
      );
    case 'topic':
      return f.createCallExpression(f.createPropertyAccessExpression(chain, f.createIdentifier('toTopic')), undefined, [
        f.createStringLiteral(destination.name),
      ]);
    case 'integration': {
      const [system] = destination.systems;
      const args: tsNS.Expression[] = [f.createIdentifier(system)];
      if (destination.message) {
        args.push(f.createStringLiteral(destination.message.name));
        args.push(f.createStringLiteral(destination.message.type));
      }
      return f.createCallExpression(
        f.createPropertyAccessExpression(chain, f.createIdentifier('toIntegration')),
        undefined,
        args,
      );
    }
    default:
      return chain;
  }
}

function buildProjectionCall(
  f: tsNS.NodeFactory,
  baseCall: tsNS.Expression,
  origin: { type: 'projection'; name: string; idField?: string | string[]; singleton?: boolean },
): tsNS.Expression {
  if (origin.singleton === true) {
    return f.createCallExpression(
      f.createPropertyAccessExpression(baseCall, f.createIdentifier('fromSingletonProjection')),
      undefined,
      [f.createStringLiteral(origin.name)],
    );
  }
  if (Array.isArray(origin.idField)) {
    return f.createCallExpression(
      f.createPropertyAccessExpression(baseCall, f.createIdentifier('fromCompositeProjection')),
      undefined,
      [
        f.createStringLiteral(origin.name),
        f.createArrayLiteralExpression(origin.idField.map((field) => f.createStringLiteral(field))),
      ],
    );
  }
  if (typeof origin.idField === 'string' && origin.idField.length > 0) {
    return f.createCallExpression(
      f.createPropertyAccessExpression(baseCall, f.createIdentifier('fromProjection')),
      undefined,
      [f.createStringLiteral(origin.name), f.createStringLiteral(origin.idField)],
    );
  }
  return f.createCallExpression(
    f.createPropertyAccessExpression(baseCall, f.createIdentifier('fromSingletonProjection')),
    undefined,
    [f.createStringLiteral(origin.name)],
  );
}

function buildStateCall(
  ts: typeof import('typescript'),
  f: tsNS.NodeFactory,
  origin: Origin,
  stateName: string,
): tsNS.Expression {
  const baseStateCall = f.createCallExpression(
    f.createPropertyAccessExpression(
      f.createCallExpression(f.createIdentifier('source'), undefined, []),
      f.createIdentifier('state'),
    ),
    undefined,
    [f.createStringLiteral(stateName)],
  );

  switch (origin.type) {
    case 'integration': {
      const [sys] = origin.systems;
      return f.createCallExpression(
        f.createPropertyAccessExpression(baseStateCall, f.createIdentifier('fromIntegration')),
        undefined,
        [f.createIdentifier(sys)],
      );
    }
    case 'projection':
      return buildProjectionCall(f, baseStateCall, origin);
    case 'database': {
      const args: tsNS.Expression[] = [f.createStringLiteral(origin.collection)];
      if (origin.query !== null && origin.query !== undefined) {
        args.push(jsonToExpr(ts, f, origin.query));
      }
      return f.createCallExpression(
        f.createPropertyAccessExpression(baseStateCall, f.createIdentifier('fromDatabase')),
        undefined,
        args,
      );
    }
    case 'api': {
      const args: tsNS.Expression[] = [f.createStringLiteral(origin.endpoint)];
      if (origin.method !== null && origin.method !== undefined) {
        args.push(f.createStringLiteral(origin.method));
      }
      return f.createCallExpression(
        f.createPropertyAccessExpression(baseStateCall, f.createIdentifier('fromApi')),
        undefined,
        args,
      );
    }
    case 'readModel':
      return f.createCallExpression(
        f.createPropertyAccessExpression(baseStateCall, f.createIdentifier('fromReadModel')),
        undefined,
        [f.createStringLiteral(origin.name)],
      );
    default:
      return baseStateCall;
  }
}

function buildProjectionArgs(
  f: tsNS.NodeFactory,
  origin: { name: string; idField?: string | string[]; singleton?: boolean },
): tsNS.Expression[] {
  if (origin.singleton === true) {
    return [f.createStringLiteral(origin.name)];
  }
  if (Array.isArray(origin.idField)) {
    return [
      f.createStringLiteral(origin.name),
      f.createArrayLiteralExpression(origin.idField.map((field) => f.createStringLiteral(field))),
    ];
  }
  if (typeof origin.idField === 'string' && origin.idField.length > 0) {
    return [f.createStringLiteral(origin.name), f.createStringLiteral(origin.idField)];
  }
  return [f.createStringLiteral(origin.name)];
}

function getProjectionMethodName(origin: { idField?: string | string[]; singleton?: boolean }): string {
  if (origin.singleton === true) {
    return 'fromSingletonProjection';
  }
  if (Array.isArray(origin.idField)) {
    return 'fromCompositeProjection';
  }
  return 'fromProjection';
}

function buildOriginArgs(ts: typeof import('typescript'), f: tsNS.NodeFactory, origin: Origin): tsNS.Expression[] {
  switch (origin.type) {
    case 'projection':
      return buildProjectionArgs(f, origin);
    case 'integration': {
      const [sys] = origin.systems;
      return [f.createIdentifier(sys)];
    }
    case 'database': {
      const args: tsNS.Expression[] = [f.createStringLiteral(origin.collection)];
      if (origin.query !== null && origin.query !== undefined) {
        args.push(jsonToExpr(ts, f, origin.query));
      }
      return args;
    }
    case 'api': {
      const args: tsNS.Expression[] = [f.createStringLiteral(origin.endpoint)];
      if (origin.method !== null && origin.method !== undefined) {
        args.push(f.createStringLiteral(origin.method));
      }
      return args;
    }
    case 'readModel':
      return [f.createStringLiteral(origin.name)];
    default:
      return [];
  }
}

function getOriginMethodName(origin: Origin): string {
  switch (origin.type) {
    case 'projection':
      return getProjectionMethodName(origin);
    case 'integration':
      return 'fromIntegration';
    case 'database':
      return 'fromDatabase';
    case 'api':
      return 'fromApi';
    case 'readModel':
      return 'fromReadModel';
    default:
      return 'fromReadModel';
  }
}

function buildSingleDataItem(
  ts: typeof import('typescript'),
  f: tsNS.NodeFactory,
  it: DataSinkItem | DataSourceItem | DataTargetItem,
): tsNS.Expression {
  if (!('destination' in it) && !('origin' in it)) {
    const args: tsNS.Expression[] = it.id != null && it.id !== '' ? [f.createStringLiteral(it.id)] : [];
    return f.createCallExpression(
      f.createPropertyAccessExpression(
        f.createCallExpression(f.createIdentifier('target'), undefined, args),
        f.createIdentifier('event'),
      ),
      undefined,
      [f.createStringLiteral(it.target.name)],
    );
  }

  let chain = buildInitialChain(ts, f, it.target, it.id);

  if ('destination' in it) {
    const sinkItem = it;
    chain = addDestinationToChain(f, chain, sinkItem.destination);

    if (sinkItem._withState) {
      const stateCall = buildStateCall(ts, f, sinkItem._withState.origin, sinkItem._withState.target.name);
      chain = f.createCallExpression(
        f.createPropertyAccessExpression(chain, f.createIdentifier('withState')),
        undefined,
        [stateCall],
      );
    }

    if (sinkItem._additionalInstructions !== null && sinkItem._additionalInstructions !== undefined) {
      chain = f.createCallExpression(
        f.createPropertyAccessExpression(chain, f.createIdentifier('additionalInstructions')),
        undefined,
        [f.createStringLiteral(sinkItem._additionalInstructions)],
      );
    }
  } else if ('origin' in it) {
    const sourceItem = it;
    const sourceArgs: tsNS.Expression[] =
      sourceItem.id != null && sourceItem.id !== '' ? [f.createStringLiteral(sourceItem.id)] : [];
    chain = f.createCallExpression(
      f.createPropertyAccessExpression(
        f.createCallExpression(
          f.createPropertyAccessExpression(
            f.createCallExpression(f.createIdentifier('source'), undefined, sourceArgs),
            f.createIdentifier('state'),
          ),
          undefined,
          [f.createStringLiteral(sourceItem.target.name)],
        ),
        f.createIdentifier(getOriginMethodName(sourceItem.origin)),
      ),
      undefined,
      buildOriginArgs(ts, f, sourceItem.origin),
    );

    if (sourceItem._additionalInstructions != null && sourceItem._additionalInstructions !== '') {
      chain = f.createCallExpression(
        f.createPropertyAccessExpression(chain, f.createIdentifier('additionalInstructions')),
        undefined,
        [f.createStringLiteral(sourceItem._additionalInstructions)],
      );
    }
  }

  return chain;
}

function buildDataItems(
  ts: typeof import('typescript'),
  f: tsNS.NodeFactory,
  data: { id?: string; items: Array<DataSinkItem | DataSourceItem | DataTargetItem> },
) {
  const calls = data.items.map((it) => buildSingleDataItem(ts, f, it));

  // Build the data object: { id?: string, items: [...] }
  const properties: tsNS.ObjectLiteralElementLike[] = [];

  if (data.id != null && data.id !== '') {
    properties.push(f.createPropertyAssignment('id', f.createStringLiteral(data.id)));
  }

  properties.push(f.createPropertyAssignment('items', f.createArrayLiteralExpression(calls, false)));

  return f.createExpressionStatement(
    f.createCallExpression(f.createIdentifier('data'), undefined, [f.createObjectLiteralExpression(properties, false)]),
  );
}

function addClientToChain(
  ts: typeof import('typescript'),
  f: tsNS.NodeFactory,
  chain: tsNS.Expression,
  slice: CommandMoment | QueryMoment | ReactMoment | ExperienceMoment,
): tsNS.Expression {
  if (
    'client' in slice &&
    slice.client !== null &&
    slice.client !== undefined &&
    'specs' in slice.client &&
    slice.client.specs !== undefined &&
    slice.client.specs.length > 0
  ) {
    return f.createCallExpression(f.createPropertyAccessExpression(chain, f.createIdentifier('client')), undefined, [
      f.createArrowFunction(
        undefined,
        undefined,
        [],
        undefined,
        f.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
        f.createBlock(buildClientSpecs(ts, f, slice.client.specs), true),
      ),
    ]);
  }
  return chain;
}

function addUiToChain(
  ts: typeof import('typescript'),
  f: tsNS.NodeFactory,
  chain: tsNS.Expression,
  slice: Moment,
): tsNS.Expression {
  if ('client' in slice && slice.client?.ui !== undefined) {
    return f.createCallExpression(f.createPropertyAccessExpression(chain, f.createIdentifier('ui')), undefined, [
      jsonToExpr(ts, f, slice.client.ui),
    ]);
  }
  return chain;
}

function addExitsToChain(
  ts: typeof import('typescript'),
  f: tsNS.NodeFactory,
  chain: tsNS.Expression,
  slice: Moment,
): tsNS.Expression {
  if (slice.exits !== undefined && slice.exits.length > 0) {
    return f.createCallExpression(f.createPropertyAccessExpression(chain, f.createIdentifier('exits')), undefined, [
      jsonToExpr(ts, f, slice.exits),
    ]);
  }
  return chain;
}

function addRequestToChain(
  f: tsNS.NodeFactory,
  chain: tsNS.Expression,
  slice: CommandMoment | QueryMoment | ReactMoment | ExperienceMoment,
): tsNS.Expression {
  if ('request' in slice && slice.request !== null && slice.request !== undefined) {
    const gqlTpl = f.createNoSubstitutionTemplateLiteral(slice.request);
    return f.createCallExpression(f.createPropertyAccessExpression(chain, f.createIdentifier('request')), undefined, [
      f.createCallExpression(f.createIdentifier('gql'), undefined, [gqlTpl]),
    ]);
  }
  return chain;
}

interface StepWithDocString {
  keyword: 'Given' | 'When' | 'Then' | 'And';
  text: string;
  __typeName?: string;
  docString?: Record<string, unknown>;
}

interface StepWithError {
  keyword: 'Then';
  text?: string;
  error: { type: string; message?: string };
}

type Step = StepWithDocString | StepWithError;

function isStepWithError(step: Step): step is StepWithError {
  return 'error' in step;
}

function refNameOf(step: StepWithDocString): string {
  return step.__typeName ?? step.text;
}

/** The emitter stores the Gherkin sentence as step.text when it differs from the type name. */
function sentenceOf(step: StepWithDocString): string | undefined {
  return step.__typeName !== undefined && step.__typeName !== step.text ? step.text : undefined;
}

function processErrorStep(step: StepWithError, gwtBlock: GWTBlock): void {
  gwtBlock.then.push({
    errorType: step.error.type as 'IllegalStateError' | 'ValidationError' | 'NotFoundError',
    message: step.error.message,
    sentence: step.text,
  });
}

function processGivenStep(step: StepWithDocString, gwtBlock: GWTBlock): void {
  if (!gwtBlock.given) gwtBlock.given = [];
  gwtBlock.given.push({ eventRef: refNameOf(step), exampleData: step.docString ?? {}, sentence: sentenceOf(step) });
}

function processWhenStep(
  step: StepWithDocString,
  momentType: 'command' | 'query' | 'react' | 'experience',
  gwtBlock: GWTBlock,
): void {
  const refName = refNameOf(step);
  const sentence = sentenceOf(step);
  if (momentType === 'command') {
    gwtBlock.when = { commandRef: refName, exampleData: step.docString ?? {}, sentence };
  } else if (momentType === 'react' || momentType === 'query') {
    const eventData = { eventRef: refName, exampleData: step.docString ?? {}, sentence };
    if (!gwtBlock.when) {
      gwtBlock.when = [eventData];
    } else if (Array.isArray(gwtBlock.when)) {
      gwtBlock.when.push(eventData);
    }
  }
}

function processThenStep(step: StepWithDocString, gwtBlock: GWTBlock): void {
  gwtBlock.then.push({ eventRef: refNameOf(step), exampleData: step.docString ?? {}, sentence: sentenceOf(step) });
}

function processStepsFormat(
  steps: Step[],
  momentType: 'command' | 'query' | 'react' | 'experience',
  gwtBlock: GWTBlock,
): void {
  let effectiveKeyword: 'Given' | 'When' | 'Then' = 'Given';

  for (const step of steps) {
    if (isStepWithError(step)) {
      processErrorStep(step, gwtBlock);
      continue;
    }

    if (step.keyword !== 'And') {
      effectiveKeyword = step.keyword;
    }

    if (effectiveKeyword === 'Given') {
      processGivenStep(step, gwtBlock);
    } else if (effectiveKeyword === 'When') {
      processWhenStep(step, momentType, gwtBlock);
    } else if (effectiveKeyword === 'Then') {
      processThenStep(step, gwtBlock);
    }
  }
}

function convertExampleToGWT(example: Example, momentType: 'command' | 'query' | 'react' | 'experience'): GWTBlock {
  const gwtBlock: GWTBlock = { then: [] };
  (gwtBlock as { name?: string }).name = example.name;

  if (Array.isArray(example.steps) && example.steps.length > 0) {
    processStepsFormat(example.steps as Step[], momentType, gwtBlock);
  }

  return gwtBlock;
}

type RuleType = { id?: string; name: string; examples: Example[] };
type RuleGroup = { rule: RuleType; examples: Example[] };
type SpecType = { type: 'gherkin'; feature: string; rules: RuleType[] };

function buildRuleGroups(rules: RuleType[]): Map<string, RuleGroup> {
  const ruleGroups = new Map<string, RuleGroup>();

  for (const rule of rules) {
    const ruleId = rule.id ?? 'no-id';
    const ruleKey = `${ruleId}:${rule.name}`;

    if (ruleGroups.has(ruleKey)) {
      const existingGroup = ruleGroups.get(ruleKey)!;
      existingGroup.examples.push(...rule.examples);
    } else {
      ruleGroups.set(ruleKey, { rule, examples: [...rule.examples] });
    }
  }

  return ruleGroups;
}

function buildConsolidatedRules(
  ts: typeof import('typescript'),
  f: tsNS.NodeFactory,
  ruleGroups: Map<string, RuleGroup>,
  momentType: 'command' | 'query' | 'react' | 'experience',
  messages?: Array<{ type: string; name: string; fields: Array<{ name: string; type: string; required: boolean }> }>,
): tsNS.Statement[] {
  const allRuleStatements: tsNS.Statement[] = [];

  for (const { rule, examples } of ruleGroups.values()) {
    const gwtBlocks = examples.map((example) => {
      const gwtBlock = convertExampleToGWT(example, momentType);
      const extendedGwtBlock = gwtBlock as GWTBlock & {
        ruleDescription?: string;
        exampleDescription?: string;
        ruleId?: string;
        exampleId?: string;
      };

      extendedGwtBlock.ruleDescription = rule.name;
      const oldFormatExample = example as { name?: string; description?: string };
      extendedGwtBlock.exampleDescription = oldFormatExample.name ?? oldFormatExample.description;
      extendedGwtBlock.ruleId = rule.id;
      extendedGwtBlock.exampleId = example.id;

      return extendedGwtBlock;
    });

    allRuleStatements.push(
      buildConsolidatedGwtSpecBlock(ts, f, { id: rule.id, description: rule.name }, gwtBlocks, momentType, messages),
    );
  }

  return allRuleStatements;
}

function buildSingleSpecStatements(
  ts: typeof import('typescript'),
  f: tsNS.NodeFactory,
  spec: SpecType,
  momentType: 'command' | 'query' | 'react' | 'experience',
  messages?: Array<{ type: string; name: string; fields: Array<{ name: string; type: string; required: boolean }> }>,
): tsNS.Statement {
  const ruleGroups = buildRuleGroups(spec.rules);
  const allRuleStatements = buildConsolidatedRules(ts, f, ruleGroups, momentType, messages);

  const arrowFunction = f.createArrowFunction(
    undefined,
    undefined,
    [],
    undefined,
    f.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
    f.createBlock(allRuleStatements, true),
  );

  const args: tsNS.Expression[] = [];
  if (spec.feature && spec.feature.trim() !== '') {
    args.push(f.createStringLiteral(spec.feature));
  }
  args.push(arrowFunction);

  return f.createExpressionStatement(f.createCallExpression(f.createIdentifier('specs'), undefined, args));
}

interface OldSpecFormat {
  name?: string;
  rules?: Array<{ description?: string; id?: string; examples?: Example[] }>;
}

function convertOldSpecToNewFormat(oldSpec: OldSpecFormat): SpecType | null {
  if (oldSpec.rules === undefined || oldSpec.rules.length === 0) {
    return null;
  }
  return {
    type: 'gherkin',
    feature: oldSpec.name ?? '',
    rules: oldSpec.rules.map((r) => ({
      id: r.id,
      name: r.description ?? '',
      examples: r.examples ?? [],
    })),
  };
}

function buildServerStatements(
  ts: typeof import('typescript'),
  f: tsNS.NodeFactory,
  server: CommandMoment['server'] | QueryMoment['server'] | ReactMoment['server'],
  momentType: 'command' | 'query' | 'react' | 'experience',
  messages?: Array<{ type: string; name: string; fields: Array<{ name: string; type: string; required: boolean }> }>,
): tsNS.Statement[] {
  const statements: tsNS.Statement[] = [];

  if (server.data?.items && server.data.items.length > 0) {
    statements.push(
      buildDataItems(
        ts,
        f,
        server.data as { id?: string; items: Array<DataSinkItem | DataSourceItem | DataTargetItem> },
      ),
    );
  }

  if (server.specs !== null && server.specs !== undefined) {
    if (Array.isArray(server.specs)) {
      for (const spec of server.specs as SpecType[]) {
        statements.push(buildSingleSpecStatements(ts, f, spec, momentType, messages));
      }
    } else {
      const convertedSpec = convertOldSpecToNewFormat(server.specs as OldSpecFormat);
      if (convertedSpec !== null) {
        statements.push(buildSingleSpecStatements(ts, f, convertedSpec, momentType, messages));
      }
    }
  }

  return statements;
}

function addServerToChain(
  ts: typeof import('typescript'),
  f: tsNS.NodeFactory,
  chain: tsNS.Expression,
  slice: CommandMoment | QueryMoment | ReactMoment | ExperienceMoment,
  messages?: Array<{ type: string; name: string; fields: Array<{ name: string; type: string; required: boolean }> }>,
): tsNS.Expression {
  if ('server' in slice && slice.server !== null && slice.server !== undefined) {
    const momentType = slice.type as 'command' | 'query' | 'react' | 'experience';
    const serverStatements = buildServerStatements(
      ts,
      f,
      slice.server,
      momentType === 'experience' ? 'react' : momentType,
      messages,
    );

    return f.createCallExpression(f.createPropertyAccessExpression(chain, f.createIdentifier('server')), undefined, [
      f.createArrowFunction(
        undefined,
        undefined,
        [],
        undefined,
        f.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
        f.createBlock(serverStatements, true),
      ),
    ]);
  }
  return chain;
}

function addStreamToChain(f: tsNS.NodeFactory, chain: tsNS.Expression, slice: Moment): tsNS.Expression {
  if (slice.stream !== undefined) {
    return f.createCallExpression(f.createPropertyAccessExpression(chain, f.createIdentifier('stream')), undefined, [
      f.createStringLiteral(slice.stream),
    ]);
  }
  return chain;
}

function addInitiatorToChain(f: tsNS.NodeFactory, chain: tsNS.Expression, slice: Moment): tsNS.Expression {
  if (slice.initiator !== undefined) {
    return f.createCallExpression(f.createPropertyAccessExpression(chain, f.createIdentifier('initiator')), undefined, [
      f.createStringLiteral(slice.initiator),
    ]);
  }
  return chain;
}

function addViaToChain(f: tsNS.NodeFactory, chain: tsNS.Expression, slice: Moment): tsNS.Expression {
  if (slice.via !== undefined && slice.via.length > 0) {
    const identifiers = slice.via.map((name) => f.createIdentifier(integrationNameToPascalCase(name)));
    const arg = identifiers.length === 1 ? identifiers[0] : f.createArrayLiteralExpression(identifiers);
    return f.createCallExpression(f.createPropertyAccessExpression(chain, f.createIdentifier('via')), undefined, [arg]);
  }
  return chain;
}

function buildMoment(
  ts: typeof import('typescript'),
  f: tsNS.NodeFactory,
  slice: CommandMoment | QueryMoment | ReactMoment | ExperienceMoment,
  messages?: Array<{ type: string; name: string; fields: Array<{ name: string; type: string; required: boolean }> }>,
): tsNS.Statement {
  const sliceCtor =
    slice.type === 'command'
      ? 'command'
      : slice.type === 'query'
        ? 'query'
        : slice.type === 'experience'
          ? 'experience'
          : 'react';

  const args: tsNS.Expression[] = [f.createStringLiteral(slice.name)];
  if (slice.id !== null && slice.id !== undefined) {
    args.push(f.createStringLiteral(slice.id));
  }

  let chain: tsNS.Expression = f.createCallExpression(f.createIdentifier(sliceCtor), undefined, args);

  chain = addStreamToChain(f, chain, slice);
  chain = addInitiatorToChain(f, chain, slice);
  chain = addViaToChain(f, chain, slice);
  chain = addClientToChain(ts, f, chain, slice);
  chain = addUiToChain(ts, f, chain, slice);
  chain = addRequestToChain(f, chain, slice);
  chain = addServerToChain(ts, f, chain, slice, messages);
  chain = addExitsToChain(ts, f, chain, slice);

  return f.createExpressionStatement(chain);
}

export function buildFlowStatements(
  ts: typeof import('typescript'),
  flow: Scene,
  messages?: Array<{ type: string; name: string; fields: Array<{ name: string; type: string; required: boolean }> }>,
): tsNS.Statement[] {
  const f = ts.factory;

  const sceneMetadata: tsNS.Statement[] = [];
  if (flow.assumptions?.length) sceneMetadata.push(buildAssumptionsCall(ts, f, flow.assumptions));
  if (flow.requirements) sceneMetadata.push(buildRequirementsCall(f, flow.requirements));
  const momentStatements = (flow.moments ?? []).map((sl: Moment) => buildMoment(ts, f, sl, messages));
  const body = [...sceneMetadata, ...momentStatements];

  const flowArgs: tsNS.Expression[] = [f.createStringLiteral(flow.name)];
  if (flow.id !== null && flow.id !== undefined) {
    flowArgs.push(f.createStringLiteral(flow.id));
  }
  flowArgs.push(
    f.createArrowFunction(
      undefined,
      undefined,
      [],
      undefined,
      f.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
      f.createBlock(body, true),
    ),
  );

  const flowExpr = f.createCallExpression(f.createIdentifier('scene'), undefined, flowArgs);

  return [f.createExpressionStatement(flowExpr)];
}
