import { z } from 'zod';

// Message reference for module type ownership
export const MessageRefSchema = z
  .object({
    kind: z.enum(['command', 'event', 'state', 'query']).describe('Message kind'),
    name: z.string().describe('Message name'),
  })
  .describe('Reference to a message type');

// Module schema for type ownership and file grouping
export const ModuleSchema = z
  .object({
    sourceFile: z.string().describe('Output file path for this module (also serves as unique identifier)'),
    isDerived: z.boolean().describe('True if auto-derived from sourceFile grouping, false if user-authored'),
    contains: z
      .object({
        sceneIds: z.array(z.string()).describe('IDs of scenes in this module'),
      })
      .describe('Scenes contained in this module'),
    declares: z
      .object({
        messages: z.array(MessageRefSchema).describe('Message types owned by this module'),
      })
      .describe('Types declared/owned by this module'),
  })
  .describe('Module for grouping scenes and owning types');

const IntegrationSchema = z
  .object({
    name: z.string().describe('Integration name (e.g., MailChimp, Twilio)'),
    description: z.string().optional(),
    source: z.string().describe('integration module source (e.g., @auto-engineer/mailchimp-integration)'),
  })
  .describe('External service integration configuration');

const ActorSchema = z
  .object({
    name: z.string().describe('Actor name'),
    kind: z.enum(['person', 'system']).describe('Whether this actor is a person or a system'),
    description: z.string().describe('What this actor does in the domain'),
  })
  .describe('A person or system involved in the domain');

const EntitySchema = z
  .object({
    name: z.string().describe('Entity name'),
    description: z.string().describe('What this entity represents'),
    attributes: z.array(z.string()).optional().describe('Key attributes of this entity'),
  })
  .describe('A domain noun — something actors interact with');

const ImpactSchema = z.enum(['critical', 'important', 'nice-to-have']).describe('Priority level');

// Data flow schemas for unified architecture
export const MessageTargetSchema = z
  .object({
    type: z.enum(['Event', 'Command', 'State']).describe('Type of message to target'),
    name: z.string().describe('Name of the specific message'),
    fields: z.record(z.unknown()).optional().describe('Field selector for partial message targeting'),
  })
  .describe('Target message with optional field selection');

export const DestinationSchema = z
  .discriminatedUnion('type', [
    z.object({
      type: z.literal('stream'),
      pattern: z.string().describe('Stream pattern with interpolation (e.g., listing-${propertyId})'),
    }),
    z.object({
      type: z.literal('integration'),
      systems: z.array(z.string()).describe('Integration names to send to'),
      message: z
        .object({
          name: z.string(),
          type: z.enum(['command', 'query', 'reaction']),
        })
        .optional(),
    }),
    z.object({
      type: z.literal('database'),
      collection: z.string().describe('Database collection name'),
    }),
    z.object({
      type: z.literal('topic'),
      name: z.string().describe('Message topic/queue name'),
    }),
  ])
  .describe('Destination for outbound data');

export const OriginSchema = z
  .discriminatedUnion('type', [
    z.object({
      type: z.literal('projection'),
      name: z.string(),
      idField: z
        .union([z.string(), z.array(z.string())])
        .optional()
        .describe(
          'Field(s) from event used as the projection unique identifier. Can be single field or array for composite keys. Omit for singleton projections.',
        ),
      singleton: z
        .boolean()
        .optional()
        .describe(
          'True if this is a singleton projection that aggregates data from multiple entities into one document',
        ),
    }),
    z.object({
      type: z.literal('readModel'),
      name: z.string().describe('Read model name'),
    }),
    z.object({
      type: z.literal('database'),
      collection: z.string().describe('Database collection name'),
      query: z.unknown().optional().describe('Optional query filter'),
    }),
    z.object({
      type: z.literal('api'),
      endpoint: z.string().describe('API endpoint URL'),
      method: z.string().optional().describe('HTTP method (defaults to GET)'),
    }),
    z.object({
      type: z.literal('integration'),
      systems: z.array(z.string()),
    }),
  ])
  .describe('Origin for inbound data');

const DataSinkSchema = z
  .object({
    id: z.string().optional().describe('Optional unique identifier for the data sink'),
    target: MessageTargetSchema,
    destination: DestinationSchema,
    transform: z.string().optional().describe('Optional transformation function name'),
    _additionalInstructions: z.string().optional().describe('Additional instructions'),
    _withState: z
      .lazy(() => DataSourceSchema)
      .optional()
      .describe('Optional state data source for command'),
  })
  .describe('Data sink configuration for outbound data flow');

const DataSourceSchema = z
  .object({
    id: z.string().optional().describe('Optional unique identifier for the data source'),
    target: MessageTargetSchema,
    origin: OriginSchema,
    transform: z.string().optional().describe('Optional transformation function name'),
    _additionalInstructions: z.string().optional().describe('Additional instructions'),
  })
  .describe('Data source configuration for inbound data flow');

const EventTargetSchema = MessageTargetSchema.extend({
  type: z.enum(['Event']),
}).describe('Event-only message target');

const DataTargetSchema = z
  .object({
    id: z.string().optional().describe('Optional unique identifier for the data target'),
    target: EventTargetSchema,
    transform: z.string().optional().describe('Optional transformation function name'),
    _additionalInstructions: z.string().optional().describe('Additional instructions'),
  })
  .describe('Target-only data item for event declaration without routing');

export const DataSchema = z
  .object({
    id: z.string().optional().describe('Optional unique identifier for the data configuration'),
    items: z
      .array(z.union([DataSinkSchema, DataSourceSchema, DataTargetSchema]))
      .describe('Array of data sinks, sources, and targets'),
  })
  .describe('Data configuration containing sinks, sources, and targets');

const MessageFieldSchema = z
  .object({
    name: z.string(),
    type: z.string().describe('Field type (e.g., string, number, Date, UUID, etc.)'),
    required: z.boolean().default(true),
    description: z.string().optional(),
    defaultValue: z.unknown().optional().describe('Default value for optional fields'),
  })
  .describe('Field definition for a message');

const BaseMessageSchema = z.object({
  name: z.string().describe('Message name'),
  fields: z.array(MessageFieldSchema),
  description: z.string().optional(),
  metadata: z
    .object({
      version: z.number().default(1).describe('Version number for schema evolution'),
    })
    .optional(),
});

const CommandSchema = BaseMessageSchema.extend({
  type: z.literal('command'),
}).describe('Command that triggers state changes');

const EventSchema = BaseMessageSchema.extend({
  type: z.literal('event'),
  source: z.enum(['internal', 'external']).default('internal'),
}).describe('Event representing something that has happened');

const StateSchema = BaseMessageSchema.extend({
  type: z.literal('state'),
}).describe('State/Read Model representing a view of data');

const QuerySchema = BaseMessageSchema.extend({
  type: z.literal('query'),
}).describe('Query representing a read operation');

const MessageSchema = z.discriminatedUnion('type', [CommandSchema, EventSchema, StateSchema, QuerySchema]);

export const MappingFieldRefSchema = z
  .object({
    type: z.enum(['Command', 'Event', 'State', 'Query']).describe('Message kind'),
    name: z.string().describe('Message name'),
    field: z.string().describe('Field name within the message'),
  })
  .describe('Reference to a specific field within a message type');

export const MappingEntrySchema = z
  .object({
    source: MappingFieldRefSchema.describe('Source field reference'),
    target: MappingFieldRefSchema.describe('Target field reference'),
    operator: z.enum(['eq', 'ne', 'gt', 'gte', 'lt', 'lte']).optional(),
  })
  .describe('Mapping entry linking a source field to a target field');

export const ImageAssetSchema = z
  .object({
    url: z.string().optional().describe('URL of the image asset'),
    originatingPrompt: z.string().optional().describe('Prompt used to generate the image'),
  })
  .describe('Image asset with optional generation metadata');

export const UIElementSchema = z
  .object({
    type: z.string(),
    props: z.record(z.unknown()).optional(),
    children: z.array(z.string()).optional(),
    visible: z.unknown().optional(),
    repeat: z
      .object({ statePath: z.union([z.string(), z.record(z.unknown())]) })
      .passthrough()
      .optional(),
    watch: z.record(z.unknown()).optional(),
  })
  .passthrough()
  .describe('Single UI element in a UI spec');

export const UISpecSchema = z
  .object({
    root: z.string(),
    elements: z.record(UIElementSchema),
    state: z.record(z.unknown()).optional(),
  })
  .describe('Flat element-map UI specification');

const UISchema = z
  .object({
    spec: UISpecSchema.optional().describe('The rendered UI spec — source of truth for rendering'),
  })
  .describe('UI composition for a moment');

const ComponentDefinitionSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    category: z.string(),
    description: z.string(),
    slots: z.record(z.unknown()),
    template: z.string(),
  })
  .describe('Custom reusable component definition');

export const DesignSchema = z
  .object({
    imageAsset: ImageAssetSchema.optional().describe('Primary image asset for this entity'),
    metadata: z.record(z.unknown()).optional().describe('Flexible design metadata'),
  })
  .describe('Design fields for visual representation');

export const ExitSchema = z
  .object({
    id: z.string().optional().describe('Optional unique identifier for the exit'),
    label: z.string().describe('Human-readable name for this exit (e.g., "Forgot Password")'),
    condition: z
      .string()
      .describe('Condition under which this exit is taken (e.g., "User clicks forgot password link")'),
    sceneId: z.string().describe('ID of the target scene to navigate to'),
  })
  .describe('Conditional exit from a moment to another scene');

const BaseMomentSchema = z
  .object({
    name: z.string(),
    id: z.string().optional().describe('Optional unique identifier for the moment'),
    description: z.string().optional(),
    stream: z.string().optional().describe('Event stream pattern for this moment'),
    via: z.array(z.string()).optional().describe('Integration names used by this moment'),
    additionalInstructions: z.string().optional().describe('Additional instructions'),
    design: DesignSchema.optional().describe('Design fields for visual representation'),
    exits: z.array(ExitSchema).optional().describe('Conditional exits from this moment to other scenes'),
    initiator: z.string().optional().describe('Which actor initiates this moment — references actor by name'),
  })
  .describe('Base properties shared by all moment types');

const StepErrorSchema = z.object({
  type: z.enum(['IllegalStateError', 'ValidationError', 'NotFoundError']).describe('Error type'),
  message: z.string().optional().describe('Optional error message'),
});

const StepWithDocStringSchema = z.object({
  id: z.string().optional().describe('Optional unique identifier for the step'),
  keyword: z.enum(['Given', 'When', 'Then', 'And']).describe('Gherkin keyword'),
  text: z.string().describe('The type name (e.g., AddTodo, TodoAdded)'),
  docString: z.record(z.unknown()).optional().describe('The example data'),
});

const StepWithErrorSchema = z.object({
  id: z.string().optional().describe('Optional unique identifier for the step'),
  keyword: z.literal('Then').describe('Error steps use Then keyword'),
  error: StepErrorSchema.describe('Error details'),
});

const StepSchema = z.union([StepWithDocStringSchema, StepWithErrorSchema]).describe('A Gherkin step');

const ExampleSchema = z
  .object({
    id: z.string().optional().describe('Unique example identifier'),
    name: z.string().describe('Example name'),
    steps: z.array(StepSchema).describe('Gherkin steps for this example'),
  })
  .describe('BDD example with Gherkin steps');

const RuleSchema = z
  .object({
    id: z.string().optional().describe('Unique rule identifier'),
    name: z.string().describe('Rule name'),
    examples: z.array(ExampleSchema).describe('Examples demonstrating the rule'),
  })
  .describe('Business rule with examples');

const SpecSchema = z
  .object({
    id: z.string().optional().describe('Optional unique identifier for the spec'),
    type: z.literal('gherkin').describe('Specification type'),
    feature: z.string().describe('Feature name'),
    rules: z.array(RuleSchema).describe('Business rules for this spec'),
  })
  .describe('Gherkin specification with business rules');

const ItNode = z
  .object({
    type: z.literal('it'),
    id: z.string().optional(),
    title: z.string(),
  })
  .strict();

type ClientSpecNode =
  | { type: 'it'; id?: string; title: string }
  | { type: 'describe'; id?: string; title?: string; children?: ClientSpecNode[] };

export const ClientSpecNodeSchema: z.ZodType<ClientSpecNode> = z.lazy(() =>
  z.union([
    ItNode,
    z
      .object({
        type: z.literal('describe'),
        id: z.string().optional(),
        title: z.string().optional(),
        children: z.array(ClientSpecNodeSchema).default([]),
      })
      .strict(),
  ]),
);

export const ClientSpecSchema = z.array(ClientSpecNodeSchema).default([]);

export const UiBlockSchema = z
  .object({
    layoutId: z.string().optional().describe('Layout template identifier'),
    mode: z.string().optional().describe('Rendering mode'),
    regions: z
      .record(z.array(z.object({ id: z.string(), name: z.string(), slots: z.record(z.unknown()).optional() })))
      .optional()
      .describe('Layout regions with placed components'),
    spec: z.record(z.unknown()).optional().describe('UI specification tree'),
    surface: z.enum(['route', 'overlay', 'ephemeral']).optional().describe('Presentation context'),
    specHash: z.string().optional().describe('Content hash of the spec, used for cache busting'),
  })
  .describe('UI composition block for a moment');

const CommandMomentSchema = BaseMomentSchema.extend({
  type: z.literal('command'),
  client: z.object({
    specs: ClientSpecSchema,
    ui: UiBlockSchema.optional().describe('UI composition for this moment'),
  }),
  request: z.string().describe('Command request (GraphQL, REST endpoint, or other query format)').optional(),
  mappings: z.array(MappingEntrySchema).optional().describe('Field mappings between Command/Event/State messages'),
  server: z.object({
    description: z.string(),
    data: DataSchema.optional().describe('Data configuration for command moments'),
    specs: z.array(SpecSchema).describe('Server-side specifications with rules and examples'),
  }),
}).describe('Command moment handling user actions and business logic');

const QueryMomentSchema = BaseMomentSchema.extend({
  type: z.literal('query'),
  client: z.object({
    specs: ClientSpecSchema,
    ui: UiBlockSchema.optional().describe('UI composition for this moment'),
  }),
  request: z.string().describe('Query request (GraphQL, REST endpoint, or other query format)').optional(),
  mappings: z.array(MappingEntrySchema).optional().describe('Field mappings between Command/Event/State messages'),
  server: z.object({
    description: z.string(),
    data: DataSchema.optional().describe('Data configuration for query moments'),
    specs: z.array(SpecSchema).describe('Server-side specifications with rules and examples'),
  }),
}).describe('Query moment for reading data and maintaining projections');

const ReactMomentSchema = BaseMomentSchema.extend({
  type: z.literal('react'),
  server: z.object({
    description: z.string().optional(),
    data: DataSchema.optional().describe('Data configuration for react moments'),
    specs: z.array(SpecSchema).describe('Server-side specifications with rules and examples'),
  }),
}).describe('React moment for automated responses to events');

const ExperienceMomentSchema = BaseMomentSchema.extend({
  type: z.literal('experience'),
  client: z.object({
    specs: ClientSpecSchema,
    ui: UiBlockSchema.optional().describe('UI composition for this moment'),
  }),
}).describe('Experience moment for user interactions and UI behavior');

const MomentSchema = z.discriminatedUnion('type', [
  CommandMomentSchema,
  QueryMomentSchema,
  ReactMomentSchema,
  ExperienceMomentSchema,
]);

export const SceneRouteSchema = z
  .object({
    type: z.enum(['dedicated', 'nested', 'no-route']).describe('Route affinity type'),
    deepLinkable: z.boolean().optional(),
    requiresAuth: z.boolean().optional(),
    preservesState: z.boolean().optional(),
  })
  .describe('Routing characteristics for the scene');

export const SceneClassificationSchema = z
  .object({
    kind: z.enum(['page', 'modal', 'drawer', 'tab-panel', 'wizard-step', 'embedded-panel', 'popover']).optional(),
    pattern: z
      .enum([
        'create-form',
        'edit-form',
        'search-filter-results',
        'browse-detail',
        'review-confirm-submit',
        'wizard-step',
        'dashboard',
        'feed',
        'auth-gate',
        'detail-view',
        'settings-panel',
        'list-bulk-actions',
      ])
      .optional(),
    route: SceneRouteSchema.optional(),
  })
  .describe('Scene classification metadata for a scene');

export const NarrativeSchema = z
  .object({
    id: z.string().optional().describe('Unique identifier for the narrative'),
    name: z.string().describe('Narrative name'),
    description: z.string().optional(),
    actors: z.array(z.string()).optional(),
    sceneIds: z.array(z.string()).describe('Ordered scene IDs composing this narrative'),
    design: DesignSchema.optional().describe('Design fields for visual representation'),
    outcome: z.string().optional().describe('What value this journey delivers'),
    impact: ImpactSchema.optional().describe('Priority — drives which narratives to build first'),
    requirements: z.string().optional().describe('Markdown requirements document (narrative level)'),
    assumptions: z.array(z.string()).optional().describe('Journey-specific assumptions'),
  })
  .describe('Narrative grouping scenes into an ordered flow');

const SceneSchema = z
  .object({
    name: z.string(),
    id: z.string().optional().describe('Optional unique identifier for the scene'),
    description: z.string().optional(),
    moments: z.array(MomentSchema),
    sourceFile: z.string().optional(),
    scene: SceneClassificationSchema.optional(),
    design: DesignSchema.optional().describe('Design fields for visual representation'),
    requirements: z.string().optional().describe('Markdown requirements document (scene level)'),
    assumptions: z.array(z.string()).optional().describe('Flow-specific assumptions'),
  })
  .describe('Business scene containing related moments');

// Variant 1: Just scene names
export const SceneNamesOnlySchema = z
  .object({
    name: z.string(),
    id: z.string().optional().describe('Optional unique identifier for the scene'),
    description: z.string().optional(),
  })
  .describe('Scene with just name for initial planning');

// Variant 2: Scene with moment names
const MomentNamesOnlySchema = z
  .object({
    name: z.string(),
    id: z.string().optional().describe('Optional unique identifier for the moment'),
    description: z.string().optional(),
    type: z.enum(['command', 'query', 'react']),
  })
  .describe('Moment with just name and type for structure planning');

const SceneWithMomentNamesSchema = z
  .object({
    name: z.string(),
    id: z.string().optional().describe('Optional unique identifier for the scene'),
    description: z.string().optional(),
    moments: z.array(MomentNamesOnlySchema),
  })
  .describe('Scene with moment names for structure planning');

// Variant 3: Scene with client & server names
const ClientServerNamesMomentSchema = z
  .object({
    name: z.string(),
    id: z.string().optional().describe('Optional unique identifier for the moment'),
    type: z.enum(['command', 'query', 'react']),
    description: z.string().optional(),
    client: z
      .object({
        description: z.string(),
      })
      .optional(),
    server: z
      .object({
        description: z.string(),
      })
      .optional(),
  })
  .describe('Moment with client/server descriptions for behavior planning');

const SceneWithClientServerNamesSchema = z
  .object({
    name: z.string(),
    id: z.string().optional().describe('Optional unique identifier for the scene'),
    description: z.string().optional(),
    moments: z.array(ClientServerNamesMomentSchema),
  })
  .describe('Scene with client/server descriptions for behavior planning');

// Variant 4: Full specs (uses existing schemas)

const NarrativePlanningNarrativeSchema = z
  .object({
    name: z.string(),
    description: z.string().optional(),
    actors: z.array(z.string()).optional(),
    sceneNames: z.array(z.string()).describe('Ordered scene names'),
    outcome: z.string().optional().describe('What value this journey delivers'),
    impact: ImpactSchema.optional().describe('Priority — drives which narratives to build first'),
    assumptions: z.array(z.string()).optional().describe('Journey-specific assumptions'),
  })
  .describe('Narrative with scene names for planning');

export const NarrativePlanningSchema = z
  .object({
    variant: z.literal('narrative-planning').describe('Narrative-based planning with scene names'),
    narratives: z.array(NarrativePlanningNarrativeSchema),
    scenes: z.array(SceneNamesOnlySchema),
    actors: z.array(ActorSchema).optional().describe('People and systems involved in the domain'),
    entities: z.array(EntitySchema).optional().describe('Domain nouns — things actors interact with'),
    assumptions: z.array(z.string()).optional().describe('Domain-wide assumptions'),
    requirements: z.string().optional().describe('Markdown requirements document (domain level)'),
    outcome: z.string().optional().describe('Domain-level outcome — what value this system delivers'),
  })
  .describe('Progressive disclosure variant for narrative-based planning');

export const SceneNamesSchema = z
  .object({
    variant: z.literal('scene-names').describe('Just scene names for initial ideation'),
    scenes: z.array(SceneNamesOnlySchema),
  })
  .describe('System with just scene names for initial planning');

export const MomentNamesSchema = z
  .object({
    variant: z.literal('moment-names').describe('Scenes with moment names for structure planning'),
    scenes: z.array(SceneWithMomentNamesSchema),
  })
  .describe('System with scene and moment names for structure planning');

export const ClientServerNamesSchema = z
  .object({
    variant: z.literal('client-server-names').describe('Scenes with client/server descriptions'),
    scenes: z.array(SceneWithClientServerNamesSchema),
  })
  .describe('System with client/server descriptions for behavior planning');

const ModelDesignSchema = DesignSchema.extend({
  components: z.array(ComponentDefinitionSchema).optional().describe('Custom reusable component definitions'),
}).describe('Model-level design fields with component definitions');

export const modelSchema = z
  .object({
    variant: z.literal('specs').describe('Full specification with all details'),
    scenes: z.array(SceneSchema),
    messages: z.array(MessageSchema),
    integrations: z.array(IntegrationSchema).optional(),
    modules: z.array(ModuleSchema).describe('Modules for type ownership and file grouping'),
    narratives: z.array(NarrativeSchema),
    design: ModelDesignSchema.optional().describe('Design fields for visual representation'),
    actors: z.array(ActorSchema).optional().describe('People and systems involved in the domain'),
    entities: z.array(EntitySchema).optional().describe('Domain nouns — things actors interact with'),
    assumptions: z.array(z.string()).optional().describe('Domain-wide assumptions'),
    requirements: z.string().optional().describe('Markdown requirements document (domain level)'),
    outcome: z.string().optional().describe('Domain-level outcome — what value this system delivers'),
  })
  .describe('Complete system specification with all implementation details');

export type { ClientSpecNode };

export {
  MessageFieldSchema,
  MessageSchema,
  CommandSchema,
  EventSchema,
  StateSchema,
  QuerySchema,
  IntegrationSchema,
  CommandMomentSchema,
  QueryMomentSchema,
  ReactMomentSchema,
  ExperienceMomentSchema,
  MomentSchema,
  SceneSchema,
  ExampleSchema,
  RuleSchema,
  SpecSchema,
  DataSinkSchema,
  DataSourceSchema,
  DataTargetSchema,
  StepSchema,
  StepErrorSchema,
  StepWithDocStringSchema,
  StepWithErrorSchema,
  UISchema,
  ComponentDefinitionSchema,
  ActorSchema,
  EntitySchema,
  ImpactSchema,
};

export type Model = z.infer<typeof modelSchema>;
export type Scene = z.infer<typeof SceneSchema>;
export type Moment = z.infer<typeof MomentSchema>;
export type QueryMoment = z.infer<typeof QueryMomentSchema>;
export type ReactMoment = z.infer<typeof ReactMomentSchema>;
export type CommandMoment = z.infer<typeof CommandMomentSchema>;
export type ExperienceMoment = z.infer<typeof ExperienceMomentSchema>;
export type Message = z.infer<typeof MessageSchema>;
export type Example = z.infer<typeof ExampleSchema>;
export type MessageField = z.infer<typeof MessageFieldSchema>;
export type Rule = z.infer<typeof RuleSchema>;
export type Spec = z.infer<typeof SpecSchema>;
export type Step = z.infer<typeof StepSchema>;
export type Module = z.infer<typeof ModuleSchema>;
export type MessageRef = z.infer<typeof MessageRefSchema>;
export type MappingFieldRef = z.infer<typeof MappingFieldRefSchema>;
export type MappingEntry = z.infer<typeof MappingEntrySchema>;
export type Narrative = z.infer<typeof NarrativeSchema>;
export type DataTarget = z.infer<typeof DataTargetSchema>;
export type SceneClassification = z.infer<typeof SceneClassificationSchema>;
export type SceneRoute = z.infer<typeof SceneRouteSchema>;
export type NarrativePlanning = z.infer<typeof NarrativePlanningSchema>;
export type ImageAsset = z.infer<typeof ImageAssetSchema>;
export type Design = z.infer<typeof DesignSchema>;
export type UIElement = z.infer<typeof UIElementSchema>;
export type UISpec = z.infer<typeof UISpecSchema>;
export type UI = z.infer<typeof UISchema>;
export type ComponentDefinition = z.infer<typeof ComponentDefinitionSchema>;
export type UiBlock = z.infer<typeof UiBlockSchema>;
export type Exit = z.infer<typeof ExitSchema>;
export type Actor = z.infer<typeof ActorSchema>;
export type Entity = z.infer<typeof EntitySchema>;
export type Impact = z.infer<typeof ImpactSchema>;
