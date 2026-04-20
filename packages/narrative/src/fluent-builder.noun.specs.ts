import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { command, experience, query, react } from './fluent-builder';
import { clearCurrentScene, getCurrentScene, startScene } from './narrative-context';

describe('fluent builder .noun()', () => {
  beforeEach(() => {
    startScene('test-flow');
  });

  afterEach(() => {
    clearCurrentScene();
  });

  it('sets noun on a command moment', () => {
    command('Submit').noun('Cart');

    const scene = getCurrentScene();
    expect(scene!.moments[0]).toEqual({
      type: 'command',
      name: 'Submit',
      noun: 'Cart',
      client: { specs: [] },
      server: { description: '', specs: [], data: undefined },
    });
  });

  it('sets noun on a query moment', () => {
    query('Fetch').noun('Cart');

    const scene = getCurrentScene();
    expect(scene!.moments[0]).toEqual({
      type: 'query',
      name: 'Fetch',
      noun: 'Cart',
      client: { specs: [] },
      server: { description: '', specs: [], data: undefined },
    });
  });

  it('sets noun on a react moment', () => {
    react('Process').noun('Cart');

    const scene = getCurrentScene();
    expect(scene!.moments[0]).toEqual({
      type: 'react',
      name: 'Process',
      noun: 'Cart',
      server: { specs: [], data: undefined },
    });
  });

  it('sets noun on an experience moment', () => {
    experience('Welcome').noun('Visitor');

    const scene = getCurrentScene();
    expect(scene!.moments[0]).toEqual({
      type: 'experience',
      name: 'Welcome',
      noun: 'Visitor',
      client: { specs: [] },
    });
  });

  it('composes .initiator() then .noun()', () => {
    command('Submit Order').initiator('Buyer').noun('Cart');

    const scene = getCurrentScene();
    expect(scene!.moments[0]).toMatchObject({
      type: 'command',
      name: 'Submit Order',
      initiator: 'Buyer',
      noun: 'Cart',
    });
  });
});
