import { afterEach, describe, expect, it } from 'vitest';
import { command, experience, query, react } from './fluent-builder';
import { clearCurrentScene, getCurrentScene, startScene } from './narrative-context';

describe('fluent builder .initiator()', () => {
  afterEach(() => {
    clearCurrentScene();
  });

  it('sets initiator on command moment', () => {
    startScene('Test');
    command('Submit').initiator('Operator');

    expect(getCurrentScene()!.moments[0]).toEqual(
      expect.objectContaining({ type: 'command', name: 'Submit', initiator: 'Operator' }),
    );
  });

  it('sets initiator on query moment', () => {
    startScene('Test');
    query('Lookup').initiator('Admin');

    expect(getCurrentScene()!.moments[0]).toEqual(
      expect.objectContaining({ type: 'query', name: 'Lookup', initiator: 'Admin' }),
    );
  });

  it('sets initiator on react moment', () => {
    startScene('Test');
    react('Process').initiator('Gateway');

    expect(getCurrentScene()!.moments[0]).toEqual(
      expect.objectContaining({ type: 'react', name: 'Process', initiator: 'Gateway' }),
    );
  });

  it('sets initiator on experience moment', () => {
    startScene('Test');
    experience('Browse').initiator('User');

    expect(getCurrentScene()!.moments[0]).toEqual(
      expect.objectContaining({ type: 'experience', name: 'Browse', initiator: 'User' }),
    );
  });
});
