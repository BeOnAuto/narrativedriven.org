import type { CommandMoment, QueryMoment, ReactMoment } from './index';
import { addMoment, getCurrentScene } from './narrative-context';
import type { Integration } from './types';

export interface MomentConfig {
  integration?: Integration;
  eventStream?: string;
  retries?: number;
}

export interface MomentBuilder {
  via(integrationOrStream: Integration | string): MomentBuilder;

  retries(count: number): MomentBuilder;

  stream(eventStream: string): MomentBuilder;

  command(name: string, fn: () => void): void;

  query(name: string, fn: () => void): void;

  reaction(name: string, fn: () => void): void;
}

export const createMomentBuilder = (config: MomentConfig = {}): MomentBuilder => ({
  via(integrationOrStream: Integration | string): MomentBuilder {
    if (typeof integrationOrStream === 'string') {
      return createMomentBuilder({ ...config, eventStream: integrationOrStream });
    } else {
      return createMomentBuilder({ ...config, integration: integrationOrStream });
    }
  },

  retries(count: number): MomentBuilder {
    return createMomentBuilder({ ...config, retries: count });
  },

  stream(eventStream: string): MomentBuilder {
    return createMomentBuilder({ ...config, eventStream });
  },

  command(name: string, fn: () => void) {
    const currentScene = getCurrentScene();
    if (!currentScene) throw new Error('No active scene');

    // Create a properly typed command moment
    const slice: CommandMoment = {
      type: 'command',
      name,
      client: { specs: [] },
      server: { description: '', specs: [], data: undefined },
      // Optional fields
      ...(config.eventStream != null && { stream: config.eventStream }),
      ...(config.integration && { via: [config.integration.name] }),
      ...(config.retries != null && { additionalInstructions: `retries: ${config.retries}` }),
    };
    addMoment(slice);
    fn();
  },

  query(name: string, fn: () => void) {
    const currentScene = getCurrentScene();
    if (!currentScene) throw new Error('No active scene');

    // Create a properly typed query moment
    const slice: QueryMoment = {
      type: 'query',
      name,
      client: { specs: [] },
      server: { description: '', specs: [], data: undefined },
      // Optional fields
      ...(config.eventStream != null && { stream: config.eventStream }),
      ...(config.integration && { via: [config.integration.name] }),
      ...(config.retries != null && { additionalInstructions: `retries: ${config.retries}` }),
    };

    addMoment(slice);

    // Execute the function which will populate client/server blocks
    fn();
  },

  reaction(name: string, fn: () => void) {
    const currentScene = getCurrentScene();
    if (!currentScene) throw new Error('No active scene');

    // Create a properly typed react moment (note: 'reaction' -> 'react' for schema compliance)
    const slice: ReactMoment = {
      type: 'react',
      name,
      server: { specs: [], data: undefined },
      // Optional fields
      ...(config.eventStream != null && { stream: config.eventStream }),
      ...(config.integration && { via: [config.integration.name] }),
      ...(config.retries != null && { additionalInstructions: `retries: ${config.retries}` }),
    };
    addMoment(slice);
    fn();
  },
});
