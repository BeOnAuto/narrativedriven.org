import { describe, expect, it, beforeEach } from 'vitest';
import {
  defineCommand,
  defineEvent,
  defineQuery,
  defineState,
  getClassificationFor,
  registerRef,
  resetRefRegistry,
} from './types';

describe('runtime type factories', () => {
  beforeEach(() => {
    resetRefRegistry();
  });

  it('defineCommand returns a frozen TypedRef with __kind=command and the given name', () => {
    const AddTodo = defineCommand<{ todoId: string }>('AddTodo');
    expect(AddTodo.__kind).toBe('command');
    expect(AddTodo.name).toBe('AddTodo');
    expect(Object.isFrozen(AddTodo)).toBe(true);
  });

  it('defineEvent, defineState, defineQuery tag their kind', () => {
    expect(defineEvent('TodoAdded').__kind).toBe('event');
    expect(defineState('TodoList').__kind).toBe('state');
    expect(defineQuery('GetTodos').__kind).toBe('query');
  });

  it('factory call registers the (name -> classification) mapping', () => {
    defineCommand('AddTodo');
    expect(getClassificationFor('AddTodo')).toBe('command');
  });

  it('registerRef is idempotent for the same kind', () => {
    registerRef('TodoAdded', 'event');
    expect(() => registerRef('TodoAdded', 'event')).not.toThrow();
    expect(getClassificationFor('TodoAdded')).toBe('event');
  });

  it('registerRef throws when re-registering the same name with a different kind', () => {
    registerRef('AddTodo', 'command');
    expect(() => registerRef('AddTodo', 'event')).toThrow(/already registered as "command"/);
  });

  it('resetRefRegistry clears all registrations', () => {
    defineCommand('AddTodo');
    expect(getClassificationFor('AddTodo')).toBe('command');
    resetRefRegistry();
    expect(getClassificationFor('AddTodo')).toBeUndefined();
  });
});
