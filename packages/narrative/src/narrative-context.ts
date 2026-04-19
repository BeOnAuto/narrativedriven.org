import type { z } from 'zod';
import type { CommandMoment, ExperienceMoment, Moment, QueryMoment, Scene } from './index';
import type { ClientSpecNode, DataTarget, ExampleSchema, RuleSchema, SpecSchema, StepSchema } from './schema';
import type { Data, DataSink, DataSource } from './types';

type Step = z.infer<typeof StepSchema>;
type Example = z.infer<typeof ExampleSchema>;
type Spec = z.infer<typeof SpecSchema>;
type Rule = z.infer<typeof RuleSchema>;

type MajorKeyword = 'Given' | 'When' | 'Then';

interface SceneContext {
  scene: Scene;
  currentMomentIndex: number | null;
  currentSpecTarget: 'client' | 'server' | null;
  currentSpecIndex: number | null;
  currentRuleIndex: number | null;
  currentExampleIndex: number | null;
  clientSpecStack: ClientSpecNode[];
  lastMajorKeyword: MajorKeyword | null;
}

let context: SceneContext | null = null;

export function startScene(name: string, id?: string): Scene {
  const sourceFile = (globalThis as Record<string, unknown>).__aeCurrentModulePath as string | undefined;

  const sceneObj: Scene = {
    name,
    id,
    moments: [],
    ...(typeof sourceFile === 'string' ? { sourceFile } : {}),
  };
  context = {
    scene: sceneObj,
    currentMomentIndex: null,
    currentSpecTarget: null,
    currentSpecIndex: null,
    currentRuleIndex: null,
    currentExampleIndex: null,
    clientSpecStack: [],
    lastMajorKeyword: null,
  };
  return sceneObj;
}

export function getCurrentScene(): Scene | null {
  return context?.scene ?? null;
}

export function clearCurrentScene(): void {
  context = null;
}

export function setSceneOutcome(value: string): void {
  if (!context) throw new Error('No active scene');
  context.scene.outcome = value;
}

export function setSceneActors(names: string[]): void {
  if (!context) throw new Error('No active scene');
  context.scene.actors = [...(context.scene.actors ?? []), ...names];
}

export function setSceneEntities(names: string[]): void {
  if (!context) throw new Error('No active scene');
  context.scene.entities = [...(context.scene.entities ?? []), ...names];
}

export function getCurrentMoment(): Moment | null {
  if (!context || context.currentMomentIndex === null) return null;
  return context.scene.moments[context.currentMomentIndex] ?? null;
}

export function addMoment(moment: Moment): void {
  if (!context) throw new Error('No active scene');
  context.scene.moments.push(moment);
  context.currentMomentIndex = context.scene.moments.length - 1;
}

function getServerSpecs(slice: Moment): Spec[] | undefined {
  if ('server' in slice) {
    return slice.server?.specs;
  }
  return undefined;
}

function getCurrentSpec(slice: Moment): Spec | undefined {
  if (!context || context.currentSpecIndex === null) return undefined;
  const specs = getServerSpecs(slice);
  if (!specs) return undefined;
  return specs[context.currentSpecIndex];
}

function getCurrentExample(slice: Moment): Example | undefined {
  if (
    !context ||
    context.currentSpecIndex === null ||
    context.currentRuleIndex === null ||
    context.currentExampleIndex === null
  ) {
    return undefined;
  }

  const spec = getCurrentSpec(slice);
  if (!spec) return undefined;

  return spec.rules[context.currentRuleIndex]?.examples[context.currentExampleIndex];
}

export function startClientBlock(slice: Moment): void {
  if (!context) throw new Error('No active scene context');

  if (slice.type === 'command' || slice.type === 'query' || slice.type === 'experience') {
    slice.client = {
      specs: [],
    };
    context.currentSpecTarget = 'client';
    context.clientSpecStack = [];
  }
}

export function endClientBlock(): void {
  if (context) {
    if (context.clientSpecStack.length > 0) {
      const unclosedCount = context.clientSpecStack.length;
      const unclosedTitles = context.clientSpecStack
        .map((n) => {
          if (n.title !== undefined && n.title !== '') return n.title;
          if (n.id !== undefined && n.id !== '') return n.id;
          return 'unnamed';
        })
        .join(', ');
      throw new Error(`${unclosedCount} unclosed describe block(s): ${unclosedTitles}`);
    }
    context.currentSpecTarget = null;
    context.clientSpecStack = [];
  }
}

export function startServerBlock(slice: Moment, description: string = ''): void {
  if (!context) throw new Error('No active scene context');

  if (slice.type === 'command') {
    slice.server = {
      description,
      specs: [],
      data: undefined,
    };
  } else if (slice.type === 'query') {
    slice.server = {
      description,
      specs: [],
      data: undefined,
    };
  } else if (slice.type === 'react') {
    slice.server = {
      description: description || undefined,
      specs: [],
      data: undefined,
    };
  }

  context.currentSpecTarget = 'server';
}

export function endServerBlock(): void {
  if (context) {
    context.currentSpecTarget = null;
  }
}

function addServerSpec(slice: Moment, feature: string): void {
  if ('server' in slice && slice.server != null) {
    const newSpec: Spec = {
      type: 'gherkin',
      feature,
      rules: [],
    };
    slice.server.specs.push(newSpec);
    if (context) context.currentSpecIndex = slice.server.specs.length - 1;
  }
}

export function pushSpec(feature: string): void {
  if (!context || !context.currentSpecTarget) throw new Error('No active spec target');
  const slice = getCurrentMoment();
  if (!slice) throw new Error('No active moment');

  if (context.currentSpecTarget === 'server') {
    addServerSpec(slice, feature);
  }
}

export function pushDescribe(title?: string, id?: string): void {
  if (!context) throw new Error('No active scene context');

  const describeNode: ClientSpecNode = {
    type: 'describe',
    ...(id !== undefined && id !== '' ? { id } : {}),
    ...(title !== undefined && title !== '' ? { title } : {}),
    children: [],
  };

  context.clientSpecStack.push(describeNode);
}

function validateMomentSupportsClientSpecs(slice: Moment): void {
  if (slice.type !== 'command' && slice.type !== 'query' && slice.type !== 'experience') {
    throw new Error('Client specs can only be added to command, query, or experience moments');
  }
}

function addNodeToParentOrRoot(node: ClientSpecNode, slice: CommandMoment | QueryMoment | ExperienceMoment): void {
  if (!context) return;

  if (context.clientSpecStack.length === 0) {
    slice.client.specs.push(node);
  } else {
    const parent = context.clientSpecStack[context.clientSpecStack.length - 1];
    if (parent.type === 'describe') {
      if (!parent.children) parent.children = [];
      parent.children.push(node);
    }
  }
}

export function popDescribe(): void {
  if (!context) throw new Error('No active scene context');
  if (context.clientSpecStack.length === 0) throw new Error('No active describe block');

  const completedDescribe = context.clientSpecStack.pop();
  if (!completedDescribe) return;

  const slice = getCurrentMoment();
  if (!slice) throw new Error('No active moment');

  validateMomentSupportsClientSpecs(slice);
  addNodeToParentOrRoot(completedDescribe, slice as CommandMoment | QueryMoment | ExperienceMoment);
}

export function recordIt(title: string, id?: string): void {
  if (!context) throw new Error('No active scene context');

  const itNode: ClientSpecNode = {
    type: 'it',
    ...(id !== undefined && id !== '' ? { id } : {}),
    title,
  };

  const slice = getCurrentMoment();
  if (!slice) throw new Error('No active moment');

  validateMomentSupportsClientSpecs(slice);
  addNodeToParentOrRoot(itNode, slice as CommandMoment | QueryMoment | ExperienceMoment);
}

export function setQueryRequest(request: string): void {
  const slice = getCurrentMoment();
  if (!slice || slice.type !== 'query') throw new Error('Request can only be set on query moments');
  slice.request = request;
}

export function setMomentData(data: Data): void {
  const slice = getCurrentMoment();
  if (!slice) throw new Error('No active moment');
  if (!('server' in slice)) throw new Error('Data can only be set on moments with a server');

  const items = data.items;
  if (items.length === 0) {
    slice.server.data = undefined;
    return;
  }

  // Strip __type discriminator (if present) and build the data object
  const strippedItems = stripTypeDiscriminator(items);

  slice.server.data = {
    ...(data.id != null && data.id !== '' && { id: data.id }),
    items: strippedItems,
  };
}

function stripTypeDiscriminator(items: (DataSink | DataSource | DataTarget)[]): (DataSink | DataSource | DataTarget)[] {
  return items.map((item) => {
    if ('__type' in item) {
      const { __type: _, ...rest } = item;
      return rest;
    }
    return item;
  });
}

export function recordRule(name: string, id?: string): void {
  if (!context || context.currentSpecIndex === null) throw new Error('No active spec context');
  const slice = getCurrentMoment();
  if (!slice) throw new Error('No active moment');

  const spec = getCurrentSpec(slice);
  if (!spec) throw new Error('No active specs for current moment');

  const newRule: Rule = {
    id,
    name,
    examples: [],
  };
  spec.rules.push(newRule);
  context.currentRuleIndex = spec.rules.length - 1;
}

export function recordExample(name: string, id?: string): void {
  if (!context || context.currentSpecIndex === null || context.currentRuleIndex === null) {
    throw new Error('No active rule context');
  }
  const slice = getCurrentMoment();
  if (!slice) throw new Error('No active moment');

  const spec = getCurrentSpec(slice);
  if (!spec) throw new Error('No active specs for current moment');

  const rule = spec.rules[context.currentRuleIndex];
  const newExample: Example = {
    id,
    name,
    steps: [],
  };
  rule.examples.push(newExample);
  context.currentExampleIndex = rule.examples.length - 1;
  context.lastMajorKeyword = null;
}

type StepKeyword = 'Given' | 'When' | 'Then' | 'And';
type ErrorType = 'IllegalStateError' | 'ValidationError' | 'NotFoundError';

// The ordinal-based AST scanner that recovered the generic type argument from
// `.given<T>(data)` calls has been retired. Type info now arrives at runtime
// as a TypedRef via `.given(Ref, "sentence", data)`.

function getActiveExampleContext(): { example: Example } {
  if (
    !context ||
    context.currentSpecIndex === null ||
    context.currentRuleIndex === null ||
    context.currentExampleIndex === null
  ) {
    throw new Error('No active example context');
  }
  const slice = getCurrentMoment();
  if (!slice) throw new Error('No active moment');
  const example = getCurrentExample(slice);
  if (!example) throw new Error('No active example for current moment');
  return { example };
}

/**
 * Records a step on the current example.
 *
 * Two call shapes during the ongoing migration:
 *
 * 1. Legacy (existing callers):  `recordStep(keyword, typeName, data)`
 *    — `text` holds the type name; `__typeName` defaults to the same value.
 * 2. New (Gherkin sentence form): `recordStep(keyword, sentence, data, typeName)`
 *    — `text` holds the English sentence; `__typeName` is the passed-in type name.
 *
 * Once the DSL builders switch to `(ref, sentence, data)` the legacy shape will
 * stop being invoked.
 */
export function recordStep(keyword: StepKeyword, text: string, data: unknown, typeNameOverride?: string): void {
  const { example } = getActiveExampleContext();

  if (keyword !== 'And') {
    context!.lastMajorKeyword = keyword as MajorKeyword;
  }

  const typeName = typeNameOverride ?? text;
  const resolvedText = text;

  const docString = typeof data === 'object' && data !== null ? (data as Record<string, unknown>) : undefined;

  const step: Step = {
    keyword,
    text: resolvedText,
    __typeName: typeName,
    ...(docString !== undefined && Object.keys(docString).length > 0 ? { docString } : {}),
  };

  example.steps.push(step);
}

export function recordErrorStep(errorType: ErrorType, message?: string): void {
  const { example } = getActiveExampleContext();

  context!.lastMajorKeyword = 'Then';

  const step: Step = {
    keyword: 'Then',
    error: {
      type: errorType,
      ...(message !== undefined ? { message } : {}),
    },
  };

  example.steps.push(step);
}
