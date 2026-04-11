import createDebug from 'debug';
import { type ASTNode, print } from 'graphql';
import type { CommandMoment, Exit, ExperienceMoment, QueryMoment, ReactMoment, UiBlock } from './index';
import {
  addMoment,
  endClientBlock,
  endServerBlock,
  getCurrentMoment,
  startClientBlock,
  startServerBlock,
} from './narrative-context';
import type { Integration } from './types';

const debug = createDebug('auto:narrative:fluent-builder');
if ('color' in debug && typeof debug === 'object') {
  (debug as { color: string }).color = '6';
} // cyan
const debugCommand = createDebug('auto:narrative:fluent-builder:command');
if ('color' in debugCommand && typeof debugCommand === 'object') {
  (debugCommand as { color: string }).color = '4';
} // blue
const debugQuery = createDebug('auto:narrative:fluent-builder:query');
if ('color' in debugQuery && typeof debugQuery === 'object') {
  (debugQuery as { color: string }).color = '4';
} // blue
const debugReact = createDebug('auto:narrative:fluent-builder:react');
if ('color' in debugReact && typeof debugReact === 'object') {
  (debugReact as { color: string }).color = '2';
} // green
const debugExperience = createDebug('auto:narrative:fluent-builder:experience');
if ('color' in debugExperience && typeof debugExperience === 'object') {
  (debugExperience as { color: string }).color = '5';
} // magenta

export interface FluentCommandMomentBuilder {
  stream(name: string): FluentCommandMomentBuilder;
  client(fn: () => void): FluentCommandMomentBuilder;
  client(description: string, fn: () => void): FluentCommandMomentBuilder;
  server(fn: () => void): FluentCommandMomentBuilder;
  server(description: string, fn: () => void): FluentCommandMomentBuilder;
  ui(spec: UiBlock): FluentCommandMomentBuilder;
  via(integration: Integration | Integration[]): FluentCommandMomentBuilder;
  retries(count: number): FluentCommandMomentBuilder;
  request(mutation: unknown): FluentCommandMomentBuilder;
  exits(exits: Exit[]): FluentCommandMomentBuilder;
  initiator(name: string): FluentCommandMomentBuilder;
}

export interface FluentQueryMomentBuilder {
  client(fn: () => void): FluentQueryMomentBuilder;
  client(description: string, fn: () => void): FluentQueryMomentBuilder;
  server(fn: () => void): FluentQueryMomentBuilder;
  server(description: string, fn: () => void): FluentQueryMomentBuilder;
  ui(spec: UiBlock): FluentQueryMomentBuilder;
  request(query: unknown): FluentQueryMomentBuilder;
  exits(exits: Exit[]): FluentQueryMomentBuilder;
  initiator(name: string): FluentQueryMomentBuilder;
}

export interface FluentReactionMomentBuilder {
  server(fn: () => void): FluentReactionMomentBuilder;
  server(description: string, fn: () => void): FluentReactionMomentBuilder;
  via(integration: Integration | Integration[]): FluentReactionMomentBuilder;
  retries(count: number): FluentReactionMomentBuilder;
  exits(exits: Exit[]): FluentReactionMomentBuilder;
  initiator(name: string): FluentReactionMomentBuilder;
}

export interface FluentExperienceMomentBuilder {
  client(fn: () => void): FluentExperienceMomentBuilder;
  client(description: string, fn: () => void): FluentExperienceMomentBuilder;
  ui(spec: UiBlock): FluentExperienceMomentBuilder;
  exits(exits: Exit[]): FluentExperienceMomentBuilder;
  initiator(name: string): FluentExperienceMomentBuilder;
}

class CommandMomentBuilderImpl implements FluentCommandMomentBuilder {
  private moment: CommandMoment;

  constructor(name: string, id?: string) {
    debugCommand('Creating command moment: %s', name);
    this.moment = {
      type: 'command',
      name,
      id,
      client: { specs: [] },
      server: { description: '', specs: [], data: undefined },
    };
    addMoment(this.moment);
    debugCommand('Command moment added to scene: %s', name);
  }

  stream(name: string): FluentCommandMomentBuilder {
    debugCommand('Setting stream for moment %s: %s', this.moment.name, name);
    this.moment.stream = name;
    return this;
  }

  client(fn: () => void): FluentCommandMomentBuilder;
  client(description: string, fn: () => void): FluentCommandMomentBuilder;
  client(descriptionOrFn: string | (() => void), fn?: () => void): FluentCommandMomentBuilder {
    const callback = typeof descriptionOrFn === 'function' ? descriptionOrFn : fn;

    debugCommand('Adding client block to moment %s', this.moment.name);

    if (callback) {
      const moment = getCurrentMoment();
      if (moment) {
        debugCommand('Starting client block execution');
        startClientBlock(moment);
        callback();
        endClientBlock();
        debugCommand('Client block execution completed');
      } else {
        debugCommand('WARNING: No current moment found for client block');
      }
    }

    return this;
  }

  server(fn: () => void): FluentCommandMomentBuilder;
  server(description: string, fn: () => void): FluentCommandMomentBuilder;
  server(descriptionOrFn: string | (() => void), fn?: () => void): FluentCommandMomentBuilder {
    const description = typeof descriptionOrFn === 'string' ? descriptionOrFn : '';
    const callback = typeof descriptionOrFn === 'function' ? descriptionOrFn : fn;

    debugCommand('Adding server block to moment %s, description: "%s"', this.moment.name, description);

    if (callback) {
      const moment = getCurrentMoment();
      if (moment) {
        debugCommand('Starting server block execution');
        startServerBlock(moment, description);
        callback();
        endServerBlock();
        debugCommand('Server block execution completed');
      } else {
        debugCommand('WARNING: No current moment found for server block');
      }
    }

    return this;
  }

  ui(spec: UiBlock): FluentCommandMomentBuilder {
    debugCommand('Setting client.ui for moment %s', this.moment.name);
    this.moment.client.ui = spec;
    return this;
  }

  via(integration: Integration | Integration[]): FluentCommandMomentBuilder {
    const integrations = Array.isArray(integration) ? integration : [integration];
    this.moment.via = integrations.map((i) => i.name);
    debugCommand('Set integrations for moment %s: %o', this.moment.name, this.moment.via);
    return this;
  }

  retries(count: number): FluentCommandMomentBuilder {
    debugCommand('Setting retries for moment %s: %d', this.moment.name, count);
    // Store retries in additionalInstructions or metadata
    this.moment.additionalInstructions = `retries: ${count}`;
    return this;
  }

  request(query: unknown): FluentCommandMomentBuilder {
    debugCommand('Setting request for moment %s', this.moment.name);
    if (typeof query === 'string') {
      debugCommand('Request is string, length: %d', query.length);
      this.moment.request = query;
    } else if (
      query !== null &&
      query !== undefined &&
      typeof query === 'object' &&
      'kind' in query &&
      query.kind === 'Document'
    ) {
      debugCommand('Request is GraphQL AST Document, converting to SDL');
      this.moment.request = print(query as ASTNode); // ✅ convert AST to SDL string
      debugCommand('Converted SDL length: %d', this.moment.request.length);
    } else {
      debugCommand('ERROR: Invalid GraphQL query format');
      throw new Error('Invalid GraphQL query format');
    }
    return this;
  }

  exits(exits: Exit[]): FluentCommandMomentBuilder {
    debugCommand('Setting exits for moment %s: %d exits', this.moment.name, exits.length);
    this.moment.exits = exits;
    return this;
  }

  initiator(name: string): FluentCommandMomentBuilder {
    this.moment.initiator = name;
    return this;
  }
}

class QueryMomentBuilderImpl implements FluentQueryMomentBuilder {
  private moment: QueryMoment;

  constructor(name: string, id?: string) {
    debugQuery('Creating query moment: %s', name);
    this.moment = {
      type: 'query',
      name,
      id,
      client: { specs: [] },
      server: { description: '', specs: [], data: undefined },
    };
    addMoment(this.moment);
    debugQuery('Query moment added to scene: %s', name);
  }

  client(fn: () => void): FluentQueryMomentBuilder;
  client(description: string, fn: () => void): FluentQueryMomentBuilder;
  client(descriptionOrFn: string | (() => void), fn?: () => void): FluentQueryMomentBuilder {
    const callback = typeof descriptionOrFn === 'function' ? descriptionOrFn : fn;

    debugQuery('Adding client block to moment %s', this.moment.name);

    if (callback) {
      const moment = getCurrentMoment();
      if (moment) {
        debugQuery('Starting client block execution');
        startClientBlock(moment);
        callback();
        endClientBlock();
        debugQuery('Client block execution completed');
      } else {
        debugQuery('WARNING: No current moment found for client block');
      }
    }

    return this;
  }

  server(fn: () => void): FluentQueryMomentBuilder;
  server(description: string, fn: () => void): FluentQueryMomentBuilder;
  server(descriptionOrFn: string | (() => void), fn?: () => void): FluentQueryMomentBuilder {
    const description = typeof descriptionOrFn === 'string' ? descriptionOrFn : '';
    const callback = typeof descriptionOrFn === 'function' ? descriptionOrFn : fn;

    debugQuery('Adding server block to moment %s, description: "%s"', this.moment.name, description);

    if (callback) {
      const moment = getCurrentMoment();
      if (moment) {
        debugQuery('Starting server block execution');
        startServerBlock(moment, description);
        callback();
        endServerBlock();
        debugQuery('Server block execution completed');
      } else {
        debugQuery('WARNING: No current moment found for server block');
      }
    }

    return this;
  }

  ui(spec: UiBlock): FluentQueryMomentBuilder {
    debugQuery('Setting client.ui for moment %s', this.moment.name);
    this.moment.client.ui = spec;
    return this;
  }

  request(query: unknown): FluentQueryMomentBuilder {
    debugQuery('Setting request for moment %s', this.moment.name);
    if (typeof query === 'string') {
      debugQuery('Request is string, length: %d', query.length);
      this.moment.request = query;
    } else if (
      query !== null &&
      query !== undefined &&
      typeof query === 'object' &&
      'kind' in query &&
      query.kind === 'Document'
    ) {
      debugQuery('Request is GraphQL AST Document, converting to SDL');
      this.moment.request = print(query as ASTNode); // ✅ convert AST to SDL string
      debugQuery('Converted SDL length: %d', this.moment.request.length);
    } else {
      debugQuery('ERROR: Invalid GraphQL query format');
      throw new Error('Invalid GraphQL query format');
    }
    return this;
  }

  exits(exits: Exit[]): FluentQueryMomentBuilder {
    debugQuery('Setting exits for moment %s: %d exits', this.moment.name, exits.length);
    this.moment.exits = exits;
    return this;
  }

  initiator(name: string): FluentQueryMomentBuilder {
    this.moment.initiator = name;
    return this;
  }
}

class ReactionMomentBuilderImpl implements FluentReactionMomentBuilder {
  private moment: ReactMoment;

  constructor(name: string, id?: string) {
    debugReact('Creating reaction moment: %s', name);
    this.moment = {
      type: 'react',
      name,
      id,
      server: { specs: [], data: undefined },
    };
    addMoment(this.moment);
    debugReact('Reaction moment added to scene: %s', name);
  }

  server(fn: () => void): FluentReactionMomentBuilder;
  server(description: string, fn: () => void): FluentReactionMomentBuilder;
  server(descriptionOrFn: string | (() => void), fn?: () => void): FluentReactionMomentBuilder {
    const description = typeof descriptionOrFn === 'string' ? descriptionOrFn : '';
    const callback = typeof descriptionOrFn === 'function' ? descriptionOrFn : fn;

    debugReact('Adding server block to moment %s, description: "%s"', this.moment.name, description);

    if (callback) {
      const moment = getCurrentMoment();
      if (moment) {
        debugReact('Starting server block execution');
        startServerBlock(moment, description);
        callback();
        endServerBlock();
        debugReact('Server block execution completed');
      } else {
        debugReact('WARNING: No current moment found for server block');
      }
    }

    return this;
  }

  via(integration: Integration | Integration[]): FluentReactionMomentBuilder {
    const integrations = Array.isArray(integration) ? integration : [integration];
    this.moment.via = integrations.map((i) => i.name);
    debugReact('Set integrations for moment %s: %o', this.moment.name, this.moment.via);
    return this;
  }

  retries(count: number): FluentReactionMomentBuilder {
    debugReact('Setting retries for moment %s: %d', this.moment.name, count);
    // Store retries in additionalInstructions or metadata
    this.moment.additionalInstructions = `retries: ${count}`;
    return this;
  }

  exits(exits: Exit[]): FluentReactionMomentBuilder {
    debugReact('Setting exits for moment %s: %d exits', this.moment.name, exits.length);
    this.moment.exits = exits;
    return this;
  }

  initiator(name: string): FluentReactionMomentBuilder {
    this.moment.initiator = name;
    return this;
  }
}

class ExperienceMomentBuilderImpl implements FluentExperienceMomentBuilder {
  private moment: ExperienceMoment;

  constructor(name: string, id?: string) {
    debugExperience('Creating experience moment: %s', name);
    this.moment = {
      type: 'experience',
      name,
      id,
      client: { specs: [] },
    };
    addMoment(this.moment);
    debugExperience('Experience moment added to scene: %s', name);
  }

  client(fn: () => void): FluentExperienceMomentBuilder;
  client(description: string, fn: () => void): FluentExperienceMomentBuilder;
  client(descriptionOrFn: string | (() => void), fn?: () => void): FluentExperienceMomentBuilder {
    const callback = typeof descriptionOrFn === 'function' ? descriptionOrFn : fn;

    debugExperience('Adding client block to moment %s', this.moment.name);

    if (callback) {
      const moment = getCurrentMoment();
      if (moment) {
        debugExperience('Starting client block execution');
        startClientBlock(moment);
        callback();
        endClientBlock();
        debugExperience('Client block execution completed');
      } else {
        debugExperience('WARNING: No current moment found for client block');
      }
    }

    return this;
  }

  ui(spec: UiBlock): FluentExperienceMomentBuilder {
    debugExperience('Setting client.ui for moment %s', this.moment.name);
    this.moment.client.ui = spec;
    return this;
  }

  exits(exits: Exit[]): FluentExperienceMomentBuilder {
    debugExperience('Setting exits for moment %s: %d exits', this.moment.name, exits.length);
    this.moment.exits = exits;
    return this;
  }

  initiator(name: string): FluentExperienceMomentBuilder {
    this.moment.initiator = name;
    return this;
  }
}

export const command = (name: string, id?: string): FluentCommandMomentBuilder => {
  debug('Creating command moment: %s', name);
  return new CommandMomentBuilderImpl(name, id);
};

export const query = (name: string, id?: string): FluentQueryMomentBuilder => {
  debug('Creating query moment: %s', name);
  return new QueryMomentBuilderImpl(name, id);
};

export const react = (name: string, id?: string): FluentReactionMomentBuilder => {
  debug('Creating react moment: %s', name);
  return new ReactionMomentBuilderImpl(name, id);
};

export const experience = (name: string, id?: string): FluentExperienceMomentBuilder => {
  debug('Creating experience moment: %s', name);
  return new ExperienceMomentBuilderImpl(name, id);
};

export const decide = (name: string, id?: string): FluentCommandMomentBuilder => {
  debug('Creating command moment via decide alias: %s', name);
  return new CommandMomentBuilderImpl(name, id);
};

export const evolve = (name: string, id?: string): FluentQueryMomentBuilder => {
  debug('Creating query moment via evolve alias: %s', name);
  return new QueryMomentBuilderImpl(name, id);
};
