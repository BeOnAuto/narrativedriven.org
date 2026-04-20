import type tsNS from 'typescript';
import type { Model, Narrative } from '../../../index';
import { jsonToExpr } from '../ast/emit-helpers';

export function buildCapabilityCall(f: tsNS.NodeFactory, value: string): tsNS.Statement {
  return f.createExpressionStatement(
    f.createCallExpression(f.createIdentifier('capability'), undefined, [f.createStringLiteral(value)]),
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

export function buildOutcomeCall(f: tsNS.NodeFactory, value: string): tsNS.Statement {
  return f.createExpressionStatement(
    f.createCallExpression(f.createIdentifier('outcome'), undefined, [f.createStringLiteral(value)]),
  );
}

export function buildModelMetadataStatements(
  ts: typeof import('typescript'),
  model: Model,
): { statements: tsNS.Statement[]; usedFunctions: Set<string> } {
  const f = ts.factory;
  const statements: tsNS.Statement[] = [];
  const usedFunctions = new Set<string>();

  if (model.actors?.length) {
    for (const a of model.actors) statements.push(buildActorCall(ts, f, a));
    usedFunctions.add('actor');
  }

  if (model.entities?.length) {
    for (const e of model.entities) statements.push(buildEntityCall(ts, f, e));
    usedFunctions.add('entity');
  }

  if (model.capability) {
    statements.push(buildCapabilityCall(f, model.capability));
    usedFunctions.add('capability');
  }

  return { statements, usedFunctions };
}

function buildNarrativeCall(
  ts: typeof import('typescript'),
  f: tsNS.NodeFactory,
  nar: Narrative,
  sceneIdToName: Map<string, string>,
): tsNS.Statement {
  const configProps: tsNS.ObjectLiteralElementLike[] = [];

  if (nar.goal) configProps.push(f.createPropertyAssignment('goal', f.createStringLiteral(nar.goal)));
  if (nar.actors?.length) configProps.push(f.createPropertyAssignment('actors', jsonToExpr(ts, f, nar.actors)));
  if (nar.entities?.length) configProps.push(f.createPropertyAssignment('entities', jsonToExpr(ts, f, nar.entities)));
  if (nar.assumptions?.length)
    configProps.push(f.createPropertyAssignment('assumptions', jsonToExpr(ts, f, nar.assumptions)));
  if (nar.sceneIds.length > 0) {
    const sceneNames = nar.sceneIds.map((id) => sceneIdToName.get(id) ?? id);
    configProps.push(f.createPropertyAssignment('scenes', jsonToExpr(ts, f, sceneNames)));
  }

  const args: tsNS.Expression[] = [f.createStringLiteral(nar.name)];
  if (nar.id) args.push(f.createStringLiteral(nar.id));
  args.push(f.createObjectLiteralExpression(configProps, configProps.length > 2));

  return f.createExpressionStatement(f.createCallExpression(f.createIdentifier('narrative'), undefined, args));
}

function hasNarrativeMetadata(nar: Narrative): boolean {
  return (
    nar.goal !== undefined ||
    (nar.actors?.length ?? 0) > 0 ||
    (nar.entities?.length ?? 0) > 0 ||
    (nar.assumptions?.length ?? 0) > 0
  );
}

function modelHasMetadata(model: Model): boolean {
  return (
    (model.actors?.length ?? 0) > 0 ||
    (model.entities?.length ?? 0) > 0 ||
    model.capability !== undefined ||
    model.narratives?.some(hasNarrativeMetadata)
  );
}

export function buildAllMetadataStatements(
  ts: typeof import('typescript'),
  model: Model,
): { statements: tsNS.Statement[]; usedFunctions: Set<string> } | null {
  if (!modelHasMetadata(model)) return null;

  const f = ts.factory;
  const { statements: modelStatements, usedFunctions } = buildModelMetadataStatements(ts, model);

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
