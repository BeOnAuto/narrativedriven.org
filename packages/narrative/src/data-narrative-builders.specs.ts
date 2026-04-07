import { describe, expect, it } from 'vitest';
import { target } from './data-narrative-builders';

describe('target() builder', () => {
  it('builds a target-only event item without id', () => {
    const result = target().event('TodoAdded');

    expect(result).toEqual({
      target: { type: 'Event', name: 'TodoAdded' },
      __type: 'target',
    });
  });

  it('builds a target-only event item with id', () => {
    const result = target('dt-1').event('OrderPlaced');

    expect(result).toEqual({
      id: 'dt-1',
      target: { type: 'Event', name: 'OrderPlaced' },
      __type: 'target',
    });
  });

  it('omits id when empty string', () => {
    const result = target('').event('TodoAdded');

    expect(result).toEqual({
      target: { type: 'Event', name: 'TodoAdded' },
      __type: 'target',
    });
  });
});
