import { afterEach, describe, expect, it } from 'vitest';
import { command } from './fluent-builder';
import { modelLevelRegistry } from './model-level-registry';
import { actor, assumptions, entity, narrative, requirements } from './narrative';
import { clearCurrentScene, getCurrentScene, startScene } from './narrative-context';
import { registry } from './narrative-registry';
import { scenesToModel } from './transformers/narrative-to-model';

describe('DSL → scenesToModel round-trip', () => {
  afterEach(() => {
    modelLevelRegistry.clearAll();
    registry.clearAll();
    clearCurrentScene();
  });

  it('produces a Model with all metadata from DSL calls', () => {
    actor({ name: 'Operator', kind: 'person', description: 'Runs system' });
    entity({ name: 'Item', description: 'A thing' });
    assumptions('System online');
    requirements('Must be fast');
    narrative('Flow', {
      outcome: 'Goal met',
      impact: 'critical',
      actors: ['Operator'],
      scenes: ['Step'],
      assumptions: ['Data ready'],
      requirements: 'Sub-second',
    });

    startScene('Step', 'n-1');
    assumptions('Input valid');
    requirements('Validate first');
    command('Do').initiator('Operator');
    const sceneObj = getCurrentScene()!;
    registry.register(sceneObj);
    clearCurrentScene();

    const model = scenesToModel(registry.getAllScenes());

    expect(model).toEqual(
      expect.objectContaining({
        actors: [{ name: 'Operator', kind: 'person', description: 'Runs system' }],
        entities: [{ name: 'Item', description: 'A thing' }],
        assumptions: ['System online'],
        requirements: 'Must be fast',
        narratives: [
          {
            name: 'Flow',
            sceneIds: ['n-1'],
            outcome: 'Goal met',
            impact: 'critical',
            actors: ['Operator'],
            assumptions: ['Data ready'],
            requirements: 'Sub-second',
          },
        ],
      }),
    );
    expect(model.scenes[0].assumptions).toEqual(['Input valid']);
    expect(model.scenes[0].requirements).toBe('Validate first');
    expect(model.scenes[0].moments[0].initiator).toBe('Operator');
  });
});
