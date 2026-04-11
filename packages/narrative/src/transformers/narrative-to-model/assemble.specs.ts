import { describe, expect, it } from 'vitest';
import type { NarrativeDefinition } from '../../model-level-registry';
import { assembleSpecs } from './assemble';

describe('assembleSpecs', () => {
  it('backward compat: no metadata produces Default narrative', () => {
    const scenes = [{ name: 'Step', id: 's-1', moments: [] }];
    const messages = [{ type: 'command' as const, name: 'DoIt', fields: [] }];

    const model = assembleSpecs(scenes, messages);

    expect(model).toEqual({
      variant: 'specs',
      scenes,
      messages,
      integrations: undefined,
      modules: expect.any(Array),
      narratives: [{ name: 'Default', sceneIds: ['s-1'] }],
    });
  });

  it('passes through model-level metadata', () => {
    const model = assembleSpecs([], [], undefined, {
      actors: [{ name: 'Op', kind: 'person' as const, description: 'Runs it' }],
      entities: [{ name: 'Item', description: 'A thing' }],
      assumptions: ['Always online'],
      requirements: 'Must be fast',
    });

    expect(model.actors).toEqual([{ name: 'Op', kind: 'person', description: 'Runs it' }]);
    expect(model.entities).toEqual([{ name: 'Item', description: 'A thing' }]);
    expect(model.assumptions).toEqual(['Always online']);
    expect(model.requirements).toBe('Must be fast');
  });

  it('resolves narrative sceneNames to sceneIds', () => {
    const scenes = [
      { name: 'Add to Cart', id: 'n-1', moments: [] },
      { name: 'Payment', id: 'n-2', moments: [] },
    ];
    const defs: NarrativeDefinition[] = [
      {
        name: 'Checkout',
        outcome: 'Items purchased',
        impact: 'critical',
        actors: ['Buyer'],
        scenes: ['Add to Cart', 'Payment'],
        assumptions: ['Gateway up'],
        requirements: 'PCI',
      },
    ];

    const model = assembleSpecs(scenes, [], undefined, undefined, defs);

    expect(model.narratives).toEqual([
      {
        name: 'Checkout',
        sceneIds: ['n-1', 'n-2'],
        outcome: 'Items purchased',
        impact: 'critical',
        actors: ['Buyer'],
        assumptions: ['Gateway up'],
        requirements: 'PCI',
      },
    ]);
  });

  it('creates Default narrative for uncovered scenes', () => {
    const scenes = [
      { name: 'Covered', id: 'n-1', moments: [] },
      { name: 'Uncovered', id: 'n-2', moments: [] },
    ];
    const defs: NarrativeDefinition[] = [{ name: 'Flow', scenes: ['Covered'] }];

    const model = assembleSpecs(scenes, [], undefined, undefined, defs);

    expect(model.narratives).toEqual([
      { name: 'Flow', sceneIds: ['n-1'] },
      { name: 'Default', sceneIds: ['n-2'] },
    ]);
  });
});
