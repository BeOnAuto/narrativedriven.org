import ts from 'typescript';
import { describe, expect, it } from 'vitest';
import { parseTypeDefinitions } from './ts-utils';

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

// Tests for `parseGivenTypeArguments` / `parseWhenTypeArguments` /
// `parseThenTypeArguments` have been removed — those AST call-expression
// scanners are retired. Type info now flows at runtime via TypedRef
// factory arguments, not via `<T>` generic recovery.
void ts;
