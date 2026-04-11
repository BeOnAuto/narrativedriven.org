import { afterEach, describe, expect, it } from 'vitest';
import { modelLevelRegistry } from './model-level-registry';
import { outcome } from './narrative';
import { clearCurrentScene, startScene } from './narrative-context';

describe('outcome() DSL', () => {
  afterEach(() => {
    modelLevelRegistry.clearAll();
    clearCurrentScene();
  });

  it('sets model-level outcome', () => {
    outcome('Users can manage records efficiently');

    expect(modelLevelRegistry.getAll().outcome).toBe('Users can manage records efficiently');
  });

  it('replaces previous value', () => {
    outcome('First');
    outcome('Second');

    expect(modelLevelRegistry.getAll().outcome).toBe('Second');
  });

  it('clears on clearAll', () => {
    outcome('Something');
    modelLevelRegistry.clearAll();

    expect(modelLevelRegistry.getAll().outcome).toBeUndefined();
  });

  it('throws inside scene context', () => {
    startScene('test');
    expect(() => outcome('value')).toThrow('outcome() must be called at model level, not inside a scene');
  });
});
