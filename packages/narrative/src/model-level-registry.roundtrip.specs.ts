import { afterEach, describe, expect, it } from 'vitest';
import { command } from './fluent-builder';
import { modelLevelRegistry } from './model-level-registry';
import { actor, capability, entity, narrative, outcome } from './narrative';
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
    capability('Team Timesheet Management');
    narrative('Flow', {
      goal: 'Operator completes a run',
      actors: ['Operator'],
      entities: ['Item'],
      scenes: ['Step'],
    });

    startScene('Step', 'n-1');
    outcome('Entry submitted');
    command('Do').initiator('Operator');
    const sceneObj = getCurrentScene()!;
    registry.register(sceneObj);
    clearCurrentScene();

    const model = scenesToModel(registry.getAllScenes());

    expect(model).toEqual(
      expect.objectContaining({
        actors: [{ name: 'Operator', kind: 'person', description: 'Runs system' }],
        entities: [{ name: 'Item', description: 'A thing' }],
        capability: 'Team Timesheet Management',
        narratives: [
          {
            name: 'Flow',
            sceneIds: ['n-1'],
            goal: 'Operator completes a run',
            actors: ['Operator'],
            entities: ['Item'],
          },
        ],
        scenes: [
          expect.objectContaining({
            name: 'Step',
            outcome: 'Entry submitted',
            moments: [expect.objectContaining({ initiator: 'Operator' })],
          }),
        ],
      }),
    );
  });
});
