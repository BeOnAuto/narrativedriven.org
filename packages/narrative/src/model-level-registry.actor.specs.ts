import { afterEach, describe, expect, it } from 'vitest';
import { modelLevelRegistry } from './model-level-registry';
import { actor } from './narrative';
import { clearCurrentScene, startScene } from './narrative-context';

describe('actor() DSL', () => {
  afterEach(() => {
    modelLevelRegistry.clearAll();
    clearCurrentScene();
  });

  it('accumulates actors via actor() DSL function', () => {
    actor({ name: 'Operator', kind: 'person', description: 'Runs the system' });
    actor({ name: 'Gateway', kind: 'system', description: 'Routes traffic' });

    expect(modelLevelRegistry.getAll()).toEqual({
      actors: [
        { name: 'Operator', kind: 'person', description: 'Runs the system' },
        { name: 'Gateway', kind: 'system', description: 'Routes traffic' },
      ],
    });
  });

  it('returns empty state after clearAll', () => {
    actor({ name: 'X', kind: 'person', description: 'Y' });
    modelLevelRegistry.clearAll();

    expect(modelLevelRegistry.getAll()).toEqual({
      actors: [],
    });
  });

  it('throws inside scene context', () => {
    startScene('test');
    expect(() => actor({ name: 'X', kind: 'person', description: 'Y' })).toThrow(
      'actor() must be called at model level, not inside a scene',
    );
  });
});
