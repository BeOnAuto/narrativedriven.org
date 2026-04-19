import { afterEach, describe, expect, it } from 'vitest';
import { modelLevelRegistry } from './model-level-registry';
import { entity } from './narrative';
import { clearCurrentScene, startScene } from './narrative-context';

describe('entity() DSL', () => {
  afterEach(() => {
    modelLevelRegistry.clearAll();
    clearCurrentScene();
  });

  it('accumulates entities via entity() DSL function', () => {
    entity({ name: 'Record', description: 'A data record', attributes: ['status'] });

    expect(modelLevelRegistry.getAll()).toEqual({
      actors: [],
      entities: [{ name: 'Record', description: 'A data record', attributes: ['status'] }],
      capability: undefined,
      narrativeDefinitions: [],
    });
  });

  it('throws inside scene context', () => {
    startScene('test');
    expect(() => entity({ name: 'X', description: 'Y' })).toThrow(
      'entity() must be called at model level, not inside a scene',
    );
  });
});
