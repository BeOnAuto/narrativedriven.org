import { describe, expect, it } from 'vitest';
import * as narrativeDSL from '../../../index';
import { ALL_FLOW_FUNCTION_NAMES } from './imports';

describe('ALL_FLOW_FUNCTION_NAMES whitelist', () => {
  it('every entry resolves to an exported function on @onauto/narrative', () => {
    const missing: string[] = [];
    for (const name of ALL_FLOW_FUNCTION_NAMES) {
      const value = (narrativeDSL as Record<string, unknown>)[name];
      if (typeof value !== 'function') missing.push(name);
    }
    expect(missing).toEqual([]);
  });
});
