import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { command, experience, query, react } from './fluent-builder';
import { clearCurrentScene, getCurrentScene, startScene } from './narrative-context';

describe('fluent builder .initiator()', () => {
  beforeEach(() => {
    startScene('test-flow');
  });

  afterEach(() => {
    clearCurrentScene();
  });

  it('sets initiator on a command moment', () => {
    command('Submit').initiator('Operator');

    const scene = getCurrentScene();
    expect(scene!.moments[0]).toEqual({
      type: 'command',
      name: 'Submit',
      initiator: 'Operator',
      client: { specs: [] },
      server: { description: '', specs: [], data: undefined },
    });
  });

  it('sets initiator on a query moment', () => {
    query('Fetch').initiator('Operator');

    const scene = getCurrentScene();
    expect(scene!.moments[0]).toEqual({
      type: 'query',
      name: 'Fetch',
      initiator: 'Operator',
      client: { specs: [] },
      server: { description: '', specs: [], data: undefined },
    });
  });

  it('sets initiator on a react moment', () => {
    react('Process').initiator('Gateway');

    const scene = getCurrentScene();
    expect(scene!.moments[0]).toEqual({
      type: 'react',
      name: 'Process',
      initiator: 'Gateway',
      server: { specs: [], data: undefined },
    });
  });

  it('sets initiator on an experience moment', () => {
    experience('Welcome').initiator('Visitor');

    const scene = getCurrentScene();
    expect(scene!.moments[0]).toEqual({
      type: 'experience',
      name: 'Welcome',
      initiator: 'Visitor',
      client: { specs: [] },
    });
  });
});
