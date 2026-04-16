import { describe, expect, it } from 'vitest';
import { walkSteps } from './step-traversal';

describe('walkSteps', () => {
  it('yields effectiveKeyword from a Given/And/When/And/Then/And sequence', () => {
    const steps = [
      { keyword: 'Given' as const, text: 'A', docString: {} },
      { keyword: 'And' as const, text: 'B', docString: {} },
      { keyword: 'When' as const, text: 'C', docString: {} },
      { keyword: 'And' as const, text: 'D', docString: {} },
      { keyword: 'Then' as const, text: 'E', docString: {} },
      { keyword: 'And' as const, text: 'F', docString: {} },
    ];

    const result = [...walkSteps(steps)].map((e) => ({
      i: e.index,
      kw: e.step.keyword,
      eff: e.effectiveKeyword,
    }));

    expect(result).toEqual([
      { i: 0, kw: 'Given', eff: 'Given' },
      { i: 1, kw: 'And', eff: 'Given' },
      { i: 2, kw: 'When', eff: 'When' },
      { i: 3, kw: 'And', eff: 'When' },
      { i: 4, kw: 'Then', eff: 'Then' },
      { i: 5, kw: 'And', eff: 'Then' },
    ]);
  });

  it('defaults to Given when the array starts with an And (degenerate)', () => {
    const [entry] = [...walkSteps([{ keyword: 'And' as const, text: 'orphan', docString: {} }])];
    expect(entry.effectiveKeyword).toBe('Given');
  });

  it('yields nothing for an empty array', () => {
    expect([...walkSteps([])]).toEqual([]);
  });

  it('tracks keyword across error steps the same as doc-string steps', () => {
    const steps = [
      { keyword: 'Given' as const, text: 'A', docString: {} },
      { keyword: 'When' as const, text: 'B', docString: {} },
      { keyword: 'Then' as const, error: { type: 'ValidationError' as const } },
    ];
    const effs = [...walkSteps(steps)].map((e) => e.effectiveKeyword);
    expect(effs).toEqual(['Given', 'When', 'Then']);
  });
});
