import { afterEach, describe, expect, it } from 'vitest';
import { modelLevelRegistry } from './model-level-registry';
import { narrative } from './narrative';

describe('narrative() DSL', () => {
  afterEach(() => {
    modelLevelRegistry.clearAll();
  });

  it('registers narrative definition with all config fields', () => {
    narrative('Checkout', {
      outcome: 'Items purchased',
      actors: ['Buyer', 'Gateway'],
      scenes: ['Add to Cart', 'Payment'],
      assumptions: ['Gateway reachable'],
      requirements: 'PCI compliance',
    });

    expect(modelLevelRegistry.getAll().narrativeDefinitions).toEqual([
      {
        name: 'Checkout',
        outcome: 'Items purchased',
        actors: ['Buyer', 'Gateway'],
        scenes: ['Add to Cart', 'Payment'],
        assumptions: ['Gateway reachable'],
        requirements: 'PCI compliance',
      },
    ]);
  });

  it('supports id overload', () => {
    narrative('Setup', 'nar-1', { scenes: ['Configure'] });

    expect(modelLevelRegistry.getAll().narrativeDefinitions).toEqual([
      { name: 'Setup', id: 'nar-1', scenes: ['Configure'] },
    ]);
  });

  it('registers minimal narrative with no optional fields', () => {
    narrative('Simple', {});

    expect(modelLevelRegistry.getAll().narrativeDefinitions).toEqual([{ name: 'Simple' }]);
  });
});
