import ts from 'typescript';
import { describe, expect, it } from 'vitest';
import type { Model } from '../../../index';
import { buildModelMetadataStatements } from './metadata';

function printStatements(statements: ts.Statement[]): string {
  const f = ts.factory;
  const file = f.createSourceFile(statements, f.createToken(ts.SyntaxKind.EndOfFileToken), ts.NodeFlags.None);
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
  return printer.printFile(file);
}

describe('buildModelMetadataStatements', () => {
  it('generates actor, entity, assumptions, requirements, and outcome calls', () => {
    const model = {
      actors: [{ name: 'Operator', kind: 'person', description: 'Runs it' }],
      entities: [{ name: 'Item', description: 'A thing', attributes: ['status'] }],
      assumptions: ['Always online'],
      requirements: 'Must be fast',
      outcome: 'Records managed efficiently',
    } as Model;

    const { statements, usedFunctions } = buildModelMetadataStatements(ts, model);
    const code = printStatements(statements);

    expect(code).toEqual(
      'actor({ name: "Operator", kind: "person", description: "Runs it" });\n' +
        'entity({ name: "Item", description: "A thing", attributes: ["status"] });\n' +
        'assumptions("Always online");\n' +
        'requirements("Must be fast");\n' +
        'outcome("Records managed efficiently");\n',
    );
    expect(usedFunctions).toEqual(new Set(['actor', 'entity', 'assumptions', 'requirements', 'outcome']));
  });

  it('returns empty statements and usedFunctions when model has no metadata', () => {
    const model = {} as Model;

    const { statements, usedFunctions } = buildModelMetadataStatements(ts, model);

    expect(statements).toEqual([]);
    expect(usedFunctions).toEqual(new Set());
  });
});
