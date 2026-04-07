import { describe, expect, it } from 'vitest';
import { isInlineObject, isInlineObjectArray, parseInlineObjectFields } from './ts-type-helpers';

describe('isInlineObject', () => {
  it('returns true for simple inline object', () => {
    expect(isInlineObject('{ name: string }')).toBe(true);
  });

  it('returns true for multi-field inline object', () => {
    expect(isInlineObject('{ name: string; age: number }')).toBe(true);
  });

  it('returns false for primitive types', () => {
    expect(isInlineObject('string')).toBe(false);
  });

  it('returns false for array types', () => {
    expect(isInlineObject('Array<{ id: string }>')).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(isInlineObject('')).toBe(false);
  });

  it('handles null-safe via fallback', () => {
    expect(isInlineObject(null as unknown as string)).toBe(false);
  });
});

describe('isInlineObjectArray', () => {
  it('returns true for Array<{...}> syntax', () => {
    expect(isInlineObjectArray('Array<{ id: string }>')).toBe(true);
  });

  it('returns true for {...}[] syntax', () => {
    expect(isInlineObjectArray('{ id: string }[]')).toBe(true);
  });

  it('returns false for plain inline object', () => {
    expect(isInlineObjectArray('{ id: string }')).toBe(false);
  });

  it('returns false for primitive array', () => {
    expect(isInlineObjectArray('string[]')).toBe(false);
  });

  it('handles null-safe via fallback', () => {
    expect(isInlineObjectArray(null as unknown as string)).toBe(false);
  });
});

describe('parseInlineObjectFields', () => {
  it('parses simple inline object fields', () => {
    expect(parseInlineObjectFields('{ name: string; age: number }')).toEqual([
      { name: 'name', tsType: 'string' },
      { name: 'age', tsType: 'number' },
    ]);
  });

  it('parses Array<{...}> wrapper', () => {
    expect(parseInlineObjectFields('Array<{ id: string; count: number }>')).toEqual([
      { name: 'id', tsType: 'string' },
      { name: 'count', tsType: 'number' },
    ]);
  });

  it('parses nested inline objects without breaking', () => {
    expect(parseInlineObjectFields('{ userId: string; items: Array<{ id: string; qty: number }> }')).toEqual([
      { name: 'userId', tsType: 'string' },
      { name: 'items', tsType: 'Array<{ id: string; qty: number }>' },
    ]);
  });

  it('parses deeply nested types', () => {
    expect(
      parseInlineObjectFields(
        'Array<{ sessionId: string; performance: Array<{ exerciseId: string; completedSets: number }> }>',
      ),
    ).toEqual([
      { name: 'sessionId', tsType: 'string' },
      { name: 'performance', tsType: 'Array<{ exerciseId: string; completedSets: number }>' },
    ]);
  });

  it('returns empty array for empty object', () => {
    expect(parseInlineObjectFields('{}')).toEqual([]);
  });

  it('returns empty array for non-inline types', () => {
    expect(parseInlineObjectFields('string')).toEqual([]);
  });

  it('filters out fields with invalid TS identifiers', () => {
    expect(parseInlineObjectFields('{ totalVolume: number; ...: unknown; sessionId: string }')).toEqual([
      { name: 'totalVolume', tsType: 'number' },
      { name: 'sessionId', tsType: 'string' },
    ]);
  });

  it('handles comma-separated fields', () => {
    expect(parseInlineObjectFields('{ x: number, y: number }')).toEqual([
      { name: 'x', tsType: 'number' },
      { name: 'y', tsType: 'number' },
    ]);
  });

  it('handles {...}[] syntax', () => {
    expect(parseInlineObjectFields('{ id: string }[]')).toEqual([{ name: 'id', tsType: 'string' }]);
  });
});
