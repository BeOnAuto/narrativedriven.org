import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { command, experience, query, react } from './fluent-builder';
import { clearCurrentScene, getCurrentScene, startScene } from './narrative-context';
import { createIntegration } from './types';

// Test integrations
const MailChimp = createIntegration('mailchimp', 'MailChimp');
const Twilio = createIntegration('twilio', 'Twilio');

describe('via method', () => {
  beforeEach(() => {
    startScene('test-flow');
  });

  afterEach(() => {
    clearCurrentScene();
  });

  it('should accept a single integration', () => {
    const slice = command('test').via(MailChimp);

    expect(slice).toBeDefined();
  });

  it('should accept multiple integrations as array', () => {
    const slice = command('test').via([MailChimp, Twilio]);

    expect(slice).toBeDefined();
  });

  it('should work with react', () => {
    const slice = react('test').via([MailChimp, Twilio]);

    expect(slice).toBeDefined();
  });
});

describe('ui method', () => {
  beforeEach(() => {
    startScene('test-flow');
  });

  afterEach(() => {
    clearCurrentScene();
  });

  it('sets client.ui on a command moment', () => {
    const uiBlock = { layoutId: 'centered-narrow', surface: 'route' as const };
    command('Submit Order').ui(uiBlock);

    const scene = getCurrentScene();
    const moment = scene!.moments[0];
    expect(moment.type).toBe('command');
    if (moment.type === 'command') {
      expect(moment.client.ui).toEqual(uiBlock);
    }
  });

  it('sets client.ui on a query moment', () => {
    const uiBlock = { layoutId: 'two-column', surface: 'route' as const };
    query('View Items').ui(uiBlock);

    const scene = getCurrentScene();
    const moment = scene!.moments[0];
    expect(moment.type).toBe('query');
    if (moment.type === 'query') {
      expect(moment.client.ui).toEqual(uiBlock);
    }
  });

  it('sets client.ui on an experience moment', () => {
    const uiBlock = { layoutId: 'full-width', surface: 'ephemeral' as const };
    experience('Welcome Tour').ui(uiBlock);

    const scene = getCurrentScene();
    const moment = scene!.moments[0];
    expect(moment.type).toBe('experience');
    if (moment.type === 'experience') {
      expect(moment.client.ui).toEqual(uiBlock);
    }
  });
});
