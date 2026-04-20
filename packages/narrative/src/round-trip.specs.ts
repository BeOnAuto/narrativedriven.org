import { describe, expect, it } from 'vitest';
import { InMemoryFileStore } from './file-store';
import { getScenes } from './getScenes';
import type { Model } from './index';
import { modelToNarrative } from './transformers/model-to-narrative';

const pattern = /\.(narrative)\.(ts)$/;

describe('model ↔ narrative round-trip (end-to-end)', () => {
  it('preserves capability, narrative metadata, .initiator(), and .noun() through a full emit + re-parse', async () => {
    const startingModel: Model = {
      variant: 'specs',
      scenes: [
        {
          name: 'Submit Order',
          id: 's-submit',
          outcome: 'Order accepted',
          moments: [
            {
              type: 'command',
              name: 'Submit',
              initiator: 'Buyer',
              noun: 'Cart',
              client: { specs: [] },
              server: { description: 'Submits', specs: [], data: undefined },
            },
          ],
        },
      ],
      messages: [],
      modules: [
        {
          sourceFile: 'app.narrative.ts',
          isDerived: false,
          contains: { sceneIds: ['s-submit'] },
          declares: { messages: [] },
        },
      ],
      narratives: [
        {
          name: 'Checkout',
          sceneIds: ['s-submit'],
          goal: 'Buyer completes a purchase',
          actors: [{ name: 'Buyer', kind: 'person', description: 'Shopper paying' }],
          entities: [{ name: 'Cart', description: 'Buyer current selections' }],
          assumptions: ['Buyer is authenticated'],
        },
      ],
      capability: 'Sales',
    };

    const emitted = await modelToNarrative(startingModel);

    const vfs = new InMemoryFileStore();
    const encoder = new TextEncoder();
    const root = '/proj';
    for (const file of emitted.files) {
      await vfs.write(`${root}/${file.path}`, encoder.encode(file.code));
    }

    const flows = await getScenes({ vfs, root, pattern, fastFsScan: true });
    const roundtrippedModel = flows.toModel();

    expect(roundtrippedModel.capability).toBe('Sales');

    const checkout = roundtrippedModel.narratives.find((n) => n.name === 'Checkout');
    expect(checkout).toBeDefined();
    expect(checkout?.goal).toBe('Buyer completes a purchase');
    expect(checkout?.actors).toEqual([{ name: 'Buyer', kind: 'person', description: 'Shopper paying' }]);
    expect(checkout?.entities).toEqual([{ name: 'Cart', description: 'Buyer current selections' }]);
    expect(checkout?.assumptions).toEqual(['Buyer is authenticated']);

    const submitScene = roundtrippedModel.scenes.find((s) => s.name === 'Submit Order');
    expect(submitScene?.outcome).toBe('Order accepted');
    const submitMoment = submitScene?.moments[0];
    expect(submitMoment?.initiator).toBe('Buyer');
    expect(submitMoment?.noun).toBe('Cart');
  });
});
