import { describe, expect, it } from 'vitest';
import type { Scene } from '../../index';
import { collectMessageKeysFromScenes } from './spec-traversal';

describe('collectMessageKeysFromScenes', () => {
  it('returns empty set for empty scenes array', () => {
    const keys = collectMessageKeysFromScenes([]);

    expect(keys.size).toBe(0);
  });

  it('returns empty set for scenes with no slices', () => {
    const scenes: Scene[] = [{ name: 'Empty', moments: [] }];

    const keys = collectMessageKeysFromScenes(scenes);

    expect(keys.size).toBe(0);
  });

  it('ignores experience slices', () => {
    const scenes: Scene[] = [
      {
        name: 'Test',
        moments: [
          {
            name: 'Homepage',
            type: 'experience',
            client: { specs: [] },
          },
        ],
      },
    ];

    const keys = collectMessageKeysFromScenes(scenes);

    expect(keys.size).toBe(0);
  });

  it('collects command keys from When steps', () => {
    const scenes: Scene[] = [
      {
        name: 'Test',
        moments: [
          {
            name: 'create order',
            type: 'command',
            client: { specs: [] },
            server: {
              description: 'Test',
              specs: [
                {
                  type: 'gherkin',
                  feature: 'Test',
                  rules: [
                    {
                      name: 'test rule',
                      examples: [
                        {
                          name: 'test example',
                          steps: [{ keyword: 'When', text: 'CreateOrder' }],
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

    const keys = collectMessageKeysFromScenes(scenes);

    expect(keys.has('command:CreateOrder')).toBe(true);
  });

  it('collects event and state keys from Given steps', () => {
    const scenes: Scene[] = [
      {
        name: 'Test',
        moments: [
          {
            name: 'view order',
            type: 'query',
            client: { specs: [] },
            server: {
              description: 'Test',
              specs: [
                {
                  type: 'gherkin',
                  feature: 'Test',
                  rules: [
                    {
                      name: 'test rule',
                      examples: [
                        {
                          name: 'test example',
                          steps: [{ keyword: 'Given', text: 'OrderCreated' }],
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

    const keys = collectMessageKeysFromScenes(scenes);

    expect(keys.has('event:OrderCreated')).toBe(true);
    expect(keys.has('state:OrderCreated')).toBe(true);
  });

  it('collects event and state keys from And steps', () => {
    const scenes: Scene[] = [
      {
        name: 'Test',
        moments: [
          {
            name: 'test',
            type: 'react',
            server: {
              description: 'Test',
              specs: [
                {
                  type: 'gherkin',
                  feature: 'Test',
                  rules: [
                    {
                      name: 'test rule',
                      examples: [
                        {
                          name: 'test example',
                          steps: [{ keyword: 'And', text: 'UserLoggedIn' }],
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

    const keys = collectMessageKeysFromScenes(scenes);

    expect(keys.has('event:UserLoggedIn')).toBe(true);
    expect(keys.has('state:UserLoggedIn')).toBe(true);
  });

  it('collects event and state keys from Then steps', () => {
    const scenes: Scene[] = [
      {
        name: 'Test',
        moments: [
          {
            name: 'test',
            type: 'command',
            client: { specs: [] },
            server: {
              description: 'Test',
              specs: [
                {
                  type: 'gherkin',
                  feature: 'Test',
                  rules: [
                    {
                      name: 'test rule',
                      examples: [
                        {
                          name: 'test example',
                          steps: [{ keyword: 'Then', text: 'OrderCompleted' }],
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

    const keys = collectMessageKeysFromScenes(scenes);

    expect(keys.has('event:OrderCompleted')).toBe(true);
    expect(keys.has('state:OrderCompleted')).toBe(true);
  });

  it('handles slices without server specs', () => {
    const scenes: Scene[] = [
      {
        name: 'Test',
        moments: [
          {
            name: 'test',
            type: 'experience',
            client: { specs: [] },
          },
        ],
      },
    ];

    const keys = collectMessageKeysFromScenes(scenes);

    expect(keys.size).toBe(0);
  });

  it('handles specs without rules', () => {
    const scenes: Scene[] = [
      {
        name: 'Test',
        moments: [
          {
            name: 'test',
            type: 'command',
            client: { specs: [] },
            server: {
              description: 'Test',
              specs: [{ type: 'gherkin', feature: 'Test', rules: [] }],
            },
          },
        ],
      },
    ];

    const keys = collectMessageKeysFromScenes(scenes);

    expect(keys.size).toBe(0);
  });

  it('handles rules without examples', () => {
    const scenes: Scene[] = [
      {
        name: 'Test',
        moments: [
          {
            name: 'test',
            type: 'command',
            client: { specs: [] },
            server: {
              description: 'Test',
              specs: [
                {
                  type: 'gherkin',
                  feature: 'Test',
                  rules: [{ name: 'empty rule', examples: [] }],
                },
              ],
            },
          },
        ],
      },
    ];

    const keys = collectMessageKeysFromScenes(scenes);

    expect(keys.size).toBe(0);
  });

  it('handles examples without steps', () => {
    const scenes: Scene[] = [
      {
        name: 'Test',
        moments: [
          {
            name: 'test',
            type: 'command',
            client: { specs: [] },
            server: {
              description: 'Test',
              specs: [
                {
                  type: 'gherkin',
                  feature: 'Test',
                  rules: [
                    {
                      name: 'rule',
                      examples: [{ name: 'empty example', steps: [] }],
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
    ];

    const keys = collectMessageKeysFromScenes(scenes);

    expect(keys.size).toBe(0);
  });

  it('handles steps with empty text', () => {
    const scenes: Scene[] = [
      {
        name: 'Test',
        moments: [
          {
            name: 'test',
            type: 'command',
            client: { specs: [] },
            server: {
              description: 'Test',
              specs: [
                {
                  type: 'gherkin',
                  feature: 'Test',
                  rules: [
                    {
                      name: 'rule',
                      examples: [
                        {
                          name: 'example',
                          steps: [{ keyword: 'When', text: '' }],
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

    const keys = collectMessageKeysFromScenes(scenes);

    expect(keys.size).toBe(0);
  });

  it('collects keys from multiple scenes and slices', () => {
    const scenes: Scene[] = [
      {
        name: 'Orders',
        moments: [
          {
            name: 'create',
            type: 'command',
            client: { specs: [] },
            server: {
              description: 'Test',
              specs: [
                {
                  type: 'gherkin',
                  feature: 'Test',
                  rules: [
                    {
                      name: 'rule',
                      examples: [
                        {
                          name: 'example',
                          steps: [
                            { keyword: 'When', text: 'CreateOrder' },
                            { keyword: 'Then', text: 'OrderCreated' },
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
      {
        name: 'Users',
        moments: [
          {
            name: 'register',
            type: 'command',
            client: { specs: [] },
            server: {
              description: 'Test',
              specs: [
                {
                  type: 'gherkin',
                  feature: 'Test',
                  rules: [
                    {
                      name: 'rule',
                      examples: [
                        {
                          name: 'example',
                          steps: [
                            { keyword: 'When', text: 'RegisterUser' },
                            { keyword: 'Then', text: 'UserRegistered' },
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

    const keys = collectMessageKeysFromScenes(scenes);

    expect(keys.has('command:CreateOrder')).toBe(true);
    expect(keys.has('event:OrderCreated')).toBe(true);
    expect(keys.has('command:RegisterUser')).toBe(true);
    expect(keys.has('event:UserRegistered')).toBe(true);
  });
});
