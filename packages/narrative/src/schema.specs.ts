import { describe, expect, it } from 'vitest';
import type {
  Actor,
  ComponentDefinition,
  Entity,
  Narrative,
  NarrativePlanning,
  UI,
  UIElement,
  UISpec,
} from './schema';
import {
  ActorSchema,
  CommandMomentSchema,
  ComponentDefinitionSchema,
  DataSchema,
  DataTargetSchema,
  DesignSchema,
  EntitySchema,
  modelSchema,
  NarrativePlanningSchema,
  NarrativeSchema,
  QueryMomentSchema,
  ReactMomentSchema,
  SceneNamesOnlySchema,
  SceneSchema,
  UIElementSchema,
  UISchema,
  UISpecSchema,
} from './schema';

describe('CommandMomentSchema', () => {
  it('should accept optional mappings field with structured entries', () => {
    const slice = {
      type: 'command' as const,
      name: 'Create User',
      client: { specs: [] },
      server: { description: 'Creates a user', specs: [] },
      mappings: [
        {
          source: { type: 'Command' as const, name: 'CreateUser', field: 'userId' },
          target: { type: 'Event' as const, name: 'UserCreated', field: 'id' },
        },
      ],
    };

    const result = CommandMomentSchema.safeParse(slice);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.mappings).toEqual([
        {
          source: { type: 'Command', name: 'CreateUser', field: 'userId' },
          target: { type: 'Event', name: 'UserCreated', field: 'id' },
        },
      ]);
    }
  });
});

describe('BaseMomentSchema initiator field', () => {
  it('should accept command moment with optional initiator', () => {
    const input = {
      type: 'command' as const,
      name: 'Submit',
      initiator: 'Operator',
      client: { specs: [] },
      server: { description: 'Submits', specs: [] },
    };
    const result = CommandMomentSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(input);
    }
  });

  it('should accept react moment with optional initiator', () => {
    const input = {
      type: 'react' as const,
      name: 'Process',
      initiator: 'Gateway',
      server: { specs: [] },
    };
    const result = ReactMomentSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(input);
    }
  });

  it('should accept moment without initiator (backward compat)', () => {
    const input = {
      type: 'command' as const,
      name: 'Submit',
      client: { specs: [] },
      server: { description: 'Submits', specs: [] },
    };
    const result = CommandMomentSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(input);
    }
  });
});

describe('CommandMomentSchema client.ui', () => {
  it('accepts ui block in client alongside specs', () => {
    const moment = {
      type: 'command' as const,
      name: 'Submit Order',
      client: {
        specs: [],
        ui: {
          layoutId: 'centered-narrow',
          mode: 'as-is',
          regions: { main: [{ id: 'r1', name: 'hero' }] },
          spec: { root: 'layout-root', elements: {}, state: {} },
          surface: 'route',
        },
      },
      server: { description: 'Submits order', specs: [] },
    };

    const result = CommandMomentSchema.safeParse(moment);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.client.ui).toEqual({
        layoutId: 'centered-narrow',
        mode: 'as-is',
        regions: { main: [{ id: 'r1', name: 'hero' }] },
        spec: { root: 'layout-root', elements: {}, state: {} },
        surface: 'route',
      });
    }
  });
});

describe('SceneSchema', () => {
  it('should accept scene with outcome, actors, and entities', () => {
    const input = {
      name: 'Submit Entry',
      moments: [],
      outcome: 'Entry submitted',
      actors: ['Submitter'],
      entities: ['Entry'],
    };
    const result = SceneSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(input);
    }
  });

  it('should accept minimal scene (name + moments)', () => {
    const result = SceneSchema.safeParse({ name: 'Simple', moments: [] });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ name: 'Simple', moments: [] });
    }
  });
});

describe('NarrativeSchema', () => {
  it('should accept a valid narrative with required fields', () => {
    const result = NarrativeSchema.safeParse({
      name: 'Onboarding',
      sceneIds: ['n-1', 'n-2'],
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe('Onboarding');
      expect(result.data.sceneIds).toEqual(['n-1', 'n-2']);
    }
  });

  it('should accept all optional fields', () => {
    const result = NarrativeSchema.safeParse({
      id: 'j-1',
      name: 'Checkout',
      description: 'Full checkout flow',
      actors: ['buyer', 'seller'],
      sceneIds: ['n-cart', 'n-pay'],
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.id).toBe('j-1');
      expect(result.data.description).toBe('Full checkout flow');
      expect(result.data.actors).toEqual(['buyer', 'seller']);
    }
  });

  it('should reject missing name', () => {
    const result = NarrativeSchema.safeParse({ sceneIds: ['n-1'] });
    expect(result.success).toBe(false);
  });

  it('should reject missing sceneIds', () => {
    const result = NarrativeSchema.safeParse({ name: 'Onboarding' });
    expect(result.success).toBe(false);
  });

  it('should accept narrative with outcome, requirements, and assumptions', () => {
    const input = {
      name: 'Registration',
      sceneIds: ['n-1'],
      outcome: 'User gains access to the system',
      requirements: 'Must complete within 60 seconds',
      assumptions: ['Email service is reachable', 'Unique constraint on username'],
    };
    const result = NarrativeSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(input);
    }
  });
});

describe('modelSchema narratives field', () => {
  const minimalModel = {
    variant: 'specs' as const,
    scenes: [],
    messages: [],
    modules: [],
    narratives: [],
  };

  it('should reject model without narratives (required)', () => {
    const { narratives: _, ...modelWithoutNarratives } = minimalModel;
    const result = modelSchema.safeParse(modelWithoutNarratives);
    expect(result.success).toBe(false);
  });

  it('should accept model with empty narratives array', () => {
    const result = modelSchema.safeParse(minimalModel);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.narratives).toEqual([]);
    }
  });

  it('should accept model with narratives array', () => {
    const result = modelSchema.safeParse({
      ...minimalModel,
      narratives: [
        {
          id: 'j-1',
          name: 'Onboarding',
          sceneIds: ['n-1', 'n-2'],
        },
      ],
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.narratives).toHaveLength(1);
      expect(result.data.narratives![0].name).toBe('Onboarding');
    }
  });
});

describe('NarrativePlanningSchema', () => {
  it('should accept a valid narrative-planning variant', () => {
    const input = {
      variant: 'narrative-planning',
      narratives: [
        {
          name: 'Onboarding',
          description: 'New user onboarding flow',
          sceneNames: ['Sign Up', 'Verify Email'],
        },
        {
          name: 'Checkout',
          sceneNames: ['Add to Cart', 'Payment'],
        },
      ],
      scenes: [
        { name: 'Sign Up' },
        { name: 'Verify Email', id: 'n-verify', outcome: 'Email verified' },
        { name: 'Add to Cart' },
        { name: 'Payment' },
      ],
    };

    const result = NarrativePlanningSchema.safeParse(input);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({
        variant: 'narrative-planning',
        narratives: [
          {
            name: 'Onboarding',
            description: 'New user onboarding flow',
            sceneNames: ['Sign Up', 'Verify Email'],
          },
          {
            name: 'Checkout',
            sceneNames: ['Add to Cart', 'Payment'],
          },
        ],
        scenes: [
          { name: 'Sign Up' },
          { name: 'Verify Email', id: 'n-verify', outcome: 'Email verified' },
          { name: 'Add to Cart' },
          { name: 'Payment' },
        ],
      });
    }
  });

  it('should reject missing variant', () => {
    const result = NarrativePlanningSchema.safeParse({
      narratives: [],
      scenes: [],
    });

    expect(result.success).toBe(false);
  });

  it('should reject wrong variant', () => {
    const result = NarrativePlanningSchema.safeParse({
      variant: 'scene-names',
      narratives: [],
      scenes: [],
    });

    expect(result.success).toBe(false);
  });

  it('should reject missing narratives', () => {
    const result = NarrativePlanningSchema.safeParse({
      variant: 'narrative-planning',
      scenes: [],
    });

    expect(result.success).toBe(false);
  });

  it('should reject missing scenes', () => {
    const result = NarrativePlanningSchema.safeParse({
      variant: 'narrative-planning',
      narratives: [],
    });

    expect(result.success).toBe(false);
  });

  it('should accept narrative with actors', () => {
    const result = NarrativePlanningSchema.safeParse({
      variant: 'narrative-planning',
      narratives: [
        {
          name: 'Onboarding',
          actors: ['new-user', 'admin'],
          sceneNames: ['Sign Up'],
        },
      ],
      scenes: [{ name: 'Sign Up' }],
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.narratives[0].actors).toEqual(['new-user', 'admin']);
    }
  });

  it('should reject narrative missing sceneNames', () => {
    const result = NarrativePlanningSchema.safeParse({
      variant: 'narrative-planning',
      narratives: [{ name: 'Onboarding' }],
      scenes: [],
    });

    expect(result.success).toBe(false);
  });

  it('should accept planning narrative with outcome and assumptions', () => {
    const input = {
      variant: 'narrative-planning' as const,
      narratives: [
        {
          name: 'Setup',
          sceneNames: ['Configure'],
          outcome: 'System is configured',
          assumptions: ['Admin has credentials'],
        },
      ],
      scenes: [{ name: 'Configure' }],
    };
    const result = NarrativePlanningSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(input);
    }
  });

  it('should accept planning schema with model-level actors, entities, assumptions, requirements', () => {
    const input = {
      variant: 'narrative-planning' as const,
      narratives: [{ name: 'Flow', sceneNames: ['Step'] }],
      scenes: [{ name: 'Step' }],
      actors: [{ name: 'Operator', kind: 'person' as const, description: 'Runs the system' }],
      entities: [{ name: 'Task', description: 'A unit of work' }],
      assumptions: ['System is online'],
      requirements: 'Must handle concurrent access',
      outcome: 'Tasks are completed on time',
    };
    const result = NarrativePlanningSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(input);
    }
  });
});

describe('SceneNamesOnlySchema', () => {
  it('should be exported and accept valid input', () => {
    const result = SceneNamesOnlySchema.safeParse({
      name: 'Create Todo',
      id: 'n-1',
      description: 'Create a todo item',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe('Create Todo');
    }
  });

  it('should require name', () => {
    const result = SceneNamesOnlySchema.safeParse({ description: 'no name' });
    expect(result.success).toBe(false);
  });
});

describe('exported types', () => {
  it('Narrative type matches NarrativeSchema inference', () => {
    const input = { name: 'Onboarding', sceneIds: ['n-1'] };
    const parsed = NarrativeSchema.parse(input);
    const typed: Narrative = parsed;

    expect(typed).toEqual({ name: 'Onboarding', sceneIds: ['n-1'] });
  });

  it('NarrativePlanning type matches NarrativePlanningSchema inference', () => {
    const input = {
      variant: 'narrative-planning' as const,
      narratives: [{ name: 'Flow', sceneNames: ['Step 1'] }],
      scenes: [{ name: 'Step 1' }],
    };
    const parsed = NarrativePlanningSchema.parse(input);
    const typed: NarrativePlanning = parsed;

    expect(typed).toEqual({
      variant: 'narrative-planning',
      narratives: [{ name: 'Flow', sceneNames: ['Step 1'] }],
      scenes: [{ name: 'Step 1' }],
    });
  });
});

describe('DataTargetSchema', () => {
  it('should accept a target-only event item', () => {
    const result = DataTargetSchema.safeParse({
      target: { type: 'Event', name: 'TodoAdded' },
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({
        target: { type: 'Event', name: 'TodoAdded' },
      });
    }
  });

  it('should accept optional id, transform, and _additionalInstructions', () => {
    const result = DataTargetSchema.safeParse({
      id: 'dt-1',
      target: { type: 'Event', name: 'OrderPlaced' },
      transform: 'mapOrder',
      _additionalInstructions: 'extra info',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({
        id: 'dt-1',
        target: { type: 'Event', name: 'OrderPlaced' },
        transform: 'mapOrder',
        _additionalInstructions: 'extra info',
      });
    }
  });

  it('should reject Command target type', () => {
    const result = DataTargetSchema.safeParse({
      target: { type: 'Command', name: 'CreateTodo' },
    });

    expect(result.success).toBe(false);
  });

  it('should reject State target type', () => {
    const result = DataTargetSchema.safeParse({
      target: { type: 'State', name: 'TodoState' },
    });

    expect(result.success).toBe(false);
  });
});

describe('DataSchema with target-only items', () => {
  it('should accept target-only items in the items array', () => {
    const result = DataSchema.safeParse({
      items: [{ target: { type: 'Event', name: 'TodoAdded' } }],
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.items).toEqual([{ target: { type: 'Event', name: 'TodoAdded' } }]);
    }
  });

  it('should accept mixed sink and target items', () => {
    const result = DataSchema.safeParse({
      items: [
        {
          target: { type: 'Event', name: 'TodoAdded' },
          destination: { type: 'stream', pattern: 'todo-${id}' },
        },
        { target: { type: 'Event', name: 'TodoRemoved' } },
      ],
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.items).toEqual([
        {
          target: { type: 'Event', name: 'TodoAdded' },
          destination: { type: 'stream', pattern: 'todo-${id}' },
        },
        { target: { type: 'Event', name: 'TodoRemoved' } },
      ]);
    }
  });
});

describe('QueryMomentSchema', () => {
  it('should accept optional mappings field with structured entries', () => {
    const slice = {
      type: 'query' as const,
      name: 'Get Users',
      client: { specs: [] },
      server: { description: 'Gets users', specs: [] },
      mappings: [
        {
          source: { type: 'State' as const, name: 'UsersProjection', field: 'users' },
          target: { type: 'Query' as const, name: 'GetUsers', field: 'data' },
        },
      ],
    };

    const result = QueryMomentSchema.safeParse(slice);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.mappings).toEqual([
        {
          source: { type: 'State', name: 'UsersProjection', field: 'users' },
          target: { type: 'Query', name: 'GetUsers', field: 'data' },
        },
      ]);
    }
  });
});

describe('UIElementSchema', () => {
  it('should accept a minimal element with type only', () => {
    const result = UIElementSchema.safeParse({ type: 'Stack' });
    expect(result.success).toBe(true);
  });

  it('should accept an element with all fields', () => {
    const element = {
      type: 'Heading',
      props: { text: { $state: '/title' }, level: 'h1' },
      children: ['subtitle'],
      visible: { $state: '/showTitle' },
      repeat: { statePath: '/items', key: 'id' },
      watch: { '/count': { action: 'refresh' } },
    };
    expect(UIElementSchema.parse(element)).toEqual(element);
  });

  it('should accept repeat with object statePath for nested repeats', () => {
    const element = {
      type: 'Stack',
      children: [],
      repeat: { statePath: { $item: 'fields' }, key: 'name' },
    };
    expect(UIElementSchema.parse(element)).toEqual(element);
  });
});

describe('UISpecSchema', () => {
  it('should accept a valid spec with root, elements, and state', () => {
    const spec = {
      root: 'page',
      elements: {
        page: { type: 'Stack', props: { direction: 'vertical' }, children: ['heading'] },
        heading: { type: 'Heading', props: { text: 'Hello' }, children: [] },
      },
      state: { title: 'Hello' },
    };
    expect(UISpecSchema.parse(spec)).toEqual(spec);
  });

  it('should reject a spec missing root', () => {
    expect(UISpecSchema.safeParse({ elements: {} }).success).toBe(false);
  });

  it('should reject a spec missing elements', () => {
    expect(UISpecSchema.safeParse({ root: 'x' }).success).toBe(false);
  });
});

describe('UISchema', () => {
  it('should accept an empty object since spec is optional', () => {
    expect(UISchema.parse({})).toEqual({});
  });

  it('should accept a UI with a spec', () => {
    const ui = {
      spec: {
        root: 'page',
        elements: { page: { type: 'Stack', children: [] } },
        state: { title: 'Dashboard' },
      },
    };
    expect(UISchema.parse(ui)).toEqual(ui);
  });
});

describe('ComponentDefinitionSchema', () => {
  it('should accept valid component definition', () => {
    const result = ComponentDefinitionSchema.safeParse({
      id: 'comp-1',
      name: 'PriceTag',
      category: 'commerce',
      description: 'Displays a price',
      slots: { price: { type: 'number' } },
      template: '<span>{{price}}</span>',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({
        id: 'comp-1',
        name: 'PriceTag',
        category: 'commerce',
        description: 'Displays a price',
        slots: { price: { type: 'number' } },
        template: '<span>{{price}}</span>',
      });
    }
  });

  it('should reject missing required fields', () => {
    const result = ComponentDefinitionSchema.safeParse({ id: 'comp-1', name: 'PriceTag' });
    expect(result.success).toBe(false);
  });
});

describe('DesignSchema', () => {
  it('does not include ui (ui lives in client.ui now)', () => {
    const design = {
      ui: { spec: { root: 'page', elements: {}, state: {} } },
      imageAsset: { url: 'https://example.com/img.png' },
    };
    const parsed = DesignSchema.parse(design);
    expect(parsed).toEqual({ imageAsset: { url: 'https://example.com/img.png' } });
    expect('ui' in parsed).toBe(false);
  });

  it('accepts design without ui', () => {
    expect(DesignSchema.parse({})).toEqual({});
  });
});

describe('modelSchema design.components field', () => {
  const minimalModel = {
    variant: 'specs' as const,
    scenes: [],
    messages: [],
    modules: [],
    narratives: [],
  };

  it('should accept model with design.components', () => {
    const result = modelSchema.safeParse({
      ...minimalModel,
      design: {
        components: [
          {
            id: 'comp-1',
            name: 'PriceTag',
            category: 'commerce',
            description: 'Displays a price',
            slots: { price: { type: 'number' } },
            template: '<span>{{price}}</span>',
          },
        ],
      },
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.design?.components).toHaveLength(1);
      expect(result.data.design?.components?.[0].name).toBe('PriceTag');
    }
  });

  it('should accept model design without components', () => {
    const result = modelSchema.safeParse({
      ...minimalModel,
      design: {},
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.design?.components).toBeUndefined();
    }
  });
});

describe('exported UI types', () => {
  it('UIElement type matches UIElementSchema inference', () => {
    const parsed = UIElementSchema.parse({ type: 'Stack', children: [] });
    const typed: UIElement = parsed;
    expect(typed).toEqual({ type: 'Stack', children: [] });
  });

  it('UISpec type matches UISpecSchema inference', () => {
    const spec = { root: 'page', elements: { page: { type: 'Stack', children: [] } } };
    const parsed = UISpecSchema.parse(spec);
    const typed: UISpec = parsed;
    expect(typed).toEqual(spec);
  });

  it('UI type matches UISchema inference', () => {
    const parsed = UISchema.parse({});
    const typed: UI = parsed;
    expect(typed).toEqual({});
  });

  it('ComponentDefinition type matches ComponentDefinitionSchema inference', () => {
    const parsed = ComponentDefinitionSchema.parse({
      id: 'c-1',
      name: 'Btn',
      category: 'ui',
      description: 'A button',
      slots: {},
      template: '<button/>',
    });
    const typed: ComponentDefinition = parsed;
    expect(typed).toEqual(parsed);
  });
});

describe('ActorSchema', () => {
  it('should accept a valid person actor', () => {
    const result = ActorSchema.safeParse({
      name: 'Operator',
      kind: 'person',
      description: 'Manages the system',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({
        name: 'Operator',
        kind: 'person',
        description: 'Manages the system',
      });
    }
  });

  it('should accept a valid system actor', () => {
    const result = ActorSchema.safeParse({
      name: 'Gateway',
      kind: 'system',
      description: 'Routes requests',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({
        name: 'Gateway',
        kind: 'system',
        description: 'Routes requests',
      });
    }
  });

  it('should reject invalid kind', () => {
    const result = ActorSchema.safeParse({
      name: 'Bot',
      kind: 'robot',
      description: 'Does things',
    });
    expect(result.success).toBe(false);
  });

  it('should reject missing required fields', () => {
    expect(ActorSchema.safeParse({ name: 'X' }).success).toBe(false);
    expect(ActorSchema.safeParse({ kind: 'person' }).success).toBe(false);
    expect(ActorSchema.safeParse({ description: 'Y' }).success).toBe(false);
  });

  it('Actor type matches ActorSchema inference', () => {
    const parsed = ActorSchema.parse({ name: 'A', kind: 'person', description: 'D' });
    const typed: Actor = parsed;
    expect(typed).toEqual({ name: 'A', kind: 'person', description: 'D' });
  });
});

describe('EntitySchema', () => {
  it('should accept entity with name and description', () => {
    const result = EntitySchema.safeParse({
      name: 'Item',
      description: 'A trackable item',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({
        name: 'Item',
        description: 'A trackable item',
      });
    }
  });

  it('should accept entity with optional attributes', () => {
    const result = EntitySchema.safeParse({
      name: 'Record',
      description: 'A data record',
      attributes: ['status', 'priority', 'label'],
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({
        name: 'Record',
        description: 'A data record',
        attributes: ['status', 'priority', 'label'],
      });
    }
  });

  it('should reject missing required fields', () => {
    expect(EntitySchema.safeParse({ name: 'X' }).success).toBe(false);
    expect(EntitySchema.safeParse({ description: 'Y' }).success).toBe(false);
  });

  it('Entity type matches EntitySchema inference', () => {
    const parsed = EntitySchema.parse({ name: 'E', description: 'D' });
    const typed: Entity = parsed;
    expect(typed).toEqual({ name: 'E', description: 'D' });
  });
});

describe('modelSchema model-level metadata fields', () => {
  const minimalModel = {
    variant: 'specs' as const,
    scenes: [],
    messages: [],
    modules: [],
    narratives: [],
  };

  it('should accept model without new metadata fields (backward compat)', () => {
    const result = modelSchema.safeParse(minimalModel);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(minimalModel);
    }
  });

  it('should accept model with all metadata fields', () => {
    const input = {
      ...minimalModel,
      actors: [
        { name: 'Operator', kind: 'person' as const, description: 'Manages system' },
        { name: 'Gateway', kind: 'system' as const, description: 'Routes requests' },
      ],
      entities: [{ name: 'Record', description: 'A data record', attributes: ['status', 'label'] }],
      assumptions: ['All users are authenticated', 'System runs in UTC'],
      requirements: '## Domain Requirements\n\nMust support multi-tenancy.',
      outcome: 'Users can manage records efficiently',
    };
    const result = modelSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(input);
    }
  });
});
