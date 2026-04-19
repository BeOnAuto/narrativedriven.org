import { afterEach, describe, expect, it } from 'vitest';
import { modelLevelRegistry } from './model-level-registry';
import { outcome } from './narrative';
import { clearCurrentScene, getCurrentScene, startScene } from './narrative-context';

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

  it('sets scene-level outcome inside scene context', () => {
    startScene('Submit Entry');
    outcome('Entry submitted');

    expect(getCurrentScene()?.outcome).toBe('Entry submitted');
  });
});
