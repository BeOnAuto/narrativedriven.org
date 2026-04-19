import { afterEach, describe, expect, it } from 'vitest';
import { modelLevelRegistry } from './model-level-registry';
import { capability } from './narrative';
import { clearCurrentScene, startScene } from './narrative-context';

describe('capability() DSL', () => {
  afterEach(() => {
    modelLevelRegistry.clearAll();
    clearCurrentScene();
  });

  it('sets model-level capability', () => {
    capability('Team Timesheet Management');

    expect(modelLevelRegistry.getAll().capability).toBe('Team Timesheet Management');
  });

  it('replaces previous value', () => {
    capability('First');
    capability('Second');

    expect(modelLevelRegistry.getAll().capability).toBe('Second');
  });

  it('clears on clearAll', () => {
    capability('Something');
    modelLevelRegistry.clearAll();

    expect(modelLevelRegistry.getAll().capability).toBeUndefined();
  });

  it('throws inside scene context', () => {
    startScene('Step');
    expect(() => capability('value')).toThrow(/model level/);
  });
});
