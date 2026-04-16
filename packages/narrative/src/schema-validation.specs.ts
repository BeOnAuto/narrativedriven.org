import { beforeEach, describe, expect, it } from 'vitest';
import { validateSceneClassifications, type ValidationError } from './schema-validation';
import { defineCommand, defineEvent, defineState, resetRefRegistry } from './types';

describe('validateSceneClassifications', () => {
  beforeEach(() => {
    resetRefRegistry();
    // Register fixtures once per test.
    defineState<{ n: number }>('TodoList');
    defineCommand<{ id: string }>('AddTodo');
    defineEvent<{ id: string }>('TodoAdded');
  });

  function commandMomentWithSteps(steps: Array<{ keyword: 'Given' | 'When' | 'Then' | 'And'; __typeName: string }>) {
    return {
      name: 'Test scene',
      moments: [
        {
          name: 'test command',
          type: 'command' as const,
          server: {
            specs: [
              {
                type: 'gherkin' as const,
                feature: 'F',
                rules: [
                  {
                    name: 'R',
                    examples: [
                      {
                        name: 'Ex',
                        steps: steps.map((s) => ({
                          ...s,
                          text: s.__typeName,
                          docString: {},
                        })),
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
      ],
    };
  }

  it('passes a valid command moment (Given state → When command → Then event)', () => {
    const scenes = [
      commandMomentWithSteps([
        { keyword: 'Given', __typeName: 'TodoList' },
        { keyword: 'When', __typeName: 'AddTodo' },
        { keyword: 'Then', __typeName: 'TodoAdded' },
      ]),
    ];

    expect(validateSceneClassifications(scenes)).toEqual([]);
  });

  it('flags a command moment whose When step carries a state (instead of a command)', () => {
    const scenes = [
      commandMomentWithSteps([
        { keyword: 'Given', __typeName: 'TodoList' },
        { keyword: 'When', __typeName: 'TodoList' }, // state, not command
        { keyword: 'Then', __typeName: 'TodoAdded' },
      ]),
    ];

    const errors = validateSceneClassifications(scenes);
    expect(errors).toHaveLength(1);
    const err = errors[0] as ValidationError;
    expect(err.effectiveKeyword).toBe('When');
    expect(err.reason).toMatch(/classification "state".*not allowed under command\.When/);
  });

  it('flags a step whose __typeName is not registered', () => {
    const scenes = [
      commandMomentWithSteps([
        { keyword: 'When', __typeName: 'AddTodo' },
        { keyword: 'Then', __typeName: 'MysteryType' }, // never declared
      ]),
    ];

    const errors = validateSceneClassifications(scenes);
    expect(errors).toHaveLength(1);
    expect(errors[0].reason).toMatch(/unknown type "MysteryType"/);
  });

  it('allows an error step under Then', () => {
    const scenes = [
      {
        name: 'Test scene',
        moments: [
          {
            name: 'test command',
            type: 'command' as const,
            server: {
              specs: [
                {
                  type: 'gherkin' as const,
                  feature: 'F',
                  rules: [
                    {
                      name: 'R',
                      examples: [
                        {
                          name: 'Ex',
                          steps: [
                            { keyword: 'When' as const, text: 'AddTodo', __typeName: 'AddTodo', docString: {} },
                            { keyword: 'Then' as const, text: 'rejected', error: { type: 'ValidationError' as const } },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
    ];

    expect(validateSceneClassifications(scenes)).toEqual([]);
  });

  it('validates And steps against the effective keyword', () => {
    const scenes = [
      commandMomentWithSteps([
        { keyword: 'Given', __typeName: 'TodoList' },
        { keyword: 'And', __typeName: 'AddTodo' }, // And under Given → command is not allowed
        { keyword: 'When', __typeName: 'AddTodo' },
        { keyword: 'Then', __typeName: 'TodoAdded' },
      ]),
    ];

    const errors = validateSceneClassifications(scenes);
    expect(errors).toHaveLength(1);
    expect(errors[0].effectiveKeyword).toBe('Given');
    expect(errors[0].reason).toMatch(/classification "command".*not allowed under command\.Given/);
  });
});
