import ts from 'typescript';
import { describe, expect, it } from 'vitest';
import {
  parseGivenTypeArguments,
  parseThenTypeArguments,
  parseTypeDefinitions,
  parseWhenTypeArguments,
} from './ts-utils';
import { createVfsCompilerHost } from './vfs-compiler-host';

function createProgramFromSource(source: string, fileName: string = '/test.ts') {
  const sourceFile = ts.createSourceFile(fileName, source, ts.ScriptTarget.ES2020, true, ts.ScriptKind.TS);
  const sourceFiles = new Map<string, ts.SourceFile>([[fileName, sourceFile]]);
  const host = createVfsCompilerHost(ts, sourceFiles);
  const program = ts.createProgram(
    [fileName],
    {
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.ESNext,
      strict: true,
      skipLibCheck: true,
      skipDefaultLibCheck: true,
    },
    host,
  );
  const checker = program.getTypeChecker();
  const programSourceFile = program.getSourceFile(fileName)!;
  return { checker, sourceFile: programSourceFile };
}

describe('parseTypeDefinitions', () => {
  it('extracts data fields with Array<T> generic syntax', () => {
    const source = `
      type WorkoutRecorded = Event<'WorkoutRecorded', {
        memberId: string;
        exercises: Array<{ name: string; reps: number }>;
      }>;
    `;

    const result = parseTypeDefinitions(ts, 'test.ts', source);

    expect(result.get('WorkoutRecorded')).toEqual({
      stringLiteral: 'WorkoutRecorded',
      classification: 'event',
      dataFields: [
        { name: 'memberId', type: 'string', required: true },
        { name: 'exercises', type: 'Array<{ name: string; reps: number }>', required: true },
      ],
    });
  });
});

describe('parseGivenTypeArguments fallback', () => {
  it('uses raw type text when tryUnwrapGeneric fails to resolve', () => {
    const source = `
      example('test')
        .given<UnresolvableType>({ id: '1' })
        .when<AnotherUnresolvable>({ name: 'foo' });
    `;
    const { checker, sourceFile } = createProgramFromSource(source);
    const typeMap = new Map();
    const typesByFile = new Map();

    const result = parseGivenTypeArguments(ts, checker, sourceFile, typeMap, typesByFile);

    expect(result).toEqual([expect.objectContaining({ ordinal: 0, typeName: 'UnresolvableType' })]);
  });

  it('preserves ordinal alignment when some types resolve and others do not', () => {
    const source = `
      type KnownEvent = Event<'KnownEvent', { id: string }>;
      example('test')
        .given<KnownEvent>({ id: '1' })
        .and<UnknownType>({ name: 'foo' });
    `;
    const typeMap = parseTypeDefinitions(ts, '/test.ts', source);
    const typesByFile = new Map([['/test.ts', typeMap]]);
    const { checker, sourceFile } = createProgramFromSource(source);

    const result = parseGivenTypeArguments(ts, checker, sourceFile, typeMap, typesByFile);

    expect(result).toEqual([
      expect.objectContaining({ ordinal: 0, typeName: 'KnownEvent', classification: 'event' }),
      expect.objectContaining({ ordinal: 1, typeName: 'UnknownType' }),
    ]);
  });
});

describe('parseWhenTypeArguments fallback', () => {
  it('uses raw type text when tryUnwrapGeneric fails to resolve', () => {
    const source = `
      example('test')
        .when<UnresolvableCommand>({ id: '1' });
    `;
    const { checker, sourceFile } = createProgramFromSource(source);

    const result = parseWhenTypeArguments(ts, checker, sourceFile, new Map(), new Map());

    expect(result).toEqual([expect.objectContaining({ ordinal: 0, typeName: 'UnresolvableCommand' })]);
  });
});

describe('parseThenTypeArguments fallback', () => {
  it('uses raw type text when tryUnwrapGeneric fails to resolve', () => {
    const source = `
      example('test')
        .given<SomeType>({ id: '1' })
        .when<SomeCommand>({ name: 'foo' })
        .then<UnresolvableResult>({ status: 'ok' });
    `;
    const { checker, sourceFile } = createProgramFromSource(source);

    const result = parseThenTypeArguments(ts, checker, sourceFile, new Map(), new Map());

    expect(result).toEqual([expect.objectContaining({ ordinal: 0, typeName: 'UnresolvableResult' })]);
  });
});
