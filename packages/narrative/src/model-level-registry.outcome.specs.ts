import { afterEach, describe, expect, it } from 'vitest';
import { modelLevelRegistry } from './model-level-registry';
import { outcome } from './narrative';
import { clearCurrentScene, getCurrentScene, startScene } from './narrative-context';

describe('outcome() DSL', () => {
  afterEach(() => {
    modelLevelRegistry.clearAll();
    clearCurrentScene();
  });

  it('sets scene-level outcome inside scene context', () => {
    startScene('Submit Entry');
    outcome('Entry submitted');

    expect(getCurrentScene()?.outcome).toBe('Entry submitted');
  });

  it('throws outside scene context', () => {
    expect(() => outcome('Nope')).toThrow(/inside a scene/);
  });
});
