import { afterEach, describe, expect, it } from 'vitest';
import { command } from './fluent-builder';
import { modelLevelRegistry } from './model-level-registry';
import { capability, narrative, outcome } from './narrative';
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
    const operator = { name: 'Operator', kind: 'person' as const, description: 'Runs system' };
    const item = { name: 'Item', description: 'A thing' };

    capability('Team Timesheet Management');
    narrative('Flow', {
      goal: 'Operator completes a run',
      actors: [operator],
      entities: [item],
      assumptions: ['Operator is authenticated', 'Inventory is live'],
      scenes: ['Step'],
    });

    startScene('Step', 'n-1');
    outcome('Entry submitted');
    command('Do').initiator('Operator').noun('Item');
    const sceneObj = getCurrentScene()!;
    registry.register(sceneObj);
    clearCurrentScene();

    const model = scenesToModel(registry.getAllScenes());

    expect(model).toEqual(
      expect.objectContaining({
        capability: 'Team Timesheet Management',
        narratives: [
          {
            name: 'Flow',
            sceneIds: ['n-1'],
            goal: 'Operator completes a run',
            actors: [operator],
            entities: [item],
            assumptions: ['Operator is authenticated', 'Inventory is live'],
          },
        ],
        scenes: [
          expect.objectContaining({
            name: 'Step',
            outcome: 'Entry submitted',
            moments: [expect.objectContaining({ initiator: 'Operator', noun: 'Item' })],
          }),
        ],
      }),
    );
  });
});
