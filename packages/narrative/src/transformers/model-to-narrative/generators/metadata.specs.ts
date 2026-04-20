import ts from 'typescript';
import { describe, expect, it } from 'vitest';
import type { Model } from '../../../index';
import { buildAllMetadataStatements, buildModelMetadataStatements } from './metadata';

function printStatements(statements: ts.Statement[]): string {
  const f = ts.factory;
  const file = f.createSourceFile(statements, f.createToken(ts.SyntaxKind.EndOfFileToken), ts.NodeFlags.None);
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
  return printer.printFile(file);
}

describe('buildModelMetadataStatements', () => {
  it('generates a capability call when model.capability is set', () => {
    const model = {
      capability: 'Team Timesheet Management',
    } as Model;

    const { statements, usedFunctions } = buildModelMetadataStatements(ts, model);
    const code = printStatements(statements);

    expect(code).toEqual('capability("Team Timesheet Management");\n');
    expect(usedFunctions).toEqual(new Set(['capability']));
  });

  it('returns empty statements and usedFunctions when model has no capability', () => {
    const model = {} as Model;

    const { statements, usedFunctions } = buildModelMetadataStatements(ts, model);

    expect(statements).toEqual([]);
    expect(usedFunctions).toEqual(new Set());
  });
});

describe('buildAllMetadataStatements — narrative-level actors/entities/assumptions', () => {
  it('emits narrative() call with full actor/entity objects and assumptions', () => {
    const model = {
      capability: 'Sales',
      scenes: [{ name: 'Pay', id: 's-pay', moments: [] }],
      messages: [],
      modules: [],
      narratives: [
        {
          name: 'Checkout',
          sceneIds: ['s-pay'],
          goal: 'Buyer completes purchase',
          actors: [{ name: 'Buyer', kind: 'person', description: 'Shopper' }],
          entities: [{ name: 'Cart', description: 'Current selections' }],
          assumptions: ['Buyer is authenticated'],
        },
      ],
    } as Model;

    const result = buildAllMetadataStatements(ts, model);
    expect(result).not.toBeNull();
    const code = printStatements(result!.statements);

    expect(code).toContain('capability("Sales");');
    expect(code).toContain('narrative("Checkout"');
    expect(code).toContain('goal: "Buyer completes purchase"');
    expect(code).toContain('actors: [{');
    expect(code).toContain('name: "Buyer"');
    expect(code).toContain('entities: [{');
    expect(code).toContain('name: "Cart"');
    expect(code).toContain('assumptions: ["Buyer is authenticated"]');
    expect(code).toContain('scenes: ["Pay"]');
    expect(result!.usedFunctions.has('capability')).toBe(true);
    expect(result!.usedFunctions.has('narrative')).toBe(true);
  });

  it('returns null when model has no metadata at all', () => {
    const model = {
      scenes: [],
      messages: [],
      modules: [],
      narratives: [{ name: 'Default', sceneIds: [] }],
    } as unknown as Model;

    expect(buildAllMetadataStatements(ts, model)).toBeNull();
  });
});
