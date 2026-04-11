import type tsNS from 'typescript';
import type { Model, Narrative } from '../../../index';
import { jsonToExpr } from '../ast/emit-helpers';

export function buildAssumptionsCall(
  ts: typeof import('typescript'),
  f: tsNS.NodeFactory,
  items: string[],
): tsNS.Statement {
  return f.createExpressionStatement(
    f.createCallExpression(
      f.createIdentifier('assumptions'),
      undefined,
      items.map((s) => f.createStringLiteral(s)),
    ),
  );
}

export function buildRequirementsCall(f: tsNS.NodeFactory, doc: string): tsNS.Statement {
  return f.createExpressionStatement(
    f.createCallExpression(f.createIdentifier('requirements'), undefined, [f.createStringLiteral(doc)]),
  );
}

function buildActorCall(
  ts: typeof import('typescript'),
  f: tsNS.NodeFactory,
  actorDef: Model['actors'] extends (infer T)[] | undefined ? T : never,
): tsNS.Statement {
  return f.createExpressionStatement(
    f.createCallExpression(f.createIdentifier('actor'), undefined, [jsonToExpr(ts, f, actorDef)]),
  );
}

function buildEntityCall(
  ts: typeof import('typescript'),
  f: tsNS.NodeFactory,
  entityDef: Model['entities'] extends (infer T)[] | undefined ? T : never,
): tsNS.Statement {
  return f.createExpressionStatement(
    f.createCallExpression(f.createIdentifier('entity'), undefined, [jsonToExpr(ts, f, entityDef)]),
  );
}

export function buildModelMetadataStatements(ts: typeof import('typescript'), model: Model): tsNS.Statement[] {
  const f = ts.factory;
  const statements: tsNS.Statement[] = [];

  if (model.actors?.length) {
    for (const a of model.actors) statements.push(buildActorCall(ts, f, a));
  }

  if (model.entities?.length) {
    for (const e of model.entities) statements.push(buildEntityCall(ts, f, e));
  }

  if (model.assumptions?.length) {
    statements.push(buildAssumptionsCall(ts, f, model.assumptions));
  }

  if (model.requirements) {
    statements.push(buildRequirementsCall(f, model.requirements));
  }

  return statements;
}

function buildNarrativeCall(
  ts: typeof import('typescript'),
  f: tsNS.NodeFactory,
  nar: Narrative,
  sceneIdToName: Map<string, string>,
): tsNS.Statement {
  const configProps: tsNS.ObjectLiteralElementLike[] = [];

  if (nar.outcome) configProps.push(f.createPropertyAssignment('outcome', f.createStringLiteral(nar.outcome)));
  if (nar.impact) configProps.push(f.createPropertyAssignment('impact', f.createStringLiteral(nar.impact)));
  if (nar.actors?.length) configProps.push(f.createPropertyAssignment('actors', jsonToExpr(ts, f, nar.actors)));
  if (nar.sceneIds.length > 0) {
    const sceneNames = nar.sceneIds.map((id) => sceneIdToName.get(id) ?? id);
    configProps.push(f.createPropertyAssignment('scenes', jsonToExpr(ts, f, sceneNames)));
  }
  if (nar.assumptions?.length)
    configProps.push(f.createPropertyAssignment('assumptions', jsonToExpr(ts, f, nar.assumptions)));
  if (nar.requirements)
    configProps.push(f.createPropertyAssignment('requirements', f.createStringLiteral(nar.requirements)));

  const args: tsNS.Expression[] = [f.createStringLiteral(nar.name)];
  if (nar.id) args.push(f.createStringLiteral(nar.id));
  args.push(f.createObjectLiteralExpression(configProps, configProps.length > 2));

  return f.createExpressionStatement(f.createCallExpression(f.createIdentifier('narrative'), undefined, args));
}

function hasNarrativeMetadata(nar: Narrative): boolean {
  return (
    nar.outcome !== undefined ||
    nar.impact !== undefined ||
    (nar.actors?.length ?? 0) > 0 ||
    (nar.assumptions?.length ?? 0) > 0 ||
    nar.requirements !== undefined
  );
}

function modelHasMetadata(model: Model): boolean {
  return (
    (model.actors?.length ?? 0) > 0 ||
    (model.entities?.length ?? 0) > 0 ||
    (model.assumptions?.length ?? 0) > 0 ||
    model.requirements !== undefined ||
    model.narratives?.some(hasNarrativeMetadata)
  );
}

export function buildAllMetadataStatements(
  ts: typeof import('typescript'),
  model: Model,
): { statements: tsNS.Statement[]; usedFunctions: Set<string> } | null {
  if (!modelHasMetadata(model)) return null;

  const f = ts.factory;
  const usedFunctions = new Set<string>();
  const modelStatements = buildModelMetadataStatements(ts, model);

  if (model.actors?.length) usedFunctions.add('actor');
  if (model.entities?.length) usedFunctions.add('entity');
  if (model.assumptions?.length) usedFunctions.add('assumptions');
  if (model.requirements) usedFunctions.add('requirements');

  const sceneIdToName = new Map(model.scenes.map((s) => [s.id ?? s.name, s.name]));
  const narrativeStatements: tsNS.Statement[] = [];
  for (const nar of model.narratives) {
    if (hasNarrativeMetadata(nar)) {
      narrativeStatements.push(buildNarrativeCall(ts, f, nar, sceneIdToName));
      usedFunctions.add('narrative');
    }
  }

  return { statements: [...modelStatements, ...narrativeStatements], usedFunctions };
}
