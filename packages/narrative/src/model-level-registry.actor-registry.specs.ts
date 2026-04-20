import { afterEach, describe, expect, it } from 'vitest';
import { capability, narrative } from './narrative';
import { clearCurrentScene, getCurrentScene, startScene } from './narrative-context';
import { command } from './fluent-builder';
import { modelLevelRegistry } from './model-level-registry';
import { registry } from './narrative-registry';
import { scenesToModel } from './transformers/narrative-to-model';

describe('cross-narrative actor/entity registry', () => {
  afterEach(() => {
    modelLevelRegistry.clearAll();
    registry.clearAll();
    clearCurrentScene();
  });

  it('two narratives declare the same actor with identical shape — both get the resolved object', () => {
    capability('Sales');
    const buyer = { name: 'Buyer', kind: 'person' as const, description: 'Shopper' };

    narrative('Checkout', { actors: [buyer], scenes: ['Pay'] });
    narrative('Returns', { actors: [buyer], scenes: ['Refund'] });

    startScene('Pay', 's-pay');
    command('Submit').initiator('Buyer');
    registry.register(getCurrentScene()!);
    clearCurrentScene();

    startScene('Refund', 's-ref');
    command('Refund').initiator('Buyer');
    registry.register(getCurrentScene()!);
    clearCurrentScene();

    const model = scenesToModel(registry.getAllScenes());

    const checkout = model.narratives.find((n) => n.name === 'Checkout');
    const returns = model.narratives.find((n) => n.name === 'Returns');
    expect(checkout?.actors).toEqual([buyer]);
    expect(returns?.actors).toEqual([buyer]);
  });

  it('second narrative references an actor by name — resolves to first narrative’s declaration', () => {
    const buyer = { name: 'Buyer', kind: 'person' as const, description: 'Shopper' };

    narrative('Checkout', { actors: [buyer], scenes: ['Pay'] });
    narrative('Returns', { actors: ['Buyer'], scenes: ['Refund'] });

    startScene('Pay', 's-pay');
    command('Submit').initiator('Buyer');
    registry.register(getCurrentScene()!);
    clearCurrentScene();

    startScene('Refund', 's-ref');
    command('Refund').initiator('Buyer');
    registry.register(getCurrentScene()!);
    clearCurrentScene();

    const model = scenesToModel(registry.getAllScenes());
    const returns = model.narratives.find((n) => n.name === 'Returns');
    expect(returns?.actors).toEqual([buyer]);
  });

  it('same actor name with different shape — throws with both narrative names', () => {
    narrative('A', {
      actors: [{ name: 'Buyer', kind: 'person', description: 'Shopper' }],
      scenes: ['Step'],
    });
    narrative('B', {
      actors: [{ name: 'Buyer', kind: 'system', description: 'Automated shopper' }],
      scenes: ['Step'],
    });

    startScene('Step', 's-1');
    command('Do');
    registry.register(getCurrentScene()!);
    clearCurrentScene();

    expect(() => scenesToModel(registry.getAllScenes())).toThrow(
      /actor "Buyer" redeclared with different shape.*narrative "A".*narrative "B"/,
    );
  });

  it('string ref with no prior declaration — throws', () => {
    narrative('Returns', { actors: ['Buyer'], scenes: ['Step'] });

    startScene('Step', 's-1');
    command('Do');
    registry.register(getCurrentScene()!);
    clearCurrentScene();

    expect(() => scenesToModel(registry.getAllScenes())).toThrow(
      /actor "Buyer" referenced in narrative "Returns" but never defined/,
    );
  });

  it('moment initiator referencing an undeclared actor — throws with scene/moment path', () => {
    const buyer = { name: 'Buyer', kind: 'person' as const, description: 'Shopper' };
    narrative('Flow', { actors: [buyer], scenes: ['Step'] });

    startScene('Step', 's-1');
    command('Do').initiator('Ghost');
    registry.register(getCurrentScene()!);
    clearCurrentScene();

    expect(() => scenesToModel(registry.getAllScenes())).toThrow(
      /scene "Step", moment "Do" \(index 0\): initiator "Ghost" is not a declared actor/,
    );
  });

  it('moment noun referencing an undeclared entity — throws with scene/moment path', () => {
    const buyer = { name: 'Buyer', kind: 'person' as const, description: 'Shopper' };
    narrative('Flow', { actors: [buyer], scenes: ['Step'] });

    startScene('Step', 's-1');
    command('Do').initiator('Buyer').noun('Phantom');
    registry.register(getCurrentScene()!);
    clearCurrentScene();

    expect(() => scenesToModel(registry.getAllScenes())).toThrow(
      /scene "Step", moment "Do" \(index 0\): noun "Phantom" is not a declared entity/,
    );
  });

  it('orphan scene whose moment uses an initiator declared in another narrative — passes', () => {
    const buyer = { name: 'Buyer', kind: 'person' as const, description: 'Shopper' };
    narrative('Declared', { actors: [buyer], scenes: ['Declared Scene'] });

    // 'Orphan' is not listed in any narrative's scenes — lands under Default
    startScene('Orphan', 's-orphan');
    command('Act').initiator('Buyer');
    registry.register(getCurrentScene()!);
    clearCurrentScene();

    startScene('Declared Scene', 's-dec');
    registry.register(getCurrentScene()!);
    clearCurrentScene();

    const model = scenesToModel(registry.getAllScenes());
    expect(model.narratives.map((n) => n.name)).toContain('Default');
  });
});
